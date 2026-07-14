/* eslint-disable no-unused-vars */
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import StationNav from '../../components/StationNav';
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
  hasPlayableCards,
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
  TYPE_NAMES,
  WHO_LEADERBOARD_STORAGE_KEY,
  writeCachedPokeApiResource
} from '../shared/stationShared';

function PokemonQuizStation({ onBack, onOpenPokedex, onOpenTcg, onOpenWhos, onOpenTeam, onOpenTrainerDex }) {
  const [selectedDex, setSelectedDex] = useState(ALL_POKEDEX_OPTION.id);
  const [selectedCategory, setSelectedCategory] = useState('mixed');
  const [pokemonList, setPokemonList] = useState([]);
  const [typeChart, setTypeChart] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [autoContinue, setAutoContinue] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [error, setError] = useState('');
  const [isCryPlaying, setIsCryPlaying] = useState(false);
  const [pendingLeaveAction, setPendingLeaveAction] = useState(null);
  const quizAudioRef = useRef(null);
  const autoContinueTimerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all(
      TYPE_NAMES.map((typeName) =>
        fetchPokeApiJson(
          `${POKEAPI_BASE_URL}/type/${typeName}`,
          { signal: controller.signal },
          'Unable to load Pokemon quiz type chart.',
        )
          .then((typeData) => [typeName, typeData]),
      ),
    )
      .then((entries) => {
        setTypeChart(Object.fromEntries(entries));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      });

    return () => controller.abort();
  }, []);

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
          'Unable to load quiz Pokedex.',
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

  useEffect(
    () => () => {
      if (quizAudioRef.current) {
        quizAudioRef.current.pause();
        quizAudioRef.current = null;
      }
      setIsCryPlaying(false);
      clearTimeout(autoContinueTimerRef.current);
    },
    [],
  );

  const resetQuiz = () => {
    setScore(0);
    setRoundCount(0);
    setStreak(0);
    setSelectedAnswer('');
    setCurrentQuestion(null);
    setIsCryPlaying(false);
  };

  const startNextQuestion = useCallback(() => {
    if (loadingList || !pokemonList.length || !Object.keys(typeChart).length) {
      return;
    }

    clearTimeout(autoContinueTimerRef.current);
    if (quizAudioRef.current) {
      quizAudioRef.current.pause();
      quizAudioRef.current = null;
    }
    setIsCryPlaying(false);
    setLoadingQuestion(true);
    setSelectedAnswer('');
    setError('');

    const tryBuildQuestion = (attempt = 0) =>
      buildPokemonQuizQuestion({
        category: selectedCategory,
        pokemonList,
        selectedDex,
        typeChart,
      }).catch((buildError) => {
        if (attempt >= 4) {
          throw buildError;
        }
        return tryBuildQuestion(attempt + 1);
      });

    tryBuildQuestion()
      .then((question) => {
        setCurrentQuestion(question);
      })
      .catch((fetchError) => {
        setError(fetchError.message);
      })
      .finally(() => setLoadingQuestion(false));
  }, [loadingList, pokemonList, selectedCategory, selectedDex, typeChart]);

  const answerQuestion = (answer) => {
    if (!currentQuestion || selectedAnswer) {
      return;
    }

    setSelectedAnswer(answer);
    setRoundCount((previousCount) => previousCount + 1);

    if (answer === currentQuestion.answer) {
      setScore((previousScore) => previousScore + 1);
      setStreak((previousStreak) => previousStreak + 1);
      if (autoContinue) {
        autoContinueTimerRef.current = setTimeout(() => {
          startNextQuestion();
        }, 1200);
      }
      return;
    }

    setStreak(0);
    if (autoContinue) {
      autoContinueTimerRef.current = setTimeout(() => {
        startNextQuestion();
      }, 1600);
    }
  };

  const playQuizCry = () => {
    const cryUrl = currentQuestion?.visual?.cryUrl;
    if (!cryUrl) return;

    if (quizAudioRef.current) {
      quizAudioRef.current.pause();
      quizAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(cryUrl);
    quizAudioRef.current = audio;
    const stopCryEffect = () => {
      if (quizAudioRef.current === audio) {
        setIsCryPlaying(false);
      }
    };

    audio.addEventListener('ended', stopCryEffect, { once: true });
    audio.addEventListener('pause', stopCryEffect, { once: true });
    audio.addEventListener('error', stopCryEffect, { once: true });
    audio.play()
      .then(() => {
        setIsCryPlaying(true);
      })
      .catch(() => {
        setIsCryPlaying(false);
        setError('Pokemon cry could not be played.');
      });
  };

  const requestLeaveQuiz = (navigationAction) => {
    if (!currentQuestion && !loadingQuestion) {
      navigationAction?.();
      return;
    }

    clearTimeout(autoContinueTimerRef.current);
    setPendingLeaveAction(() => navigationAction);
  };

  const cancelLeaveQuiz = () => {
    setPendingLeaveAction(null);
  };

  const confirmLeaveQuiz = () => {
    const navigationAction = pendingLeaveAction;
    setPendingLeaveAction(null);
    if (quizAudioRef.current) {
      quizAudioRef.current.pause();
      quizAudioRef.current = null;
    }
    navigationAction?.();
  };

  const renderQuizVisual = () => {
    const visual = currentQuestion?.visual;
    if (!visual) {
      return (
        <div className="quiz-visual-placeholder">
          <span>?</span>
        </div>
      );
    }

    if (visual.kind === 'entry') {
      return <blockquote className="quiz-entry-card">{visual.text}</blockquote>;
    }

    if (visual.kind === 'cry') {
      return (
        <div className={`quiz-cry-card ${isCryPlaying ? 'is-playing' : ''}`}>
          <span className="quiz-cry-pulse" aria-hidden="true">
            <span className="nes-pokeball" />
          </span>
          <button
            type="button"
            className="nes-btn is-primary quiz-cry-button"
            onClick={playQuizCry}
            aria-live="polite"
          >
            {isCryPlaying ? 'Playing...' : 'Play Cry'}
          </button>
        </div>
      );
    }

    if (visual.kind === 'versus') {
      return (
        <div className="quiz-versus-card">
          <div>
            <img src={visual.firstImage} alt="" aria-hidden="true" />
            <span>{visual.firstName}</span>
          </div>
          <strong>VS</strong>
          <div>
            <img src={visual.secondImage} alt="" aria-hidden="true" />
            <span>{visual.secondName}</span>
          </div>
        </div>
      );
    }

    if (visual.kind === 'move') {
      return (
        <div className="quiz-move-card">
          <strong>{visual.moveName}</strong>
          <span>{visual.moveClass} move</span>
        </div>
      );
    }

    if (visual.kind === 'sprite-line' || visual.kind === 'art-line') {
      return (
        <div className={visual.kind === 'art-line' ? 'quiz-art-line' : 'quiz-sprite-line'}>
          {visual.images
            .map((image) => (typeof image === 'string' ? { image, fallback: '' } : image))
            .filter((image) => image?.image || image?.fallback)
            .map((image, index) => (
              <img
                key={`${image.image || image.fallback}-${index}`}
                src={image.image || image.fallback}
                data-fallback-src={image.fallback || ''}
                alt=""
                aria-hidden="true"
                onError={(event) => {
                  const fallbackSrc = event.currentTarget.dataset.fallbackSrc;
                  if (fallbackSrc && event.currentTarget.src !== fallbackSrc) {
                    event.currentTarget.src = fallbackSrc;
                    event.currentTarget.removeAttribute('data-fallback-src');
                  }
                }}
              />
            ))}
        </div>
      );
    }

    if (visual.kind === 'sprite') {
      return (
        <div className="quiz-art-card">
          <img src={visual.image} alt="" aria-hidden="true" />
        </div>
      );
    }

    return (
      <div className="quiz-art-card is-silhouette">
        {visual.image ? <img src={visual.image} alt="" aria-hidden="true" /> : <span>?</span>}
      </div>
    );
  };

  const activeDex = TEAM_POKEDEX_OPTIONS.find((pokedex) => pokedex.id === selectedDex);
  const answeredCorrectly = selectedAnswer && selectedAnswer === currentQuestion?.answer;
  const answeredIncorrectly = selectedAnswer && selectedAnswer !== currentQuestion?.answer;

  return (
    <div className="app-container quiz-page">
      <header className="app-header">
        <button
          type="button"
          className="brand-mark brand-home-button"
          onClick={() => requestLeaveQuiz(onBack)}
        >
          <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
          <h1>Pokemon Quiz</h1>
        </button>
        <StationNav
          activeStation="quiz"
          onNavigate={(station) => {
            const handlers = {
              home: onBack,
              pokedex: onOpenPokedex,
              tcg: onOpenTcg,
              who: onOpenWhos,
              team: onOpenTeam,
              trainerdex: onOpenTrainerDex,
            };
            const handler = handlers[station];
            if (handler) {
              requestLeaveQuiz(handler);
            }
          }}
        />
      </header>

      <section className="quiz-layout">
        <aside className="quiz-control-panel">
          <label htmlFor="quiz-pokedex-select">Quiz Pool</label>
          <select
            id="quiz-pokedex-select"
            value={selectedDex}
            onChange={(event) => {
              setSelectedDex(event.target.value);
              setLoadingList(true);
              setCurrentQuestion(null);
              setSelectedAnswer('');
              setScore(0);
              setRoundCount(0);
              setStreak(0);
            }}
          >
            {TEAM_POKEDEX_OPTIONS.map((pokedex) => (
              <option key={pokedex.id} value={pokedex.id}>
                {pokedex.label}
              </option>
            ))}
          </select>

          <label htmlFor="quiz-category-select">Category</label>
          <select
            id="quiz-category-select"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setCurrentQuestion(null);
              setSelectedAnswer('');
            }}
          >
            {QUIZ_CATEGORY_OPTIONS.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>

          <dl className="quiz-score-card">
            <div>
              <dt>Score</dt>
              <dd>{score}</dd>
            </div>
            <div>
              <dt>Rounds</dt>
              <dd>{roundCount}</dd>
            </div>
            <div>
              <dt>Streak</dt>
              <dd>{streak}</dd>
            </div>
          </dl>

          <label className="quiz-toggle">
            <input
              type="checkbox"
              checked={autoContinue}
              onChange={(event) => setAutoContinue(event.target.checked)}
            />
            Auto continue
          </label>

          <div className="quiz-control-actions">
            <button
              type="button"
              className="nes-btn is-success"
              onClick={startNextQuestion}
              disabled={loadingList || loadingQuestion || !pokemonList.length || !Object.keys(typeChart).length}
            >
              {currentQuestion ? 'Next Question' : 'Start Quiz'}
            </button>
            <button type="button" className="nes-btn" onClick={resetQuiz} disabled={!roundCount && !currentQuestion}>
              Reset
            </button>
          </div>

          <p className="quiz-pool-note">
            {loadingList ? 'Loading quiz pool...' : `${activeDex?.label || 'Quiz'}: ${pokemonList.length} Pokemon`}
          </p>
          {error && <p className="pokedex-error">{error}</p>}
        </aside>

        <main className="quiz-stage-panel">
          <div className="quiz-stage-topline">
            <p className="card-detail-set">{currentQuestion?.category || 'Quiz Terminal'}</p>
            <span>{selectedCategory === 'mixed' ? 'Mixed mode' : QUIZ_CATEGORY_OPTIONS.find((category) => category.id === selectedCategory)?.label}</span>
          </div>

          <section className="quiz-question-card">
            {loadingQuestion && (
              <div className="quiz-loading-state">
                <div className="pack-loader-ball" aria-hidden="true" />
                <p>Drawing a new question...</p>
              </div>
            )}

            {!loadingQuestion && currentQuestion && (
              <>
                <div className="quiz-visual-stage">
                  {renderQuizVisual()}
                </div>
                <h2>{currentQuestion.prompt}</h2>
                <div className="quiz-answer-grid">
                  {currentQuestion.choices.map((choice) => {
                    const isCorrect = selectedAnswer && choice === currentQuestion.answer;
                    const isWrong = selectedAnswer === choice && choice !== currentQuestion.answer;
                    return (
                      <button
                        key={choice}
                        type="button"
                        className={`nes-btn quiz-answer-button ${
                          isCorrect ? 'is-success' : isWrong ? 'is-error' : ''
                        }`}
                        onClick={() => answerQuestion(choice)}
                        disabled={Boolean(selectedAnswer)}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {answeredCorrectly && <p className="quiz-result is-correct">Correct.</p>}
                {answeredIncorrectly && (
                  <p className="quiz-result is-wrong">
                    Wrong. Answer: {currentQuestion.answer}
                  </p>
                )}
              </>
            )}

            {!loadingQuestion && !currentQuestion && (
              <div className="quiz-empty-state">
                <span className="nes-pokeball" aria-hidden="true" />
                <h2>Ready Check</h2>
                <p>Choose a pool and category, then start the quiz.</p>
              </div>
            )}
          </section>
        </main>
      </section>

      {pendingLeaveAction && (
        <div
          className="clear-dialog-overlay"
          role="presentation"
          onClick={cancelLeaveQuiz}
        >
          <div
            className="clear-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-leave-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="quiz-leave-dialog-title">Leave Quiz?</h2>
            <p>Your current Pokemon Quiz session will end if you leave this screen.</p>
            <div className="clear-dialog-actions">
              <button
                type="button"
                className="nes-btn"
                onClick={cancelLeaveQuiz}
                autoFocus
              >
                Stay
              </button>
              <button
                type="button"
                className="nes-btn is-error"
                onClick={confirmLeaveQuiz}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonQuizStation;
