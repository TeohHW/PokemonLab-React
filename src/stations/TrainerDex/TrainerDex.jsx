import { useEffect, useMemo, useState } from 'react';
import {
  getCardFaceImage,
  getCardFallbackImage,
  getExpansionCards,
  getExpansionCategory,
  handleCardImageError,
  hasFeaturedTcgCards,
  TypeBadge,
} from '../shared/stationShared';
import { TRAINERDEX_OPTIONS, TRAINERDEX_TRAINERS, TRAINER_GROUPS } from './trainerDexData';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const TYPE_NAMES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];
const STAT_SORT_OPTIONS = [
  { id: 'hp', label: 'HP' },
  { id: 'attack', label: 'Attack' },
  { id: 'defense', label: 'Defense' },
  { id: 'special-attack', label: 'Sp. Atk' },
  { id: 'special-defense', label: 'Sp. Def' },
  { id: 'speed', label: 'Speed' },
];
const trainerArtModules = import.meta.glob('../../../trainers/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});
const getAssetByFileName = (modules, fileName) =>
  Object.entries(modules).find(([path]) => path.endsWith(`/${fileName}`))?.[1] || '';

const getTrainerArt = (trainerName) =>
  getAssetByFileName(trainerArtModules, `${trainerName.replace(/\./g, '')}.png`);

const formatPokemonName = (name = '') =>
  name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatNoBreakSlashLabel = (label = '') => label.replace(/\s*\/\s*/g, '\u00a0/\u00a0');

const normalizeSearchText = (value = '') =>
  String(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const compactSearchText = (value = '') => normalizeSearchText(value).replace(/\s+/g, '');

const POKEMON_LOOKUP_ALIASES = {
  'mr mime': 'mr-mime',
  mrmime: 'mr-mime',
  'mime jr': 'mime-jr',
  mimejr: 'mime-jr',
  farfetchd: 'farfetchd',
  sirfetchd: 'sirfetchd',
  'type null': 'type-null',
  lycanroc: 'lycanroc-midday',
  ninetales: 'ninetales',
  oricorio: 'oricorio-baile',
};

const normalizePokemonLookup = (pokemonName = '') => {
  const searchKey = normalizeSearchText(pokemonName);
  const compactSearchKey = searchKey.replace(/\s+/g, '');

  return (
    POKEMON_LOOKUP_ALIASES[searchKey] ||
    POKEMON_LOOKUP_ALIASES[compactSearchKey] ||
    searchKey.replace(/\s+/g, '-')
  );
};

const fetchJson = async (url, options = {}, errorMessage = 'Unable to load resource.') => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json();
};

const fetchPokemonByName = (pokemonName, options = {}) =>
  fetchJson(
    `${POKEAPI_BASE_URL}/pokemon/${normalizePokemonLookup(pokemonName)}`,
    options,
    'Unable to load trainer team data.',
  );

const getTypeMultiplierMap = (typeData = []) =>
  TYPE_NAMES.reduce((multipliers, typeName) => {
    let multiplier = 1;

    typeData.forEach((type) => {
      const relations = type.damage_relations;
      if (relations.double_damage_from.some((damageType) => damageType.name === typeName)) {
        multiplier *= 2;
      }
      if (relations.half_damage_from.some((damageType) => damageType.name === typeName)) {
        multiplier *= 0.5;
      }
      if (relations.no_damage_from.some((damageType) => damageType.name === typeName)) {
        multiplier *= 0;
      }
    });

    return {
      ...multipliers,
      [typeName]: multiplier,
    };
  }, {});

const handlePokemonSpriteError = (event) => {
  const fallbackSrc = event.currentTarget.dataset.fallbackSrc;
  const [nextFallback, ...remainingFallbacks] = fallbackSrc ? fallbackSrc.split('|').filter(Boolean) : [];

  if (!nextFallback) {
    event.currentTarget.removeAttribute('data-fallback-src');
    return;
  }

  event.currentTarget.src = nextFallback;
  if (remainingFallbacks.length) {
    event.currentTarget.dataset.fallbackSrc = remainingFallbacks.join('|');
  } else {
    event.currentTarget.removeAttribute('data-fallback-src');
  }
};

const handlePokemonSpriteLoad = (event) => {
  event.currentTarget.style.visibility = 'visible';
};

const getTrainerTeamAverageLevel = (team = []) =>
  team.length ? Math.round(team.reduce((sum, member) => sum + member.level, 0) / team.length) : 0;

const getTrainerTeamSpecialties = (trainer, enrichedTeam = []) => {
  const declaredTypes = trainer.specialty?.filter((typeName) => typeName !== 'mixed') || [];
  const actualTypes = enrichedTeam.flatMap((member) => member.types || []);
  return [...new Set([...declaredTypes, ...actualTypes])];
};

const getTrainerAverageStats = (enrichedTeam = []) =>
  STAT_SORT_OPTIONS.map((stat) => {
    const statValues = enrichedTeam
      .map((member) => member.stats?.[stat.id])
      .filter((value) => Number.isFinite(value));

    return {
      ...stat,
      value: statValues.length
        ? Math.round(statValues.reduce((sum, value) => sum + value, 0) / statValues.length)
        : 0,
    };
  });

const getRecommendedTrainerCounters = (enrichedTeam = []) =>
  TYPE_NAMES.map((typeName) => {
    const multipliers = enrichedTeam
      .map((member) => member.defenseMultipliers?.[typeName])
      .filter((multiplier) => multiplier !== undefined);
    const score = multipliers.reduce((sum, multiplier) => sum + multiplier, 0);
    return {
      type: typeName,
      score,
      superEffective: multipliers.filter((multiplier) => multiplier > 1).length,
    };
  })
    .filter((counter) => counter.superEffective > 0)
    .sort((firstCounter, secondCounter) => (
      secondCounter.superEffective - firstCounter.superEffective ||
      secondCounter.score - firstCounter.score ||
      firstCounter.type.localeCompare(secondCounter.type)
    ))
    .slice(0, 5);

const getPokemonCardSearchNames = (teamMember) => {
  const displayName = teamMember?.label || formatPokemonName(teamMember?.name || '');
  const lookupName = formatPokemonName(teamMember?.name || '');
  return [...new Set([displayName, lookupName].filter(Boolean).map((name) => compactSearchText(name)))];
};

const getCardPokemonMatchScore = (card, pokemonSearchNames = [], trainerName = '') => {
  const cardName = compactSearchText(card.name);
  const compactTrainerName = compactSearchText(trainerName);
  const matchedPokemonName = pokemonSearchNames.find((pokemonName) => cardName.includes(pokemonName));

  if (!matchedPokemonName) return 0;

  let score = 10;
  if (compactTrainerName && cardName.includes(compactTrainerName)) score += 60;
  if (card.supertype === 'Pokémon') score += 8;
  if (cardName === matchedPokemonName) score += 10;
  if (cardName.endsWith(matchedPokemonName)) score += 5;
  if (cardName.startsWith('alolan') || cardName.startsWith('galarian') || cardName.startsWith('hisuian')) {
    score -= 3;
  }

  return score;
};

const sortFeaturedCards = (trainerName, pokemonSearchNames = []) => (firstCard, secondCard) => {
  const firstScore = getCardPokemonMatchScore(firstCard, pokemonSearchNames, trainerName);
  const secondScore = getCardPokemonMatchScore(secondCard, pokemonSearchNames, trainerName);
  return (
    secondScore - firstScore ||
    firstCard.name.localeCompare(secondCard.name) ||
    firstCard.setName.localeCompare(secondCard.setName)
  );
};

const getFeaturedTrainerTcgCards = (cards, trainer) => {
  if (!trainer) return [];

  const trainerName = compactSearchText(trainer.name);
  const trainerPokemonNames = trainer.team.flatMap(getPokemonCardSearchNames);

  return cards
    .filter((card) => (
      compactSearchText(card.name).includes(trainerName) &&
      trainerPokemonNames.some((pokemonName) => compactSearchText(card.name).includes(pokemonName))
    ))
    .sort(sortFeaturedCards(trainer.name, trainerPokemonNames))
    .slice(0, 8);
};

const getTeamPokemonTcgCards = (cards, trainer, teamMember) => {
  const pokemonSearchNames = getPokemonCardSearchNames(teamMember);

  return cards
    .filter((card) => getCardPokemonMatchScore(card, pokemonSearchNames, trainer?.name) > 0)
    .sort(sortFeaturedCards(trainer?.name, pokemonSearchNames))
    .slice(0, 24);
};

const getTrainerSummary = (trainer, region) => {
  const specialtyText = trainer.specialty
    ?.filter((typeName) => typeName !== 'mixed')
    .map(formatPokemonName)
    .join('- and ');
  const roleText = trainer.role || `${region?.region || trainer.regionId} trainer`;
  const officialGymMatch = roleText.match(/^(.+?) Gym Leader$/);

  if (officialGymMatch) {
    const gymName = officialGymMatch[1];
    return `${trainer.name} is the Gym Leader of ${gymName}'s Gym. ${trainer.name} specializes in ${specialtyText || 'varied'}-type Pokemon.`;
  }

  if (trainer.division === 'elite-four') {
    return `${trainer.name} is a member of the ${region?.region || 'regional'} Elite Four. ${trainer.name} specializes in ${specialtyText || 'varied'}-type Pokemon.`;
  }

  if (trainer.division === 'champion') {
    return `${trainer.name} is the Champion of the ${region?.region || 'regional'} Pokemon League and tests the player after the Elite Four challenge.`;
  }

  return `${trainer.name} is a ${roleText}. ${trainer.name} specializes in ${specialtyText || 'varied'}-type Pokemon.`;
};

const getDefaultGameId = (regionId) => {
  const region = TRAINERDEX_OPTIONS.find((option) => option.id === regionId);
  return region?.games?.[0]?.id || regionId;
};

const isTrainerAvailableForGame = (trainer, gameId) =>
  !trainer.gameIds?.length || trainer.gameIds.includes(gameId) || Boolean(trainer.gameData?.[gameId]);

const resolveTrainerForGame = (trainer, gameId, battleStage = 'initial') => {
  const gameData = trainer?.gameData?.[gameId] || {};
  const stageData = battleStage === 'initial' ? {} : gameData.battleStages?.[battleStage] || {};
  return {
    ...trainer,
    ...gameData,
    ...stageData,
    id: trainer.id,
    name: trainer.name,
    regionId: trainer.regionId,
    team: stageData.team || gameData.team || trainer.team,
    battleStages: gameData.battleStages || trainer.battleStages,
  };
};

const getRegionTrainersForGame = (regionId, gameId) =>
  TRAINERDEX_TRAINERS
    .filter((trainer) => trainer.regionId === regionId && isTrainerAvailableForGame(trainer, gameId))
    .map((trainer) => resolveTrainerForGame(trainer, gameId));

const hasSelectableGameVersionData = (regionId, games = []) =>
  games.length > 1 &&
  games.some((game) =>
    TRAINERDEX_TRAINERS.some((trainer) => {
      const gameData = trainer.regionId === regionId ? trainer.gameData?.[game.id] : null;
      return Boolean(gameData?.team || gameData?.division || gameData?.role || trainer.gameIds?.includes(game.id));
    }),
  );

function TrainerDexPage({ onBack, onOpenPokedex, onOpenTcg, onOpenWhos, onOpenTeam, onOpenQuiz, StationNav }) {
  const [selectedRegion, setSelectedRegion] = useState(TRAINERDEX_OPTIONS[0].id);
  const [selectedGame, setSelectedGame] = useState(getDefaultGameId(TRAINERDEX_OPTIONS[0].id));
  const [selectedBattleStage, setSelectedBattleStage] = useState('initial');
  const [selectedTrainerId, setSelectedTrainerId] = useState(
    TRAINERDEX_TRAINERS.find((trainer) => trainer.regionId === TRAINERDEX_OPTIONS[0].id)?.id,
  );
  const [tcgCards, setTcgCards] = useState([]);
  const [loadingTcgCards, setLoadingTcgCards] = useState(true);
  const [enrichedTeam, setEnrichedTeam] = useState([]);
  const [loadingTeamData, setLoadingTeamData] = useState(true);
  const [selectedTcgCard, setSelectedTcgCard] = useState(null);
  const [selectedTeamTcgMember, setSelectedTeamTcgMember] = useState(null);
  const [error, setError] = useState('');

  const regionTrainers = useMemo(
    () => getRegionTrainersForGame(selectedRegion, selectedGame),
    [selectedRegion, selectedGame],
  );
  const selectedTrainerBase = useMemo(
    () =>
      regionTrainers.find((trainer) => trainer.id === selectedTrainerId) ||
      regionTrainers[0] ||
      TRAINERDEX_TRAINERS[0],
    [regionTrainers, selectedTrainerId],
  );
  const battleStageOptions = useMemo(() => {
    const stages = selectedTrainerBase?.battleStages || {};
    return [
      { id: 'initial', label: 'Initial Team' },
      ...Object.entries(stages).map(([id, stage]) => ({ id, label: stage.label || formatPokemonName(id) })),
    ];
  }, [selectedTrainerBase]);
  const activeBattleStage = battleStageOptions.some((stage) => stage.id === selectedBattleStage)
    ? selectedBattleStage
    : 'initial';
  const selectedTrainer = useMemo(
    () => resolveTrainerForGame(selectedTrainerBase, selectedGame, activeBattleStage),
    [selectedTrainerBase, selectedGame, activeBattleStage],
  );
  const activeRegion = TRAINERDEX_OPTIONS.find((region) => region.id === selectedRegion);
  const activeGame = activeRegion?.games?.find((game) => game.id === selectedGame) || activeRegion?.games?.[0];
  const showGameVersionSelector = hasSelectableGameVersionData(selectedRegion, activeRegion?.games || []);
  const groupedTrainers = useMemo(
    () =>
      TRAINER_GROUPS.map((group) => ({
        ...group,
        trainers: regionTrainers.filter((trainer) => trainer.division === group.id),
      })).filter((group) => group.trainers.length),
    [regionTrainers],
  );
  const featuredTrainerCards = useMemo(
    () => getFeaturedTrainerTcgCards(tcgCards, selectedTrainer),
    [tcgCards, selectedTrainer],
  );
  const selectedTeamTcgCards = useMemo(
    () => getTeamPokemonTcgCards(tcgCards, selectedTrainer, selectedTeamTcgMember),
    [tcgCards, selectedTrainer, selectedTeamTcgMember],
  );
  const trainerTypes = useMemo(
    () => getTrainerTeamSpecialties(selectedTrainer, enrichedTeam),
    [selectedTrainer, enrichedTeam],
  );
  const averageStats = useMemo(() => getTrainerAverageStats(enrichedTeam), [enrichedTeam]);
  const recommendedCounters = useMemo(
    () => getRecommendedTrainerCounters(enrichedTeam),
    [enrichedTeam],
  );
  const renderFeaturedCard = (card) => (
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
  );

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
    const controller = new AbortController();
    let isCurrentRequest = true;

    Promise.all(
      selectedTrainer.team.map((teamMember) =>
        fetchPokemonByName(teamMember.name, { signal: controller.signal })
          .then((pokemon) =>
            Promise.all(
              pokemon.types.map(({ type }) =>
                fetchJson(type.url, { signal: controller.signal }, 'Unable to load trainer team type data.'),
              ),
            )
              .catch((fetchError) => {
                if (fetchError.name === 'AbortError') {
                  throw fetchError;
                }

                return [];
              })
              .then((typeData) => {
                return {
                  ...teamMember,
                  types: pokemon.types.map(({ type }) => type.name),
                  stats: Object.fromEntries(
                    pokemon.stats.map((stat) => [stat.stat.name, stat.base_stat]),
                  ),
                  sprite: pokemon.sprites?.front_default || '',
                  spriteFallbacks: [
                    pokemon.sprites?.other?.['official-artwork']?.front_default,
                  ].filter(Boolean),
                  defenseMultipliers: getTypeMultiplierMap(typeData),
                };
              }),
          )
          .catch((fetchError) => {
            if (fetchError.name === 'AbortError') {
              throw fetchError;
            }

            return { ...teamMember };
          }),
      ),
    )
      .then((teamData) => {
        if (isCurrentRequest && !controller.signal.aborted) {
          setEnrichedTeam(teamData);
        }
      })
      .catch((fetchError) => {
        if (isCurrentRequest && fetchError.name !== 'AbortError') {
          setError(fetchError.message);
          setEnrichedTeam(selectedTrainer.team);
        }
      })
      .finally(() => {
        if (isCurrentRequest && !controller.signal.aborted) {
          setLoadingTeamData(false);
        }
      });

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [selectedTrainer]);

  return (
    <div className="app-container trainerdex-page">
      <header className="app-header">
        <button type="button" className="brand-mark brand-home-button" onClick={onBack}>
          <span className="nes-pokeball brand-pokeball trainerdex-ball" aria-hidden="true" />
          <h1>TrainerDex</h1>
        </button>
        <StationNav
          activeStation="trainerdex"
          onNavigate={(station) => {
            const handlers = {
              home: onBack,
              pokedex: onOpenPokedex,
              tcg: onOpenTcg,
              who: onOpenWhos,
              team: onOpenTeam,
              quiz: onOpenQuiz,
            };
            handlers[station]?.();
          }}
        />
      </header>

      <section className="trainerdex-layout">
        <aside className="trainerdex-sidebar">
          <label>Game / Region</label>
          <div className="pokedex-game-grid trainerdex-region-grid" aria-label="TrainerDex region">
            {TRAINERDEX_OPTIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                className={`pokedex-game-card trainerdex-region-card nes-btn ${
                  selectedRegion === region.id ? 'is-selected' : ''
                }`}
                onClick={() => {
                  setSelectedRegion(region.id);
                  const nextGame = getDefaultGameId(region.id);
                  const nextTrainer = getRegionTrainersForGame(region.id, nextGame)[0];
                  setSelectedGame(nextGame);
                  setSelectedBattleStage('initial');
                  setSelectedTrainerId(
                    nextTrainer?.id,
                  );
                  setLoadingTeamData(true);
                  setError('');
                }}
              >
                <strong>{formatNoBreakSlashLabel(region.label)}</strong>
                <span className="pokedex-game-region">{region.region}</span>
              </button>
            ))}
          </div>

          {showGameVersionSelector && (
            <>
              <label>Game Version</label>
              <div className="move-version-grid trainerdex-game-version-grid" aria-label={`${activeRegion.region} game versions`}>
                {activeRegion.games.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    className={`move-version-button trainerdex-game-version-button nes-btn ${
                      selectedGame === game.id ? 'is-selected' : ''
                    }`}
                    onClick={() => {
                      const nextTrainers = getRegionTrainersForGame(selectedRegion, game.id);
                      setSelectedGame(game.id);
                      setSelectedBattleStage('initial');
                      if (!nextTrainers.some((trainer) => trainer.id === selectedTrainerId)) {
                        setSelectedTrainerId(nextTrainers[0]?.id);
                      }
                      setLoadingTeamData(true);
                      setError('');
                    }}
                  >
                    {game.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <label>Trainers</label>
          <div className="trainerdex-trainer-list" aria-label={`${activeRegion?.region} trainers`}>
            {groupedTrainers.map((group) => (
              <section key={group.id} className="trainerdex-trainer-group">
                <h2>{group.label}</h2>
                {group.trainers.map((trainer) => (
                  <button
                    key={trainer.id}
                    type="button"
                    className={`trainerdex-trainer-button nes-btn ${
                      trainer.id === selectedTrainer?.id ? 'is-selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedTrainerId(trainer.id);
                      setSelectedBattleStage('initial');
                      setLoadingTeamData(true);
                      setError('');
                    }}
                  >
                    <img src={getTrainerArt(trainer.name)} alt="" loading="lazy" />
                    <span>
                      <strong>{trainer.name}</strong>
                      <small>{trainer.role}</small>
                    </span>
                  </button>
                ))}
              </section>
            ))}
          </div>
        </aside>

        <main className="trainerdex-dossier">
          {error && <p className="pokedex-error">{error}</p>}
          <section className="trainerdex-hero">
            <div className="trainerdex-art-panel">
              <img src={getTrainerArt(selectedTrainer.name)} alt={selectedTrainer.name} loading="lazy" />
            </div>
            <div className="trainerdex-summary">
              <p className="card-detail-set">{activeGame?.label || activeRegion?.label}</p>
              <h2>{selectedTrainer.name}</h2>
              <p className="trainerdex-entry-summary">
                {getTrainerSummary(selectedTrainer, activeRegion)}
              </p>
              <dl className="trainerdex-meta">
                <div>
                  <dt>Role</dt>
                  <dd>{selectedTrainer.role}</dd>
                </div>
                <div>
                  <dt>Average Level</dt>
                  <dd>{getTrainerTeamAverageLevel(selectedTrainer.team)}</dd>
                </div>
                <div>
                  <dt>Team Size</dt>
                  <dd>{selectedTrainer.team.length}</dd>
                </div>
              </dl>
              <section className="trainerdex-info-cluster" aria-label="Trainer analysis">
                <div>
                  <h3>Types Used</h3>
                  <div className="trainerdex-type-row" aria-label="Trainer team types">
                    {trainerTypes.map((typeName) => (
                      <TypeBadge key={typeName} type={typeName} className="move-type-pill" />
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Average Stats</h3>
                  <dl className="trainerdex-stat-list">
                    {averageStats.map((stat) => (
                      <div key={stat.id}>
                        <dt>{stat.label}</dt>
                        <dd>{stat.value || '-'}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3>Recommended Types</h3>
                  <div className="trainerdex-counter-list">
                    {recommendedCounters.map((counter) => (
                      <TypeBadge key={counter.type} type={counter.type} className="move-type-pill" />
                    ))}
                    {!recommendedCounters.length && (
                      <p className="pokedex-status">Counters load after team analysis.</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section className="pokedex-section trainerdex-team-section">
            <div className="trainerdex-section-heading">
              <div className="trainerdex-team-title-row">
                <h3>Pokemon Team</h3>
                <p className="trainerdex-card-help">
                  Click a Pokemon to view featured TCG cards.
                </p>
              </div>
              {battleStageOptions.length > 1 && (
                <div className="trainerdex-battle-stage-toggle" aria-label="Pokemon team battle stage">
                  {battleStageOptions.map((stage) => (
                    <button
                      key={stage.id}
                      type="button"
                      className={`move-version-button trainerdex-battle-stage-button nes-btn ${
                        activeBattleStage === stage.id ? 'is-selected' : ''
                      }`}
                      onClick={() => {
                        setSelectedBattleStage(stage.id);
                        setLoadingTeamData(true);
                        setError('');
                      }}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {loadingTeamData && <p className="pokedex-status">Loading team analysis...</p>}
            <div className="trainerdex-team-panel">
              {selectedTrainer.team.map((teamMember, teamMemberIndex) => {
                const candidateMember = enrichedTeam[teamMemberIndex];
                const enrichedMember = candidateMember?.name === teamMember.name ? candidateMember : null;
                return (
                  <article
                    key={`${teamMember.name}-${teamMember.level}-${teamMemberIndex}`}
                    className="trainerdex-team-row"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${teamMember.label || formatPokemonName(teamMember.name)} TCG cards`}
                    onClick={() => setSelectedTeamTcgMember(teamMember)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedTeamTcgMember(teamMember);
                      }
                    }}
                  >
                    <div className="trainerdex-team-heading">
                      <div className="trainerdex-team-sprite">
                        {enrichedMember?.sprite && (
                          <img
                            key={`${teamMember.name}-${enrichedMember.sprite}`}
                            src={enrichedMember.sprite}
                            data-fallback-src={(enrichedMember.spriteFallbacks || [])
                              .filter((spriteUrl) => spriteUrl && spriteUrl !== enrichedMember.sprite)
                              .join('|')}
                            alt=""
                            loading="lazy"
                            onLoad={handlePokemonSpriteLoad}
                            onError={handlePokemonSpriteError}
                          />
                        )}
                      </div>
                      <div>
                        <strong>{teamMember.label || formatPokemonName(teamMember.name)}</strong>
                        <span>Lv. {teamMember.level}</span>
                      </div>
                    </div>
                    {enrichedMember?.types?.length > 0 && (
                      <div className="trainerdex-type-row">
                        {enrichedMember.types.map((typeName) => (
                          <TypeBadge key={typeName} type={typeName} className="move-type-pill" />
                        ))}
                      </div>
                    )}
                    <ul className="trainerdex-move-list">
                      {teamMember.moves.map((moveName) => (
                        <li key={moveName}>{moveName}</li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pokedex-section tcg-featured-section trainerdex-tcg-section">
            <h3>Featured TCG Cards</h3>
            {loadingTcgCards && <p className="pokedex-status">Loading TCG cards...</p>}
            {!loadingTcgCards && (
              <div className="trainerdex-featured-groups">
                {featuredTrainerCards.length > 0 && (
                  <section className="trainerdex-featured-group">
                    <h4>Trainer Featured</h4>
                    <div className="tcg-featured-grid">
                      {featuredTrainerCards.map(renderFeaturedCard)}
                    </div>
                  </section>
                )}
                {!featuredTrainerCards.length && (
                  <p className="pokedex-status">No local trainer-featured TCG cards found for this trainer.</p>
                )}
              </div>
            )}
          </section>
        </main>
      </section>

      {selectedTeamTcgMember && (
        <div
          className="card-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trainerdex-team-tcg-title"
          onClick={() => setSelectedTeamTcgMember(null)}
        >
          <div className="trainerdex-team-tcg-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedTeamTcgMember(null)}
              aria-label="Close Pokemon TCG cards"
            >
              Close
            </button>
            <div className="trainerdex-team-tcg-header">
              <p className="card-detail-set">{selectedTrainer.name}'s team</p>
              <h2 id="trainerdex-team-tcg-title">
                {selectedTeamTcgMember.label || formatPokemonName(selectedTeamTcgMember.name)} TCG Cards
              </h2>
            </div>
            {selectedTeamTcgCards.length > 0 ? (
              <div className="tcg-featured-grid trainerdex-team-tcg-grid">
                {selectedTeamTcgCards.map(renderFeaturedCard)}
              </div>
            ) : (
              <p className="pokedex-status">No local TCG cards found for this Pokemon.</p>
            )}
          </div>
        </div>
      )}

      {selectedTcgCard && (
        <div
          className="card-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trainerdex-tcg-card-detail-title"
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
            <div className="card-detail-image-wrap">
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
              <h2 id="trainerdex-tcg-card-detail-title">{selectedTcgCard.name}</h2>
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
                  <dt>Type</dt>
                  <dd>{selectedTcgCard.types?.join(', ') || 'N/A'}</dd>
                </div>
                <div>
                  <dt>Artist</dt>
                  <dd>{selectedTcgCard.artist || 'Unknown'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerDexPage;

