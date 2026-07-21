/* eslint-disable no-unused-vars */
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import StationNav from '../../components/StationNav';
import unownQuestionMark from '../../../pokedex/misc/Unown_QuestionMark.png';
import whosThatPokemonBg from '../../../pokedex/misc/WhosThatPokemon.png';
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

function WhosThatPokemonPage({ onBack, onOpenPokedex, onOpenTcg, onOpenTeam, onOpenQuiz, onOpenTrainerDex }) {
  const regionOptions = useMemo(
    () => [
      { id: 'random', label: 'Random Region', region: 'Surprise' },
      ...POKEDEX_OPTIONS,
    ],
    [],
  );
  const [setupName, setSetupName] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('random');
  const [playerName, setPlayerName] = useState('');
  const [entriesByRegion, setEntriesByRegion] = useState({});
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [guess, setGuess] = useState('');
  const [roundState, setRoundState] = useState('setup');
  const [result, setResult] = useState(null);
  const [showHintChoices, setShowHintChoices] = useState(false);
  const [hintChoices, setHintChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState(loadWhoLeaderboard);
  const [tcgCards, setTcgCards] = useState([]);
  const [loadingTcgCards, setLoadingTcgCards] = useState(true);
  const [showEntryOverlay, setShowEntryOverlay] = useState(false);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [selectedTcgCard, setSelectedTcgCard] = useState(null);
  const [entrySpecies, setEntrySpecies] = useState(null);
  const [entryLoading, setEntryLoading] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showResetLeaderboardDialog, setShowResetLeaderboardDialog] = useState(false);
  const [pendingLeaveAction, setPendingLeaveAction] = useState(null);
  const [error, setError] = useState('');
  const sessionIdRef = useRef('');
  const guessInputRef = useRef(null);

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
              releaseDate: expansion.releaseDate,
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
    if (!showEntryOverlay || !currentPokemon?.species?.url) {
      return undefined;
    }

    const controller = new AbortController();

    fetchPokeApiJson(currentPokemon.species.url, { signal: controller.signal }, 'Unable to load Pokemon species data.')
      .then((data) => {
        setEntrySpecies(data);
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setEntryLoading(false);
        }
      });

    return () => controller.abort();
  }, [showEntryOverlay, currentPokemon]);

  const loadRegionEntries = useCallback((regionId) => {
    const cachedEntries = entriesByRegion[regionId];
    if (cachedEntries?.length) {
      return Promise.resolve(cachedEntries);
    }

    return fetchPokeApiJson(`${POKEAPI_BASE_URL}/pokedex/${regionId}`, {}, 'Unable to load this Pokedex.')
      .then((data) => {
        const entries = buildPokedexEntries([data], false);
        setEntriesByRegion((previousEntries) => ({
          ...previousEntries,
          [regionId]: entries,
        }));
        return entries;
      });
  }, [entriesByRegion]);

  const recordLeaderboardScore = useCallback((nextScore) => {
    if (!playerName) return;

    const entry = {
      id: sessionIdRef.current,
      name: playerName,
      playedAt: new Date().toISOString(),
      score: nextScore,
    };

    setLeaderboard((previousLeaderboard) => {
      const nextLeaderboard = [
        entry,
        ...previousLeaderboard.filter((leaderboardEntry) => leaderboardEntry.id !== entry.id),
      ]
        .sort((firstEntry, secondEntry) => {
          if (secondEntry.score !== firstEntry.score) {
            return secondEntry.score - firstEntry.score;
          }
          return new Date(secondEntry.playedAt) - new Date(firstEntry.playedAt);
        })
        .slice(0, 12);

      saveWhoLeaderboard(nextLeaderboard);
      return nextLeaderboard;
    });
  }, [playerName]);

  const startNextRound = useCallback(() => {
    const regionId =
      selectedRegionId === 'random'
        ? randomItem(POKEDEX_OPTIONS).id
        : selectedRegionId;
    const nextRegion = POKEDEX_OPTIONS.find((region) => region.id === regionId);

    setRoundState('loading');
    setResult(null);
    setShowHintChoices(false);
    setHintChoices([]);
    setGuess('');
    setCurrentPokemon(null);
    setCurrentRegion(nextRegion);
    setShowEntryOverlay(false);
    setError('');

    loadRegionEntries(regionId)
      .then((entries) => {
        const randomPokemon = randomItem(entries);
        if (!randomPokemon) {
          throw new Error('No Pokemon available for this region.');
        }
        return fetchPokemonByNameOrSpecies(randomPokemon.name).then((pokemon) => ({
          pokemon,
          entries,
        }));
      })
      .then(({ pokemon, entries }) => {
        setCurrentPokemon(pokemon);
        setHintChoices(buildPokemonHintChoices(pokemon, entries));
        setRoundState('guessing');
      })
      .catch((fetchError) => {
        setRoundState('setup');
        setError(fetchError.message);
      });
  }, [loadRegionEntries, selectedRegionId]);

  const startGame = (event) => {
    event.preventDefault();
    const trimmedName = setupName.trim();

    if (!trimmedName) {
      setError('');
      setShowNameDialog(true);
      return;
    }

    sessionIdRef.current = `who-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setPlayerName(trimmedName.slice(0, 24));
    setScore(0);
    setRoundCount(0);
    setError('');
    setResult(null);
    setShowEntryOverlay(false);
    setShowNameDialog(false);
    startNextRound();
  };

  const submitPokemonGuess = (guessValue) => {
    if (!currentPokemon || roundState !== 'guessing') {
      return;
    }

    const trimmedGuess = guessValue.trim();

    if (!trimmedGuess) {
      setError('Enter a Pokemon name to guess.');
      return;
    }

    const validationError = getPokemonLookupValidationError(trimmedGuess);
    if (validationError) {
      setError(validationError);
      return;
    }

    const guessedCorrectly = isPokemonGuessCorrect(trimmedGuess, currentPokemon);
    const nextScore = guessedCorrectly ? score + 1 : score;

    setResult(guessedCorrectly ? 'correct' : 'wrong');
    setRoundState('revealed');
    setShowHintChoices(false);
    setRoundCount((previousCount) => previousCount + 1);
    setError('');

    if (guessedCorrectly) {
      setScore(nextScore);
    }

    recordLeaderboardScore(nextScore);
  };

  const submitGuess = (event) => {
    event.preventDefault();
    submitPokemonGuess(guess);
  };

  useEffect(() => {
    if (roundState !== 'guessing') {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      guessInputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [roundState, currentPokemon]);

  useEffect(() => {
    if (
      roundState !== 'revealed' ||
      showEntryOverlay ||
      showGameMenu ||
      selectedTcgCard ||
      showResetLeaderboardDialog
    ) {
      return undefined;
    }

    const handleNextRoundKey = (event) => {
      if (event.key !== 'Enter' || event.repeat) {
        return;
      }

      event.preventDefault();
      startNextRound();
    };

    window.addEventListener('keydown', handleNextRoundKey);

    return () => {
      window.removeEventListener('keydown', handleNextRoundKey);
    };
  }, [
    result,
    roundState,
    selectedTcgCard,
    showEntryOverlay,
    showGameMenu,
    showResetLeaderboardDialog,
    startNextRound,
  ]);

  const resetGame = () => {
    setPlayerName('');
    setSetupName('');
    setCurrentPokemon(null);
    setCurrentRegion(null);
    setGuess('');
    setRoundState('setup');
    setResult(null);
    setShowHintChoices(false);
    setHintChoices([]);
    setScore(0);
    setRoundCount(0);
    setError('');
    setShowEntryOverlay(false);
    setShowGameMenu(false);
    setSelectedTcgCard(null);
    setShowNameDialog(false);
    setShowResetLeaderboardDialog(false);
  };

  const changeRegion = () => {
    setSetupName(playerName);
    setPlayerName('');
    setCurrentPokemon(null);
    setCurrentRegion(null);
    setGuess('');
    setRoundState('setup');
    setResult(null);
    setShowHintChoices(false);
    setHintChoices([]);
    setScore(0);
    setRoundCount(0);
    setError('');
    setShowEntryOverlay(false);
    setShowGameMenu(false);
    setSelectedTcgCard(null);
    setShowNameDialog(false);
    setShowResetLeaderboardDialog(false);
  };

  const resetLeaderboard = () => {
    saveWhoLeaderboard([]);
    setLeaderboard([]);
    setShowResetLeaderboardDialog(false);
  };

  const requestLeaveGame = (navigationAction) => {
    setShowGameMenu(false);
    setShowEntryOverlay(false);
    setShowResetLeaderboardDialog(false);
    setSelectedTcgCard(null);
    setPendingLeaveAction(() => navigationAction);
  };

  const cancelLeaveGame = () => {
    setPendingLeaveAction(null);
  };

  const confirmLeaveGame = () => {
    const navigationAction = pendingLeaveAction;
    setPendingLeaveAction(null);
    navigationAction?.();
  };

  const openEntryOverlay = () => {
    setEntrySpecies(null);
    setEntryLoading(true);
    setShowEntryOverlay(true);
  };
  const officialArtwork =
    currentPokemon?.sprites?.other?.['official-artwork']?.front_default ||
    currentPokemon?.sprites?.front_default;
  const featuredCards = useMemo(
    () => getFeaturedTcgCards(tcgCards, [currentPokemon?.name, currentPokemon?.species?.name]),
    [tcgCards, currentPokemon],
  );
  const answerName = currentPokemon ? formatPokemonName(currentPokemon.species?.name || currentPokemon.name) : '';
  const activeRegionLabel =
    selectedRegionId === 'random'
      ? 'Random Region'
      : POKEDEX_OPTIONS.find((region) => region.id === selectedRegionId)?.region || 'Region';

  if (roundState === 'setup') {
    return (
      <div className="app-container who-page">
        <header className="app-header">
          <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
            <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
            <h1>Who's That Pokemon?</h1>
          </button>
          <StationNav
            activeStation="who"
            onNavigate={(station) => {
              const handlers = {
                home: onBack,
                pokedex: onOpenPokedex,
                tcg: onOpenTcg,
                team: onOpenTeam,
                quiz: onOpenQuiz,
                trainerdex: onOpenTrainerDex,
              };
              handlers[station]?.();
            }}
          />
        </header>

        <section className="who-setup-layout">
          <form className="who-setup-panel" onSubmit={startGame}>
            <div>
              <p className="card-detail-set">Trainer setup</p>
              <h2>Choose your challenge</h2>
            </div>

            <label htmlFor="who-player-name">Trainer name</label>
            <div className="who-name-row">
              <input
                id="who-player-name"
                type="text"
                value={setupName}
                onChange={(event) => setSetupName(event.target.value)}
                placeholder="Enter your name..."
                maxLength="24"
              />
              <button type="submit" className="nes-btn is-success">
                Start Game
              </button>
            </div>

            <label>Region</label>
            <div className="who-region-grid" aria-label="Region selection">
              {regionOptions.map((region) => {
                const isRandomRegion = region.id === 'random';

                return (
                  <button
                    key={region.id}
                    type="button"
                    className={`who-region-card nes-btn ${
                      selectedRegionId === region.id ? 'is-primary is-selected' : ''
                    }`}
                    onClick={() => setSelectedRegionId(region.id)}
                  >
                    <span className="who-region-art" aria-hidden="true">
                      {isRandomRegion ? (
                        <img
                          className="who-random-icon"
                          src={unownQuestionMark}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        region.starters.map((starterId) => (
                          <span key={starterId} className="who-region-pokemon-preview">
                            <img
                              src={getPokemonOfficialArtworkUrl(starterId)}
                              alt=""
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.src = getPokemonSpriteUrl(starterId);
                              }}
                            />
                          </span>
                        ))
                      )}
                    </span>
                    <strong>{isRandomRegion ? region.label : region.region}</strong>
                    <span>{isRandomRegion ? 'Any listed Pokedex' : region.label}</span>
                  </button>
                );
              })}
            </div>

            {error && <p className="pokedex-error">{error}</p>}

          </form>

          <section className="who-leaderboard who-setup-leaderboard" aria-label="Leaderboard">
            <div className="who-leaderboard-heading">
              <h2>Leaderboard</h2>
              <button
                type="button"
                className="nes-btn is-error"
                onClick={() => setShowResetLeaderboardDialog(true)}
                disabled={!leaderboard.length}
              >
                Reset
              </button>
            </div>
            <div className="who-leaderboard-list">
              {leaderboard.map((entry, index) => (
                <article key={entry.id} className="who-leaderboard-row">
                  <strong>#{index + 1}</strong>
                  <span>{entry.name}</span>
                  <span>{formatLeaderboardDate(entry.playedAt)}</span>
                  <strong>{entry.score}</strong>
                </article>
              ))}
              {!leaderboard.length && (
                <p className="pokedex-status">No scores yet.</p>
              )}
            </div>
          </section>

          {showNameDialog && (
            <div
              className="clear-dialog-overlay"
              role="presentation"
              onClick={() => setShowNameDialog(false)}
            >
              <div
                className="clear-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="who-name-dialog-title"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 id="who-name-dialog-title">Name Required</h2>
                <p>Trainer name cannot be empty. Please enter a name before starting.</p>
                <div className="clear-dialog-actions">
                  <button
                    type="button"
                    className="nes-btn is-success"
                    onClick={() => setShowNameDialog(false)}
                    autoFocus
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResetLeaderboardDialog && (
            <div
              className="clear-dialog-overlay"
              role="presentation"
              onClick={() => setShowResetLeaderboardDialog(false)}
            >
              <div
                className="clear-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="who-reset-leaderboard-title"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 id="who-reset-leaderboard-title">Reset Leaderboard?</h2>
                <p>This will remove every score from the Who's That Pokemon leaderboard.</p>
                <div className="clear-dialog-actions">
                  <button
                    type="button"
                    className="nes-btn"
                    onClick={() => setShowResetLeaderboardDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="nes-btn is-error"
                    onClick={resetLeaderboard}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="app-container who-page who-game-route">
      <header className="app-header who-game-header">
        <button
          type="button"
          className="brand-mark brand-home-button"
          onClick={() => requestLeaveGame(onBack)}
        >
          <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
          <h1>Who's That Pokemon?</h1>
        </button>
        <StationNav
          activeStation="who"
          onNavigate={(station) => {
            const handlers = {
              home: onBack,
              pokedex: onOpenPokedex,
              tcg: onOpenTcg,
              team: onOpenTeam,
              quiz: onOpenQuiz,
              trainerdex: onOpenTrainerDex,
            };
            const handler = handlers[station];
            if (handler) {
              requestLeaveGame(handler);
            }
          }}
        />
      </header>

      <section className="who-play-shell">
        <main
          className="who-game-panel"
          style={{ "--who-game-background": `url(${whosThatPokemonBg})` }}
        >
          <button
            type="button"
            className="who-menu-button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setShowGameMenu(true);
            }}
            aria-label="Open game menu"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          {roundState === 'loading' && (
            <div className="who-empty-state">
              <div className="pack-loader-ball" aria-hidden="true" />
              <p>Finding a mystery Pokemon...</p>
            </div>
          )}

          {currentPokemon && roundState !== 'loading' && (
            <div className="who-stage">
              <button
                type="button"
                className={`who-pokemon-button ${roundState === 'revealed' ? 'is-revealed' : ''}`}
                onClick={openEntryOverlay}
                disabled={roundState !== 'revealed'}
                aria-label={
                  roundState === 'revealed'
                    ? `Open ${answerName} Pokedex entry`
                    : 'Mystery Pokemon silhouette'
                }
                style={officialArtwork ? { '--pokemon-art': `url(${officialArtwork})` } : undefined}
              >
                {officialArtwork && (
                  <>
                    <span className="who-pokemon-layer who-pokemon-silhouette" aria-hidden="true" />
                    <span className="who-pokemon-layer who-pokemon-revealed-art" aria-hidden="true" />
                    <span className="who-pokemon-preload" aria-hidden="true">
                      <img src={officialArtwork} alt="" />
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </main>

        {currentPokemon && roundState !== 'loading' && (
          <form className="who-guess-panel" onSubmit={submitGuess}>
            <div className="who-guess-heading">
              <div>
                <p className="card-detail-set">
                  {currentRegion?.region || 'Region'} Pokemon
                </p>
                <h2>
                  {roundState === 'revealed'
                    ? answerName
                    : "Who's that Pokemon?"}
                </h2>
              </div>
              <dl className="who-live-score" aria-label="Current score">
                <div>
                  <dt>Score</dt>
                  <dd>{score}</dd>
                </div>
                <div>
                  <dt>Rounds</dt>
                  <dd>{roundCount}</dd>
                </div>
              </dl>
              {result && (
                <p className={`who-result is-${result}`}>
                  {result === 'correct'
                    ? 'Correct! Click the Pokemon to open its entry.'
                    : `It was ${answerName}. Click the Pokemon to learn more.`}
                </p>
              )}
              {error && <p className="who-result is-wrong">{error}</p>}
            </div>

            {roundState === 'guessing' && (
              <div className="who-guess-controls">
                <div className="who-guess-row">
                  <input
                    ref={guessInputRef}
                    type="search"
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    placeholder="Pokemon name..."
                  />
                  <button
                    type="button"
                    className="nes-btn is-warning"
                    onClick={() => setShowHintChoices((isShowing) => !isShowing)}
                    disabled={!hintChoices.length}
                  >
                    Help
                  </button>
                  <button type="submit" className="nes-btn is-success">
                    Guess
                  </button>
                </div>
                {showHintChoices && (
                  <div className="who-hint-grid" aria-label="Pokemon name choices">
                    {hintChoices.map((choice) => (
                      <button
                        key={choice.name}
                        type="button"
                        className="nes-btn"
                        onClick={() => {
                          setGuess(choice.label);
                          submitPokemonGuess(choice.name);
                        }}
                      >
                    {choice.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {roundState === 'revealed' && (
              <button type="button" className="nes-btn is-primary" onClick={startNextRound}>
                Next Pokemon
              </button>
            )}
          </form>
        )}
      </section>

      {showGameMenu && (
        <div
          className="who-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="who-menu-title"
          onClick={() => setShowGameMenu(false)}
        >
          <aside className="who-menu-panel" onClick={(event) => event.stopPropagation()}>
            <h2 id="who-menu-title" className="who-start-menu-title">
              {playerName}
            </h2>
            <ul className="who-start-menu-list" aria-label="Pause menu">
              <li>
                <button type="button" onClick={() => setShowGameMenu(false)}>
                  Resume
                </button>
              </li>
              <li>
                <button type="button" onClick={changeRegion}>
                  Region
                </button>
              </li>
              <li>
                <button type="button" onClick={resetGame}>
                  New Player
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setShowGameMenu(false)}>
                  Exit
                </button>
              </li>
            </ul>
            <div className="who-score-panel">
              <p className="card-detail-set">{activeRegionLabel}</p>
              <dl className="who-score-list">
                <div>
                  <dt>Score</dt>
                  <dd>{score}</dd>
                </div>
                <div>
                  <dt>Rounds</dt>
                  <dd>{roundCount}</dd>
                </div>
                <div>
                  <dt>Current Region</dt>
                  <dd>{currentRegion?.region || 'Loading'}</dd>
                </div>
              </dl>
            </div>

            {error && <p className="pokedex-error">{error}</p>}

            <section className="who-leaderboard" aria-label="Leaderboard">
              <div className="who-leaderboard-heading">
                <h2>Leaderboard</h2>
                <button
                  type="button"
                  className="nes-btn is-error"
                  onClick={() => setShowResetLeaderboardDialog(true)}
                  disabled={!leaderboard.length}
                >
                  Reset
                </button>
              </div>
              <div className="who-leaderboard-list">
                {leaderboard.map((entry, index) => (
                  <article key={entry.id} className="who-leaderboard-row">
                    <strong>#{index + 1}</strong>
                    <span>{entry.name}</span>
                    <span>{formatLeaderboardDate(entry.playedAt)}</span>
                    <strong>{entry.score}</strong>
                  </article>
                ))}
                {!leaderboard.length && (
                  <p className="pokedex-status">No scores yet.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      )}

      {showResetLeaderboardDialog && (
        <div
          className="clear-dialog-overlay"
          role="presentation"
          onClick={() => setShowResetLeaderboardDialog(false)}
        >
          <div
            className="clear-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="who-reset-leaderboard-game-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="who-reset-leaderboard-game-title">Reset Leaderboard?</h2>
            <p>This will remove every score from the Who's That Pokemon leaderboard.</p>
            <div className="clear-dialog-actions">
              <button
                type="button"
                className="nes-btn"
                onClick={() => setShowResetLeaderboardDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="nes-btn is-error"
                onClick={resetLeaderboard}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingLeaveAction && (
        <div
          className="clear-dialog-overlay"
          role="presentation"
          onClick={cancelLeaveGame}
        >
          <div
            className="clear-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="who-leave-game-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="who-leave-game-title">Leave Game?</h2>
            <p>Your current Who's That Pokemon round will end if you leave this screen.</p>
            <div className="clear-dialog-actions">
              <button
                type="button"
                className="nes-btn"
                onClick={cancelLeaveGame}
                autoFocus
              >
                Stay
              </button>
              <button
                type="button"
                className="nes-btn is-error"
                onClick={confirmLeaveGame}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {showEntryOverlay && currentPokemon && (
        <div
          className="who-entry-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="who-entry-title"
          onClick={() => setShowEntryOverlay(false)}
        >
          <div className="who-entry-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setShowEntryOverlay(false)}
              aria-label="Back to game"
            >
              Back
            </button>

            <div className="who-entry-main">
              <div className="pokedex-card-media">
                {officialArtwork && <img src={officialArtwork} alt={answerName} />}
              </div>
              <div className="pokedex-card-info">
                <p className="card-detail-set">#{String(currentPokemon.id).padStart(3, '0')}</p>
                <h2 id="who-entry-title">{answerName}</h2>
                <div className="type-row">
                  {currentPokemon.types.map(({ type }) => (
                    <TypeBadge key={type.name} type={type.name} />
                  ))}
                </div>
                <section className="pokedex-section flavor-section">
                  {entryLoading && <p>Loading Pokedex entry...</p>}
                  {!entryLoading && (
                    <p>{getEnglishFlavorText(entrySpecies) || 'No English flavor text found.'}</p>
                  )}
                </section>
                <dl className="profile-list">
                  <div>
                    <dt>Species</dt>
                    <dd>
                      {entrySpecies?.genera?.find((genus) => genus.language.name === 'en')?.genus ||
                        'Unknown'}
                    </dd>
                  </div>
                  <div>
                    <dt>Height</dt>
                    <dd>{currentPokemon.height / 10} m</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd>{currentPokemon.weight / 10} kg</dd>
                  </div>
                </dl>
              </div>
            </div>

            <section className="pokedex-section who-featured-section">
              <h3>Featured TCG Cards</h3>
              {loadingTcgCards && <p className="pokedex-status">Loading TCG cards...</p>}
              {!loadingTcgCards && (
                <div className="who-featured-grid">
                  {featuredCards.slice(0, 8).map((card) => (
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
          </div>
        </div>
      )}

      {selectedTcgCard && (
        <div
          className="card-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="who-tcg-card-detail-title"
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
              <h2 id="who-tcg-card-detail-title">{selectedTcgCard.name}</h2>
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
                  <dd>{selectedTcgCard.subtypes?.join(', ') || selectedTcgCard.supertype || 'N/A'}</dd>
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

export default WhosThatPokemonPage;
