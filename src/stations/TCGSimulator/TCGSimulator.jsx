/* eslint-disable react-hooks/preserve-manual-memoization */
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import StationNav from '../../components/StationNav';
import {
  buildBoosterPack,
  buildGodPack,
  CARD_BACK_IMAGE,
  CARD_FLIP_DELAY,
  cardMatchesSearch,
  COLLECTION_STORAGE_KEY,
  compactSearchText,
  createCardSearchIndex,
  expansionHasCardMatch,
  getCardArtworkKey,
  getCardFaceImage,
  getCardFallbackImage,
  getExpansionCards,
  getExpansionCategory,
  handleCardImageError,
  handleCardImageLoad,
  hasFeaturedTcgCards,
  hasPlayableCards,
  isReferenceOnlyExpansion,
  loadCollection,
  normalizeSearchText,
  PACK_PREP_DELAY,
  parseReleaseDate,
  randomItem,
  TcgCardDetailModal,
  TEN_PACK_FLIP_DELAY,
} from '../shared/stationShared';

const cardNumberCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

const compareCardNumbers = (firstCard, secondCard) =>
  cardNumberCollator.compare(String(firstCard.number || ''), String(secondCard.number || ''));

const CARD_RARITY_ORDER = new Map([
  ['common', 0],
  ['uncommon', 100],
  ['rare', 200],
  ['promo', 250],
  ['rare holo', 300],
  ['double rare', 400],
  ['rare holo v', 450],
  ['rare holo ex', 450],
  ['rare holo gx', 450],
  ['rare break', 475],
  ['rare prism star', 490],
  ['rare holo vmax', 500],
  ['rare holo vstar', 510],
  ['rare prime', 520],
  ['legend', 530],
  ['rare holo lv.x', 540],
  ['rare ace', 550],
  ['amazing rare', 560],
  ['radiant rare', 560],
  ['trainer gallery rare holo', 570],
  ['rare ultra', 600],
  ['ultra rare', 600],
  ['illustration rare', 650],
  ['classic collection', 660],
  ['ace spec rare', 700],
  ['rare shiny', 700],
  ['shiny rare', 700],
  ['rare shiny gx', 750],
  ['shiny ultra rare', 750],
  ['special illustration rare', 800],
  ['mega attack rare', 850],
  ['mega_attack_rare', 850],
  ['rare rainbow', 875],
  ['rare secret', 900],
  ['hyper rare', 900],
  ['rare shining', 925],
  ['black white rare', 940],
  ['rare holo star', 950],
  ['mega hyper rare', 1000],
]);

const getRarityRank = (rarity) => {
  const normalizedRarity = String(rarity || '').trim().toLowerCase();
  const exactRank = CARD_RARITY_ORDER.get(normalizedRarity);
  if (exactRank !== undefined) return exactRank;

  if (normalizedRarity.includes('mega hyper')) return 1000;
  if (normalizedRarity.includes('holo star')) return 950;
  if (normalizedRarity.includes('shining')) return 925;
  if (normalizedRarity.includes('secret') || normalizedRarity.includes('hyper')) return 900;
  if (normalizedRarity.includes('rainbow')) return 875;
  if (normalizedRarity.includes('mega attack')) return 850;
  if (normalizedRarity.includes('special illustration')) return 800;
  if (normalizedRarity.includes('shiny ultra') || normalizedRarity.includes('shiny gx')) return 750;
  if (normalizedRarity.includes('ace spec') || normalizedRarity.includes('shiny')) return 700;
  if (normalizedRarity.includes('illustration')) return 650;
  if (normalizedRarity.includes('ultra')) return 600;
  if (normalizedRarity.includes('radiant') || normalizedRarity.includes('amazing')) return 560;
  if (normalizedRarity.includes('lv.x')) return 540;
  if (normalizedRarity.includes('vstar')) return 510;
  if (normalizedRarity.includes('vmax')) return 500;
  if (normalizedRarity.includes('break')) return 475;
  if (normalizedRarity.includes('double')) return 400;
  if (normalizedRarity.includes('holo')) return 300;
  if (normalizedRarity.includes('rare')) return 200;
  if (normalizedRarity.includes('uncommon')) return 100;
  return 0;
};

const compareCardsByRarity = (firstCard, secondCard, rarityDirection) => {
  const tierDifference = getRarityRank(firstCard.rarity) - getRarityRank(secondCard.rarity);
  if (tierDifference) return rarityDirection === 'rarest' ? -tierDifference : tierDifference;

  const rarityDifference = String(firstCard.rarity || 'Unknown').localeCompare(
    String(secondCard.rarity || 'Unknown'),
  );
  return rarityDifference || compareCardNumbers(firstCard, secondCard);
};

const TCG_VIEW_STORAGE_KEY = 'pokemon-lab-tcg-view-v1';
const TCG_PULL_HISTORY_KEY = 'pokemon-lab-tcg-pull-history-v1';
const EXPANSION_PAGE_SIZE = 8;

const loadPullHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(TCG_PULL_HISTORY_KEY)) || [];
  } catch {
    return [];
  }
};

function TcgSimulator({
  onBack,
  onOpenPokedex,
  onOpenWhos,
  onOpenTeam,
  onOpenQuiz,
  onOpenTrainerDex,
  routeParams = {},
  onRouteChange,
}) {
  const [allExpansions, setAllExpansions] = useState(null);
  const [selectedSet, setSelectedSet] = useState(() => (
    routeParams.set || 'base1'
  ));
  const [selectedSeries, setSelectedSeries] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [binderSearchTerm, setBinderSearchTerm] = useState('');
  const [binderSortMode, setBinderSortMode] = useState('number');
  const [binderRarityDirection, setBinderRarityDirection] = useState('rarest');
  const [binderFilter, setBinderFilter] = useState('all');
  const [showUnownedCardArt, setShowUnownedCardArt] = useState(false);
  const [sortMode, setSortMode] = useState('release-oldest');
  const [currentPack, setCurrentPack] = useState([]);
  const [currentPackSet, setCurrentPackSet] = useState(null);
  const [showPackModal, setShowPackModal] = useState(false);
  const [packAdded, setPackAdded] = useState(false);
  const [isPreparingPack, setIsPreparingPack] = useState(false);
  const [isAutoRevealing, setIsAutoRevealing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showClearBinderDialog, setShowClearBinderDialog] = useState(null);
  const [collection, setCollection] = useState(loadCollection);
  const [pullHistory, setPullHistory] = useState(loadPullHistory);
  const [lastPullCardIds, setLastPullCardIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [expansionPage, setExpansionPage] = useState(1);
  const [setBrowserOpen, setSetBrowserOpen] = useState(true);
  const revealTimersRef = useRef([]);
  const prepTimerRef = useRef(null);
  const revealDelayRef = useRef(CARD_FLIP_DELAY);
  const activePackTransactionRef = useRef('');
  const committedPackTransactionRef = useRef('');
  const binderPanelRef = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(prepTimerRef.current);
      revealTimersRef.current.forEach((timer) => clearTimeout(timer));
    },
    [],
  );
  
  useEffect(() => {
    if (Object.keys(collection).length) {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));
      return;
    }

    localStorage.removeItem(COLLECTION_STORAGE_KEY);
  }, [collection]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/expansions.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load the local card database.');
        return res.json();
      })
      .then((data) => {
        setAllExpansions(data);
        setSelectedSet((currentSet) => (data[currentSet] ? currentSet : 'base1'));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setLoadError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [loadAttempt]);

  const clearRevealTimers = () => {
    clearTimeout(prepTimerRef.current);
    prepTimerRef.current = null;
    revealTimersRef.current.forEach((timer) => clearTimeout(timer));
    revealTimersRef.current = [];
  };

  const addPackToBinder = useCallback((cards, transactionId) => {
    if (
      !transactionId ||
      transactionId !== activePackTransactionRef.current ||
      committedPackTransactionRef.current === transactionId ||
      !cards.length ||
      !cards.every((card) => card.flipped)
    ) {
      return;
    }

    // Claim the transaction synchronously before scheduling any React state updates.
    committedPackTransactionRef.current = transactionId;
    setCollection((prevCollection) =>
      cards.reduce((nextCollection, card) => {
        const ownedCard = nextCollection[card.id];
        return {
          ...nextCollection,
          [card.id]: {
            id: card.id,
            name: card.name,
            image: card.image,
            setId: card.setId,
            setName: card.setName,
            count: (ownedCard?.count || 0) + 1,
          },
        };
      }, prevCollection),
    );
    setLastPullCardIds([...new Set(cards.map((card) => card.id))]);
    setPullHistory((currentHistory) => {
      const nextHistory = [
        {
          id: `${Date.now()}-${cards[0]?.setId || 'set'}`,
          setId: cards[0]?.setId,
          setName: cards[0]?.setName || 'Unknown set',
          cardCount: cards.length,
          newCount: cards.filter((card) => card.isNewPull).length,
          rareNames: cards
            .filter((card) => card.isRare)
            .slice(0, 6)
            .map((card) => card.name),
          openedAt: Date.now(),
        },
        ...currentHistory,
      ].slice(0, 10);
      localStorage.setItem(TCG_PULL_HISTORY_KEY, JSON.stringify(nextHistory));
      return nextHistory;
    });
    setPackAdded(true);
  }, []);

  const revealAllCards = useCallback(() => {
    clearRevealTimers();
    const revealedPack = currentPack.map((card) => ({ ...card, flipped: true }));
    setCurrentPack(revealedPack);
    setIsPreparingPack(false);
    setIsAutoRevealing(false);
    addPackToBinder(revealedPack, activePackTransactionRef.current);
  }, [addPackToBinder, currentPack]);

  const revealCards = (cards, delay, transactionId) => {
    clearRevealTimers();
    setIsPreparingPack(true);
    setIsAutoRevealing(false);

    prepTimerRef.current = setTimeout(() => {
      setIsPreparingPack(false);
      setIsAutoRevealing(true);

      revealTimersRef.current = cards.map((card, index) =>
        setTimeout(() => {
          setCurrentPack((prevPack) => {
            return prevPack.map((packCard) =>
              packCard.packId === card.packId ? { ...packCard, flipped: true } : packCard,
            );
          });
          if (index === cards.length - 1) {
            const revealedPack = cards.map((packCard) => ({ ...packCard, flipped: true }));
            setIsAutoRevealing(false);
            addPackToBinder(revealedPack, transactionId);
          }
        }, (index + 1) * delay),
      );
    }, PACK_PREP_DELAY);
  };

  const startPackReveal = (cards, revealDelay = CARD_FLIP_DELAY) => {
    clearRevealTimers();
    const transactionId = `pack-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    activePackTransactionRef.current = transactionId;
    committedPackTransactionRef.current = '';
    const annotatedCards = cards.map((card) => ({
      ...card,
      isNewPull: !collection[card.id],
    }));
    setCurrentPack(annotatedCards);
    setCurrentPackSet({
      setId: annotatedCards[0]?.setId || selectedSet,
      setName: annotatedCards[0]?.setName || allExpansions?.[selectedSet]?.setName,
      logo: allExpansions?.[annotatedCards[0]?.setId || selectedSet]?.logo,
      releaseYear: allExpansions?.[annotatedCards[0]?.setId || selectedSet]?.releaseYear,
    });
    setShowPackModal(true);
    setPackAdded(false);
    setIsPreparingPack(false);
    setIsAutoRevealing(false);
    setSelectedCard(null);
    revealDelayRef.current = revealDelay;
    revealCards(annotatedCards, revealDelay, transactionId);
  };

  const openPack = () => {
    if (loading || !allExpansions) return;

    const activeSet = allExpansions[selectedSet];
    if (!hasPlayableCards(activeSet)) {
      alert('This set does not have enough cards categorized locally yet!');
      return;
    }

    startPackReveal(buildBoosterPack(activeSet, selectedSet));
  };

  const openRandomPack = () => {
    if (loading || !allExpansions) return;

    const playableSets = releasedPlayableExpansionEntries;
    const [randomSetId, randomSet] = randomItem(playableSets) || [];

    if (!randomSetId || !randomSet) {
      alert('No playable sets are available locally yet!');
      return;
    }

    startPackReveal(buildBoosterPack(randomSet, randomSetId));
  };

  const openTenPacks = () => {
    if (loading || !allExpansions) return;

    const activeSet = allExpansions[selectedSet];
    if (!hasPlayableCards(activeSet)) {
      alert('This set does not have enough cards categorized locally yet!');
      return;
    }

    const packs = Array.from({ length: 10 }, (_, index) =>
      buildBoosterPack(activeSet, selectedSet, index),
    ).flat();
    startPackReveal(packs, TEN_PACK_FLIP_DELAY);
  };

  const openGodPack = () => {
    if (loading || !allExpansions) return;

    const activeSet = allExpansions[selectedSet];
    if (!activeSet?.rares?.length) {
      alert('This set does not have enough rare cards categorized locally yet!');
      return;
    }

    startPackReveal(buildGodPack(activeSet, selectedSet));
  };

  const flipCard = (packId) => {
    if (isAutoRevealing) return;

    const card = currentPack.find((packCard) => packCard.packId === packId);
    if (card?.flipped) {
      setSelectedCard(card);
      return;
    }

    const nextPack = currentPack.map((packCard) =>
      packCard.packId === packId ? { ...packCard, flipped: true } : packCard,
    );
    setCurrentPack(nextPack);
    addPackToBinder(nextPack, activePackTransactionRef.current);
  };

  const clearAllBinders = () => {
    setShowClearBinderDialog('all');
  };

  const confirmClearBinder = () => {
    if (showClearBinderDialog === 'set') {
      const activeSetCardIds = new Set(activeSetCards.map((card) => card.id));
      setCollection((prevCollection) =>
        Object.fromEntries(
          Object.entries(prevCollection).filter(([cardId]) => !activeSetCardIds.has(cardId)),
        ),
      );
    } else {
      setCollection({});
    }

    setShowClearBinderDialog(null);
  };

  const clearActiveSetBinder = () => {
    setShowClearBinderDialog('set');
  };

  const expansionEntries = useMemo(
    () => (allExpansions ? Object.entries(allExpansions) : []),
    [allExpansions],
  );
  const releasedExpansionEntries = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return expansionEntries.filter(([, expansion]) =>
      hasFeaturedTcgCards(expansion) && parseReleaseDate(expansion.releaseDate) <= today.getTime(),
    );
  }, [expansionEntries]);
  const releasedPlayableExpansionEntries = useMemo(
    () => releasedExpansionEntries.filter(([, expansion]) => hasPlayableCards(expansion)),
    [releasedExpansionEntries],
  );
  const indexedReleasedExpansionEntries = useMemo(
    () =>
      releasedExpansionEntries.map(([setId, expansion]) => {
        const setCategory = getExpansionCategory(expansion);
        const seriesFilter = isReferenceOnlyExpansion(expansion)
          ? 'Special / Limited'
          : expansion.series || 'Unknown';
        const allCards = getExpansionCards(expansion).map((card) => {
          const indexedCard = {
            ...card,
            setId,
            setName: expansion.setName,
            series: expansion.series,
            seriesFilter,
            setCategory,
            releaseYear: expansion.releaseYear,
          };

          return {
            ...indexedCard,
            ...createCardSearchIndex(indexedCard),
          };
        });
        const expansionSearchText = normalizeSearchText([
          expansion.setName,
          expansion.series,
          seriesFilter,
          setCategory,
          expansion.releaseYear,
        ].join(' '));

        return [
          setId,
          {
            ...expansion,
            allCards,
            setCategory,
            seriesFilter,
            searchText: expansionSearchText,
            compactSearchText: expansionSearchText.replace(/\s+/g, ''),
          },
        ];
      }),
    [releasedExpansionEntries],
  );
  const latestReleasedExpansion = useMemo(
    () =>
      [...releasedExpansionEntries]
        .sort(([, firstExpansion], [, secondExpansion]) =>
          parseReleaseDate(secondExpansion.releaseDate) - parseReleaseDate(firstExpansion.releaseDate),
        )[0]?.[1],
    [releasedExpansionEntries],
  );

  const activeSet = allExpansions?.[selectedSet];
  const activeSetIsReferenceOnly = isReferenceOnlyExpansion(activeSet);
  const selectedSetIsPlayable = hasPlayableCards(activeSet);
  const activeSetCards = useMemo(() => {
    if (!activeSet) return [];

    const uniqueCards = new Map();
    getExpansionCards(activeSet).forEach((card) => {
      if (!uniqueCards.has(card.id)) {
        uniqueCards.set(card.id, {
          ...card,
          setId: selectedSet,
          setName: activeSet.setName,
          series: activeSet.series,
          seriesFilter: activeSetIsReferenceOnly
            ? 'Special / Limited'
            : activeSet.series || 'Unknown',
          setCategory: getExpansionCategory(activeSet),
          releaseYear: activeSet.releaseYear,
        });
      }
    });

    return [...uniqueCards.values()].map((card) => ({
      ...card,
      ...createCardSearchIndex(card),
    }));
  }, [activeSet, activeSetIsReferenceOnly, selectedSet]);
  const ownedActiveSetCards = activeSetIsReferenceOnly
    ? activeSetCards
    : activeSetCards.filter((card) => collection[card.id]);
  const normalizedSetSearch = normalizeSearchText(deferredSearchTerm);
  const compactSetSearch = compactSearchText(deferredSearchTerm);
  const hasRawSetSearch = Boolean(deferredSearchTerm.trim());
  const hasInvalidSetSearch = hasRawSetSearch && !normalizedSetSearch;
  const isSetCardSearchTooShort = Boolean(normalizedSetSearch) && compactSetSearch.length < 2;
  const normalizedBinderSearch = normalizeSearchText(binderSearchTerm);
  const hasRawBinderSearch = Boolean(binderSearchTerm.trim());
  const hasInvalidBinderSearch = hasRawBinderSearch && !normalizedBinderSearch;
  const visibleBinderCards = useMemo(() => {
    if (hasInvalidBinderSearch) return [];

    const matchingCards = normalizedBinderSearch
      ? activeSetCards.filter((card) => cardMatchesSearch(card, binderSearchTerm))
      : activeSetCards;
    const filteredCards = matchingCards.filter((card) => {
      const ownedCount = collection[card.id]?.count || 0;
      if (binderFilter === 'owned') return ownedCount > 0 || activeSetIsReferenceOnly;
      if (binderFilter === 'missing') return ownedCount === 0 && !activeSetIsReferenceOnly;
      if (binderFilter === 'duplicates') return ownedCount > 1;
      if (binderFilter === 'new') return lastPullCardIds.includes(card.id);
      return true;
    });

    return [...filteredCards].sort((firstCard, secondCard) => {
      if (binderSortMode !== 'rarity') return compareCardNumbers(firstCard, secondCard);

      return compareCardsByRarity(
        firstCard,
        secondCard,
        binderRarityDirection,
      );
    });
  }, [
    activeSetCards,
    activeSetIsReferenceOnly,
    binderFilter,
    binderRarityDirection,
    binderSearchTerm,
    binderSortMode,
    collection,
    hasInvalidBinderSearch,
    lastPullCardIds,
    normalizedBinderSearch,
  ]);
  const allSetSearchCards = useMemo(() => {
    if (compactSearchText(deferredSearchTerm).length < 2) return [];

    return indexedReleasedExpansionEntries.flatMap(([setId, expansion]) =>
      expansion.allCards
        .filter((card) => cardMatchesSearch(card, deferredSearchTerm))
        .map((card) => ({
          ...card,
          setId,
          setName: expansion.setName,
          setCategory: expansion.setCategory,
          releaseYear: expansion.releaseYear,
          isOwnedInBinder: isReferenceOnlyExpansion(expansion) || Boolean(collection[card.id]),
          isReferenceOnly: isReferenceOnlyExpansion(expansion),
        })),
    );
  }, [collection, deferredSearchTerm, indexedReleasedExpansionEntries]);
  const binderProgress = activeSetIsReferenceOnly && activeSetCards.length
    ? 100
    : activeSetCards.length
    ? Math.round((ownedActiveSetCards.length / activeSetCards.length) * 100)
    : 0;
  const progressLevel = binderProgress >= 75 ? 'good' : binderProgress >= 35 ? 'mid' : 'low';
  const hasCollectionCards = Object.keys(collection).length > 0;
  const clearDialogIsForSet = showClearBinderDialog === 'set';
  const clearDialogTitle = clearDialogIsForSet ? 'Clear This Binder?' : 'Clear All Binders?';
  const clearDialogMessage = clearDialogIsForSet
    ? `This will remove ${ownedActiveSetCards.length} owned card${
        ownedActiveSetCards.length === 1 ? '' : 's'
      } from ${activeSet?.setName || 'the selected set'} only.`
    : 'This will remove every card from every binder collection.';
  const clearDialogButtonLabel = clearDialogIsForSet ? 'Clear This Binder' : 'Clear All Binders';

  const openBinderCard = (card) => {
    setSelectedCard({
      ...card,
      setId: selectedSet,
      setName: activeSet?.setName,
      isOwnedInBinder: activeSetIsReferenceOnly || Boolean(collection[card.id]),
      isReferenceOnly: activeSetIsReferenceOnly,
    });
  };

  const openSearchResultCard = (card) => {
    setSelectedCard({
      ...card,
      isOwnedInBinder: card.isReferenceOnly || Boolean(collection[card.id]),
    });
  };

  const seriesOptions = useMemo(() => {
    const options = [
      'All',
      ...new Set(indexedReleasedExpansionEntries.map(([, expansion]) => expansion.seriesFilter)),
    ];
    return options.sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      if (a === 'Special / Limited') return 1;
      if (b === 'Special / Limited') return -1;
      return a.localeCompare(b);
    });
  }, [indexedReleasedExpansionEntries]);

  const visibleExpansions = useMemo(
    () =>
      indexedReleasedExpansionEntries
        .filter(([, expansion]) => {
          const matchesSeries =
            selectedSeries === 'All' || expansion.seriesFilter === selectedSeries;
          const canSearchCards = compactSetSearch.length >= 2;
          const matchesSearch =
            !hasRawSetSearch ||
            (!hasInvalidSetSearch && (
              expansion.searchText.includes(normalizedSetSearch) ||
              expansion.compactSearchText.includes(compactSetSearch) ||
              (canSearchCards && expansionHasCardMatch(expansion, deferredSearchTerm))
            ));

          return matchesSeries && matchesSearch;
        })
        .sort(([, firstExpansion], [, secondExpansion]) => {
          if (selectedSeries === 'All') {
            const firstIsReference = firstExpansion.seriesFilter === 'Special / Limited';
            const secondIsReference = secondExpansion.seriesFilter === 'Special / Limited';
            if (firstIsReference !== secondIsReference) return firstIsReference ? 1 : -1;
          }

          if (sortMode === 'name') {
            return firstExpansion.setName.localeCompare(secondExpansion.setName);
          }

          const firstDate = firstExpansion.releaseDate || '9999/99/99';
          const secondDate = secondExpansion.releaseDate || '9999/99/99';
          const dateSort = firstDate.localeCompare(secondDate);
          return sortMode === 'release-newest' ? dateSort * -1 : dateSort;
        }),
    [
      compactSetSearch,
      deferredSearchTerm,
      hasInvalidSetSearch,
      hasRawSetSearch,
      indexedReleasedExpansionEntries,
      normalizedSetSearch,
      selectedSeries,
      sortMode,
    ],
  );
  const expansionPageCount = Math.max(1, Math.ceil(visibleExpansions.length / EXPANSION_PAGE_SIZE));
  const activeExpansionPage = Math.min(expansionPage, expansionPageCount);
  const visibleExpansionPage = visibleExpansions.slice(
    (activeExpansionPage - 1) * EXPANSION_PAGE_SIZE,
    activeExpansionPage * EXPANSION_PAGE_SIZE,
  );

  const chooseSet = (setId) => {
    const nextSet = allExpansions?.[setId];
    const indexedNextSet = indexedReleasedExpansionEntries.find(
      ([candidateSetId]) => candidateSetId === setId,
    )?.[1];
    const canSearchCards = compactSearchText(searchTerm).length >= 2;
    const hasTopPokemonSearch =
      canSearchCards && expansionHasCardMatch(indexedNextSet || nextSet, searchTerm);

    clearRevealTimers();
    setSelectedSet(setId);
    localStorage.setItem(TCG_VIEW_STORAGE_KEY, setId);
    onRouteChange?.({ set: setId }, { replace: true });
    if (normalizeSearchText(searchTerm)) {
      setBinderSearchTerm(hasTopPokemonSearch ? searchTerm : '');
    }
    setCurrentPack([]);
    setShowPackModal(false);
    setPackAdded(false);
    setIsPreparingPack(false);
    setIsAutoRevealing(false);
    setSelectedCard(null);
    setBinderFilter('all');

    if (hasTopPokemonSearch) {
      window.setTimeout(() => {
        binderPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  return (
    <div className="app-container tcg-page">
      <header className="app-header tcg-header">
        <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
          <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
          <h1>Pokémon TCG Simulator</h1>
        </button>
        <StationNav
          activeStation="tcg"
          onNavigate={(station) => {
            const handlers = {
              home: onBack,
              pokedex: onOpenPokedex,
              who: onOpenWhos,
              team: onOpenTeam,
              quiz: onOpenQuiz,
              trainerdex: onOpenTrainerDex,
            };
            handlers[station]?.();
          }}
        />
      </header>

      <div className="control-panel">
        {loadError && (
          <div className="status-with-action" role="alert">
            <p className="pokedex-error">{loadError}</p>
            <button
              type="button"
              className="nes-btn"
              onClick={() => {
                setLoadError('');
                setLoading(true);
                setLoadAttempt((attempt) => attempt + 1);
              }}
            >
              Retry
            </button>
          </div>
        )}
        <details
          className="disclosure-panel tcg-set-browser-disclosure"
          open={setBrowserOpen}
          onToggle={(event) => setSetBrowserOpen(event.currentTarget.open)}
        >
          <summary>Browse expansions ({visibleExpansions.length})</summary>
          <div className="tcg-set-browser-content">
        <div className="series-filter" aria-label="Filter by series">
          {seriesOptions.map((series) => (
            <button
              key={series}
              type="button"
              className={`series-button ${selectedSeries === series ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedSeries(series);
                setExpansionPage(1);
              }}
              disabled={loading}
            >
              {series}
            </button>
          ))}
        </div>

        {latestReleasedExpansion && (
          <p className="tcg-latest-expansion">
            Sets available through {latestReleasedExpansion.setName} ({latestReleasedExpansion.releaseYear}).
          </p>
        )}
        <p className="tcg-artwork-note" role="note">
          <strong>Artwork notice:</strong> Cards without available front artwork are excluded from set lists, binders, search results, and featured card galleries.
        </p>
        {(selectedSeries === 'Special / Limited' || activeSetIsReferenceOnly) && (
          <p className="tcg-other-note">
            Special and limited sets include promos, trainer kits, POP, and other releases that are not eligible for pack opening. Their binders are shown complete by default for browsing only.
          </p>
        )}

        <label htmlFor="set-search">Search expansions or Pokemon</label>
        <div className="search-with-clear">
          <input
            id="set-search"
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setExpansionPage(1);
            }}
            placeholder="Try Charizard, Base Set, or Base Set Charizard..."
            disabled={loading}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-button"
              onClick={() => {
                setSearchTerm('');
                setExpansionPage(1);
              }}
              disabled={loading}
              aria-label="Clear expansion search"
              title="Clear expansion search"
            >
              x
            </button>
          )}
        </div>

        <div className="tcg-art-toggle-setting">
          <span className="binder-art-default-note">Unowned cards are grayscale by default</span>
          <button
            type="button"
            className={`binder-art-toggle ${showUnownedCardArt ? 'is-color' : ''}`}
            onClick={() => setShowUnownedCardArt((showCardArt) => !showCardArt)}
            aria-pressed={showUnownedCardArt}
            aria-label={`Unowned card artwork: ${showUnownedCardArt ? 'color' : 'grayscale'}. Click to switch to ${
              showUnownedCardArt ? 'grayscale' : 'color'
            }.`}
            title={`Unowned cards: ${showUnownedCardArt ? 'color' : 'grayscale'}`}
          >
            <span className="binder-art-toggle-thumb" aria-hidden="true" />
          </button>
        </div>

        <label htmlFor="set-sort">Sort sets</label>
        <select
          id="set-sort"
          value={sortMode}
          onChange={(event) => {
            setSortMode(event.target.value);
            setExpansionPage(1);
          }}
          disabled={loading}
        >
          <option value="release-oldest">Release year: oldest first</option>
          <option value="release-newest">Release year: newest first</option>
          <option value="name">Name: A to Z</option>
        </select>

        <div className="set-grid" aria-label="Expansion sets">
          {visibleExpansionPage.map(([key, expansion]) => (
            <button
              key={key}
              type="button"
              className={`set-card nes-btn ${selectedSet === key ? 'is-selected is-primary' : ''}`}
              onClick={() => chooseSet(key)}
            >
              {expansion.logo && (
                <img
                  className="set-card-logo"
                  src={expansion.logo}
                  alt={`${expansion.setName} logo`}
                  loading="lazy"
                />
              )}
              <span className="set-card-name">{expansion.setName}</span>
              <span className="set-card-series">
                {expansion.symbol && (
                  <img
                    className="set-card-symbol"
                    src={expansion.symbol}
                    alt=""
                    loading="lazy"
                  />
                )}
                <span className="set-card-series-text">{expansion.series}</span>
              </span>
              <span className="set-card-date">{expansion.releaseYear || 'Unknown year'}</span>
              <span className={`set-category-pill set-category-${compactSearchText(expansion.setCategory)}`}>
                {expansion.setCategory}
              </span>
            </button>
          ))}
          {!loading && hasInvalidSetSearch && (
            <p className="pokedex-status" role="status">Enter letters or numbers to search sets and cards.</p>
          )}
          {!loading && !hasInvalidSetSearch && isSetCardSearchTooShort && (
            <p className="pokedex-status" role="status">Enter at least 2 characters to search cards across sets.</p>
          )}
          {!loading && normalizedSetSearch && !isSetCardSearchTooShort && !visibleExpansions.length && !allSetSearchCards.length && (
            <p className="pokedex-status" role="status">No sets or cards match this search.</p>
          )}
        </div>

        {!loading && visibleExpansions.length > 0 && (
          <nav className="set-grid-pagination" aria-label="Expansion set pages">
            <button
              type="button"
              className="nes-btn"
              onClick={() => setExpansionPage(Math.max(1, activeExpansionPage - 1))}
              disabled={activeExpansionPage === 1}
            >
              Prev
            </button>
            <span aria-live="polite">
              Page {activeExpansionPage} / {expansionPageCount} · {visibleExpansions.length} sets
            </span>
            <button
              type="button"
              className="nes-btn"
              onClick={() => setExpansionPage(Math.min(expansionPageCount, activeExpansionPage + 1))}
              disabled={activeExpansionPage === expansionPageCount}
            >
              Next
            </button>
          </nav>
        )}
          </div>
        </details>

        <div className="button-group tcg-selected-set-actions">
          <p className="tcg-selected-set-label">
            <span>Selected set</span>
            <strong>{activeSet?.setName || 'Loading...'}</strong>
          </p>
          <button
            onClick={openPack}
            disabled={loading || !selectedSetIsPlayable}
            className="btn btn-primary nes-btn is-success"
          >
            {loading ? 'Loading Database...' : 'Open 1 Pack'}
          </button>
          <button
            onClick={openTenPacks}
            disabled={loading || !selectedSetIsPlayable}
            className="btn btn-secondary btn-ten-pack nes-btn is-warning"
          >
            Open 10 Packs
          </button>
          <button
            onClick={openRandomPack}
            disabled={loading || !allExpansions}
            className="btn btn-random-pack nes-btn is-primary"
          >
            Open Random Pack
          </button>
          <button
            onClick={openGodPack}
            disabled={loading || !selectedSetIsPlayable}
            className="btn btn-god nes-btn is-primary"
          >
            Open God Pack
          </button>
        </div>
      </div>

      {allSetSearchCards.length > 0 && (
        <section
          className={`binder-panel all-set-results-panel ${
            showUnownedCardArt ? 'show-unowned-card-art' : ''
          }`}
          aria-label="All set search results"
        >
          <div className="binder-header">
            <div>
              <h2>All Sets</h2>
              <p>
                {allSetSearchCards.length} card{allSetSearchCards.length === 1 ? '' : 's'} found for {deferredSearchTerm}
              </p>
            </div>
          </div>
          <div className="binder-grid all-set-results-grid">
            {allSetSearchCards.map((card) => (
              <article
                key={`${card.setId}-${card.id}`}
                className={`binder-card ${card.isOwnedInBinder ? 'is-owned' : ''}`}
                data-card-art-entry
                hidden={!getCardFaceImage(card)}
                role="button"
                tabIndex={0}
                onClick={() => openSearchResultCard(card)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openSearchResultCard(card);
                  }
                }}
              >
                <img
                  src={getCardFaceImage(card)}
                  data-fallback-src={getCardFallbackImage(card)}
                  data-card-art-key={getCardArtworkKey(card)}
                  alt={card.name}
                  loading="lazy"
                  onLoad={handleCardImageLoad}
                  onError={handleCardImageError}
                />
                <div>
                  <h3>{card.name}</h3>
                  <p>{card.setName} <span className="set-category-pill">{card.setCategory}</span></p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section
        ref={binderPanelRef}
        className={`binder-panel ${showUnownedCardArt ? 'show-unowned-card-art' : ''}`}
        aria-label="Collection binder"
      >
        <div className="binder-header">
          <div>
            <h2>Binder</h2>
            <p>
              {activeSetIsReferenceOnly
                ? `${activeSet?.setName || 'Selected set'} is reference-only and shown complete by default.`
                : `${activeSet?.setName || 'Selected set'} collection progress: ${ownedActiveSetCards.length} / ${activeSetCards.length} unique cards`}
            </p>
          </div>
          <div className="binder-header-actions">
            <strong className={`binder-progress progress-label-${progressLevel}`}>
              {binderProgress}%
            </strong>
            <div className="binder-clear-actions" aria-label="Binder clear actions">
              <button
                type="button"
                onClick={clearActiveSetBinder}
                disabled={activeSetIsReferenceOnly || !ownedActiveSetCards.length}
                className="btn btn-danger nes-btn is-error"
              >
                Clear This Binder
              </button>
              <button
                type="button"
                onClick={clearAllBinders}
                disabled={!hasCollectionCards}
                className="btn btn-danger nes-btn is-error"
              >
                Clear All Binders
              </button>
            </div>
          </div>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div
            className={`progress-fill progress-${progressLevel}`}
            style={{ width: `${binderProgress}%` }}
          />
        </div>
        <label htmlFor="binder-search">Search binder cards</label>
        <div className="search-with-clear">
          <input
            id="binder-search"
            type="text"
            value={binderSearchTerm}
            onChange={(event) => setBinderSearchTerm(event.target.value)}
            placeholder="Search Pokemon in this set..."
          />
          {binderSearchTerm && (
            <button
              type="button"
              className="search-clear-button"
              onClick={() => setBinderSearchTerm('')}
              aria-label="Clear binder search"
              title="Clear binder search"
            >
              x
            </button>
          )}
        </div>
        <div className="binder-filter-row" aria-label="Filter binder by ownership">
          {[
            ['all', 'All'],
            ['owned', 'Owned'],
            ['missing', 'Missing'],
            ['duplicates', 'Duplicates'],
            ['new', 'Latest Pull'],
          ].map(([filterId, label]) => (
            <button
              key={filterId}
              type="button"
              className={`series-button ${binderFilter === filterId ? 'is-active' : ''}`}
              onClick={() => setBinderFilter(filterId)}
              disabled={filterId === 'new' && !lastPullCardIds.length}
              aria-pressed={binderFilter === filterId}
            >
              {label}
            </button>
          ))}
        </div>
        <label htmlFor="binder-sort">Sort binder cards</label>
        <div className={`binder-sort-controls ${binderSortMode === 'rarity' ? 'has-rarity-toggle' : ''}`}>
          <select
            id="binder-sort"
            value={binderSortMode}
            onChange={(event) => setBinderSortMode(event.target.value)}
          >
            <option value="number">Card number</option>
            <option value="rarity">Rarity</option>
          </select>
          {binderSortMode === 'rarity' && (
            <button
              type="button"
              className="binder-rarity-order-button nes-btn"
              onClick={() =>
                setBinderRarityDirection((currentDirection) =>
                  currentDirection === 'rarest' ? 'common' : 'rarest',
                )
              }
              aria-pressed={binderRarityDirection === 'common'}
              aria-label={`Rarity order: ${
                binderRarityDirection === 'rarest' ? 'most rare first' : 'most common first'
              }. Click to reverse the order.`}
            >
              {binderRarityDirection === 'rarest' ? 'Most rare first ↓' : 'Most common first ↑'}
            </button>
          )}
        </div>
        <div className="binder-grid">
          {visibleBinderCards.map((card) => {
            const ownedCard = collection[card.id];
            return (
              <article
                key={card.id}
                className={`binder-card ${ownedCard || activeSetIsReferenceOnly ? 'is-owned' : ''}`}
                data-card-art-entry
                hidden={!getCardFaceImage(card)}
                role="button"
                tabIndex={0}
                onClick={() => openBinderCard(card)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openBinderCard(card);
                  }
                }}
              >
                <img
                  src={getCardFaceImage(card)}
                  data-fallback-src={getCardFallbackImage(card)}
                  data-card-art-key={getCardArtworkKey(card)}
                  alt={card.name}
                  loading="lazy"
                  onLoad={handleCardImageLoad}
                  onError={handleCardImageError}
                />
                <div>
                  <h3>{card.name}</h3>
                  <p>{card.rarity || 'Unknown'} · Owned x {ownedCard?.count || 0}</p>
                </div>
              </article>
            );
          })}
          {!visibleBinderCards.length && (
            <p className="pokedex-status" role="status">
              {hasInvalidBinderSearch
                ? 'Enter letters or numbers to search this binder.'
                : 'No cards match this binder search.'}
            </p>
          )}
        </div>
      </section>

      {pullHistory.length > 0 && (
        <section className="binder-panel pull-history-panel" aria-labelledby="pull-history-title">
          <details className="disclosure-panel">
            <summary id="pull-history-title">Recent Pulls ({pullHistory.length})</summary>
            <ol className="pull-history-list">
              {pullHistory.map((pull) => (
                <li key={pull.id}>
                  <div>
                    <strong>{pull.setName}</strong>
                    <span>
                      {pull.cardCount} cards · {pull.newCount} new
                    </span>
                  </div>
                  <p>{pull.rareNames.length ? pull.rareNames.join(', ') : 'No rare cards recorded'}</p>
                  <time dateTime={new Date(pull.openedAt).toISOString()}>
                    {new Date(pull.openedAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ol>
          </details>
        </section>
      )}

      {showClearBinderDialog && (
        <div
          className="clear-dialog-overlay"
          role="presentation"
          onClick={() => setShowClearBinderDialog(null)}
        >
          <div
            className="clear-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="clear-dialog-title">{clearDialogTitle}</h2>
            <p>{clearDialogMessage}</p>
            <div className="clear-dialog-actions">
              <button
                type="button"
                className="nes-btn"
                onClick={() => setShowClearBinderDialog(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger nes-btn is-error"
                onClick={confirmClearBinder}
              >
                {clearDialogButtonLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPackModal && currentPack.length > 0 && (
        <div className="pack-reveal-overlay" role="dialog" aria-modal="true">
          <div className="pack-reveal-modal">
            <div className="pack-reveal-header">
              <div className="pack-set-info">
                {currentPackSet?.logo && (
                  <img
                    className="pack-set-logo"
                    src={currentPackSet.logo}
                    alt={`${currentPackSet.setName} logo`}
                  />
                )}
                <span className="pack-release-year">
                  Release Year: {currentPackSet?.releaseYear || 'Unknown year'}
                </span>
              </div>
              <button
                type="button"
                className="modal-close nes-btn"
                onClick={() => setShowPackModal(false)}
                disabled={isPreparingPack || isAutoRevealing}
              >
                Close
              </button>
            </div>

            {isPreparingPack && (
              <div className="pack-loading-state" role="status">
                <div className="pack-loader-ball" aria-hidden="true" />
                <p>Preparing booster pack...</p>
              </div>
            )}

            {currentPack.length > 0 && !isPreparingPack && (
              <div
                className={`pack-grid ${
                  currentPack.length > 20 ? 'is-scrollable' : ''
                }`}
              >
                {currentPack.map((card) => (
                  <div
                    key={card.packId}
                    className={`card-container ${card.flipped ? 'is-flipped' : ''}`}
                    data-card-art-entry
                    hidden={!getCardFaceImage(card)}
                    role="button"
                    tabIndex={0}
                    aria-label={card.flipped ? `Open ${card.name}` : 'Reveal card'}
                    onClick={() => flipCard(card.packId)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        flipCard(card.packId);
                      }
                    }}
                  >
                    <div className="card-inner">
                      <div className="card-front">
                        <img
                          src={getCardFaceImage(card)}
                          data-fallback-src={getCardFallbackImage(card)}
                          data-card-art-key={getCardArtworkKey(card)}
                          alt={card.name}
                          onLoad={handleCardImageLoad}
                          onError={handleCardImageError}
                        />
                        {card.isRare && <div className="holo-overlay" aria-hidden="true" />}
                        {card.isNewPull && <span className="new-card-badge">New</span>}
                      </div>
                      <div className="card-back">
                        <img
                          className="card-back-image"
                          src={CARD_BACK_IMAGE}
                          alt="Pokemon card back"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pack-actions pack-reveal-actions">
              <button
                type="button"
                className="pack-skip-button nes-btn is-primary"
                onClick={revealAllCards}
                disabled={packAdded && currentPack.every((card) => card.flipped)}
              >
                {isPreparingPack || isAutoRevealing ? 'Skip Animation' : 'Reveal All'}
              </button>
              <button
                type="button"
                className="btn btn-primary nes-btn is-success"
                onClick={openPack}
                disabled={loading || !selectedSetIsPlayable || isPreparingPack || isAutoRevealing}
              >
                Open 1 Pack
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-ten-pack nes-btn is-warning"
                onClick={openTenPacks}
                disabled={loading || !selectedSetIsPlayable || isPreparingPack || isAutoRevealing}
              >
                Open 10 Packs
              </button>
              <button
                type="button"
                className="btn btn-random-pack nes-btn is-primary"
                onClick={openRandomPack}
                disabled={loading || !allExpansions || isPreparingPack || isAutoRevealing}
              >
                Random Pack
              </button>
              <button
                type="button"
                className="btn btn-god nes-btn is-primary"
                onClick={openGodPack}
                disabled={loading || !selectedSetIsPlayable || isPreparingPack || isAutoRevealing}
              >
                Open God Pack
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCard && (
        <TcgCardDetailModal
          card={selectedCard}
          titleId="card-detail-title"
          imageClassName={selectedCard.isOwnedInBinder === false ? 'is-unowned' : ''}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}

export default TcgSimulator;
