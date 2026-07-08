/* eslint-disable no-unused-vars */
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import StationNav from '../../components/StationNav';
import speakerIcon from '../../../pokedex/misc/Speaker_Icon.svg';
import {
  ALL_POKEDEX_OPTION,
  buildBoosterPack,
  buildEvolutionTree,
  buildGodPack,
  buildPokedexEntries,
  buildPokemonHintChoices,
  buildPokemonQuizQuestion,
  CARD_BACK_IMAGE,
  CARD_FLIP_DELAY,
  CachedImage,
  cardMatchesSearch,
  cleanPokeApiText,
  COLLECTION_STORAGE_KEY,
  COMMON_ABILITY_DISTRACTORS,
  compactSearchText,
  createCardSearchIndex,
  EvolutionBranch,
  expansionHasCardMatch,
  fetchPokeApiJson,
  fetchPokemonByNameOrSpecies,
  fetchPokemonListMetadata,
  findEvolutionNode,
  formatEvolutionRequirement,
  formatGenerationName,
  formatLeaderboardDate,
  formatNoBreakSlashLabel,
  formatPokemonName,
  formatVersionGroupName,
  GENERATION_ORDER,
  getAvailableLevelUpMoveGroups,
  getCardFaceImage,
  getCardFallbackImage,
  getEnglishApiFlavorText,
  getEnglishEffectText,
  getEnglishEntry,
  getEnglishFlavorText,
  getEnglishShortEffectText,
  getEvolutionNames,
  getExpansionCards,
  getExpansionCategory,
  getFeaturedTcgCards,
  getGenerationSprites,
  getImageFallbackChain,
  getLevelUpMovesForVersionGroup,
  getPokeApiCacheDb,
  getPokemonIdFromPokemonUrl,
  getPokemonIdFromSpeciesUrl,
  getPokemonIdFromUrl,
  getPokemonLookupValidationError,
  getPokemonOfficialArtworkUrl,
  getPokemonPool,
  getPokemonQuizData,
  getPokemonSpriteUrl,
  getRegionForGeneration,
  getSpriteVariants,
  getTeamAverageStats,
  getTeamVersionGroup,
  getTypeMultiplierMap,
  getTypeWeaknesses,
  GitHubRepoLink,
  handleCardImageError,
  hasFeaturedTcgCards,
  isPokemonGuessCorrect,
  LATEST_VERSION_GROUPS,
  loadCollection,
  loadEvolutionChain,
  loadWhoLeaderboard,
  makeAbortError,
  makeChoices,
  maskPokemonNameInText,
  matchesPokemonSearch,
  MOVE_CATEGORY_ICONS,
  normalizePokemonLookup,
  normalizePokemonName,
  normalizeSearchText,
  PACK_PREP_DELAY,
  parseReleaseDate,
  POKEAPI_BASE_URL,
  POKEAPI_CACHE_DB_NAME,
  POKEAPI_CACHE_DB_VERSION,
  POKEAPI_CACHE_STORE_NAME,
  pokeApiCacheDbPromise,
  pokeApiMemoryCache,
  POKEDEX_METADATA_SORTS,
  POKEDEX_OPTIONS,
  POKEDEX_VERSION_GROUPS,
  POKEMON_LOOKUP_ALIASES,
  POKEMON_SEARCH_VALIDATION_MESSAGE,
  QUIZ_CATEGORY_OPTIONS,
  randomItem,
  readCachedPokeApiResource,
  REPOSITORY_URL,
  saveWhoLeaderboard,
  shuffleItems,
  STAT_LABELS,
  STAT_SORT_OPTIONS,
  STATION_NAV_OPTIONS,
  summarizeTeamMoveCoverage,
  summarizeTeamTypeMatchups,
  TEAM_POKEDEX_OPTIONS,
  TEN_PACK_FLIP_DELAY,
  TypeBadge,
  TYPE_NAMES,
  WHO_LEADERBOARD_STORAGE_KEY,
  writeCachedPokeApiResource
} from '../shared/stationShared';

const POKEMON_LIST_PAGE_SIZE = 24;

function PokedexPage({ onBack, onOpenTcg, onOpenWhos, onOpenTeam, onOpenQuiz, onOpenTrainerDex }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedDex, setSelectedDex] = useState(ALL_POKEDEX_OPTION.id);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedTcgCard, setSelectedTcgCard] = useState(null);
  const [selectedSpriteSet, setSelectedSpriteSet] = useState(null);
  const [selectedPokedexDetail, setSelectedPokedexDetail] = useState(null);
  const [unavailableGenerationSpriteIds, setUnavailableGenerationSpriteIds] = useState({});
  const [unavailableSpriteVariantIds, setUnavailableSpriteVariantIds] = useState({});
  const [selectedMoveGroup, setSelectedMoveGroup] = useState('');
  const [speciesDetails, setSpeciesDetails] = useState(null);
  const [evolutionTree, setEvolutionTree] = useState(null);
  const [typeWeaknesses, setTypeWeaknesses] = useState([]);
  const [moveDetails, setMoveDetails] = useState({});
  const [tcgCards, setTcgCards] = useState([]);
  const [loadingTcgCards, setLoadingTcgCards] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonPage, setPokemonPage] = useState(1);
  const [pokemonSortMode, setPokemonSortMode] = useState('entry');
  const [pokemonMetadata, setPokemonMetadata] = useState({});
  const [loadingList, setLoadingList] = useState(true);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [error, setError] = useState('');
  const cryAudioRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const pokedexIds =
      selectedDex === ALL_POKEDEX_OPTION.id
        ? POKEDEX_OPTIONS.map((pokedex) => pokedex.id)
        : [selectedDex];

    Promise.all(
      pokedexIds.map((pokedexId) =>
        fetchPokeApiJson(
          `${POKEAPI_BASE_URL}/pokedex/${pokedexId}`,
          { signal: controller.signal },
          'Unable to load this Pokedex.',
        ),
      ),
    )
      .then((data) => {
        setPokemonList(buildPokedexEntries(data, selectedDex === ALL_POKEDEX_OPTION.id));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingList(false);
        }
      });

    return () => controller.abort();
  }, [selectedDex]);

  useEffect(() => {
    if (!POKEDEX_METADATA_SORTS.has(pokemonSortMode) || !pokemonList.length) {
      return undefined;
    }

    const missingPokemon = pokemonList.filter((pokemon) => !pokemonMetadata[pokemon.name]);

    if (!missingPokemon.length) {
      return undefined;
    }

    const controller = new AbortController();

    const loadMetadata = async () => {
      const loadedEntries = [];
      const batchSize = 20;

      for (let index = 0; index < missingPokemon.length; index += batchSize) {
        if (controller.signal.aborted) {
          return;
        }

        const batch = missingPokemon.slice(index, index + batchSize);
        const metadataBatch = await Promise.all(
          batch.map((pokemon) => fetchPokemonListMetadata(pokemon, { signal: controller.signal })),
        );
        loadedEntries.push(...metadataBatch);
      }

      if (!controller.signal.aborted) {
        setPokemonMetadata((previousMetadata) => ({
          ...previousMetadata,
          ...Object.fromEntries(loadedEntries.map((metadata) => [metadata.name, metadata])),
        }));
      }
    };

    loadMetadata()
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      });

    return () => controller.abort();
  }, [pokemonList, pokemonMetadata, pokemonSortMode]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/expansions.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load TCG card data.');
        }
        return response.json();
      })
      .then((data) => {
        const allCards = Object.values(data)
          .filter((expansion) => hasFeaturedTcgCards(expansion))
          .flatMap((expansion) =>
            getExpansionCards(expansion).map((card) => ({
              ...card,
              setName: expansion.setName,
              setId: expansion.setId,
              setCategory: getExpansionCategory(expansion),
            })),
          );
        setTcgCards(allCards);
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingTcgCards(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedPokemon) {
      return undefined;
    }

    const controller = new AbortController();

    Promise.all([
      fetchPokeApiJson(
        selectedPokemon.species.url,
        { signal: controller.signal },
        'Unable to load Pokemon species data.',
      ),
      Promise.all(
        selectedPokemon.types.map(({ type }) =>
          fetchPokeApiJson(type.url, { signal: controller.signal }, 'Unable to load Pokemon type data.'),
        ),
      ),
    ])
      .then(([species, typeData]) => {
        setSpeciesDetails(species);
        setTypeWeaknesses(getTypeWeaknesses(typeData));
        return fetchPokeApiJson(
          species.evolution_chain.url,
          { signal: controller.signal },
          'Unable to load evolution chain.',
        );
      })
      .then((data) => {
        setEvolutionTree(buildEvolutionTree(data.chain));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      });

    return () => controller.abort();
  }, [selectedPokemon]);

  useEffect(
    () => () => {
      if (cryAudioRef.current) {
        cryAudioRef.current.pause();
        cryAudioRef.current = null;
      }
    },
    [selectedPokemon],
  );

  const searchPokemon = useCallback((pokemonName) => {
    const validationError = getPokemonLookupValidationError(pokemonName);
    if (validationError) {
      setSelectedPokemon(null);
      setSpeciesDetails(null);
      setEvolutionTree(null);
      setTypeWeaknesses([]);
      setMoveDetails({});
      setSelectedPokedexDetail(null);
      setError(validationError);
      return;
    }

    const normalizedName = normalizePokemonLookup(pokemonName);
    if (!normalizedName) return;

    setLoadingPokemon(true);
    setError('');

    fetchPokemonByNameOrSpecies(normalizedName)
      .then((data) => {
        setSelectedPokemon(data);
        setSelectedMoveGroup('');
        setSpeciesDetails(null);
        setEvolutionTree(null);
        setTypeWeaknesses([]);
        setMoveDetails({});
        setSelectedPokedexDetail(null);
        setSearchTerm(data.species?.name || data.name);
        setPokemonPage(1);
      })
      .catch((fetchError) => {
        setSelectedPokemon(null);
        setSpeciesDetails(null);
        setEvolutionTree(null);
        setTypeWeaknesses([]);
        setMoveDetails({});
        setSelectedPokedexDetail(null);
        setError(fetchError.message);
      })
      .finally(() => setLoadingPokemon(false));
  }, []);

  const playPokemonCry = useCallback(() => {
    const cryUrl = selectedPokemon?.cries?.latest || selectedPokemon?.cries?.legacy;
    if (!cryUrl) return;

    if (cryAudioRef.current) {
      cryAudioRef.current.pause();
      cryAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(cryUrl);
    cryAudioRef.current = audio;
    audio.play().catch(() => {
      setError('Pokemon cry could not be played.');
    });
  }, [selectedPokemon]);

  const openAbilityDetail = useCallback((ability, isHidden = false) => {
    setSelectedPokedexDetail({
      type: 'ability',
      name: ability.name,
      isHidden,
      loading: true,
      error: '',
      data: null,
    });

    fetchPokeApiJson(ability.url, {}, 'Unable to load ability details.')
      .then((data) => {
        setSelectedPokedexDetail({
          type: 'ability',
          name: ability.name,
          isHidden,
          loading: false,
          error: '',
          data,
        });
      })
      .catch((fetchError) => {
        setSelectedPokedexDetail({
          type: 'ability',
          name: ability.name,
          isHidden,
          loading: false,
          error: fetchError.message,
          data: null,
        });
      });
  }, []);

  const openMoveDetail = useCallback((move) => {
    const cachedMove = moveDetails[move.name];

    setSelectedPokedexDetail({
      type: 'move',
      name: move.name,
      level: move.level,
      loading: !cachedMove,
      error: '',
      data: cachedMove || null,
    });

    if (cachedMove) {
      return;
    }

    fetchPokeApiJson(move.url, {}, 'Unable to load move details.')
      .then((data) => {
        setSelectedPokedexDetail({
          type: 'move',
          name: move.name,
          level: move.level,
          loading: false,
          error: '',
          data,
        });
      })
      .catch((fetchError) => {
        setSelectedPokedexDetail({
          type: 'move',
          name: move.name,
          level: move.level,
          loading: false,
          error: fetchError.message,
          data: null,
        });
      });
  }, [moveDetails]);

  const searchRandomPokemon = useCallback(() => {
    setError('');
    setLoadingPokemon(true);

    const loadAllPokemon =
      selectedDex === ALL_POKEDEX_OPTION.id && pokemonList.length
        ? Promise.resolve(pokemonList)
        : Promise.all(
            POKEDEX_OPTIONS.map((pokedex) =>
              fetchPokeApiJson(
                `${POKEAPI_BASE_URL}/pokedex/${pokedex.id}`,
                {},
                'Unable to load all Pokedex entries.',
              ),
            ),
          ).then((data) => buildPokedexEntries(data, true));

    loadAllPokemon
      .then((entries) => {
        const randomPokemon = randomItem(entries);
        if (!randomPokemon) {
          throw new Error('No Pokemon available to randomize.');
        }
        return fetchPokemonByNameOrSpecies(randomPokemon.name);
      })
      .then((data) => {
        setSelectedPokemon(data);
        setSelectedMoveGroup('');
        setSpeciesDetails(null);
        setEvolutionTree(null);
        setTypeWeaknesses([]);
        setMoveDetails({});
        setSelectedPokedexDetail(null);
        setSearchTerm(data.species?.name || data.name);
        setPokemonPage(1);
      })
      .catch((fetchError) => {
        setSelectedPokemon(null);
        setSpeciesDetails(null);
        setEvolutionTree(null);
        setTypeWeaknesses([]);
        setMoveDetails({});
        setSelectedPokedexDetail(null);
        setError(fetchError.message);
      })
      .finally(() => setLoadingPokemon(false));
  }, [pokemonList, selectedDex]);

  const visiblePokemon = useMemo(() => {
    const filteredPokemon = pokemonList.filter((pokemon) => matchesPokemonSearch(pokemon, searchTerm));

    const compareByEntry = (firstPokemon, secondPokemon) =>
      firstPokemon.entryNumber - secondPokemon.entryNumber ||
      firstPokemon.name.localeCompare(secondPokemon.name);

    return [...filteredPokemon].sort((firstPokemon, secondPokemon) => {
      const firstMetadata = pokemonMetadata[firstPokemon.name];
      const secondMetadata = pokemonMetadata[secondPokemon.name];

      if (pokemonSortMode === 'name') {
        return firstPokemon.name.localeCompare(secondPokemon.name);
      }

      if (pokemonSortMode === 'type') {
        return (
          (firstMetadata?.primaryType || '').localeCompare(secondMetadata?.primaryType || '') ||
          compareByEntry(firstPokemon, secondPokemon)
        );
      }

      if (pokemonSortMode === 'legendary') {
        return (
          Number(Boolean(secondMetadata?.isLegendary)) -
            Number(Boolean(firstMetadata?.isLegendary)) ||
          compareByEntry(firstPokemon, secondPokemon)
        );
      }

      if (pokemonSortMode === 'generation') {
        return (
          (firstMetadata?.generationOrder || Number.MAX_SAFE_INTEGER) -
            (secondMetadata?.generationOrder || Number.MAX_SAFE_INTEGER) ||
          compareByEntry(firstPokemon, secondPokemon)
        );
      }

      if (pokemonSortMode.startsWith('stat-')) {
        const statName = pokemonSortMode.replace('stat-', '');
        return (
          (secondMetadata?.stats?.[statName] || 0) -
            (firstMetadata?.stats?.[statName] || 0) ||
          compareByEntry(firstPokemon, secondPokemon)
        );
      }

      return compareByEntry(firstPokemon, secondPokemon);
    });
  }, [pokemonList, pokemonMetadata, pokemonSortMode, searchTerm]);
  const pokemonPageCount = Math.max(1, Math.ceil(visiblePokemon.length / POKEMON_LIST_PAGE_SIZE));
  const clampedPokemonPage = Math.min(pokemonPage, pokemonPageCount);
  const pokemonPageStart = (clampedPokemonPage - 1) * POKEMON_LIST_PAGE_SIZE;
  const pagedPokemon = visiblePokemon.slice(pokemonPageStart, pokemonPageStart + POKEMON_LIST_PAGE_SIZE);

  const pokedexSortOptions = useMemo(
    () => [
      { value: 'entry', label: 'Pokedex Number' },
      { value: 'name', label: 'Name' },
      { value: 'type', label: 'Type' },
      { value: 'legendary', label: 'Legendary' },
      ...(selectedDex === ALL_POKEDEX_OPTION.id
        ? [{ value: 'generation', label: 'Generation' }]
        : []),
      ...STAT_SORT_OPTIONS.map((stat) => ({
        value: `stat-${stat.id}`,
        label: stat.label,
      })),
    ],
    [selectedDex],
  );
  const loadingPokemonMetadata =
    POKEDEX_METADATA_SORTS.has(pokemonSortMode) &&
    pokemonList.some((pokemon) => !pokemonMetadata[pokemon.name]);

  const pokedexChoices = [ALL_POKEDEX_OPTION, ...POKEDEX_OPTIONS];
  const activeDex = pokedexChoices.find((pokedex) => pokedex.id === selectedDex);
  const regionalPokemonCount = pokemonList.length;

  const officialArtwork =
    selectedPokemon?.sprites?.other?.['official-artwork']?.front_default ||
    selectedPokemon?.sprites?.front_default;
  const moveVersionGroups = useMemo(
    () => getAvailableLevelUpMoveGroups(selectedPokemon),
    [selectedPokemon],
  );
  const activeMoveGroup = selectedMoveGroup || moveVersionGroups[0] || '';
  const levelUpMoves = useMemo(
    () => getLevelUpMovesForVersionGroup(selectedPokemon, activeMoveGroup),
    [selectedPokemon, activeMoveGroup],
  );
  useEffect(() => {
    if (!levelUpMoves.length) {
      return undefined;
    }

    const controller = new AbortController();

    Promise.all(
      levelUpMoves.map((move) =>
        fetchPokeApiJson(move.url, { signal: controller.signal }, 'Unable to load move details.')
          .then((data) => [move.name, data]),
      ),
    )
      .then((entries) => {
        setMoveDetails(Object.fromEntries(entries));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      });

    return () => controller.abort();
  }, [levelUpMoves]);
  const generationSprites = useMemo(
    () => getGenerationSprites(selectedPokemon),
    [selectedPokemon],
  );
  const visibleGenerationSprites = useMemo(
    () => generationSprites.filter((sprite) => !unavailableGenerationSpriteIds[sprite.id]),
    [generationSprites, unavailableGenerationSpriteIds],
  );
  const visibleSpriteVariants = useMemo(
    () =>
      (selectedSpriteSet?.variants || []).filter(
        (variant) => !unavailableSpriteVariantIds[`${selectedSpriteSet.id}-${variant.label}`],
      ),
    [selectedSpriteSet, unavailableSpriteVariantIds],
  );
  const alternateForms = useMemo(
    () =>
      (speciesDetails?.varieties || []).map((variety) => ({
        name: variety.pokemon.name,
        isDefault: variety.is_default,
        pokemonId: getPokemonIdFromPokemonUrl(variety.pokemon.url),
      })),
    [speciesDetails],
  );
  const featuredCards = useMemo(
    () => getFeaturedTcgCards(tcgCards, [selectedPokemon?.name, selectedPokemon?.species?.name]),
    [tcgCards, selectedPokemon],
  );
  useEffect(() => {
    setUnavailableGenerationSpriteIds({});
    setUnavailableSpriteVariantIds({});
  }, [selectedPokemon?.id]);

  useEffect(() => {
    setUnavailableSpriteVariantIds({});
  }, [selectedSpriteSet?.id]);
  const getStarterName = useCallback(
    (starterId) =>
      pokemonList.find((pokemon) => pokemon.pokemonId === String(starterId))?.name ||
      `Pokemon ${starterId}`,
    [pokemonList],
  );

  return (
    <div className="app-container pokedex-page">
      <header className="app-header">
        <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
          <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
          <h1>Pokedex</h1>
        </button>
        <StationNav
          activeStation="pokedex"
          onNavigate={(station) => {
            const handlers = {
              home: onBack,
              tcg: onOpenTcg,
              who: onOpenWhos,
              team: onOpenTeam,
              quiz: onOpenQuiz,
              trainerdex: onOpenTrainerDex,
            };
            handlers[station]?.();
          }}
        />
      </header>

      <section className="pokedex-layout">
        <form
          className="pokedex-search-panel"
          onSubmit={(event) => {
            event.preventDefault();
            searchPokemon(searchTerm);
          }}
        >
          <label>Game Pokedex</label>
          <div className="pokedex-game-picker">
            <div className="pokedex-game-grid" aria-label="Game Pokedex">
              {pokedexChoices.map((pokedex) => (
                <button
                  key={pokedex.id}
                  type="button"
                  className={`pokedex-game-card nes-btn ${
                    selectedDex === pokedex.id ? 'is-primary is-selected' : ''
                  }`}
                  onClick={() => {
                    setSelectedDex(pokedex.id);
                    setPokemonSortMode((currentSortMode) =>
                      currentSortMode === 'generation' && pokedex.id !== ALL_POKEDEX_OPTION.id
                        ? 'entry'
                        : currentSortMode,
                    );
                    setSearchTerm('');
                    setPokemonPage(1);
                    setError('');
                    setPokemonList([]);
                    setSelectedPokemon(null);
                    setSpeciesDetails(null);
                    setEvolutionTree(null);
                    setTypeWeaknesses([]);
                    setMoveDetails({});
                    setSelectedSpriteSet(null);
                    setSelectedPokedexDetail(null);
                    setSelectedMoveGroup('');
                    setLoadingList(true);
                  }}
                  disabled={loadingList && selectedDex === pokedex.id}
                >
                  {pokedex.starters?.length > 0 && (
                    <span className="starter-sprite-row" aria-hidden="true">
                      {pokedex.starters.map((starterId) => (
                        <CachedImage
                          key={starterId}
                          src={getPokemonSpriteUrl(starterId)}
                          alt=""
                          loading="lazy"
                        />
                      ))}
                    </span>
                  )}
                  <strong>{formatNoBreakSlashLabel(pokedex.label)}</strong>
                  <span className="pokedex-game-region">{pokedex.region}</span>
                </button>
              ))}
            </div>
          </div>

          <label htmlFor="pokemon-search">Search Pokemon</label>
          <div className="pokedex-search-row">
            <input
              id="pokemon-search"
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPokemonPage(1);
              }}
              placeholder="Name or number..."
            />
            <button type="submit" className="nes-btn is-success" disabled={loadingPokemon}>
              Search
            </button>
            <button
              type="button"
              className="nes-btn is-error"
              onClick={searchRandomPokemon}
              disabled={loadingPokemon}
            >
              Random
            </button>
            <button
              type="button"
              className="nes-btn"
              onClick={() => {
                setSearchTerm('');
                setPokemonPage(1);
                setSelectedPokemon(null);
                setSpeciesDetails(null);
                setEvolutionTree(null);
                setTypeWeaknesses([]);
                setMoveDetails({});
                setSelectedSpriteSet(null);
                setSelectedMoveGroup('');
              }}
              disabled={!searchTerm && !selectedPokemon}
            >
              Clear
            </button>
          </div>

          <div className="pokedex-filter-row">
            <label htmlFor="pokemon-sort">Sort Pokemon</label>
            <select
              id="pokemon-sort"
              value={pokemonSortMode}
              onChange={(event) => {
                const nextSortMode = event.target.value;
                setPokemonSortMode(nextSortMode);
                setPokemonPage(1);
              }}
              disabled={loadingList}
            >
              {pokedexSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {loadingPokemonMetadata && (
            <p className="pokedex-status">Loading Pokemon sort data...</p>
          )}

          {error && <p className="pokedex-error">{error}</p>}

          {!loadingList && visiblePokemon.length > 0 && (
            <div className="pokemon-list-pager" aria-label="Pokemon quick pick pages">
              <button
                type="button"
                className="nes-btn"
                onClick={() => setPokemonPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={clampedPokemonPage === 1}
              >
                Prev
              </button>
              <span>
                {pokemonPageStart + 1}-{Math.min(pokemonPageStart + POKEMON_LIST_PAGE_SIZE, visiblePokemon.length)} of{' '}
                {visiblePokemon.length}
              </span>
              <button
                type="button"
                className="nes-btn"
                onClick={() => setPokemonPage((currentPage) => Math.min(pokemonPageCount, currentPage + 1))}
                disabled={clampedPokemonPage === pokemonPageCount}
              >
                Next
              </button>
            </div>
          )}

          <div className="pokemon-list" aria-label="Pokemon quick picks">
            {loadingList && <p>Loading Pokemon...</p>}
            {pagedPokemon.map((pokemon) => (
              <button
                key={pokemon.name}
                type="button"
                className={`pokemon-list-item nes-btn ${
                  selectedDex === ALL_POKEDEX_OPTION.id ? '' : 'is-without-number'
                }`}
                onClick={() => searchPokemon(pokemon.name)}
              >
                {selectedDex === ALL_POKEDEX_OPTION.id && (
                  <span>#{String(pokemon.entryNumber).padStart(3, '0')}</span>
                )}
                <CachedImage
                  src={getPokemonSpriteUrl(pokemon.pokemonId)}
                  fallbackSrc={getPokemonOfficialArtworkUrl(pokemon.pokemonId)}
                  alt=""
                  loading="lazy"
                  aria-hidden="true"
                />
                <strong>{formatPokemonName(pokemon.name)}</strong>
              </button>
            ))}
            {!loadingList && !visiblePokemon.length && (
              <p>No Pokemon match this Pokedex search.</p>
            )}
          </div>

          {selectedPokemon && (
            <section className="pokedex-section generation-sprites-section is-left-column">
              <h3>Generation Sprites</h3>
              <div className="generation-sprite-grid">
                {visibleGenerationSprites.map((sprite) => (
                  <article
                    key={sprite.id}
                    className="generation-sprite-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedSpriteSet(sprite)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedSpriteSet(sprite);
                      }
                    }}
                  >
                    <CachedImage
                      src={sprite.image}
                      alt={`${selectedPokemon.name} ${sprite.game} sprite`}
                      onUnavailable={() => {
                        setUnavailableGenerationSpriteIds((previousIds) => ({
                          ...previousIds,
                          [sprite.id]: true,
                        }));
                      }}
                    />
                    <strong>{sprite.generation}</strong>
                    <span>{sprite.game}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

        </form>

        <article className="pokedex-card">
          {loadingPokemon && <p className="pokedex-status">Scanning...</p>}
          {!loadingPokemon && selectedPokemon && (
            <>
              <div className="pokedex-card-media">
                {officialArtwork && (
                  <CachedImage
                    src={officialArtwork}
                    fallbackSrc={getImageFallbackChain(
                      selectedPokemon.sprites?.front_default,
                      getPokemonSpriteUrl(selectedPokemon.id),
                    ).join('|')}
                    alt={selectedPokemon.name}
                  />
                )}
              </div>
              <div className="pokedex-card-info">
                <p className="card-detail-set">#{String(selectedPokemon.id).padStart(3, '0')}</p>
                <div className="pokemon-title-row">
                  <h2>{formatPokemonName(selectedPokemon.name)}</h2>
                  <button
                    type="button"
                    className="cry-button"
                    onClick={playPokemonCry}
                    disabled={!selectedPokemon.cries?.latest && !selectedPokemon.cries?.legacy}
                    aria-label={`Play ${formatPokemonName(selectedPokemon.name)} cry`}
                  >
                    <img src={speakerIcon} alt="" aria-hidden="true" />
                  </button>
                </div>
                <div className="type-row">
                  {selectedPokemon.types.map(({ type }) => (
                    <TypeBadge key={type.name} type={type.name} />
                  ))}
                </div>
                {speciesDetails && (
                  <section className="pokedex-section flavor-section">
                    <p>{getEnglishFlavorText(speciesDetails) || 'No English flavor text found.'}</p>
                  </section>
                )}
                <section className="pokedex-section weakness-section">
                  <h3>Weak To</h3>
                  <div className="type-row">
                    {typeWeaknesses.map((weakness) => (
                      <TypeBadge key={weakness.name} type={weakness.name} detail={`x${weakness.multiplier}`} />
                    ))}
                    {!typeWeaknesses.length && <p>No weaknesses found.</p>}
                  </div>
                </section>
                <section className="pokedex-section">
                  <h3>Profile</h3>
                  <dl className="profile-list">
                    <div>
                      <dt>Species</dt>
                      <dd>
                        {speciesDetails?.genera?.find((genus) => genus.language.name === 'en')?.genus ||
                          'Loading...'}
                      </dd>
                    </div>
                    <div>
                      <dt>Height</dt>
                      <dd>{selectedPokemon.height / 10} m</dd>
                    </div>
                    <div>
                      <dt>Weight</dt>
                      <dd>{selectedPokemon.weight / 10} kg</dd>
                    </div>
                  </dl>
                </section>

                <section className="pokedex-section">
                  <h3>Base Stats</h3>
                  <div className="base-stat-list">
                    {selectedPokemon.stats.map((stat) => (
                      <div key={stat.stat.name} className="base-stat-row">
                        <span>{STAT_LABELS[stat.stat.name] || formatPokemonName(stat.stat.name)}</span>
                        <meter min="0" max="255" value={stat.base_stat} />
                        <strong>{stat.base_stat}</strong>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pokedex-section">
                  <h3>Abilities</h3>
                  <div className="ability-list">
                    {selectedPokemon.abilities.map(({ ability, is_hidden: isHidden }) => (
                      <button
                        key={ability.name}
                        type="button"
                        className="ability-button"
                        onClick={() => openAbilityDetail(ability, isHidden)}
                      >
                        {formatPokemonName(ability.name)}
                        {isHidden ? ' (Hidden)' : ''}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <section className="pokedex-section evolution-section">
                <h3>Evolution Tree</h3>
                <div className="evolution-tree">
                  {evolutionTree ? (
                    <EvolutionBranch node={evolutionTree} onChoosePokemon={searchPokemon} />
                  ) : (
                    <p className="pokedex-status">Loading evolution tree...</p>
                  )}
                </div>
              </section>

              {alternateForms.length > 1 && (
                <section className="pokedex-section alternate-forms-section">
                  <h3>Alternate Forms</h3>
                  <div className="alternate-form-grid">
                    {alternateForms.map((form) => (
                      <button
                        key={form.name}
                        type="button"
                        className={`alternate-form-card ${
                          selectedPokemon.name === form.name ? 'is-current' : ''
                        }`}
                        onClick={() => searchPokemon(form.name)}
                      >
                        <CachedImage
                          src={getPokemonOfficialArtworkUrl(form.pokemonId)}
                          fallbackSrc={getImageFallbackChain(
                            getPokemonSpriteUrl(form.pokemonId),
                            selectedPokemon.sprites?.front_default,
                            officialArtwork,
                          ).join('|')}
                          alt=""
                          loading="lazy"
                          aria-hidden="true"
                        />
                        <strong>{formatPokemonName(form.name)}</strong>
                        {form.isDefault && <span>Default Form</span>}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="pokedex-section moves-section">
                <h3>
                  Level-Up Moves
                  {activeMoveGroup && (
                    <span>{formatVersionGroupName(activeMoveGroup)}</span>
                  )}
                </h3>
                <div className="move-version-grid" aria-label="Level-up move version">
                  {moveVersionGroups.map((versionGroup) => (
                    <button
                      key={versionGroup}
                      type="button"
                      className={`move-version-button nes-btn ${
                        activeMoveGroup === versionGroup ? 'is-error is-selected' : ''
                      }`}
                      onClick={() => setSelectedMoveGroup(versionGroup)}
                    >
                      {formatVersionGroupName(versionGroup)}
                    </button>
                  ))}
                </div>
                <div className="moves-table-wrap">
                  <table className="moves-table">
                    <thead>
                      <tr>
                        <th>Lv.</th>
                        <th>Move</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Power</th>
                        <th>Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {levelUpMoves.map((move, index) => (
                        <tr
                          key={`${move.level}-${move.name}`}
                          className={`move-detail-row ${index % 2 ? 'is-red-row' : ''}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => openMoveDetail(move)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              openMoveDetail(move);
                            }
                          }}
                        >
                          {moveDetails[move.name] ? (
                            <>
                              <td>{move.level}</td>
                              <td>{formatPokemonName(move.name)}</td>
                              <td>
                                <TypeBadge type={moveDetails[move.name].type.name} className="move-type-pill" />
                              </td>
                              <td>
                                <img
                                  className="move-category-icon"
                                  src={MOVE_CATEGORY_ICONS[moveDetails[move.name].damage_class.name]}
                                  alt={formatPokemonName(moveDetails[move.name].damage_class.name)}
                                  title={formatPokemonName(moveDetails[move.name].damage_class.name)}
                                />
                              </td>
                              <td>{moveDetails[move.name].power || '-'}</td>
                              <td>{moveDetails[move.name].accuracy || '-'}</td>
                            </>
                          ) : (
                            <>
                              <td>{move.level}</td>
                              <td>{formatPokemonName(move.name)}</td>
                              <td colSpan="4">Loading...</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!levelUpMoves.length && (
                    <p className="pokedex-status">No level-up moves found for this game.</p>
                  )}
                </div>
              </section>

            </>
          )}
          {!loadingPokemon && !selectedPokemon && (
            <div className="pokedex-empty-state">
              <p className="pokedex-status">
                Choose a Pokemon from {activeDex?.label || 'this Pokedex'} to inspect its data.
              </p>
              {activeDex && activeDex.id !== ALL_POKEDEX_OPTION.id && (
                <aside className="pokedex-game-preview" aria-label={`${activeDex.label} details`}>
                  <div className="pokedex-game-preview-copy">
                    <strong>{activeDex.label}</strong>
                    <span>Region: {activeDex.region}</span>
                    <span>Pokemon: {regionalPokemonCount}</span>
                    <span>Released: {activeDex.releaseDate}</span>
                    <span>Director: {activeDex.director}</span>
                  </div>
                  {activeDex.art.length > 0 && (
                    <div className="pokedex-game-preview-art" aria-hidden="true">
                      {activeDex.art.map((artSrc) => (
                        <img key={artSrc} src={artSrc} alt="" loading="lazy" />
                      ))}
                    </div>
                  )}
                  {activeDex.summary && (
                    <p className="pokedex-game-summary">Summary: {activeDex.summary}</p>
                  )}
                </aside>
              )}
              {activeDex && activeDex.id !== ALL_POKEDEX_OPTION.id && (
                <div className="pokedex-preview-bottom">
                  {activeDex.starters?.length > 0 && (
                    <aside className="pokedex-starter-preview" aria-label={`${activeDex.region} starters`}>
                      <strong>{activeDex.region} Starters</strong>
                      <div className="starter-art-row">
                        {activeDex.starters.map((starterId) => (
                          <span
                            key={starterId}
                            className="starter-art-button"
                            role="button"
                            tabIndex={0}
                            onClick={() => searchPokemon(String(starterId))}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                searchPokemon(String(starterId));
                              }
                            }}
                          >
                            <CachedImage
                              src={getPokemonOfficialArtworkUrl(starterId)}
                              fallbackSrc={getPokemonSpriteUrl(starterId)}
                              alt={`Open ${formatPokemonName(getStarterName(starterId))}`}
                              loading="lazy"
                            />
                            <strong>{formatPokemonName(getStarterName(starterId))}</strong>
                          </span>
                        ))}
                      </div>
                    </aside>
                  )}
                  <aside className="pokedex-platform-preview">
                    <strong>Platform</strong>
                    <div className="platform-list" aria-label="Platforms">
                      {activeDex.platforms.map((platform) => (
                        <span key={platform.name} title={platform.name}>
                          <img src={platform.icon} alt={platform.name} loading="lazy" />
                        </span>
                      ))}
                    </div>
                  </aside>
                </div>
              )}
            </div>
          )}
        </article>
      </section>

      {selectedPokemon && (
        <section className="pokedex-section tcg-featured-section is-full-width">
          <h3>Featured TCG Cards</h3>
          {loadingTcgCards && <p className="pokedex-status">Loading TCG cards...</p>}
          {!loadingTcgCards && (
            <div className="tcg-featured-grid">
              {featuredCards.map((card) => (
                <article
                  key={`${card.setId}-${card.id}`}
                  className="binder-card is-owned"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTcgCard(card)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedTcgCard(card);
                    }
                  }}
                >
                  <img
                    src={getCardFaceImage(card)}
                    data-fallback-src={getCardFallbackImage(card)}
                    alt={card.name}
                    loading="lazy"
                    onError={handleCardImageError}
                  />
                  <div>
                    <h3>{card.name}</h3>
                    <p>{card.setName} <span className="set-category-pill">{card.setCategory}</span></p>
                  </div>
                </article>
              ))}
              {!featuredCards.length && (
                <p className="pokedex-status">No local TCG cards found for this Pokemon.</p>
              )}
            </div>
          )}
        </section>
      )}

      {selectedSpriteSet && (
        <div
          className="sprite-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sprite-detail-title"
          onClick={() => setSelectedSpriteSet(null)}
        >
          <div className="sprite-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedSpriteSet(null)}
              aria-label="Close sprite details"
            >
              Close
            </button>
            <div>
              <p className="card-detail-set">{selectedSpriteSet.generation}</p>
              <h2 id="sprite-detail-title">{selectedSpriteSet.game} Sprites</h2>
            </div>
            <div className="sprite-variant-grid">
              {visibleSpriteVariants.map((variant) => (
                <article key={variant.label} className="sprite-variant-card">
                  <CachedImage
                    src={variant.image}
                    alt={`${selectedSpriteSet.game} ${variant.label}`}
                    onUnavailable={() => {
                      setUnavailableSpriteVariantIds((previousIds) => ({
                        ...previousIds,
                        [`${selectedSpriteSet.id}-${variant.label}`]: true,
                      }));
                    }}
                  />
                  <strong>{variant.label}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedPokedexDetail && (
        <div
          className="pokedex-info-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pokedex-info-title"
          onClick={() => setSelectedPokedexDetail(null)}
        >
          <div className="pokedex-info-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedPokedexDetail(null)}
              aria-label="Close Pokedex detail"
            >
              Close
            </button>
            <div>
              <p className="card-detail-set">
                {selectedPokedexDetail.type === 'ability' ? 'Ability' : 'Move'}
              </p>
              <h2 id="pokedex-info-title">{formatPokemonName(selectedPokedexDetail.name)}</h2>
            </div>

            {selectedPokedexDetail.loading && (
              <p className="pokedex-status">Loading details...</p>
            )}
            {!selectedPokedexDetail.loading && selectedPokedexDetail.error && (
              <p className="pokedex-status">{selectedPokedexDetail.error}</p>
            )}
            {!selectedPokedexDetail.loading && selectedPokedexDetail.data && (
              <>
                {selectedPokedexDetail.type === 'ability' && (
                  <>
                    <dl className="pokedex-info-meta">
                      <div>
                        <dt>Slot</dt>
                        <dd>{selectedPokedexDetail.isHidden ? 'Hidden Ability' : 'Standard Ability'}</dd>
                      </div>
                      <div>
                        <dt>Introduced</dt>
                        <dd>{formatGenerationName(selectedPokedexDetail.data.generation?.name) || 'Unknown'}</dd>
                      </div>
                    </dl>
                    <section className="detail-section">
                      <h3>Effect</h3>
                      <p>
                        {getEnglishEffectText(selectedPokedexDetail.data.effect_entries) ||
                          'No English effect text found.'}
                      </p>
                    </section>
                    <section className="detail-section">
                      <h3>Game Description</h3>
                      <p>
                        {getEnglishApiFlavorText(selectedPokedexDetail.data.flavor_text_entries) ||
                          'No English game description found.'}
                      </p>
                    </section>
                  </>
                )}

                {selectedPokedexDetail.type === 'move' && (
                  <>
                    <dl className="pokedex-info-meta">
                      <div>
                        <dt>Level</dt>
                        <dd>{selectedPokedexDetail.level}</dd>
                      </div>
                      <div>
                        <dt>Type</dt>
                        <dd>
                          <TypeBadge type={selectedPokedexDetail.data.type.name} className="move-type-pill" />
                        </dd>
                      </div>
                      <div>
                        <dt>Category</dt>
                        <dd>
                          <img
                            className="move-category-icon"
                            src={MOVE_CATEGORY_ICONS[selectedPokedexDetail.data.damage_class.name]}
                            alt={formatPokemonName(selectedPokedexDetail.data.damage_class.name)}
                          />
                        </dd>
                      </div>
                      <div>
                        <dt>Power</dt>
                        <dd>{selectedPokedexDetail.data.power ?? '-'}</dd>
                      </div>
                      <div>
                        <dt>Accuracy</dt>
                        <dd>{selectedPokedexDetail.data.accuracy ?? '-'}</dd>
                      </div>
                      <div>
                        <dt>PP</dt>
                        <dd>{selectedPokedexDetail.data.pp ?? '-'}</dd>
                      </div>
                      <div>
                        <dt>Introduced</dt>
                        <dd>{formatGenerationName(selectedPokedexDetail.data.generation?.name) || 'Unknown'}</dd>
                      </div>
                    </dl>
                    <section className="detail-section">
                      <h3>Effect</h3>
                      <p>
                        {getEnglishEffectText(selectedPokedexDetail.data.effect_entries) ||
                          getEnglishShortEffectText(selectedPokedexDetail.data.effect_entries) ||
                          'No English effect text found.'}
                      </p>
                    </section>
                    <section className="detail-section">
                      <h3>Game Description</h3>
                      <p>
                        {getEnglishApiFlavorText(selectedPokedexDetail.data.flavor_text_entries) ||
                          'No English game description found.'}
                      </p>
                    </section>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {selectedTcgCard && (
        <div
          className="card-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pokedex-tcg-card-detail-title"
          onClick={() => setSelectedTcgCard(null)}
        >
          <div className="card-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedTcgCard(null)}
              aria-label="Close card details"
            >
              Close
            </button>
            <div
              className="card-detail-image-wrap"
              onPointerMove={(event) => {
                const card = event.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.setProperty('--pointer-x', `${x * 100}%`);
                card.style.setProperty('--pointer-y', `${y * 100}%`);
                card.style.setProperty('--rotate-x', `${(0.5 - y) * 24}deg`);
                card.style.setProperty('--rotate-y', `${(x - 0.5) * 24}deg`);
                card.style.setProperty('--card-shift-x', `${(x - 0.5) * 10}px`);
                card.style.setProperty('--card-shift-y', `${(y - 0.5) * 10}px`);
              }}
              onPointerLeave={(event) => {
                const card = event.currentTarget;
                card.style.setProperty('--pointer-x', '50%');
                card.style.setProperty('--pointer-y', '50%');
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
                card.style.setProperty('--card-shift-x', '0px');
                card.style.setProperty('--card-shift-y', '0px');
              }}
            >
              <img
                src={getCardFaceImage(selectedTcgCard)}
                data-fallback-src={getCardFallbackImage(selectedTcgCard)}
                alt={selectedTcgCard.name}
                onError={handleCardImageError}
              />
              {selectedTcgCard.isRare && <div className="holo-overlay" aria-hidden="true" />}
            </div>
            <div className="card-detail-info">
              <p className="card-detail-set">{selectedTcgCard.setName}</p>
              <h2 id="pokedex-tcg-card-detail-title">{selectedTcgCard.name}</h2>
              <dl className="card-detail-meta">
                <div>
                  <dt>Rarity</dt>
                  <dd>{selectedTcgCard.rarity || 'Unknown'}</dd>
                </div>
                <div>
                  <dt>Number</dt>
                  <dd>{selectedTcgCard.number || 'N/A'}</dd>
                </div>
                <div>
                  <dt>HP</dt>
                  <dd>{selectedTcgCard.hp || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{selectedTcgCard.types?.join(', ') || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Stage</dt>
                  <dd>
                    {selectedTcgCard.subtypes?.join(', ') ||
                      selectedTcgCard.supertype ||
                      'N/A'}
                  </dd>
                </div>
                <div>
                  <dt>Artist</dt>
                  <dd>{selectedTcgCard.artist || 'Unknown'}</dd>
                </div>
              </dl>
              {selectedTcgCard.evolvesFrom && (
                <p className="detail-copy">Evolves from {selectedTcgCard.evolvesFrom}</p>
              )}
              {selectedTcgCard.flavorText && (
                <p className="detail-copy">{selectedTcgCard.flavorText}</p>
              )}
              {selectedTcgCard.abilities?.length > 0 && (
                <section className="detail-section">
                  <h3>Abilities</h3>
                  {selectedTcgCard.abilities.map((ability) => (
                    <article key={`${ability.name}-${ability.type}`}>
                      <strong>{ability.name}</strong>
                      <p>{ability.text}</p>
                    </article>
                  ))}
                </section>
              )}
              {selectedTcgCard.attacks?.length > 0 && (
                <section className="detail-section">
                  <h3>Attacks</h3>
                  {selectedTcgCard.attacks.map((attack) => (
                    <article key={`${attack.name}-${attack.damage}`}>
                      <strong>
                        {attack.name} {attack.damage && `- ${attack.damage}`}
                      </strong>
                      <p>{attack.text || 'No attack text.'}</p>
                    </article>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokedexPage;
