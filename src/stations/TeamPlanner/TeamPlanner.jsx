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
  TYPE_ICONS,
  TYPE_NAMES,
  WHO_LEADERBOARD_STORAGE_KEY,
  writeCachedPokeApiResource
} from '../shared/stationShared';

function PokemonTeamPlanner({ onBack, onOpenPokedex, onOpenTcg, onOpenWhos, onOpenQuiz, onOpenTrainerDex }) {
  const [selectedDex, setSelectedDex] = useState(POKEDEX_OPTIONS[0].id);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonSearchTerm, setPokemonSearchTerm] = useState('');
  const [pokemonSortMode, setPokemonSortMode] = useState('entry');
  const [pokemonMetadata, setPokemonMetadata] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [typeChart, setTypeChart] = useState({});
  const [loadingList, setLoadingList] = useState(true);
  const [loadingTeamMember, setLoadingTeamMember] = useState(false);
  const [error, setError] = useState('');

  const activeVersionGroup = getTeamVersionGroup(selectedDex);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all(
      TYPE_NAMES.map((typeName) =>
        fetchPokeApiJson(
          `${POKEAPI_BASE_URL}/type/${typeName}`,
          { signal: controller.signal },
          'Unable to load Pokemon type chart.',
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

  const visiblePokemon = useMemo(() => {
    const normalizedSearch = pokemonSearchTerm.trim().toLowerCase();
    const filteredPokemon = normalizedSearch
      ? pokemonList.filter((pokemon) => (
          pokemon.name.includes(normalizedSearch) ||
          String(pokemon.entryNumber).includes(normalizedSearch)
        ))
      : pokemonList;

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
  }, [pokemonList, pokemonMetadata, pokemonSearchTerm, pokemonSortMode]);

  const pokemonSortOptions = useMemo(
    () => [
      { value: 'entry', label: 'Pokedex Number' },
      { value: 'name', label: 'Name' },
      { value: 'type', label: 'Type' },
      { value: 'legendary', label: 'Legendary' },
      ...STAT_SORT_OPTIONS.map((stat) => ({
        value: `stat-${stat.id}`,
        label: stat.label,
      })),
    ],
    [],
  );
  const loadingPokemonMetadata =
    POKEDEX_METADATA_SORTS.has(pokemonSortMode) &&
    pokemonList.some((pokemon) => !pokemonMetadata[pokemon.name]);

  const moveTypeCoverage = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(typeChart).map(([typeName, typeData]) => [
          typeName,
          typeData.damage_relations.double_damage_to.map((type) => type.name),
        ]),
      ),
    [typeChart],
  );

  const buildTeamMember = useCallback((pokemonName) =>
    fetchPokemonByNameOrSpecies(pokemonName)
      .then((pokemon) => {
        const levelUpMoves = getLevelUpMovesForVersionGroup(pokemon, activeVersionGroup);
        const limitedMoves = levelUpMoves.slice(0, 80);

        return Promise.all(
          limitedMoves.map((move) =>
            fetchPokeApiJson(move.url, {}, 'Unable to load move details.')
              .then((moveData) => ({
                ...move,
                type: moveData.type.name,
                damageClass: moveData.damage_class.name,
                power: moveData.power,
              })),
          ),
        ).then((availableMoves) => ({ pokemon, availableMoves }));
      })
      .then(({ pokemon, availableMoves }) => {
        const pokemonTypes = pokemon.types.map(({ type }) => type.name);
        const typeData = pokemonTypes.map((typeName) => typeChart[typeName]).filter(Boolean);
        const stats = Object.fromEntries(
          pokemon.stats.map((stat) => [stat.stat.name, stat.base_stat]),
        );

        return {
          id: `${pokemon.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          pokemonId: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprites.front_default,
          artwork: pokemon.sprites.other?.['official-artwork']?.front_default,
          types: pokemonTypes,
          stats,
          availableMoves,
          selectedMoves: availableMoves.slice(0, 4).map((move) => move.name),
          defenseMultipliers: getTypeMultiplierMap(typeData),
          moveTypeCoverage,
        };
      }), [activeVersionGroup, moveTypeCoverage, typeChart]);

  const addPokemonToTeam = useCallback((pokemonName) => {
    if (teamMembers.length >= 6 || loadingTeamMember || !Object.keys(typeChart).length) {
      return;
    }

    setLoadingTeamMember(true);
    setError('');

    buildTeamMember(pokemonName)
      .then((teamMember) => {
        setTeamMembers((previousMembers) => [...previousMembers, teamMember].slice(0, 6));
      })
      .catch((fetchError) => {
        setError(fetchError.message);
      })
      .finally(() => setLoadingTeamMember(false));
  }, [buildTeamMember, loadingTeamMember, teamMembers.length, typeChart]);

  const randomizeTeam = useCallback(() => {
    if (loadingList || loadingTeamMember || !pokemonList.length || !Object.keys(typeChart).length) {
      return;
    }

    setLoadingTeamMember(true);
    setError('');

    const shuffledPokemon = [...pokemonList].sort(() => Math.random() - 0.5).slice(0, 6);

    Promise.all(shuffledPokemon.map((pokemon) => buildTeamMember(pokemon.name)))
      .then((team) => {
        setTeamMembers(team);
      })
      .catch((fetchError) => {
        setError(fetchError.message);
      })
      .finally(() => setLoadingTeamMember(false));
  }, [buildTeamMember, loadingList, loadingTeamMember, pokemonList, typeChart]);

  const updateTeamMove = (memberId, moveIndex, moveName) => {
    setTeamMembers((previousMembers) =>
      previousMembers.map((member) => {
        if (member.id !== memberId) return member;

        const nextMoves = [...member.selectedMoves];
        nextMoves[moveIndex] = moveName;

        return {
          ...member,
          selectedMoves: nextMoves,
        };
      }),
    );
  };

  const removeTeamMember = (memberId) => {
    setTeamMembers((previousMembers) =>
      previousMembers.filter((member) => member.id !== memberId),
    );
  };

  const clearTeam = () => {
    setTeamMembers([]);
  };

  const teamMatchups = useMemo(
    () => summarizeTeamTypeMatchups(teamMembers),
    [teamMembers],
  );
  const teamWeaknesses = teamMatchups
    .filter((matchup) => matchup.weak)
    .sort((first, second) => second.weak - first.weak || first.type.localeCompare(second.type));
  const teamResistances = teamMatchups
    .filter((matchup) => matchup.resist || matchup.immune)
    .sort((first, second) =>
      (second.resist + second.immune) - (first.resist + first.immune) ||
      first.type.localeCompare(second.type),
    );
  const teamCoverage = useMemo(
    () => summarizeTeamMoveCoverage(teamMembers),
    [teamMembers],
  );
  const strongAgainstTypes = teamCoverage.map((coverage) => coverage.type);
  const averageStats = useMemo(
    () => getTeamAverageStats(teamMembers),
    [teamMembers],
  );

  return (
    <div className="app-container team-planner-page">
      <header className="app-header">
        <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
          <span className="nes-pokeball brand-pokeball" aria-hidden="true" />
          <h1>Pokemon Team Planner</h1>
        </button>
        <StationNav
          activeStation="team"
          onNavigate={(station) => {
            const handlers = {
              home: onBack,
              pokedex: onOpenPokedex,
              tcg: onOpenTcg,
              who: onOpenWhos,
              quiz: onOpenQuiz,
              trainerdex: onOpenTrainerDex,
            };
            handlers[station]?.();
          }}
        />
      </header>

      <section className="team-planner-layout">
        <aside className="team-control-panel">
          <label htmlFor="team-game-select">Game Pokedex</label>
          <select
            id="team-game-select"
            value={selectedDex}
            onChange={(event) => {
              setSelectedDex(event.target.value);
              setLoadingList(true);
              setError('');
              setPokemonList([]);
              setPokemonSearchTerm('');
              setPokemonSortMode('entry');
              setTeamMembers([]);
            }}
          >
            {TEAM_POKEDEX_OPTIONS.map((pokedex) => (
              <option key={pokedex.id} value={pokedex.id}>
                {pokedex.label}
              </option>
            ))}
          </select>

          <label htmlFor="team-pokemon-search">Pokemon</label>
          <input
            id="team-pokemon-search"
            type="search"
            value={pokemonSearchTerm}
            onChange={(event) => setPokemonSearchTerm(event.target.value)}
            placeholder="Filter by name or number..."
          />

          <label htmlFor="team-pokemon-sort">Sort Pokemon</label>
          <select
            id="team-pokemon-sort"
            value={pokemonSortMode}
            onChange={(event) => setPokemonSortMode(event.target.value)}
            disabled={loadingList}
          >
            {pokemonSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="team-count-badge">{teamMembers.length}/6 selected</p>
          {loadingPokemonMetadata && (
            <p className="pokedex-status">Loading Pokemon sort data...</p>
          )}

          <div className="team-action-row">
            <button
              type="button"
              className="nes-btn is-primary"
              onClick={randomizeTeam}
              disabled={loadingList || loadingTeamMember || !pokemonList.length || !Object.keys(typeChart).length}
            >
              Randomize Team
            </button>
            <button
              type="button"
              className="nes-btn is-error"
              onClick={clearTeam}
              disabled={!teamMembers.length || loadingTeamMember}
            >
              Remove All
            </button>
          </div>

          {error && <p className="pokedex-error">{error}</p>}

          <div className="team-pokemon-list" aria-label="Pokemon team choices">
            {loadingList && <p className="pokedex-status">Loading Pokemon...</p>}
            {!loadingList && visiblePokemon.map((pokemon) => (
              <button
                key={pokemon.name}
                type="button"
                className="pokemon-list-item nes-btn"
                onClick={() => addPokemonToTeam(pokemon.name)}
                disabled={teamMembers.length >= 6 || loadingTeamMember || !Object.keys(typeChart).length}
              >
                <span>#{String(pokemon.entryNumber).padStart(3, '0')}</span>
                <img src={getPokemonSpriteUrl(pokemon.pokemonId)} alt="" aria-hidden="true" loading="lazy" />
                <strong>{formatPokemonName(pokemon.name)}</strong>
              </button>
            ))}
            {!loadingList && !visiblePokemon.length && (
              <p className="pokedex-status">No Pokemon match this search.</p>
            )}
          </div>
        </aside>

        <main className="team-builder-panel">
          <section className="team-slot-grid" aria-label="Team slots">
            {teamMembers.map((member) => (
              <article key={member.id} className="team-member-card">
                <button
                  type="button"
                  className="team-remove-button nes-btn is-error"
                  onClick={() => removeTeamMember(member.id)}
                  aria-label={`Remove ${formatPokemonName(member.name)}`}
                >
                  Remove
                </button>
                <div className="team-member-heading">
                  <img
                    src={member.artwork || member.sprite || getPokemonSpriteUrl(member.pokemonId)}
                    alt={formatPokemonName(member.name)}
                    loading="lazy"
                  />
                  <div>
                    <p className="card-detail-set">#{String(member.pokemonId).padStart(3, '0')}</p>
                    <h2>{formatPokemonName(member.name)}</h2>
                    <div className="type-row">
                      {member.types.map((typeName) => (
                        <span key={typeName} className={`type-badge type-${typeName}`}>
                          <img src={TYPE_ICONS[typeName]} alt="" aria-hidden="true" />
                          {typeName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="team-move-grid">
                  {Array.from({ length: 4 }, (_, moveIndex) => (
                    <label key={moveIndex}>
                      Move {moveIndex + 1}
                      <select
                        value={member.selectedMoves[moveIndex] || ''}
                        onChange={(event) => updateTeamMove(member.id, moveIndex, event.target.value)}
                      >
                        <option value="">Empty Slot</option>
                        {member.availableMoves.map((move) => (
                          <option key={`${move.level}-${move.name}`} value={move.name}>
                            Lv. {move.level} - {formatPokemonName(move.name)} ({formatPokemonName(move.type)})
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </article>
            ))}

            {Array.from({ length: Math.max(6 - teamMembers.length, 0) }, (_, index) => (
              <article key={`empty-${index}`} className="team-member-card is-empty">
                <span>{teamMembers.length + index + 1}</span>
              </article>
            ))}
          </section>

          <section className="team-analysis-grid">
            <article className="team-analysis-card">
              <h2>Weaknesses</h2>
              <div className="team-type-list">
                {teamWeaknesses.map((matchup) => (
                  <span key={matchup.type} className={`type-badge type-${matchup.type}`}>
                    {formatPokemonName(matchup.type)} x{matchup.weak}
                  </span>
                ))}
                {!teamWeaknesses.length && <p className="pokedex-status">Add Pokemon to scan team weaknesses.</p>}
              </div>
            </article>

            <article className="team-analysis-card">
              <h2>Resistances</h2>
              <div className="team-type-list">
                {teamResistances.map((matchup) => (
                  <span key={matchup.type} className={`type-badge type-${matchup.type}`}>
                    {formatPokemonName(matchup.type)} {matchup.immune ? `immune ${matchup.immune}` : `resist ${matchup.resist}`}
                  </span>
                ))}
                {!teamResistances.length && <p className="pokedex-status">No resistances yet.</p>}
              </div>
            </article>

            <article className="team-analysis-card">
              <h2>Strong Against</h2>
              <div className="team-type-list">
                {strongAgainstTypes.map((typeName) => (
                  <span key={typeName} className={`type-badge type-${typeName}`}>
                    {formatPokemonName(typeName)}
                  </span>
                ))}
                {!strongAgainstTypes.length && <p className="pokedex-status">Choose moves to see offensive strengths.</p>}
              </div>
            </article>

            <article className="team-analysis-card team-stat-card">
              <h2>Average Stats</h2>
              <div className="team-stat-list">
                {averageStats.map((stat) => (
                  <div key={stat.id}>
                    <span>{stat.label}</span>
                    <meter min="0" max="255" value={stat.value} />
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </main>
      </section>
    </div>
  );
}

export default PokemonTeamPlanner;
