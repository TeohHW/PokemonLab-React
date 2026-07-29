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
  TypeBadge,
  TYPE_NAMES,
  WHO_LEADERBOARD_STORAGE_KEY,
  writeCachedPokeApiResource
} from '../shared/stationShared';

const TEAM_POKEMON_LIST_PAGE_SIZE = 24;
const TEAM_PLANNER_STORAGE_KEY = 'pokemon-team-planner-saved-team';
const COMPETITIVE_STATS_BASE_URL = 'https://data.pkmn.cc/stats';

const loadSavedTeamPlanner = () => {
  try {
    const savedPlanner = localStorage.getItem(TEAM_PLANNER_STORAGE_KEY);
    if (!savedPlanner) return null;

    const parsedPlanner = JSON.parse(savedPlanner);
    const hasValidMembers = Array.isArray(parsedPlanner?.teamMembers) && parsedPlanner.teamMembers.every(
      (member) =>
        member &&
        typeof member.id === 'string' &&
        typeof member.name === 'string' &&
        Array.isArray(member.types) &&
        Array.isArray(member.abilities) &&
        Array.isArray(member.availableMoves) &&
        Array.isArray(member.selectedMoves) &&
        Array.isArray(member.formOptions),
    );

    return hasValidMembers ? parsedPlanner : null;
  } catch {
    return null;
  }
};
const HISTORICAL_VGC_USAGE_FORMATS = [
  { id: 'gen4vgc2009', label: 'VGC 2009', year: 2009 },
  { id: 'gen5vgc2011', label: 'VGC 2011', year: 2011 },
  { id: 'gen6vgc2016', label: 'VGC 2016', year: 2016 },
  { id: 'gen7vgc2017', label: 'VGC 2017', year: 2017 },
  { id: 'gen7vgc2018', label: 'VGC 2018', year: 2018 },
  { id: 'gen7vgc2019', label: 'VGC 2019', year: 2019 },
  { id: 'gen8vgc2020', label: 'VGC 2020', year: 2020 },
  { id: 'gen8vgc2021', label: 'VGC 2021', year: 2021 },
  { id: 'gen8vgc2022', label: 'VGC 2022', year: 2022 },
  { id: 'gen9vgc2023', label: 'VGC 2023', year: 2023 },
  { id: 'gen9vgc2024', label: 'VGC 2024', year: 2024 },
  { id: 'gen9vgc2025', label: 'VGC 2025', year: 2025 },
  { id: 'gen9vgc2026', label: 'VGC 2026', year: 2026 },
];
const COMPETITIVE_MOVE_FORMATS = {
  kanto: { singles: 'gen3ou' },
  hoenn: { singles: 'gen3ou' },
  'updated-johto': { vgc: 'gen4vgc2009', singles: 'gen4ou' },
  'extended-sinnoh': { vgc: 'gen4vgc2009', singles: 'gen4ou' },
  'updated-unova': { vgc: 'gen5vgc2011', singles: 'gen5ou' },
  'kalos-central': { vgc: 'gen6vgc2016', singles: 'gen6ou' },
  'updated-hoenn': { vgc: 'gen6vgc2016', singles: 'gen6ou' },
  'original-alola': { vgc: 'gen7vgc2019', singles: 'gen7ou' },
  galar: { vgc: 'gen8vgc2022', singles: 'gen8ou' },
  paldea: { vgc: 'gen9vgc2026', singles: 'gen9ou' },
  all: { vgc: 'gen9vgc2026', singles: 'gen9ou' },
};
const COMPETITIVE_FORMAT_LABELS = Object.fromEntries(
  HISTORICAL_VGC_USAGE_FORMATS.map((format) => [format.id, format.label]),
);
const COMPETITIVE_FORMAT_VERSION_GROUPS = {
  gen4vgc2009: 'platinum',
  gen5vgc2011: 'black-white',
  gen6vgc2016: 'omega-ruby-alpha-sapphire',
  gen7vgc2017: 'sun-moon',
  gen7vgc2018: 'ultra-sun-ultra-moon',
  gen7vgc2019: 'ultra-sun-ultra-moon',
  gen8vgc2020: 'sword-shield',
  gen8vgc2021: 'sword-shield',
  gen8vgc2022: 'sword-shield',
  gen9vgc2023: 'scarlet-violet',
  gen9vgc2024: 'scarlet-violet',
  gen9vgc2025: 'scarlet-violet',
  gen9vgc2026: 'scarlet-violet',
};
const NATIONAL_FORM_MOVE_GROUPS = [
  'scarlet-violet',
  'sword-shield',
  'ultra-sun-ultra-moon',
  'sun-moon',
  'omega-ruby-alpha-sapphire',
  'x-y',
  'black-2-white-2',
  'black-white',
  'heartgold-soulsilver',
  'platinum',
  'diamond-pearl',
];
const HISTORICAL_TOURNAMENT_MOVE_EVIDENCE = {
  urshifu: {
    tournamentMoves: ['surging-strikes', 'aqua-jet', 'protect', 'taunt'],
    tournamentMoveLabel: '2023 World Champion team',
    tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/319/teams',
  },
};
const META_SOURCES = [
  {
    label: '2026 Regulation M-B analytics',
    url: 'https://www.vantagevgc.com/',
  },
  {
    label: '2025 World Championships teams',
    url: 'https://limitlessvgc.com/tournaments/399/teams',
  },
  {
    label: '2017 Toronto Regional top cut',
    url: 'https://www.pokemon.com/us/play-pokemon/regionals/2017/toronto/vg-masters',
  },
  {
    label: '2014–2016 Worlds finalist archive',
    url: 'https://bulbapedia.bulbagarden.net/wiki/User%3ACarbonific/List_of_Pok%C3%A9mon_Video_Game_World_Finalist_Teams',
  },
];
const META_SOURCE_LABEL = 'Cross-format tournament records and competitive usage evidence';
const META_SOURCE_UPDATED = '2009–2026';
const HISTORICAL_CHAMPION_SOURCE = 'https://bulbapedia.bulbagarden.net/wiki/User%3ACarbonific/List_of_Pok%C3%A9mon_Video_Game_World_Finalist_Teams';
const CHAMPION_HISTORY_SOURCE = 'https://www.abyssalruins.com/campeones-mundo-pokemon-vgc/';
const WORLD_CHAMPION_TEAMS = [
  {
    year: 2025,
    champion: 'Giovanni Cischke',
    sourceUrl: 'https://limitlessvgc.com/tournaments/399/teams',
    statsFormat: 'gen9vgc2025',
    pokemon: [
      { name: 'koraidon', moves: ['close-combat', 'flare-blitz', 'flame-charge', 'protect'] },
      { name: 'lunala', moves: ['moongeist-beam', 'meteor-beam', 'wide-guard', 'trick-room'] },
      { name: 'ursaluna', moves: ['headlong-rush', 'facade', 'earthquake', 'protect'] },
      { name: 'chi-yu', moves: ['dark-pulse', 'heat-wave', 'overheat', 'snarl'] },
      { name: 'flutter-mane', moves: ['shadow-ball', 'moonblast', 'icy-wind', 'protect'] },
      { name: 'brute-bonnet', moves: ['seed-bomb', 'sucker-punch', 'spore', 'rage-powder'] },
    ],
  },
  {
    year: 2024,
    champion: 'Luca Ceribelli',
    sourceUrl: 'https://limitlessvgc.com/tournaments/358/teams',
    statsFormat: 'gen9vgc2024',
    pokemon: [
      { name: 'miraidon', moves: ['electro-drift', 'draco-meteor', 'dazzling-gleam', 'volt-switch'] },
      { name: 'urshifu-rapid-strike', species: 'urshifu', moves: ['detect', 'surging-strikes', 'close-combat', 'aqua-jet'] },
      { name: 'whimsicott', moves: ['moonblast', 'encore', 'light-screen', 'tailwind'] },
      { name: 'ogerpon-hearthflame-mask', species: 'ogerpon', moves: ['spiky-shield', 'ivy-cudgel', 'wood-hammer', 'follow-me'] },
      { name: 'iron-hands', moves: ['drain-punch', 'wild-charge', 'fake-out', 'low-kick'] },
      { name: 'farigiraf', moves: ['psychic-noise', 'foul-play', 'helping-hand', 'trick-room'] },
    ],
  },
  {
    year: 2023,
    champion: 'Shohei Kimura',
    sourceUrl: 'https://limitlessvgc.com/tournaments/319/teams',
    statsFormat: 'gen9vgc2023',
    pokemon: [
      { name: 'landorus-therian', species: 'landorus', moves: ['stomping-tantrum', 'tera-blast', 'u-turn', 'protect'] },
      { name: 'urshifu-rapid-strike', species: 'urshifu', moves: ['surging-strikes', 'aqua-jet', 'protect', 'taunt'] },
      { name: 'flutter-mane', moves: ['shadow-ball', 'dazzling-gleam', 'moonblast', 'energy-ball'] },
      { name: 'chien-pao', moves: ['icicle-crash', 'sacred-sword', 'sucker-punch', 'protect'] },
      { name: 'amoonguss', moves: ['pollen-puff', 'spore', 'rage-powder', 'protect'] },
      { name: 'iron-hands', moves: ['wild-charge', 'volt-switch', 'drain-punch', 'fake-out'] },
    ],
  },
  {
    year: 2022,
    champion: 'Eduardo Cunha',
    sourceUrl: CHAMPION_HISTORY_SOURCE,
    statsFormat: 'gen8vgc2022',
    pokemon: [
      { name: 'zacian-crowned', species: 'zacian' },
      { name: 'calyrex-shadow', species: 'calyrex' },
      { name: 'incineroar' },
      { name: 'rillaboom' },
      { name: 'gastrodon' },
      { name: 'thundurus' },
    ],
  },
  { year: 2019, champion: 'Naoto Mizobuchi', sourceUrl: CHAMPION_HISTORY_SOURCE, statsFormat: 'gen7vgc2019', pokemon: [{ name: 'groudon-primal', species: 'groudon' }, { name: 'lunala' }, { name: 'salamence-mega', species: 'salamence' }, { name: 'tapu-fini' }, { name: 'incineroar' }, { name: 'stakataka' }] },
  { year: 2018, champion: 'Paul Ruiz', sourceUrl: CHAMPION_HISTORY_SOURCE, statsFormat: 'gen7vgc2018', pokemon: [{ name: 'salamence-mega', species: 'salamence' }, { name: 'incineroar' }, { name: 'tapu-koko' }, { name: 'snorlax' }, { name: 'kartana' }, { name: 'gastrodon' }] },
  { year: 2017, champion: 'Ryota Otsubo', sourceUrl: CHAMPION_HISTORY_SOURCE, statsFormat: 'gen7vgc2017', pokemon: [{ name: 'tapu-koko' }, { name: 'tapu-fini' }, { name: 'marowak-alola', species: 'marowak' }, { name: 'celesteela' }, { name: 'whimsicott' }, { name: 'krookodile' }] },
  { year: 2016, champion: 'Wolfe Glick', sourceUrl: HISTORICAL_CHAMPION_SOURCE, statsFormat: 'gen6vgc2016', pokemon: [{ name: 'kyogre-primal', species: 'kyogre' }, { name: 'rayquaza-mega', species: 'rayquaza' }, { name: 'hitmontop' }, { name: 'raichu' }, { name: 'gengar-mega', species: 'gengar' }, { name: 'bronzong' }] },
  { year: 2015, champion: 'Shoma Honami', sourceUrl: HISTORICAL_CHAMPION_SOURCE, statsFormat: 'gen6vgc2016', pokemon: [{ name: 'kangaskhan-mega', species: 'kangaskhan' }, { name: 'thundurus' }, { name: 'landorus-therian', species: 'landorus' }, { name: 'cresselia' }, { name: 'heatran' }, { name: 'amoonguss' }] },
  { year: 2014, champion: 'Sejun Park', sourceUrl: HISTORICAL_CHAMPION_SOURCE, statsFormat: 'gen6vgc2016', pokemon: [{ name: 'garchomp' }, { name: 'pachirisu' }, { name: 'talonflame' }, { name: 'gardevoir' }, { name: 'gyarados-mega', species: 'gyarados' }, { name: 'gothitelle' }] },
  { year: 2013, champion: 'Arash Ommati', sourceUrl: HISTORICAL_CHAMPION_SOURCE, statsFormat: 'gen5vgc2011', pokemon: [{ name: 'tornadus' }, { name: 'mamoswine' }, { name: 'amoonguss' }, { name: 'conkeldurr' }, { name: 'latios' }, { name: 'heatran' }] },
  { year: 2012, champion: 'Ray Rizzo', sourceUrl: HISTORICAL_CHAMPION_SOURCE, statsFormat: 'gen5vgc2011', pokemon: [{ name: 'cresselia' }, { name: 'garchomp' }, { name: 'rotom-wash', species: 'rotom' }, { name: 'tyranitar' }, { name: 'metagross' }, { name: 'hydreigon' }] },
  { year: 2011, champion: 'Ray Rizzo', sourceUrl: HISTORICAL_CHAMPION_SOURCE, statsFormat: 'gen5vgc2011', pokemon: [{ name: 'thundurus' }, { name: 'gothitelle' }, { name: 'conkeldurr' }, { name: 'terrakion' }, { name: 'hydreigon' }, { name: 'escavalier' }] },
  { year: 2010, champion: 'Ray Rizzo', sourceUrl: CHAMPION_HISTORY_SOURCE, statsFormat: 'gen4vgc2009', pokemon: [{ name: 'kyogre' }, { name: 'dialga' }, { name: 'groudon' }, { name: 'ludicolo' }, { name: 'cresselia' }, { name: 'hariyama' }] },
  { year: 2009, champion: 'Kazuyuki Tsuji', sourceUrl: HISTORICAL_CHAMPION_SOURCE, statsFormat: 'gen4vgc2009', pokemon: [{ name: 'ludicolo' }, { name: 'toxicroak' }, { name: 'metagross' }, { name: 'snorlax' }, { name: 'salamence' }, { name: 'empoleon' }] },
];

const CURRENT_META_POKEMON = [
  { name: 'kingambit', pokemonId: 983, types: ['dark', 'steel'], metaScore: 100, signal: '38.4% usage across 1,194 tournament teams', role: 'Physical pressure and late-game cleaner' },
  { name: 'basculegion', pokemonId: 902, types: ['water', 'ghost'], metaScore: 96, signal: '32.8% usage across 1,194 tournament teams', role: 'Fast physical or special attacker' },
  { name: 'garchomp', pokemonId: 445, types: ['dragon', 'ground'], metaScore: 92, signal: '29.4% usage across 1,194 tournament teams', role: 'Fast Ground pressure and spread damage' },
  { name: 'incineroar', pokemonId: 727, types: ['fire', 'dark'], metaScore: 90, signal: '28.4% usage across 1,194 tournament teams', role: 'Defensive pivot and disruption' },
  { name: 'scovillain', pokemonId: 952, types: ['grass', 'fire'], metaScore: 86, signal: '60.9% win rate over 87 tracked matches', role: 'Sun attacker and Fire / Water / Grass core' },
  { name: 'venusaur', pokemonId: 3, types: ['grass', 'poison'], metaScore: 82, signal: '11.7% usage and a +13.6 point rise', role: 'Sun speed control and special pressure' },
  { name: 'farigiraf', pokemonId: 981, types: ['normal', 'psychic'], metaScore: 81, signal: '11.5% usage and a +10.8 point rise', role: 'Priority control and Trick Room support', tournamentMoves: ['psychic-noise', 'foul-play', 'helping-hand', 'trick-room'], tournamentMoveLabel: '2024 World Champion team', tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/358/teams' },
  { name: 'grimmsnarl', pokemonId: 861, types: ['dark', 'fairy'], metaScore: 76, signal: '6.5% usage and a +12.5 point rise', role: 'Screens and disruptive support' },
  { name: 'staraptor', pokemonId: 398, types: ['normal', 'flying'], metaScore: 72, signal: '5.3% usage and a +11.4 point rise', role: 'Immediate physical pressure and pivoting' },
  { name: 'chandelure', pokemonId: 609, types: ['ghost', 'fire'], metaScore: 68, signal: '5.7% usage in the current snapshot', role: 'Special attacker and speed-mode option' },
  { name: 'florges', pokemonId: 671, types: ['fairy'], metaScore: 68, signal: '57.7% win rate over 78 tracked matches', role: 'Specially defensive Fairy support' },
  { name: 'primarina', pokemonId: 730, types: ['water', 'fairy'], metaScore: 78, signal: 'Listed among the current meta leader\'s top teammates', role: 'Bulky special Water and Fairy pressure' },
  { name: 'whimsicott', pokemonId: 547, types: ['grass', 'fairy'], metaScore: 74, signal: 'Featured on a published Regulation M-B tournament team', role: 'Tailwind and disruptive speed control', tournamentMoves: ['moonblast', 'encore', 'light-screen', 'tailwind'], tournamentMoveLabel: '2024 World Champion team', tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/358/teams' },
  { name: 'gholdengo', pokemonId: 1000, types: ['steel', 'ghost'], metaScore: 73, signal: 'Featured on a published Regulation M-B tournament team', role: 'Special Steel pressure and disruption resistance' },
  { name: 'excadrill', pokemonId: 530, types: ['ground', 'steel'], metaScore: 72, signal: 'Featured on a published Regulation M-B tournament team', role: 'Sand offense and physical Steel coverage' },
  { name: 'milotic', pokemonId: 350, types: ['water'], metaScore: 70, signal: 'Featured on a published Regulation M-B tournament team', role: 'Bulky Water support and Intimidate deterrent' },
  { name: 'sinistcha', pokemonId: 1013, types: ['grass', 'ghost'], metaScore: 69, signal: 'Featured on a published Regulation M-B tournament team', role: 'Recovery, redirection pressure, and support' },
  { name: 'sylveon', pokemonId: 700, types: ['fairy'], metaScore: 69, signal: 'Featured on a published Regulation M-B tournament team', role: 'Spread Fairy damage and special bulk' },
  { name: 'pelipper', pokemonId: 279, types: ['water', 'flying'], metaScore: 67, signal: 'Rain is a tracked winning core in the current format', role: 'Rain setup and Tailwind support' },
  { name: 'meowscarada', pokemonId: 908, types: ['grass', 'dark'], metaScore: 58, signal: 'Tracked as an emerging Regulation M-B pick', role: 'Fast physical pressure and pivoting' },
  { name: 'charizard', pokemonId: 6, types: ['fire', 'flying'], metaScore: 75, signal: 'Mega Charizard Y appears on published tournament teams', role: 'Sun setup and special Fire pressure', preferredForm: 'charizard-mega-y', eraWarning: 'This evidence is specifically for Mega Charizard Y. Base Charizard does not have Drought, and Mega availability depends on the format.' },
];

const WORLDS_2025_META_POKEMON = [
  { name: 'brute-bonnet', pokemonId: 986, types: ['grass', 'dark'], metaScore: 94, signal: 'Member of the 2025 Masters World Champion team', role: 'Bulky redirection, sleep pressure, and priority damage', tournamentMoves: ['seed-bomb', 'sucker-punch', 'spore', 'rage-powder'] },
  { name: 'lunala', pokemonId: 792, types: ['psychic', 'ghost'], metaScore: 94, signal: 'Member of the 2025 Masters World Champion team', role: 'Restricted special attacker and flexible Trick Room setter', tournamentMoves: ['moongeist-beam', 'meteor-beam', 'wide-guard', 'trick-room'] },
  { name: 'ursaluna', pokemonId: 901, types: ['ground', 'normal'], metaScore: 94, signal: 'Member of the 2025 Masters World Champion team', role: 'High-output physical attacker for balanced or Trick Room teams', tournamentMoves: ['headlong-rush', 'facade', 'earthquake', 'protect'] },
  { name: 'chi-yu', pokemonId: 1004, types: ['dark', 'fire'], metaScore: 94, signal: 'Member of the 2025 Masters World Champion team', role: 'Fast special damage amplifier and Fire pressure', tournamentMoves: ['dark-pulse', 'heat-wave', 'overheat', 'snarl'] },
  { name: 'koraidon', pokemonId: 1007, types: ['fighting', 'dragon'], metaScore: 94, signal: 'Member of the 2025 Masters World Champion team', role: 'Sun-enabling restricted physical attacker', tournamentMoves: ['close-combat', 'flare-blitz', 'flame-charge', 'protect'] },
  { name: 'flutter-mane', pokemonId: 987, types: ['ghost', 'fairy'], metaScore: 94, signal: 'Member of the 2025 Masters World Champion team', role: 'Fast special attacker and speed control option', tournamentMoves: ['shadow-ball', 'moonblast', 'icy-wind', 'protect'] },
  { name: 'raging-bolt', pokemonId: 1021, types: ['electric', 'dragon'], metaScore: 88, signal: 'Appeared repeatedly across the 2025 Worlds top cut', role: 'Bulky special attacker with priority Electric pressure' },
  { name: 'landorus', pokemonId: 645, types: ['ground', 'flying'], metaScore: 87, signal: 'Appeared on the 2025 Worlds runner-up and other top teams', role: 'Ground pressure with immediate special or physical damage', tournamentMoves: ['stomping-tantrum', 'tera-blast', 'u-turn', 'protect'], tournamentMoveLabel: '2023 World Champion team', tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/319/teams', eraWarning: 'The recorded 2023 World Champion set used Therian Forme with Intimidate. The planner currently loads base Landorus, whose ability and stats differ.' },
  { name: 'rillaboom', pokemonId: 812, types: ['grass'], metaScore: 87, signal: 'Appeared repeatedly across the 2025 Worlds top cut', role: 'Terrain control, Fake Out support, and priority damage' },
  { name: 'dragonite', pokemonId: 149, types: ['dragon', 'flying'], metaScore: 86, signal: 'Appeared repeatedly across the 2025 Worlds top cut', role: 'Priority physical attacker with flexible defensive utility' },
  { name: 'chien-pao', pokemonId: 1002, types: ['dark', 'ice'], metaScore: 86, signal: 'Appeared repeatedly across the 2025 Worlds top cut', role: 'Fast physical pressure and partner damage amplification', tournamentMoves: ['icicle-crash', 'sacred-sword', 'sucker-punch', 'protect'], tournamentMoveLabel: '2023 World Champion team', tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/319/teams' },
  { name: 'miraidon', pokemonId: 1008, types: ['electric', 'dragon'], metaScore: 85, signal: 'Reached the 2025 Worlds top cut', role: 'Electric Terrain and restricted special offense', tournamentMoves: ['electro-drift', 'draco-meteor', 'dazzling-gleam', 'volt-switch'], tournamentMoveLabel: '2024 World Champion team', tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/358/teams' },
  { name: 'amoonguss', pokemonId: 591, types: ['grass', 'poison'], metaScore: 85, signal: 'Appeared repeatedly across the 2025 Worlds top cut', role: 'Redirection, sleep, and regenerative defensive support', tournamentMoves: ['pollen-puff', 'spore', 'rage-powder', 'protect'], tournamentMoveLabel: '2023 World Champion team', tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/319/teams' },
  { name: 'clefairy', pokemonId: 35, types: ['fairy'], metaScore: 82, signal: 'Reached the 2025 Worlds top cut', role: 'Friend Guard redirection and partner support' },
  { name: 'volcarona', pokemonId: 637, types: ['bug', 'fire'], metaScore: 78, signal: 'Reached the upper tables at the 2025 World Championships', role: 'Setup-oriented special attacker and burn pressure' },
  { name: 'regieleki', pokemonId: 894, types: ['electric'], metaScore: 77, signal: 'Reached the upper tables at the 2025 World Championships', role: 'Extreme speed control and Electric offense', eraWarning: 'Transistor was reduced from a 1.5× Electric-type boost to 1.3× starting in Generation IX, so older damage expectations are too high.' },
  { name: 'iron-treads', pokemonId: 990, types: ['ground', 'steel'], metaScore: 77, signal: 'Reached the upper tables at the 2025 World Championships', role: 'Fast physical Ground and Steel pressure' },
  { name: 'ho-oh', pokemonId: 250, types: ['fire', 'flying'], metaScore: 77, signal: 'Reached the upper tables at the 2025 World Championships', role: 'Bulky restricted attacker with long-game recovery' },
  { name: 'ogerpon', pokemonId: 1017, types: ['grass'], metaScore: 76, signal: 'Multiple mask forms appeared at the 2025 World Championships', role: 'Fast Follow Me support and flexible physical offense', tournamentMoves: ['spiky-shield', 'ivy-cudgel', 'wood-hammer', 'follow-me'], tournamentMoveLabel: '2024 World Champion team', tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/358/teams', eraWarning: 'The recorded 2024 World Champion set used Hearthflame Mask Ogerpon. Its typing and ability differ from base Teal Mask Ogerpon.' },
];

const WORLDS_2025_FIELD_POKEMON = [
  { name: 'sneasler', pokemonId: 903, types: ['fighting', 'poison'], metaScore: 76, signal: 'Appeared in the published 2025 Worlds field outside the finalist teams', role: 'Fast physical pressure with status and Unburden options' },
  { name: 'ditto', pokemonId: 132, types: ['normal'], metaScore: 72, signal: 'Appeared in the published 2025 Worlds field outside the finalist teams', role: 'Choice Scarf revenge option that copies opposing win conditions' },
  { name: 'terapagos', pokemonId: 1024, types: ['normal'], metaScore: 75, signal: 'Reached 25th at the 2025 World Championships', role: 'Restricted setup attacker with wide neutral pressure' },
  { name: 'ting-lu', pokemonId: 1003, types: ['dark', 'ground'], metaScore: 72, signal: 'Reached the upper tables at the 2025 World Championships', role: 'Special-damage suppression and durable Ground pressure' },
  { name: 'roaring-moon', pokemonId: 1005, types: ['dragon', 'dark'], metaScore: 72, signal: 'Reached the upper tables at the 2025 World Championships', role: 'Fast physical offense and flexible Tailwind support' },
  { name: 'iron-hands', pokemonId: 992, types: ['fighting', 'electric'], metaScore: 72, signal: 'Appeared in the published 2025 Worlds field outside the top cut', role: 'Bulky Fake Out support and sustained physical pressure', tournamentMoves: ['drain-punch', 'wild-charge', 'fake-out', 'low-kick'], tournamentMoveLabel: '2024 World Champion team', tournamentMoveUrl: 'https://limitlessvgc.com/tournaments/358/teams' },
  { name: 'iron-bundle', pokemonId: 991, types: ['ice', 'water'], metaScore: 70, signal: 'Appeared in the published 2025 Worlds field outside the top cut', role: 'Fast Icy Wind control and Water / Ice coverage' },
  { name: 'torkoal', pokemonId: 324, types: ['fire'], metaScore: 70, signal: 'Appeared in the published 2025 Worlds field outside the top cut', role: 'Sun setup and slow spread Fire damage' },
  { name: 'tornadus', pokemonId: 641, types: ['flying'], metaScore: 70, signal: 'Appeared in the published 2025 Worlds field outside the top cut', role: 'Priority Tailwind, weather support, and spread Flying pressure' },
  { name: 'groudon', pokemonId: 383, types: ['ground'], metaScore: 70, signal: 'Appeared in the published 2025 Worlds field outside the top cut', role: 'Sun-setting restricted physical attacker' },
  { name: 'vivillon', pokemonId: 666, types: ['bug', 'flying'], metaScore: 66, signal: 'Appeared in the published 2025 Worlds field outside the top cut', role: 'Fast sleep, redirection, and Tailwind utility' },
];

const TORONTO_2017_META_POKEMON = [
  { name: 'tapu-koko', pokemonId: 785, types: ['electric', 'fairy'], metaScore: 84, signal: 'Member of the 2017 Toronto Regional Masters champion team', role: 'Fast Electric Terrain offense and disruption', tournamentMoves: ['thunderbolt', 'dazzling-gleam', 'taunt', 'protect'] },
  { name: 'celesteela', pokemonId: 797, types: ['steel', 'flying'], metaScore: 84, signal: 'Member of the 2017 Toronto Regional Masters champion team', role: 'Bulky Steel win condition and defensive pivot', tournamentMoves: ['heavy-slam', 'flamethrower', 'leech-seed', 'protect'] },
  { name: 'snorlax', pokemonId: 143, types: ['normal'], metaScore: 84, signal: 'Member of the 2017 Toronto Regional Masters champion team', role: 'Bulky setup attacker and Trick Room win condition', tournamentMoves: ['return', 'high-horsepower', 'curse', 'recycle'] },
  { name: 'arcanine', pokemonId: 59, types: ['fire'], metaScore: 84, signal: 'Member of the 2017 Toronto Regional Masters champion team', role: 'Intimidate support and flexible Fire pressure', tournamentMoves: ['flare-blitz', 'will-o-wisp', 'snarl', 'roar'] },
  { name: 'hariyama', pokemonId: 297, types: ['fighting'], metaScore: 79, signal: 'Reached the 2017 Toronto Regional Masters final', role: 'Slow Fake Out support and Fighting pressure' },
  { name: 'xurkitree', pokemonId: 796, types: ['electric'], metaScore: 79, signal: 'Reached the 2017 Toronto Regional Masters final', role: 'Special Electric sweeper and setup threat' },
  { name: 'tapu-fini', pokemonId: 788, types: ['water', 'fairy'], metaScore: 79, signal: 'Reached the 2017 Toronto Regional Masters final', role: 'Bulky terrain control and Water / Fairy pressure' },
  { name: 'smeargle', pokemonId: 235, types: ['normal'], metaScore: 76, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Unpredictable utility, redirection, and speed control' },
  { name: 'nihilego', pokemonId: 793, types: ['rock', 'poison'], metaScore: 76, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Fast special Rock and Poison attacker' },
  { name: 'tapu-lele', pokemonId: 786, types: ['psychic', 'fairy'], metaScore: 76, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Psychic Terrain and immediate special pressure' },
  { name: 'pheromosa', pokemonId: 795, types: ['bug', 'fighting'], metaScore: 76, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Extremely fast mixed offense' },
  { name: 'gigalith', pokemonId: 526, types: ['rock'], metaScore: 75, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Sand setup and slow Rock offense' },
  { name: 'kartana', pokemonId: 798, types: ['grass', 'steel'], metaScore: 75, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Fast physical attacker with snowball potential' },
  { name: 'porygon2', pokemonId: 233, types: ['normal'], metaScore: 75, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Durable Trick Room and coverage support' },
  { name: 'tapu-bulu', pokemonId: 787, types: ['grass', 'fairy'], metaScore: 74, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Grassy Terrain and physical Grass pressure' },
  { name: 'araquanid', pokemonId: 752, types: ['water', 'bug'], metaScore: 74, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Slow, powerful Water attacker with special bulk' },
  { name: 'gyarados', pokemonId: 130, types: ['water', 'flying'], metaScore: 74, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Intimidate, setup pressure, and physical Water offense' },
  { name: 'machamp', pokemonId: 68, types: ['fighting'], metaScore: 73, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Accurate high-impact Fighting attacks and disruption' },
  { name: 'golduck', pokemonId: 55, types: ['water'], metaScore: 72, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Rain-enabled fast special Water offense' },
  { name: 'buzzwole', pokemonId: 794, types: ['bug', 'fighting'], metaScore: 72, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Physically bulky Fighting attacker' },
  { name: 'vanilluxe', pokemonId: 584, types: ['ice'], metaScore: 71, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Snow setup and spread Ice pressure' },
  { name: 'mimikyu', pokemonId: 778, types: ['ghost', 'fairy'], metaScore: 71, signal: 'Reached the 2017 Toronto Regional Masters top cut', role: 'Reliable setup, Trick Room, and Fairy pressure' },
];

const HISTORICAL_WORLDS_META_POKEMON = [
  { name: 'pachirisu', pokemonId: 417, types: ['electric'], metaScore: 92, signal: 'Member of the 2014 Masters World Champion team', role: 'Redirection, disruption, and defensive support' },
  { name: 'talonflame', pokemonId: 663, types: ['fire', 'flying'], metaScore: 90, signal: 'Member of the 2014 Masters World Champion team', role: 'Priority speed control and immediate Flying pressure', eraWarning: 'Gale Wings granted priority to Flying moves at any HP in Generation VI; since Generation VII it only works at full HP.' },
  { name: 'gardevoir', pokemonId: 282, types: ['psychic', 'fairy'], metaScore: 90, signal: 'Member of the 2014 Masters World Champion team', role: 'Special spread damage and flexible speed modes' },
  { name: 'gothitelle', pokemonId: 576, types: ['psychic'], metaScore: 90, signal: 'Member of the 2014 Masters World Champion team', role: 'Position control, trapping, and Trick Room support' },
  { name: 'kangaskhan', pokemonId: 115, types: ['normal'], metaScore: 93, signal: 'Member of the 2015 Masters World Champion team', role: 'High-pressure physical attacker and Fake Out support', preferredForm: 'kangaskhan-mega', eraWarning: 'This result relied on Mega Kangaskhan. Parental Bond’s second hit fell from 50% to 25% power in Generation VII, and Mega availability depends on the format.' },
  { name: 'thundurus', pokemonId: 642, types: ['electric', 'flying'], metaScore: 93, signal: 'Member of the 2015 Masters World Champion team', role: 'Priority disruption and Electric offense', eraWarning: 'Since Generation VII, Prankster-boosted status moves fail against opposing Dark-type Pokémon.' },
  { name: 'cresselia', pokemonId: 488, types: ['psychic'], metaScore: 93, signal: 'Member of the 2015 Masters World Champion team', role: 'Bulky speed control and team support' },
  { name: 'heatran', pokemonId: 485, types: ['fire', 'steel'], metaScore: 93, signal: 'Member of the 2015 Masters World Champion team', role: 'Bulky special Fire and Steel attacker' },
  { name: 'rayquaza', pokemonId: 384, types: ['dragon', 'flying'], metaScore: 95, signal: 'Member of the 2016 Masters World Champion team', role: 'Restricted mixed attacker and weather control', preferredForm: 'rayquaza-mega' },
  { name: 'kyogre', pokemonId: 382, types: ['water'], metaScore: 95, signal: 'Member of the 2016 Masters World Champion team', role: 'Rain-setting restricted special attacker', preferredForm: 'kyogre-primal' },
  { name: 'hitmontop', pokemonId: 237, types: ['fighting'], metaScore: 95, signal: 'Member of the 2016 Masters World Champion team', role: 'Intimidate, Fake Out, and wide-guard support' },
  { name: 'gengar', pokemonId: 94, types: ['ghost', 'poison'], metaScore: 95, signal: 'Member of the 2016 Masters World Champion team', role: 'Fast disruption and special offense', preferredForm: 'gengar-mega', eraWarning: 'Regular Gengar had Levitate through Generation VI, but has Cursed Body from Generation VII onward. The cited 2016 champion used Mega Gengar’s Shadow Tag, and Mega availability is format-specific.' },
  { name: 'raichu', pokemonId: 26, types: ['electric'], metaScore: 95, signal: 'Member of the 2016 Masters World Champion team', role: 'Lightning Rod, Fake Out, and speed control' },
  { name: 'bronzong', pokemonId: 437, types: ['steel', 'psychic'], metaScore: 95, signal: 'Member of the 2016 Masters World Champion team', role: 'Trick Room, weather support, and defensive utility' },
];

const withMetaSource = (candidates, format, source) => candidates.map((candidate) => ({
  ...candidate,
  format,
  sourceLabel: source.label,
  sourceUrl: source.url,
}));

const META_POKEMON = [
  ...withMetaSource(CURRENT_META_POKEMON, 'Regulation M-B (2026)', META_SOURCES[0]),
  ...withMetaSource(WORLDS_2025_META_POKEMON, 'World Championships 2025', META_SOURCES[1]),
  ...withMetaSource(WORLDS_2025_FIELD_POKEMON, 'World Championships 2025 field', META_SOURCES[1]),
  ...withMetaSource(TORONTO_2017_META_POKEMON, 'VGC 2017', META_SOURCES[2]),
  ...withMetaSource(HISTORICAL_WORLDS_META_POKEMON, 'World Championships 2014–2016', META_SOURCES[3]),
];

const compactCompetitiveName = (value = '') => normalizeSearchText(value).replace(/\s+/g, '');

const getMovesForVersionGroup = (pokemon, versionGroup) => pokemon.moves
  .map((move) => {
    const versionDetails = move.version_group_details.filter(
      (detail) => detail.version_group.name === versionGroup,
    );
    if (!versionDetails.length) return null;

    const levelUpDetail = versionDetails.find(
      (detail) => detail.move_learn_method.name === 'level-up',
    );
    return {
      name: move.move.name,
      url: move.move.url,
      level: levelUpDetail?.level_learned_at ?? null,
      learnMethod: levelUpDetail ? 'level-up' : versionDetails[0].move_learn_method.name,
    };
  })
  .filter(Boolean);

const getEffectiveMoveVersionGroup = (
  pokemon,
  selectedDex,
  activeVersionGroup,
  metaCandidate,
  enforceActiveVersionGroup = false,
) => {
  const evidenceVersionGroup = COMPETITIVE_FORMAT_VERSION_GROUPS[metaCandidate?.statsFormat];
  const requestedVersionGroup = !enforceActiveVersionGroup && selectedDex === ALL_POKEDEX_OPTION.id && evidenceVersionGroup
    ? evidenceVersionGroup
    : activeVersionGroup;

  if (getMovesForVersionGroup(pokemon, requestedVersionGroup).length) {
    return requestedVersionGroup;
  }

  if (selectedDex !== ALL_POKEDEX_OPTION.id || enforceActiveVersionGroup) {
    return requestedVersionGroup;
  }

  return NATIONAL_FORM_MOVE_GROUPS.find(
    (versionGroup) => getMovesForVersionGroup(pokemon, versionGroup).length,
  ) || requestedVersionGroup;
};

const findCompetitiveStatsEntry = (statsData, pokemon, metaCandidate) => {
  const aliases = [
    metaCandidate?.statsPokemonName,
    metaCandidate?.competitiveForm,
    pokemon.name,
    pokemon.species?.name,
  ].filter(Boolean).map(compactCompetitiveName);
  const entries = Object.entries(statsData?.pokemon || {});

  return entries.find(([name]) => aliases.includes(compactCompetitiveName(name))) ||
    entries.find(([name]) => aliases.some((alias) => compactCompetitiveName(name).startsWith(alias)));
};

const getCompetitiveMoveSuggestions = async ({
  pokemon,
  metaCandidate,
  selectedDex,
  activeVersionGroup,
}) => {
  const compatibleMoves = getMovesForVersionGroup(pokemon, activeVersionGroup);
  const compatibleMoveMap = new Map(compatibleMoves.map((move) => [move.name, move]));
  const tournamentMoves = (metaCandidate?.tournamentMoves || [])
    .map((moveName) => compatibleMoveMap.get(moveName))
    .filter(Boolean)
    .map((move) => ({ ...move, recommendationSource: 'Tournament set' }));

  const configuredFormats = COMPETITIVE_MOVE_FORMATS[selectedDex] || {};
  const statsFormat = metaCandidate
    ? metaCandidate.statsFormat || configuredFormats.vgc
    : configuredFormats.singles;
  let usageMoves = [];
  let usageNature = null;

  if (statsFormat) {
    try {
      const statsData = await fetchPokeApiJson(
        `${COMPETITIVE_STATS_BASE_URL}/${statsFormat}.json`,
        {},
        'Unable to load competitive move usage.',
      );
      const statsEntry = findCompetitiveStatsEntry(statsData, pokemon, metaCandidate)?.[1];
      if (tournamentMoves.length < 4) {
        usageMoves = Object.entries(statsEntry?.moves || {})
          .filter(([moveName, usage]) => moveName !== 'Other' && Number.isFinite(Number(usage)))
          .sort((firstMove, secondMove) => Number(secondMove[1]) - Number(firstMove[1]))
          .map(([moveName, usage]) => ({
            move: compatibleMoveMap.get(normalizePokemonLookup(moveName)),
            usage: Number(usage),
          }))
          .filter(({ move }) => Boolean(move))
          .map(({ move, usage }) => ({
            ...move,
            usage,
            recommendationSource: metaCandidate ? 'VGC usage' : 'Smogon usage',
          }));
      }
      const spreadEntry = Object.entries(statsEntry?.spreads || {})
        .filter(([, usage]) => Number(usage) > 0)
        .sort((firstSpread, secondSpread) => Number(secondSpread[1]) - Number(firstSpread[1]))
        .find(([spreadName]) => NATURES[normalizePokemonLookup(spreadName.split(':')[0])]);
      if (spreadEntry) {
        usageNature = {
          name: normalizePokemonLookup(spreadEntry[0].split(':')[0]),
          usage: Number(spreadEntry[1]),
        };
      }
    } catch {
      usageMoves = [];
    }
  }

  const suggestions = [...tournamentMoves, ...usageMoves]
    .filter((move, index, moves) => moves.findIndex((candidate) => candidate.name === move.name) === index)
    .slice(0, 8);
  const statsLabel = COMPETITIVE_FORMAT_LABELS[statsFormat] || statsFormat?.replace(/^gen(\d+)/, 'Gen $1 ').toUpperCase();
  let moveSource = null;

  if (tournamentMoves.length) {
    moveSource = {
      label: `${metaCandidate.tournamentMoveLabel || metaCandidate.format} published tournament set`,
      url: metaCandidate.tournamentMoveUrl || metaCandidate.sourceUrl,
    };
  } else if (usageMoves.length) {
    moveSource = {
      label: metaCandidate ? `${statsLabel} usage moves` : `${statsLabel} Smogon usage moves`,
      url: `${COMPETITIVE_STATS_BASE_URL}/${statsFormat}.json`,
    };
  }

  const usageSource = {
    label: metaCandidate ? `${statsLabel} usage evidence` : `${statsLabel} Smogon usage evidence`,
    url: `${COMPETITIVE_STATS_BASE_URL}/${statsFormat}.json`,
  };
  const natureRecommendation = metaCandidate?.tournamentNature ? {
    name: normalizePokemonLookup(metaCandidate.tournamentNature),
    source: {
      label: metaCandidate.tournamentNatureLabel || `${metaCandidate.format} published tournament set`,
      url: metaCandidate.tournamentNatureUrl || metaCandidate.sourceUrl,
    },
  } : usageNature ? { ...usageNature, source: usageSource } : null;

  return { suggestions, moveSource, natureRecommendation };
};

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const calculateTeamScore = (teamMembers, metaPokemonPool) => {
  if (!teamMembers.length) {
    return { total: 0, defense: 0, offense: 0, variety: 0, readiness: 0, meta: 0, power: 0 };
  }

  const defensiveExposure = summarizeTeamTypeMatchups(teamMembers).reduce((total, matchup) =>
    total + Math.max(0, matchup.weak - matchup.resist - matchup.immune),
  0);
  const coveredTypes = summarizeTeamMoveCoverage(teamMembers).length;
  const uniqueTypes = new Set(teamMembers.flatMap((member) => member.types));
  const metaScores = teamMembers.map((member) => member.metaContext?.metaScore ||
    metaPokemonPool.find((candidate) => candidate.name === (member.speciesName || member.name))?.metaScore || 0);
  const defense = clampScore(100 - defensiveExposure * 12);
  const offense = clampScore((coveredTypes / TYPE_NAMES.length) * 100);
  const variety = clampScore((uniqueTypes.size / Math.min(12, teamMembers.length * 2)) * 100);
  const readiness = clampScore((teamMembers.length / 6) * 100);
  const meta = clampScore(metaScores.reduce((sum, score) => sum + score, 0) / teamMembers.length);
  const averageBaseStatTotal = teamMembers.reduce(
    (total, member) => total + member.baseStatTotal,
    0,
  ) / teamMembers.length;
  const power = clampScore(((averageBaseStatTotal - 300) / 420) * 100);

  return {
    defense,
    offense,
    variety,
    readiness,
    meta,
    power,
    total: clampScore(
      defense * 0.25 +
      offense * 0.25 +
      variety * 0.15 +
      readiness * 0.15 +
      meta * 0.1 +
      power * 0.1,
    ),
  };
};

const formatScoreChange = (value) => value > 0 ? `+${value}` : String(value);

const NATURES = {
  hardy: { increased: null, decreased: null }, lonely: { increased: 'attack', decreased: 'defense' },
  brave: { increased: 'attack', decreased: 'speed' }, adamant: { increased: 'attack', decreased: 'special-attack' },
  naughty: { increased: 'attack', decreased: 'special-defense' }, bold: { increased: 'defense', decreased: 'attack' },
  docile: { increased: null, decreased: null }, relaxed: { increased: 'defense', decreased: 'speed' },
  impish: { increased: 'defense', decreased: 'special-attack' }, lax: { increased: 'defense', decreased: 'special-defense' },
  timid: { increased: 'speed', decreased: 'attack' }, hasty: { increased: 'speed', decreased: 'defense' },
  serious: { increased: null, decreased: null }, jolly: { increased: 'speed', decreased: 'special-attack' },
  naive: { increased: 'speed', decreased: 'special-defense' }, modest: { increased: 'special-attack', decreased: 'attack' },
  mild: { increased: 'special-attack', decreased: 'defense' }, quiet: { increased: 'special-attack', decreased: 'speed' },
  bashful: { increased: null, decreased: null }, rash: { increased: 'special-attack', decreased: 'special-defense' },
  calm: { increased: 'special-defense', decreased: 'attack' }, gentle: { increased: 'special-defense', decreased: 'defense' },
  sassy: { increased: 'special-defense', decreased: 'speed' }, careful: { increased: 'special-defense', decreased: 'special-attack' },
  quirky: { increased: null, decreased: null },
};

const applyNatureToStats = (baseStats, natureName) => {
  const nature = NATURES[natureName] || NATURES.hardy;
  return Object.fromEntries(Object.entries(baseStats).map(([statName, value]) => {
    if (statName === nature.increased) return [statName, Math.floor(value * 1.1)];
    if (statName === nature.decreased) return [statName, Math.floor(value * 0.9)];
    return [statName, value];
  }));
};

const getNatureSummary = (natureName) => {
  const nature = NATURES[natureName] || NATURES.hardy;
  return nature.increased
    ? `+${formatPokemonName(nature.increased)} / -${formatPokemonName(nature.decreased)}`
    : 'No stat changes';
};

const chooseFallbackNature = (stats, moves) => {
  const hasPhysical = moves.some((move) => move.damageClass === 'physical');
  const hasSpecial = moves.some((move) => move.damageClass === 'special');
  if (hasPhysical && (!hasSpecial || stats.attack >= stats['special-attack'])) {
    return stats.speed >= 90 ? 'jolly' : 'adamant';
  }
  if (hasSpecial) return stats.speed >= 90 ? 'timid' : 'modest';
  return stats.defense >= stats['special-defense'] ? 'bold' : 'calm';
};

const RESTRICTED_SPECIES = new Set([
  'mewtwo', 'lugia', 'ho-oh', 'kyogre', 'groudon', 'rayquaza', 'dialga', 'palkia', 'giratina',
  'reshiram', 'zekrom', 'kyurem', 'xerneas', 'yveltal', 'zygarde', 'cosmog', 'cosmoem',
  'solgaleo', 'lunala', 'necrozma', 'zacian', 'zamazenta', 'eternatus', 'calyrex',
  'koraidon', 'miraidon', 'terapagos',
]);
const MYTHICAL_SPECIES = new Set([
  'mew', 'celebi', 'jirachi', 'deoxys', 'phione', 'manaphy', 'darkrai', 'shaymin', 'arceus',
  'victini', 'keldeo', 'meloetta', 'genesect', 'diancie', 'hoopa', 'volcanion', 'magearna',
  'marshadow', 'zeraora', 'meltan', 'melmetal', 'zarude', 'pecharunt',
]);

const BATTLE_FORMATS = [
  {
    id: 'open',
    label: 'Open Planning',
    battleStyle: 'flexible',
    speciesClause: false,
    restrictedLimit: Infinity,
    allowMythical: true,
    allowLegacyForms: true,
    description: 'No composition restrictions; useful for casual and historical teams.',
  },
  {
    id: 'singles-species',
    label: 'Singles — Species Clause',
    battleStyle: 'singles',
    speciesClause: true,
    restrictedLimit: Infinity,
    allowMythical: true,
    allowLegacyForms: true,
    description: 'One of each species, using the selected game Pokédex and learnset.',
  },
  {
    id: 'vgc-no-restricted',
    label: 'VGC Doubles — No Restricted',
    battleStyle: 'doubles',
    speciesClause: true,
    restrictedLimit: 0,
    allowMythical: false,
    allowLegacyForms: false,
    description: 'Species Clause, no restricted or mythical Pokémon, and no Mega or Primal forms.',
  },
  {
    id: 'vgc-two-restricted',
    label: 'VGC Doubles — Up to 2 Restricted',
    battleStyle: 'doubles',
    speciesClause: true,
    restrictedLimit: 2,
    allowMythical: false,
    allowLegacyForms: false,
    description: 'Species Clause, at most two restricted Pokémon, no mythicals, and no Mega or Primal forms.',
  },
];

const LEGACY_FORM_MARKERS = ['-mega', '-primal'];
const isLegacyBattleForm = (pokemonName = '') =>
  LEGACY_FORM_MARKERS.some((marker) => pokemonName.includes(marker));
const getSpeciesName = (pokemon) => pokemon.speciesName || pokemon.name;
const isRestrictedPokemon = (pokemon) => RESTRICTED_SPECIES.has(getSpeciesName(pokemon));
const isCandidateAllowedForFormat = (candidate, members, format) => {
  const candidateName = getSpeciesName(candidate);
  if (!format.allowLegacyForms && isLegacyBattleForm(candidate.preferredForm || candidate.competitiveForm || candidate.name)) {
    return false;
  }
  if (!format.allowMythical && MYTHICAL_SPECIES.has(candidateName)) return false;
  if (!RESTRICTED_SPECIES.has(candidateName)) return true;
  if (format.restrictedLimit === 0) return false;

  const restrictedCount = members.filter(isRestrictedPokemon).length;
  return restrictedCount < format.restrictedLimit || (members.length >= 6 && restrictedCount > 0);
};

const getTeamLegalityIssues = (members, format) => {
  const issues = [];
  const speciesCounts = members.reduce((counts, member) => {
    const speciesName = getSpeciesName(member);
    counts.set(speciesName, (counts.get(speciesName) || 0) + 1);
    return counts;
  }, new Map());

  if (format.speciesClause) {
    [...speciesCounts.entries()]
      .filter(([, count]) => count > 1)
      .forEach(([speciesName]) => issues.push(`${formatPokemonName(speciesName)} appears more than once.`));
  }

  const restrictedCount = members.filter(isRestrictedPokemon).length;
  if (restrictedCount > format.restrictedLimit) {
    issues.push(`This format allows ${format.restrictedLimit} restricted Pokémon; the team has ${restrictedCount}.`);
  }

  if (!format.allowMythical) {
    members.filter((member) => member.isMythical).forEach((member) =>
      issues.push(`${formatPokemonName(member.name)} is mythical and is not allowed.`),
    );
  }

  if (!format.allowLegacyForms) {
    members.filter((member) => isLegacyBattleForm(member.name)).forEach((member) =>
      issues.push(`${formatPokemonName(member.name)} is not available in this VGC profile.`),
    );
  }

  members.forEach((member) => {
    if (member.selectedAbilityName && !member.abilities.some((ability) => ability.name === member.selectedAbilityName)) {
      issues.push(`${formatPokemonName(member.name)} has an invalid ability selection.`);
    }
    const availableMoveNames = new Set(member.availableMoves.map((move) => move.name));
    if (member.selectedMoves.some((moveName) => moveName && !availableMoveNames.has(moveName))) {
      issues.push(`${formatPokemonName(member.name)} has a move outside its loaded game learnset.`);
    }
  });

  return issues;
};

const ROLE_DEFINITIONS = [
  { id: 'physical-offense', label: 'Physical offense' },
  { id: 'special-offense', label: 'Special offense' },
  { id: 'speed-control', label: 'Speed control' },
  { id: 'disruption', label: 'Disruption' },
  { id: 'defensive-support', label: 'Defensive support' },
  { id: 'field-control', label: 'Weather / terrain' },
];
const ROLE_MOVE_GROUPS = {
  'speed-control': new Set(['tailwind', 'trick-room', 'icy-wind', 'electroweb', 'thunder-wave', 'glare', 'quash']),
  disruption: new Set(['fake-out', 'taunt', 'encore', 'spore', 'will-o-wisp', 'snarl', 'parting-shot', 'disable']),
  'defensive-support': new Set(['follow-me', 'rage-powder', 'wide-guard', 'quick-guard', 'reflect', 'light-screen', 'aurora-veil', 'helping-hand', 'pollen-puff', 'life-dew']),
  'field-control': new Set(['rain-dance', 'sunny-day', 'sandstorm', 'snowscape', 'electric-terrain', 'grassy-terrain', 'misty-terrain', 'psychic-terrain']),
};
const FIELD_CONTROL_ABILITIES = new Set([
  'drizzle', 'drought', 'sand-stream', 'snow-warning', 'electric-surge', 'grassy-surge',
  'misty-surge', 'psychic-surge', 'orichalcum-pulse', 'hadron-engine',
]);

const getMemberRoleIds = (member) => {
  const roles = new Set();
  const selectedMoves = member.selectedMoves
    .map((moveName) => member.availableMoves.find((move) => move.name === moveName))
    .filter(Boolean);
  if (selectedMoves.some((move) => move.damageClass === 'physical')) roles.add('physical-offense');
  if (selectedMoves.some((move) => move.damageClass === 'special')) roles.add('special-offense');
  Object.entries(ROLE_MOVE_GROUPS).forEach(([roleId, moves]) => {
    if (selectedMoves.some((move) => moves.has(move.name))) roles.add(roleId);
  });
  if (FIELD_CONTROL_ABILITIES.has(member.selectedAbilityName)) roles.add('field-control');
  if (member.selectedAbilityName === 'intimidate' || member.selectedAbilityName === 'friend-guard') {
    roles.add('defensive-support');
  }
  return roles;
};

const getCandidateRoleIds = (candidate) => {
  const searchableRole = `${candidate.role || ''} ${(candidate.tournamentMoves || []).join(' ')}`.toLowerCase();
  const roles = new Set();
  if (/physical|mixed attacker|physical pressure/.test(searchableRole)) roles.add('physical-offense');
  if (/special|mixed attacker|special pressure/.test(searchableRole)) roles.add('special-offense');
  if (/speed control|tailwind|trick room|icy wind/.test(searchableRole)) roles.add('speed-control');
  if (/disrupt|fake out|sleep|spore|taunt|snarl|status/.test(searchableRole)) roles.add('disruption');
  if (/support|redirection|follow me|rage powder|screens|wide guard|recovery/.test(searchableRole)) roles.add('defensive-support');
  if (/weather|rain|sun|sand|snow|terrain/.test(searchableRole)) roles.add('field-control');
  return roles;
};

const VERSION_GROUP_GENERATIONS = {
  'firered-leafgreen': 3,
  emerald: 3,
  'heartgold-soulsilver': 4,
  platinum: 4,
  'black-white': 5,
  'omega-ruby-alpha-sapphire': 6,
  'sun-moon': 7,
  'ultra-sun-ultra-moon': 7,
  'sword-shield': 8,
  'scarlet-violet': 9,
};

const getCandidateEvidenceGeneration = (candidate) => {
  const statsGeneration = Number(candidate.statsFormat?.match(/^gen(\d+)/)?.[1]);
  if (statsGeneration) return statsGeneration;
  const evidenceText = `${candidate.format || ''} ${candidate.signal || ''}`;
  const year = Number(evidenceText.match(/20\d{2}/)?.[0]);
  if (year >= 2023) return 9;
  if (year >= 2020) return 8;
  if (year >= 2017) return 7;
  if (year >= 2014) return 6;
  if (year >= 2011) return 5;
  return null;
};

const getEvidenceAlignment = (candidate, battleFormat, targetGeneration) => {
  const evidenceGeneration = getCandidateEvidenceGeneration(candidate);
  const generationDistance = evidenceGeneration ? Math.abs(targetGeneration - evidenceGeneration) : null;
  const styleAdjustment = battleFormat.battleStyle === 'singles'
    ? -12
    : battleFormat.battleStyle === 'doubles'
      ? 12
      : 4;
  const generationAdjustment = generationDistance === 0
    ? 14
    : generationDistance === 1
      ? 5
      : generationDistance === null
        ? 0
        : -Math.min(14, generationDistance * 4);
  const score = styleAdjustment + generationAdjustment;
  const styleLabel = battleFormat.battleStyle === 'singles' ? 'cross-format doubles' : 'doubles';
  const generationLabel = generationDistance === 0
    ? 'same-generation'
    : generationDistance === null
      ? 'generation-unspecified'
      : `${generationDistance}-generation gap`;
  return {
    score,
    label: battleFormat.battleStyle === 'flexible'
      ? `${generationLabel} evidence`
      : `${generationLabel} ${styleLabel} evidence`,
    evidenceGeneration,
  };
};

const chooseDefaultMoves = (availableMoves) => {
  const rankedMoves = [...availableMoves].sort((firstMove, secondMove) =>
    Number(secondMove.power || 0) - Number(firstMove.power || 0) ||
    secondMove.level - firstMove.level ||
    firstMove.name.localeCompare(secondMove.name),
  );
  const selectedMoves = [];
  const selectedTypes = new Set();

  rankedMoves.forEach((move) => {
    if (selectedMoves.length >= 4 || selectedTypes.has(move.type)) return;
    selectedMoves.push(move.name);
    selectedTypes.add(move.type);
  });
  rankedMoves.forEach((move) => {
    if (selectedMoves.length < 4 && !selectedMoves.includes(move.name)) selectedMoves.push(move.name);
  });

  return selectedMoves;
};

const chooseGapAwareMetaCandidates = ({
  candidates,
  currentMembers,
  moveTypeCoverage,
  openSlots,
  typeChart,
}) => {
  const plannedMembers = [...currentMembers];
  const selectedCandidates = [];
  const remainingCandidates = [...candidates];
  const coveredTypes = new Set(
    currentMembers.flatMap((member) =>
      member.selectedMoves
        .map((moveName) => member.availableMoves.find((move) => move.name === moveName))
        .filter(Boolean)
        .flatMap((move) => moveTypeCoverage[move.type] || []),
    ),
  );
  const representedTypes = new Set(currentMembers.flatMap((member) => member.types));

  while (selectedCandidates.length < openSlots && remainingCandidates.length) {
    const defensiveGaps = TYPE_NAMES.map((typeName) => {
      const multipliers = plannedMembers.map((member) => member.defenseMultipliers?.[typeName] ?? 1);
      const weak = multipliers.filter((multiplier) => multiplier > 1).length;
      const resist = multipliers.filter((multiplier) => multiplier > 0 && multiplier < 1).length;
      const immune = multipliers.filter((multiplier) => multiplier === 0).length;
      return { type: typeName, exposure: Math.max(0, weak - resist - immune) };
    }).filter((gap) => gap.exposure > 0);

    const rankedCandidates = remainingCandidates
      .map((candidate) => {
        const candidateDefense = getTypeMultiplierMap(
          candidate.types.map((typeName) => typeChart[typeName]).filter(Boolean),
        );
        const defensiveFit = defensiveGaps.reduce(
          (total, gap) => total + (candidateDefense[gap.type] < 1 ? gap.exposure : 0),
          0,
        );
        const candidateCoverage = new Set(
          candidate.types.flatMap((typeName) => moveTypeCoverage[typeName] || []),
        );
        const addedCoverage = [...candidateCoverage].filter((typeName) => !coveredTypes.has(typeName)).length;
        const newTypes = candidate.types.filter((typeName) => !representedTypes.has(typeName)).length;
        const fitScore =
          Number(candidate.formatFitScore ?? candidate.metaScore ?? 0) * 0.5 +
          Math.min(30, defensiveFit * 10) +
          Math.min(20, addedCoverage * 3) +
          Math.min(10, newTypes * 5);

        return { candidate, candidateCoverage, candidateDefense, fitScore };
      })
      .sort((first, second) => second.fitScore - first.fitScore);
    const topScore = rankedCandidates[0]?.fitScore || 0;
    const shortlist = rankedCandidates
      .filter(({ fitScore }) => fitScore >= topScore - 15)
      .slice(0, 10);
    const selected = randomItem(shortlist);

    if (!selected) break;

    selectedCandidates.push(selected.candidate);
    selected.candidate.types.forEach((typeName) => representedTypes.add(typeName));
    selected.candidateCoverage.forEach((typeName) => coveredTypes.add(typeName));
    plannedMembers.push({
      types: selected.candidate.types,
      defenseMultipliers: selected.candidateDefense,
    });
    remainingCandidates.splice(
      remainingCandidates.findIndex((candidate) => candidate.name === selected.candidate.name),
      1,
    );
  }

  return selectedCandidates;
};

function PokemonTeamPlanner({ onBack, onOpenPokedex, onOpenTcg, onOpenWhos, onOpenQuiz, onOpenTrainerDex }) {
  const [savedPlanner] = useState(loadSavedTeamPlanner);
  const [selectedDex, setSelectedDex] = useState(savedPlanner?.selectedDex || ALL_POKEDEX_OPTION.id);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonSearchTerm, setPokemonSearchTerm] = useState('');
  const [pokemonPage, setPokemonPage] = useState(1);
  const [pokemonSortMode, setPokemonSortMode] = useState('entry');
  const [pokemonMetadata, setPokemonMetadata] = useState({});
  const [teamMembers, setTeamMembers] = useState(savedPlanner?.teamMembers?.slice(0, 6) || []);
  const [selectedBattleFormat, setSelectedBattleFormat] = useState(savedPlanner?.selectedBattleFormat || BATTLE_FORMATS[0].id);
  const [selectedChampionYear, setSelectedChampionYear] = useState(savedPlanner?.selectedChampionYear || WORLD_CHAMPION_TEAMS[0].year);
  const [typeChart, setTypeChart] = useState({});
  const [loadingList, setLoadingList] = useState(true);
  const [loadingTeamMember, setLoadingTeamMember] = useState(false);
  const [historicalUsagePokemon, setHistoricalUsagePokemon] = useState([]);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [pendingDuplicatePokemon, setPendingDuplicatePokemon] = useState(null);
  const [pendingChampionFill, setPendingChampionFill] = useState(false);
  const [recommendationSwapTargets, setRecommendationSwapTargets] = useState({});
  const [lastRecommendationSwap, setLastRecommendationSwap] = useState(null);
  const [selectedSwapImpact, setSelectedSwapImpact] = useState(null);
  const [selectedBuildPicker, setSelectedBuildPicker] = useState(null);
  const [useNatureAdjustedStats, setUseNatureAdjustedStats] = useState(savedPlanner?.useNatureAdjustedStats ?? true);
  const [loadingAbility, setLoadingAbility] = useState(false);
  const [error, setError] = useState('');
  const [savedPlannerSignature, setSavedPlannerSignature] = useState(() =>
    savedPlanner ? JSON.stringify(savedPlanner) : '',
  );
  const [saveError, setSaveError] = useState('');

  const plannerSnapshot = useMemo(() => ({
    teamMembers,
    selectedDex,
    selectedBattleFormat,
    selectedChampionYear,
    useNatureAdjustedStats,
  }), [selectedBattleFormat, selectedChampionYear, selectedDex, teamMembers, useNatureAdjustedStats]);
  const plannerSignature = useMemo(() => JSON.stringify(plannerSnapshot), [plannerSnapshot]);
  const isPlannerSaved = Boolean(teamMembers.length && plannerSignature === savedPlannerSignature);

  const battleFormat = BATTLE_FORMATS.find((format) => format.id === selectedBattleFormat) || BATTLE_FORMATS[0];

  const activeVersionGroup = selectedDex === ALL_POKEDEX_OPTION.id
    ? 'scarlet-violet'
    : getTeamVersionGroup(selectedDex);
  const metaPokemonPool = useMemo(
    () => [...META_POKEMON, ...historicalUsagePokemon],
    [historicalUsagePokemon],
  );
  const selectedWorldChampionTeam = useMemo(
    () => WORLD_CHAMPION_TEAMS.find((team) => team.year === selectedChampionYear) || WORLD_CHAMPION_TEAMS[0],
    [selectedChampionYear],
  );
  const selectedWorldChampionAvailableCount = useMemo(() => {
    const availableNames = new Set(pokemonList.map((pokemon) => pokemon.name));
    return selectedWorldChampionTeam.pokemon.filter(
      (pokemon) => availableNames.has(pokemon.species || pokemon.name),
    ).length;
  }, [pokemonList, selectedWorldChampionTeam]);

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

    const pokedexIds = selectedDex === ALL_POKEDEX_OPTION.id
      ? ['national']
      : POKEDEX_OPTIONS.find((pokedex) => pokedex.id === selectedDex)?.pokedexIds || [selectedDex];

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
        setPokemonList(buildPokedexEntries(data, selectedDex === ALL_POKEDEX_OPTION.id || pokedexIds.length > 1));
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
    if (!pokemonList.length) {
      return undefined;
    }

    const controller = new AbortController();
    const availableNames = new Set(pokemonList.map((pokemon) => pokemon.name));
    const staticNames = new Set(META_POKEMON.map((candidate) => candidate.name));

    Promise.all(
      HISTORICAL_VGC_USAGE_FORMATS.map((format) =>
        fetchPokeApiJson(
          `${COMPETITIVE_STATS_BASE_URL}/${format.id}.json`,
          { signal: controller.signal },
          `Unable to load ${format.label} usage evidence.`,
        ).then((stats) => ({ format, stats })),
      ),
    )
      .then((formatStats) => {
        const usageRecords = new Map();

        formatStats.forEach(({ format, stats }) => {
          Object.entries(stats.pokemon || {})
            .sort((firstPokemon, secondPokemon) =>
              Number(secondPokemon[1]?.usage?.weighted || 0) - Number(firstPokemon[1]?.usage?.weighted || 0),
            )
            .slice(0, 8)
            .forEach(([statsPokemonName, statsPokemon]) => {
              const key = compactCompetitiveName(statsPokemonName);
              const usage = Number(statsPokemon?.usage?.weighted || 0);
              const previousRecord = usageRecords.get(key);
              if (!previousRecord || usage > previousRecord.usage) {
                usageRecords.set(key, { format, statsPokemonName, usage });
              }
            });
        });

        return Promise.all(
          [...usageRecords.values()].map((record) =>
            fetchPokemonByNameOrSpecies(record.statsPokemonName, { signal: controller.signal })
              .then((statsPokemon) => {
                const speciesName = statsPokemon.species.name;
                if (statsPokemon.name === speciesName) {
                  return { pokemon: statsPokemon, record, competitiveForm: '' };
                }

                return fetchPokemonByNameOrSpecies(speciesName, { signal: controller.signal })
                  .then((pokemon) => ({ pokemon, record, competitiveForm: statsPokemon.name }));
              })
              .catch((fetchError) => {
                if (fetchError.name === 'AbortError') throw fetchError;
                return null;
              }),
          ),
        );
      })
      .then((resolvedRecords) => {
        if (controller.signal.aborted) return;

        const candidatesBySpecies = new Map();
        resolvedRecords.filter(Boolean).forEach(({ pokemon, record, competitiveForm }) => {
          const speciesName = pokemon.species.name;
          if (!availableNames.has(speciesName) || staticNames.has(speciesName)) return;

          const previousCandidate = candidatesBySpecies.get(speciesName);
          if (previousCandidate && previousCandidate.usage >= record.usage) return;

          candidatesBySpecies.set(speciesName, {
            name: speciesName,
            pokemonId: Number(getPokemonIdFromSpeciesUrl(pokemon.species.url)),
            types: pokemon.types.map(({ type }) => type.name),
            metaScore: clampScore(58 + record.usage * 42),
            usage: record.usage,
            signal: `${(record.usage * 100).toFixed(1)}% weighted usage in the archived ${record.format.label} ladder snapshot`,
            role: `High-usage ${record.format.label} competitive pick`,
            format: `${record.format.label} usage`,
            sourceLabel: 'Smogon VGC usage statistics',
            sourceUrl: `${COMPETITIVE_STATS_BASE_URL}/${record.format.id}.json`,
            statsFormat: record.format.id,
            statsPokemonName: record.statsPokemonName,
            competitiveForm,
            ...(HISTORICAL_TOURNAMENT_MOVE_EVIDENCE[speciesName] || {}),
            eraWarning: competitiveForm
              ? `The evidence is for ${formatPokemonName(competitiveForm)}. Form availability, typing, abilities, and power can differ from the base species loaded by this planner.`
              : '',
          });
        });

        setHistoricalUsagePokemon([...candidatesBySpecies.values()]);
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setHistoricalUsagePokemon([]);
        }
      });

    return () => controller.abort();
  }, [pokemonList]);

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
  const totalPokemonPages = Math.max(1, Math.ceil(visiblePokemon.length / TEAM_POKEMON_LIST_PAGE_SIZE));
  const effectivePokemonPage = Math.min(pokemonPage, totalPokemonPages);
  const pagedPokemon = useMemo(() => {
    const startIndex = (effectivePokemonPage - 1) * TEAM_POKEMON_LIST_PAGE_SIZE;
    return visiblePokemon.slice(startIndex, startIndex + TEAM_POKEMON_LIST_PAGE_SIZE);
  }, [effectivePokemonPage, visiblePokemon]);

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

  const buildTeamMember = useCallback(async (pokemonName, metaCandidate = null) => {
    const pokemon = await fetchPokemonByNameOrSpecies(pokemonName);
    const moveVersionGroup = getEffectiveMoveVersionGroup(
      pokemon,
      selectedDex,
      activeVersionGroup,
      metaCandidate,
      selectedBattleFormat !== 'open',
    );
    if (selectedBattleFormat !== 'open' && !getMovesForVersionGroup(pokemon, moveVersionGroup).length) {
      throw new Error(`${formatPokemonName(pokemon.name)} is not available in the loaded ${formatVersionGroupName(moveVersionGroup)} learnset.`);
    }
    const levelUpMoves = getLevelUpMovesForVersionGroup(pokemon, moveVersionGroup).slice(0, 80);
    const [species, { suggestions, moveSource, natureRecommendation }] = await Promise.all([
      fetchPokeApiJson(pokemon.species.url, {}, 'Unable to load Pokémon forms.'),
      getCompetitiveMoveSuggestions({
        pokemon,
        metaCandidate,
        selectedDex,
        activeVersionGroup: moveVersionGroup,
      }),
    ]);
    const movesToLoad = [...suggestions, ...levelUpMoves]
      .filter((move, index, moves) => moves.findIndex((candidate) => candidate.name === move.name) === index);
    const availableMoves = await Promise.all(
      movesToLoad.map((move) =>
        fetchPokeApiJson(move.url, {}, 'Unable to load move details.')
          .then((moveData) => ({
            ...move,
            type: moveData.type.name,
            damageClass: moveData.damage_class.name,
            power: moveData.power,
          })),
      ),
    );
    const recommendedMoveNames = suggestions.map((move) => move.name);
    const selectedMoves = [...recommendedMoveNames, ...chooseDefaultMoves(availableMoves)]
      .filter((moveName, index, moveNames) => moveNames.indexOf(moveName) === index)
      .slice(0, 4);
    const pokemonTypes = pokemon.types.map(({ type }) => type.name);
    const typeData = pokemonTypes.map((typeName) => typeChart[typeName]).filter(Boolean);
    const stats = Object.fromEntries(
      pokemon.stats.map((stat) => [stat.stat.name, stat.base_stat]),
    );
    const selectedMoveDetails = selectedMoves
      .map((moveName) => availableMoves.find((move) => move.name === moveName))
      .filter(Boolean);
    const selectedNatureName = NATURES[natureRecommendation?.name]
      ? natureRecommendation.name
      : chooseFallbackNature(stats, selectedMoveDetails);
    const fallbackSource = {
      label: metaCandidate ? 'Role and stat fallback' : 'Smogon-style role and stat fallback',
      url: `${POKEAPI_BASE_URL}/pokemon/${pokemon.name}`,
    };
    const abilities = pokemon.abilities
      .map(({ ability, is_hidden: isHidden, slot }) => ({
        name: ability.name,
        url: ability.url,
        isHidden,
        slot,
      }))
      .sort((firstAbility, secondAbility) =>
        Number(firstAbility.isHidden) - Number(secondAbility.isHidden) ||
        firstAbility.slot - secondAbility.slot,
      );

    return {
      id: `${pokemon.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      pokemonId: Number(getPokemonIdFromSpeciesUrl(pokemon.species.url)) || pokemon.id,
      formId: pokemon.id,
      name: pokemon.name,
      speciesName: pokemon.species.name,
      sprite: pokemon.sprites.front_default,
      artwork: pokemon.sprites.other?.['official-artwork']?.front_default,
      types: pokemonTypes,
      baseStats: stats,
      stats: applyNatureToStats(stats, selectedNatureName),
      baseStatTotal: Object.values(stats).reduce((total, statValue) => total + statValue, 0),
      abilities,
      selectedAbilityName: abilities[0]?.name || '',
      selectedNatureName,
      natureRecommendation: natureRecommendation || { name: selectedNatureName, source: fallbackSource },
      isLegendary: Boolean(species.is_legendary),
      isMythical: Boolean(species.is_mythical),
      availableMoves,
      selectedMoves,
      formOptions: species.varieties
        .filter((variety) => battleFormat.allowLegacyForms || !isLegacyBattleForm(variety.pokemon.name))
        .map((variety) => ({
          name: variety.pokemon.name,
          isDefault: variety.is_default,
        })),
      moveVersionGroup,
      selectionContext: metaCandidate ? {
        ...metaCandidate,
        evidenceForm: metaCandidate.evidenceForm ||
          metaCandidate.preferredForm ||
          metaCandidate.competitiveForm ||
          metaCandidate.name,
        evidenceTournamentMoves: metaCandidate.evidenceTournamentMoves || metaCandidate.tournamentMoves || [],
        evidenceTournamentMoveLabel: metaCandidate.evidenceTournamentMoveLabel || metaCandidate.tournamentMoveLabel || '',
        evidenceTournamentMoveUrl: metaCandidate.evidenceTournamentMoveUrl || metaCandidate.tournamentMoveUrl || '',
      } : null,
      moveSource: moveSource || {
        label: `PokéAPI level-up learnset for ${formatVersionGroupName(moveVersionGroup)}`,
        url: `${POKEAPI_BASE_URL}/pokemon/${pokemon.name}`,
      },
      defenseMultipliers: getTypeMultiplierMap(typeData),
      moveTypeCoverage,
      metaContext: metaCandidate ? {
        format: metaCandidate.format,
        signal: metaCandidate.signal,
        sourceLabel: metaCandidate.sourceLabel,
        sourceUrl: metaCandidate.sourceUrl,
        eraWarning: metaCandidate.eraWarning || '',
        metaScore: metaCandidate.metaScore || 0,
      } : null,
    };
  }, [activeVersionGroup, battleFormat.allowLegacyForms, moveTypeCoverage, selectedBattleFormat, selectedDex, typeChart]);

  const openAbilityDetails = useCallback((ability, pokemonName) => {
    setSelectedAbility({ ...ability, pokemonName });
    setLoadingAbility(true);

    fetchPokeApiJson(ability.url, {}, 'Unable to load ability details.')
      .then((abilityData) => {
        setSelectedAbility((currentAbility) => {
          if (!currentAbility || currentAbility.name !== ability.name) return currentAbility;

          return {
            ...currentAbility,
            effect: getEnglishEffectText(abilityData.effect_entries),
            shortEffect: getEnglishShortEffectText(abilityData.effect_entries),
            flavorText: getEnglishApiFlavorText(abilityData.flavor_text_entries),
          };
        });
      })
      .catch((fetchError) => {
        setSelectedAbility((currentAbility) => currentAbility && ({
          ...currentAbility,
          error: fetchError.message,
        }));
      })
      .finally(() => setLoadingAbility(false));
  }, []);

  const addPokemonToTeam = useCallback((pokemonName, { allowDuplicate = false } = {}) => {
    if (teamMembers.length >= 6 || loadingTeamMember || !Object.keys(typeChart).length) {
      return;
    }

    const duplicateMember = teamMembers.find(
      (member) => (member.speciesName || member.name) === pokemonName,
    );

    if (duplicateMember && !allowDuplicate) {
      if (battleFormat.speciesClause) {
        setError(`${battleFormat.label} uses Species Clause; ${formatPokemonName(pokemonName)} is already on the team.`);
        return;
      }
      setPendingDuplicatePokemon({
        name: pokemonName,
        existingName: duplicateMember.name,
      });
      return;
    }

    setPendingDuplicatePokemon(null);
    setLoadingTeamMember(true);
    setError('');

    buildTeamMember(pokemonName)
      .then((teamMember) => {
        const nextTeam = [...teamMembers, teamMember].slice(0, 6);
        const legalityIssues = getTeamLegalityIssues(nextTeam, battleFormat);
        if (legalityIssues.length) {
          setError(legalityIssues[0]);
          return;
        }
        setTeamMembers(nextTeam);
      })
      .catch((fetchError) => {
        setError(fetchError.message);
      })
      .finally(() => setLoadingTeamMember(false));
  }, [battleFormat, buildTeamMember, loadingTeamMember, teamMembers, typeChart]);

  const fillTeamFromMeta = useCallback(() => {
    if (loadingList || loadingTeamMember || !pokemonList.length || !Object.keys(typeChart).length) {
      return;
    }

    const selectedNames = new Set(teamMembers.map((member) => member.speciesName || member.name));
    const availableNames = new Set(pokemonList.map((pokemon) => pokemon.name));
    const openSlots = 6 - teamMembers.length;
    const suggestedPokemon = chooseGapAwareMetaCandidates({
      candidates: metaPokemonPool
        .filter((candidate) =>
          availableNames.has(candidate.name) &&
          !selectedNames.has(candidate.name) &&
          isCandidateAllowedForFormat(candidate, teamMembers, battleFormat),
        )
        .map((candidate) => ({
          ...candidate,
          formatFitScore: clampScore(
            Number(candidate.metaScore || 0) +
            getEvidenceAlignment(candidate, battleFormat, VERSION_GROUP_GENERATIONS[activeVersionGroup] || 9).score,
          ),
        })),
      currentMembers: teamMembers,
      moveTypeCoverage,
      openSlots,
      typeChart,
    });

    if (!suggestedPokemon.length) return;

    setLoadingTeamMember(true);
    setError('');

    Promise.all(suggestedPokemon.map((candidate) =>
      buildTeamMember(candidate.preferredForm || candidate.competitiveForm || candidate.name, candidate),
    ))
      .then((suggestedMembers) => {
        const legalMembers = [];
        suggestedMembers.forEach((member) => {
          const nextTeam = [...teamMembers, ...legalMembers, member].slice(0, 6);
          if (!getTeamLegalityIssues(nextTeam, battleFormat).length) legalMembers.push(member);
        });
        setTeamMembers((previousMembers) => [...previousMembers, ...legalMembers].slice(0, 6));
        if (legalMembers.length < suggestedMembers.length) {
          setError(`${suggestedMembers.length - legalMembers.length} recommendation(s) were skipped because they are not legal in ${battleFormat.label}.`);
        }
      })
      .catch((fetchError) => {
        setError(fetchError.message);
      })
      .finally(() => setLoadingTeamMember(false));
  }, [
    buildTeamMember,
    battleFormat,
    activeVersionGroup,
    loadingList,
    loadingTeamMember,
    metaPokemonPool,
    moveTypeCoverage,
    pokemonList,
    teamMembers,
    typeChart,
  ]);

  const fillRemainingRandomly = useCallback(() => {
    if (loadingList || loadingTeamMember || !pokemonList.length || !Object.keys(typeChart).length) {
      return;
    }

    const selectedNames = new Set(teamMembers.map((member) => member.speciesName || member.name));
    const openSlots = 6 - teamMembers.length;
    const randomPokemon = shuffleItems(
      pokemonList.filter((pokemon) =>
        !selectedNames.has(pokemon.name) &&
        isCandidateAllowedForFormat(pokemon, teamMembers, battleFormat),
      ),
    ).slice(0, openSlots);

    if (!randomPokemon.length) return;

    setLoadingTeamMember(true);
    setError('');

    Promise.all(randomPokemon.map((pokemon) => buildTeamMember(pokemon.name)))
      .then((randomMembers) => {
        const legalMembers = [];
        randomMembers.forEach((member) => {
          const nextTeam = [...teamMembers, ...legalMembers, member].slice(0, 6);
          if (!getTeamLegalityIssues(nextTeam, battleFormat).length) legalMembers.push(member);
        });
        setTeamMembers((previousMembers) => [...previousMembers, ...legalMembers].slice(0, 6));
        if (legalMembers.length < randomMembers.length) {
          setError(`${randomMembers.length - legalMembers.length} random pick(s) were skipped because they are not legal in ${battleFormat.label}.`);
        }
      })
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoadingTeamMember(false));
  }, [battleFormat, buildTeamMember, loadingList, loadingTeamMember, pokemonList, teamMembers, typeChart]);

  const fillWorldChampionTeam = useCallback(({ preserveExisting = false } = {}) => {
    if (
      loadingList ||
      loadingTeamMember ||
      selectedWorldChampionAvailableCount !== selectedWorldChampionTeam.pokemon.length ||
      !Object.keys(typeChart).length
    ) {
      return;
    }

    setPendingChampionFill(false);
    setLoadingTeamMember(true);
    setError('');
    const selectedSpecies = new Set(
      preserveExisting
        ? teamMembers.map((member) => member.speciesName || member.name)
        : [],
    );
    const championCandidates = selectedWorldChampionTeam.pokemon
      .filter((teamPokemon) => !selectedSpecies.has(teamPokemon.species || teamPokemon.name))
      .map((teamPokemon) => {
        const speciesName = teamPokemon.species || teamPokemon.name;
        const existingCandidate = metaPokemonPool.find((candidate) => candidate.name === speciesName);
        const formWarning = teamPokemon.species
          ? `This champion roster used ${formatPokemonName(teamPokemon.name)}, not the base ${formatPokemonName(speciesName)} form.`
          : '';

        return {
          ...(existingCandidate || {}),
          name: teamPokemon.name,
          speciesName,
          metaScore: existingCandidate?.metaScore || 95,
          format: `${selectedWorldChampionTeam.year} World Champion team`,
          signal: `Member of ${selectedWorldChampionTeam.champion}'s winning Worlds roster`,
          sourceLabel: `${selectedWorldChampionTeam.year} World Champion roster`,
          sourceUrl: selectedWorldChampionTeam.sourceUrl,
          statsFormat: selectedWorldChampionTeam.statsFormat,
          statsPokemonName: teamPokemon.name,
          tournamentMoves: teamPokemon.moves || [],
          tournamentMoveLabel: teamPokemon.moves
            ? `${selectedWorldChampionTeam.year} World Champion team`
            : '',
          tournamentMoveUrl: teamPokemon.moves ? selectedWorldChampionTeam.sourceUrl : '',
          eraWarning: [existingCandidate?.eraWarning, formWarning].filter(Boolean).join(' '),
        };
      });

    Promise.all(championCandidates.map((candidate) => buildTeamMember(candidate.name, candidate)))
      .then((championMembers) => {
        const legalChampionMembers = championMembers;
        if (!preserveExisting) {
          const legalityIssues = getTeamLegalityIssues(legalChampionMembers, battleFormat);
          if (legalityIssues.length) {
            setError(`Champion roster is not legal in ${battleFormat.label}: ${legalityIssues[0]}`);
            return;
          }
          setTeamMembers(legalChampionMembers);
          return;
        }

        const candidatesWithTeamData = championCandidates.map((candidate, index) => ({
          ...candidate,
          types: legalChampionMembers[index].types,
          builtMember: legalChampionMembers[index],
        }));
        const selectedCandidates = chooseGapAwareMetaCandidates({
          candidates: candidatesWithTeamData,
          currentMembers: teamMembers,
          moveTypeCoverage,
          openSlots: 6 - teamMembers.length,
          typeChart,
        });

        const nextTeam = [
          ...teamMembers,
          ...selectedCandidates.map((candidate) => candidate.builtMember),
        ].slice(0, 6);
        const legalityIssues = getTeamLegalityIssues(nextTeam, battleFormat);
        if (legalityIssues.length) {
          setError(`Champion fill is not legal in ${battleFormat.label}: ${legalityIssues[0]}`);
          return;
        }
        setTeamMembers((previousMembers) => [
          ...previousMembers,
          ...selectedCandidates.map((candidate) => candidate.builtMember),
        ].slice(0, 6));
      })
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoadingTeamMember(false));
  }, [
    battleFormat,
    buildTeamMember,
    loadingList,
    loadingTeamMember,
    metaPokemonPool,
    moveTypeCoverage,
    selectedWorldChampionAvailableCount,
    selectedWorldChampionTeam,
    teamMembers,
    typeChart,
  ]);

  const requestWorldChampionFill = useCallback(() => {
    if (!teamMembers.length) {
      fillWorldChampionTeam();
      return;
    }

    setPendingChampionFill(true);
  }, [fillWorldChampionTeam, teamMembers.length]);

  const applyRecommendation = useCallback((candidate, replacementId = null) => {
    if (loadingTeamMember || !Object.keys(typeChart).length) return;

    const outgoingMember = replacementId
      ? teamMembers.find((member) => member.id === replacementId)
      : null;
    setLoadingTeamMember(true);
    setError('');
    buildTeamMember(candidate.preferredForm || candidate.competitiveForm || candidate.name, candidate)
      .then((teamMember) => {
        const nextTeam = replacementId
          ? teamMembers.map((member) => member.id === replacementId ? teamMember : member)
          : [...teamMembers, teamMember].slice(0, 6);
        const legalityIssues = getTeamLegalityIssues(nextTeam, battleFormat);
        if (legalityIssues.length) {
          setError(`Swap is not legal in ${battleFormat.label}: ${legalityIssues[0]}`);
          return;
        }
        setTeamMembers((previousMembers) => {
          if (replacementId && previousMembers.some((member) => member.id === replacementId)) {
            return previousMembers.map((member) => member.id === replacementId ? teamMember : member);
          }
          return [...previousMembers, teamMember].slice(0, 6);
        });
        setLastRecommendationSwap(outgoingMember ? {
          incomingId: teamMember.id,
          incomingName: teamMember.name,
          outgoingMember,
        } : null);
      })
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoadingTeamMember(false));
  }, [battleFormat, buildTeamMember, loadingTeamMember, teamMembers, typeChart]);

  const undoRecommendationSwap = useCallback(() => {
    if (!lastRecommendationSwap) return;

    setTeamMembers((previousMembers) => previousMembers.map((member) =>
      member.id === lastRecommendationSwap.incomingId
        ? lastRecommendationSwap.outgoingMember
        : member,
    ));
    setLastRecommendationSwap(null);
  }, [lastRecommendationSwap]);

  const updateTeamMemberForm = useCallback((memberId, formName) => {
    const currentMember = teamMembers.find((member) => member.id === memberId);
    if (!currentMember || currentMember.name === formName || loadingTeamMember) return;

    const context = currentMember.selectionContext;
    const evidenceForm = context?.evidenceForm;
    const isEvidenceForm = Boolean(context && formName === evidenceForm);
    const nextContext = context ? {
      ...context,
      name: formName,
      preferredForm: formName,
      competitiveForm: formName,
      statsPokemonName: formName,
      tournamentMoves: isEvidenceForm ? context.evidenceTournamentMoves : [],
      tournamentMoveLabel: isEvidenceForm ? context.evidenceTournamentMoveLabel : '',
      tournamentMoveUrl: isEvidenceForm ? context.evidenceTournamentMoveUrl : '',
    } : null;

    setLoadingTeamMember(true);
    setError('');
    buildTeamMember(formName, nextContext)
      .then((updatedMember) => {
        const nextTeam = teamMembers.map((member) =>
          member.id === memberId ? { ...updatedMember, id: memberId } : member,
        );
        const legalityIssues = getTeamLegalityIssues(nextTeam, battleFormat);
        if (legalityIssues.length) {
          setError(`Form is not legal in ${battleFormat.label}: ${legalityIssues[0]}`);
          return;
        }
        setTeamMembers((previousMembers) => previousMembers.map((member) =>
          member.id === memberId ? { ...updatedMember, id: memberId } : member,
        ));
      })
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoadingTeamMember(false));
  }, [battleFormat, buildTeamMember, loadingTeamMember, teamMembers]);

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

  const saveTeam = () => {
    try {
      localStorage.setItem(TEAM_PLANNER_STORAGE_KEY, plannerSignature);
      setSavedPlannerSignature(plannerSignature);
      setSaveError('');
    } catch {
      setSaveError('Unable to save this team in local storage.');
    }
  };

  const selectTeamAbility = (memberId, ability) => {
    setTeamMembers((previousMembers) => previousMembers.map((member) =>
      member.id === memberId
        ? { ...member, selectedAbilityName: ability.name }
        : member,
    ));
    openAbilityDetails(ability, teamMembers.find((member) => member.id === memberId)?.name || 'Pokémon');
  };

  const updateTeamNature = (memberId, natureName) => {
    setTeamMembers((previousMembers) => previousMembers.map((member) =>
      member.id === memberId
        ? {
          ...member,
          selectedNatureName: natureName,
          stats: applyNatureToStats(member.baseStats || member.stats, natureName),
        }
        : member,
    ));
  };

  const selectedBuildPickerMember = selectedBuildPicker
    ? teamMembers.find((member) => member.id === selectedBuildPicker.memberId)
    : null;
  const buildPickerOptions = selectedBuildPickerMember
    ? Object.keys(NATURES)
      .filter((optionName) => {
        const query = normalizeSearchText(selectedBuildPicker.query);
        if (!query) return true;
        const description = getNatureSummary(optionName);
        return normalizeSearchText(`${formatPokemonName(optionName)} ${description}`).includes(query);
      })
      .sort((firstName, secondName) => {
        const recommendationName = selectedBuildPickerMember.natureRecommendation?.name;
        if (firstName === recommendationName) return -1;
        if (secondName === recommendationName) return 1;
        return formatPokemonName(firstName).localeCompare(formatPokemonName(secondName));
      })
    : [];
  const statChangingNatureOptions = buildPickerOptions.filter((natureName) => NATURES[natureName].increased);
  const neutralNatureOptions = buildPickerOptions.filter((natureName) => !NATURES[natureName].increased);

  const selectedPokedexLabel = TEAM_POKEDEX_OPTIONS.find((pokedex) => pokedex.id === selectedDex)?.label || 'this Pokedex';
  const availablePokemonNames = useMemo(
    () => new Set(pokemonList.map((pokemon) => pokemon.name)),
    [pokemonList],
  );
  const selectedPokemonNames = useMemo(
    () => new Set(teamMembers.map((member) => member.speciesName || member.name)),
    [teamMembers],
  );
  const eligibleMetaPokemon = useMemo(
    () => metaPokemonPool.filter((candidate) =>
      availablePokemonNames.has(candidate.name) &&
      isCandidateAllowedForFormat(candidate, teamMembers, battleFormat),
    ),
    [availablePokemonNames, battleFormat, metaPokemonPool, teamMembers],
  );
  const unusedMetaPokemon = useMemo(
    () => eligibleMetaPokemon.filter((candidate) => !selectedPokemonNames.has(candidate.name)),
    [eligibleMetaPokemon, selectedPokemonNames],
  );
  const unusedPokemonCount = useMemo(
    () => pokemonList.filter((pokemon) =>
      !selectedPokemonNames.has(pokemon.name) &&
      isCandidateAllowedForFormat(pokemon, teamMembers, battleFormat),
    ).length,
    [battleFormat, pokemonList, selectedPokemonNames, teamMembers],
  );

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
  const analysisTeamMembers = useMemo(
    () => useNatureAdjustedStats
      ? teamMembers
      : teamMembers.map((member) => ({
        ...member,
        stats: member.baseStats || member.stats,
      })),
    [teamMembers, useNatureAdjustedStats],
  );
  const averageStats = useMemo(
    () => getTeamAverageStats(analysisTeamMembers),
    [analysisTeamMembers],
  );
  const defensiveGaps = useMemo(
    () => teamMatchups
      .map((matchup) => ({
        ...matchup,
        exposure: Math.max(0, matchup.weak - matchup.resist - matchup.immune),
      }))
      .filter((matchup) => matchup.exposure > 0)
      .sort((first, second) => second.exposure - first.exposure || second.weak - first.weak),
    [teamMatchups],
  );
  const coverageGaps = useMemo(
    () => TYPE_NAMES.filter((typeName) => !strongAgainstTypes.includes(typeName)),
    [strongAgainstTypes],
  );
  const selectedMoveDetails = useMemo(
    () => teamMembers.flatMap((member) =>
      member.selectedMoves
        .map((moveName) => member.availableMoves.find((move) => move.name === moveName))
        .filter(Boolean),
    ),
    [teamMembers],
  );
  const moveProfile = useMemo(
    () => ['physical', 'special', 'status'].map((damageClass) => ({
      damageClass,
      count: selectedMoveDetails.filter((move) => move.damageClass === damageClass).length,
    })),
    [selectedMoveDetails],
  );
  const teamLegalityIssues = useMemo(
    () => getTeamLegalityIssues(teamMembers, battleFormat),
    [battleFormat, teamMembers],
  );
  const roleCoverage = useMemo(() => ROLE_DEFINITIONS.map((role) => ({
    ...role,
    members: teamMembers.filter((member) => getMemberRoleIds(member).has(role.id)),
  })), [teamMembers]);
  const missingCoreRoleIds = useMemo(() => {
    const missingRoles = new Set();
    const roleMap = new Map(roleCoverage.map((role) => [role.id, role.members]));
    if (teamMembers.length >= 3 && !roleMap.get('speed-control')?.length) missingRoles.add('speed-control');
    if (teamMembers.length >= 3 && !roleMap.get('disruption')?.length) missingRoles.add('disruption');
    if (teamMembers.length >= 6 && !roleMap.get('physical-offense')?.length) missingRoles.add('physical-offense');
    if (teamMembers.length >= 6 && !roleMap.get('special-offense')?.length) missingRoles.add('special-offense');
    return missingRoles;
  }, [roleCoverage, teamMembers.length]);
  const roleWarnings = useMemo(() => {
    const warnings = [];
    roleCoverage.forEach((role) => {
      if (missingCoreRoleIds.has(role.id)) warnings.push(`Missing ${role.label.toLowerCase()}.`);
      if (role.members.length === 1 && ['speed-control', 'disruption', 'defensive-support'].includes(role.id)) {
        warnings.push(`${formatPokemonName(role.members[0].name)} is the only ${role.label.toLowerCase()} provider.`);
      }
    });
    if (battleFormat.battleStyle === 'doubles') {
      const protectUsers = teamMembers.filter((member) =>
        member.selectedMoves.some((moveName) => ['protect', 'detect', 'spiky-shield'].includes(moveName)),
      );
      if (teamMembers.length >= 3 && protectUsers.length < 2) {
        warnings.push(`Only ${protectUsers.length} team member${protectUsers.length === 1 ? '' : 's'} currently has a Protect-style move.`);
      }
    }
    return warnings;
  }, [battleFormat.battleStyle, missingCoreRoleIds, roleCoverage, teamMembers]);
  const teamSynergies = useMemo(() => {
    const synergies = [];
    const trickRoomSetter = analysisTeamMembers.find((member) => member.selectedMoves.includes('trick-room'));
    const slowPartners = analysisTeamMembers.filter((member) => member.id !== trickRoomSetter?.id && (member.stats?.speed || 0) <= 60);
    if (trickRoomSetter && slowPartners.length) {
      synergies.push(`${formatPokemonName(trickRoomSetter.name)} enables Trick Room for ${slowPartners.slice(0, 2).map((member) => formatPokemonName(member.name)).join(' and ')}.`);
    }

    const activeAbilities = new Set(teamMembers.map((member) => member.selectedAbilityName));
    if ((activeAbilities.has('drizzle')) && teamMembers.some((member) => member.types.includes('water'))) {
      synergies.push('Rain support strengthens the team’s Water pressure.');
    }
    if ((activeAbilities.has('drought') || activeAbilities.has('orichalcum-pulse')) && teamMembers.some((member) => member.types.includes('fire'))) {
      synergies.push('Sun support strengthens the team’s Fire pressure.');
    }
    if (activeAbilities.has('sand-stream') && teamMembers.some((member) => member.types.includes('rock') || member.types.includes('ground') || member.types.includes('steel'))) {
      synergies.push('Sand support has Rock, Ground, or Steel partners that can use it safely.');
    }
    return synergies;
  }, [analysisTeamMembers, teamMembers]);
  const targetGeneration = VERSION_GROUP_GENERATIONS[activeVersionGroup] || 9;
  const teamScore = useMemo(
    () => calculateTeamScore(teamMembers, metaPokemonPool),
    [metaPokemonPool, teamMembers],
  );
  const metaRecommendations = useMemo(() => {
    const availableNames = new Set(pokemonList.map((pokemon) => pokemon.name));
    const selectedNames = new Set(teamMembers.map((member) => member.speciesName || member.name));
    const existingTypes = new Set(teamMembers.flatMap((member) => member.types));

    return metaPokemonPool
      .filter((candidate) =>
        availableNames.has(candidate.name) &&
        !selectedNames.has(candidate.name) &&
        isCandidateAllowedForFormat(candidate, teamMembers, battleFormat),
      )
      .map((candidate) => {
        const candidateDefense = getTypeMultiplierMap(
          candidate.types.map((typeName) => typeChart[typeName]).filter(Boolean),
        );
        const coveredWeaknesses = defensiveGaps
          .filter((gap) => candidateDefense[gap.type] < 1)
          .map((gap) => gap.type);
        const addedCoverage = [...new Set(candidate.types.flatMap((typeName) =>
          moveTypeCoverage[typeName] || [],
        ))].filter((typeName) => coverageGaps.includes(typeName));
        const newTypes = candidate.types.filter((typeName) => !existingTypes.has(typeName));
        const candidateRoles = getCandidateRoleIds(candidate);
        const filledRoleGaps = [...missingCoreRoleIds].filter((roleId) => candidateRoles.has(roleId));
        const evidenceAlignment = getEvidenceAlignment(candidate, battleFormat, targetGeneration);
        const fitScore = clampScore(
          candidate.metaScore * 0.45 +
          Math.min(25, coveredWeaknesses.length * 10) +
          Math.min(20, addedCoverage.length * 3) +
          Math.min(10, newTypes.length * 5) +
          Math.min(16, filledRoleGaps.length * 8) +
          evidenceAlignment.score,
        );
        const reasons = [];

        if (coveredWeaknesses.length) {
          reasons.push(`Defensively answers ${coveredWeaknesses.slice(0, 3).map(formatPokemonName).join(', ')} pressure.`);
        }
        if (addedCoverage.length) {
          reasons.push(`Its STAB types can cover ${addedCoverage.slice(0, 4).map(formatPokemonName).join(', ')} gaps.`);
        }
        if (newTypes.length) {
          reasons.push(`Adds ${newTypes.map(formatPokemonName).join(' / ')} typing to the team.`);
        }
        if (filledRoleGaps.length) {
          const roleLabels = filledRoleGaps.map((roleId) =>
            ROLE_DEFINITIONS.find((role) => role.id === roleId)?.label.toLowerCase(),
          );
          reasons.push(`Fills missing ${roleLabels.join(' and ')} roles.`);
        }
        reasons.push(candidate.signal);

        let replacement = null;
        let replacementBenefit = 0;
        if (teamMembers.length >= 6) {
          const mustReplaceRestricted = isRestrictedPokemon(candidate) &&
            teamMembers.filter(isRestrictedPokemon).length >= battleFormat.restrictedLimit;
          const replacementOption = [...teamMembers]
            .filter((member) => !mustReplaceRestricted || isRestrictedPokemon(member))
            .map((member) => {
              const liability = defensiveGaps.reduce((sum, gap) =>
                sum + (member.defenseMultipliers?.[gap.type] > 1 && candidateDefense[gap.type] < 1 ? gap.exposure : 0),
              0);
              const uniqueRolesLost = roleCoverage.filter((role) =>
                role.members.length === 1 &&
                role.members[0].id === member.id &&
                !candidateRoles.has(role.id),
              );
              return {
                member,
                liability,
                swapValue: liability - uniqueRolesLost.length * 6,
              };
            })
            .sort((first, second) => second.swapValue - first.swapValue)[0];
          replacement = replacementOption?.member || teamMembers[0];
          replacementBenefit = replacementOption?.liability || 0;
        }

        return { ...candidate, evidenceAlignment, fitScore, reasons, replacement, replacementBenefit };
      })
      .sort((first, second) => second.fitScore - first.fitScore || second.metaScore - first.metaScore)
      .slice(0, 4);
  }, [battleFormat, coverageGaps, defensiveGaps, metaPokemonPool, missingCoreRoleIds, moveTypeCoverage, pokemonList, roleCoverage, targetGeneration, teamMembers, typeChart]);

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
              setPokemonPage(1);
              setPokemonSortMode('entry');
            }}
          >
            {TEAM_POKEDEX_OPTIONS.map((pokedex) => (
              <option key={pokedex.id} value={pokedex.id}>
                {pokedex.label}
              </option>
            ))}
          </select>

          <label htmlFor="team-format-select">Battle Format</label>
          <select
            id="team-format-select"
            value={selectedBattleFormat}
            onChange={(event) => {
              setSelectedBattleFormat(event.target.value);
              setPendingDuplicatePokemon(null);
              setError('');
            }}
            disabled={loadingTeamMember}
          >
            {BATTLE_FORMATS.map((format) => (
              <option key={format.id} value={format.id}>{format.label}</option>
            ))}
          </select>
          <div className="team-format-summary">
            <p>{battleFormat.description}</p>
            <small>Pokémon and move availability follow the selected game Pokédex and its loaded learnset.</small>
          </div>
          {teamLegalityIssues.length > 0 && (
            <div className="team-legality-status is-error" role="alert">
              <strong>{teamLegalityIssues.length} legality issue{teamLegalityIssues.length === 1 ? '' : 's'}</strong>
              <ul>
                {teamLegalityIssues.map((issue) => <li key={issue}>{issue}</li>)}
              </ul>
            </div>
          )}
          {teamMembers.length > 0 && !teamLegalityIssues.length && selectedBattleFormat !== 'open' && (
            <p className="team-legality-status is-valid" role="status">Team composition is legal for this planner profile.</p>
          )}

          <label htmlFor="team-pokemon-search">Pokemon</label>
          <input
            id="team-pokemon-search"
            type="search"
            value={pokemonSearchTerm}
            onChange={(event) => {
              setPokemonSearchTerm(event.target.value);
              setPokemonPage(1);
            }}
            placeholder="Filter by name or number..."
          />

          <label htmlFor="team-pokemon-sort">Sort Pokemon</label>
          <select
            id="team-pokemon-sort"
            value={pokemonSortMode}
            onChange={(event) => {
              setPokemonSortMode(event.target.value);
              setPokemonPage(1);
            }}
            disabled={loadingList}
          >
            {pokemonSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="team-count-badge">{teamMembers.length}/6 selected</p>
          <div className="team-save-row">
            <button
              type="button"
              className="nes-btn is-primary"
              onClick={saveTeam}
              disabled={!teamMembers.length || isPlannerSaved || loadingTeamMember}
            >
              {isPlannerSaved ? 'Team Saved' : 'Save Team'}
            </button>
            <span className={saveError ? 'is-error' : ''} role="status">
              {saveError || (isPlannerSaved
                ? 'This team will be restored after reload.'
                : 'Save this team to restore it after reload.')}
            </span>
          </div>
          {loadingPokemonMetadata && (
            <p className="pokedex-status">Loading Pokemon sort data...</p>
          )}

          <div className="team-action-row">
            <button
              type="button"
              className="nes-btn is-primary"
              onClick={fillTeamFromMeta}
              disabled={loadingList || loadingTeamMember || teamMembers.length >= 6 || !unusedMetaPokemon.length || !Object.keys(typeChart).length}
            >
              Fill from Meta
            </button>
            <button
              type="button"
              className="nes-btn is-success"
              onClick={fillRemainingRandomly}
              disabled={loadingList || loadingTeamMember || teamMembers.length >= 6 || !unusedPokemonCount || !Object.keys(typeChart).length}
            >
              Fill Randomly
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

          <div className="team-world-champion-fill">
            <label>
              <span>World Champion Team</span>
              <select
                value={selectedChampionYear}
                onChange={(event) => setSelectedChampionYear(Number(event.target.value))}
                disabled={loadingTeamMember}
              >
                {WORLD_CHAMPION_TEAMS.map((team) => (
                  <option key={team.year} value={team.year}>
                    {team.year} — {team.champion}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="nes-btn is-warning"
              onClick={requestWorldChampionFill}
              disabled={
                loadingList ||
                loadingTeamMember ||
                selectedWorldChampionAvailableCount !== selectedWorldChampionTeam.pokemon.length ||
                !Object.keys(typeChart).length
              }
            >
              Fill Champion Team
            </button>
          </div>

          {!loadingList && (
            <div className="team-fill-note" aria-live="polite">
              <p>
                <strong>{eligibleMetaPokemon.length} of {metaPokemonPool.length} cross-format competitive {metaPokemonPool.length === 1 ? 'pick' : 'picks'}</strong>
                {' '}are available in {selectedPokedexLabel}.
                {unusedMetaPokemon.length
                  ? ` ${unusedMetaPokemon.length} not yet selected.`
                  : ' All available meta picks are already selected.'}
                {' '}Fill from Meta randomly chooses among the strongest-fitting candidates, recalculating defensive gaps, move coverage, and type variety after every slot.
                {' '}Fill Randomly completes the remaining slots from this Pokedex.
              </p>
              <details className="team-pool-methodology is-compact">
                <summary>How the {metaPokemonPool.length}-Pokémon pool is built</summary>
                <p>This is an evidence catalog, not a usage-percentile cutoff or universal tier list. Its meta scores are internal evidence weights, not official usage percentiles.</p>
                <ul>
                  <li>{CURRENT_META_POKEMON.length} current-format usage, win-rate, rising, core, and published-team signals.</li>
                  <li>{WORLDS_2025_META_POKEMON.length + WORLDS_2025_FIELD_POKEMON.length} Pokémon from champion, top-cut, upper-table, and broader published 2025 Worlds teams.</li>
                  <li>{TORONTO_2017_META_POKEMON.length} Pokémon from the official 2017 Toronto Masters top cut, including non-winners.</li>
                  <li>{HISTORICAL_WORLDS_META_POKEMON.length} historically important 2014–2016 World Champion picks.</li>
                  <li>{historicalUsagePokemon.length} additional high-usage picks derived from archived VGC format snapshots spanning 2009–2026 and filtered to this Pokédex.</li>
                </ul>
                <p>Smogon usage statistics summarize ladder usage; they are competitive evidence, not claims that those sets appeared at a specific tournament.</p>
              </details>
            </div>
          )}

          {error && <p className="pokedex-error">{error}</p>}

          {!loadingList && visiblePokemon.length > TEAM_POKEMON_LIST_PAGE_SIZE && (
            <div className="pokemon-list-pager team-pokemon-list-pager" aria-label="Team Pokemon pages">
              <button
                type="button"
                className="nes-btn"
                onClick={() => setPokemonPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={effectivePokemonPage <= 1}
              >
                Prev
              </button>
              <span>
                Page {effectivePokemonPage} / {totalPokemonPages}
              </span>
              <button
                type="button"
                className="nes-btn"
                onClick={() => setPokemonPage((currentPage) => Math.min(totalPokemonPages, currentPage + 1))}
                disabled={effectivePokemonPage >= totalPokemonPages}
              >
                Next
              </button>
            </div>
          )}

          <div className="team-pokemon-list" aria-label="Pokemon team choices">
            {loadingList && <p className="pokedex-status">Loading Pokemon...</p>}
            {!loadingList && pagedPokemon.map((pokemon) => {
              const isFormatLegal = isCandidateAllowedForFormat(pokemon, teamMembers, battleFormat) &&
                (!battleFormat.speciesClause || !selectedPokemonNames.has(pokemon.name));
              return (
                <button
                  key={pokemon.name}
                  type="button"
                  className="pokemon-list-item nes-btn"
                  onClick={() => addPokemonToTeam(pokemon.name)}
                  disabled={teamMembers.length >= 6 || loadingTeamMember || !Object.keys(typeChart).length || !isFormatLegal}
                  title={isFormatLegal ? '' : `Not legal in ${battleFormat.label}`}
                >
                  <span>#{String(pokemon.entryNumber).padStart(3, '0')}</span>
                  <img src={getPokemonSpriteUrl(pokemon.pokemonId)} alt="" aria-hidden="true" loading="lazy" />
                  <strong>{formatPokemonName(pokemon.name)}</strong>
                </button>
              );
            })}
            {!loadingList && !visiblePokemon.length && (
              <p className="pokedex-status">No Pokemon match this search.</p>
            )}
          </div>
        </aside>

        <main className="team-builder-panel">
          <p className="team-move-source-note">
            <strong>Data and build defaults:</strong> PokéAPI supplies Pokémon stats, forms, abilities, and moves available in {formatVersionGroupName(activeVersionGroup)}.
            Competitive usage data helps choose move and nature defaults when available; otherwise the planner uses role, move, and base-stat fallbacks.
          </p>
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
                        <TypeBadge key={typeName} type={typeName} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="team-form-slot">
                  {(member.formOptions?.length || 0) > 1 && (
                    <div className="team-form-control">
                      <label>
                        <span>Forme</span>
                        <select
                          value={member.name}
                          onChange={(event) => updateTeamMemberForm(member.id, event.target.value)}
                          disabled={loadingTeamMember}
                        >
                          {member.formOptions.map((form) => (
                            <option key={form.name} value={form.name}>
                              {formatPokemonName(form.name)}{form.isDefault ? ' — Default' : ''}
                            </option>
                          ))}
                        </select>
                      </label>
                      <span className="team-form-stat">BST {member.baseStatTotal}</span>
                    </div>
                  )}
                </div>

                {member.metaContext?.eraWarning && (
                  <details className="team-era-details">
                    <summary>History</summary>
                    <p className="team-era-warning">
                      <strong>Historical mechanics:</strong> {member.metaContext.eraWarning}
                    </p>
                  </details>
                )}

                <div className="team-ability-section">
                  <span className="team-ability-label">Ability — select one</span>
                  <div className="team-ability-list">
                    {member.abilities.map((ability) => (
                      <button
                        key={`${ability.slot}-${ability.name}`}
                        type="button"
                        className={`team-ability-button${ability.isHidden ? ' is-hidden' : ''}${member.selectedAbilityName === ability.name ? ' is-selected' : ''}`}
                        onClick={() => selectTeamAbility(member.id, ability)}
                        aria-pressed={member.selectedAbilityName === ability.name}
                        aria-label={`Select ${formatPokemonName(ability.name)} ${ability.isHidden ? 'hidden ability' : 'ability'} and view details`}
                      >
                        <span>{formatPokemonName(ability.name)}</span>
                        {ability.isHidden && <small>Hidden</small>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="team-build-controls">
                  <section>
                    <span className="team-build-label">Nature</span>
                    <div className="team-build-picker-trigger">
                      <div className="team-build-current">
                        <span>
                          <strong>{formatPokemonName(member.selectedNatureName)}</strong>
                          <small>{getNatureSummary(member.selectedNatureName)}</small>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="team-build-change"
                        onClick={() => setSelectedBuildPicker({
                          memberId: member.id,
                          query: '',
                        })}
                        aria-label={`Change ${member.name}'s nature`}
                      >
                        Change
                      </button>
                    </div>
                  </section>
                </div>

                <div className="team-moveset-section">
                  <p className="team-member-move-source">
                    <strong>Suggested moves:</strong>
                    <a href={member.moveSource.url} target="_blank" rel="noreferrer">
                      {member.moveSource.label}
                    </a>
                  </p>

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
                            <option key={move.name} value={move.name}>
                              {move.recommendationSource
                                ? `${move.recommendationSource} · `
                                : move.level !== null
                                  ? `Lv. ${move.level} · `
                                  : `${formatPokemonName(move.learnMethod)} · `}
                              {formatPokemonName(move.name)} ({formatPokemonName(move.type)})
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                </div>
              </article>
            ))}

            {Array.from({ length: Math.max(6 - teamMembers.length, 0) }, (_, index) => (
              <article key={`empty-${index}`} className="team-member-card is-empty">
                <span>{teamMembers.length + index + 1}</span>
              </article>
            ))}
          </section>

          <section className="team-assistant-panel" aria-labelledby="team-assistant-title">
            <div className="team-assistant-header">
              <div>
                <p className="team-assistant-kicker">Source-backed guidance</p>
                <h2 id="team-assistant-title">Team-Building Assistant</h2>
                <p>
                  Recommendations blend tournament signals with this team&apos;s defensive gaps,
                  offensive coverage, type variety, missing roles, and selected battle format.
                </p>
              </div>
              <div className="team-score-summary" aria-label={`Team guidance score ${teamScore.total} out of 100`}>
                <strong>{teamScore.total}</strong>
                <span>/ 100</span>
              </div>
            </div>

            <div className="team-score-breakdown" aria-label="Team score factors">
              {[
                ['Defense', teamScore.defense],
                ['Offense', teamScore.offense],
                ['Type variety', teamScore.variety],
                ['Team readiness', teamScore.readiness],
                ['Meta signal', teamScore.meta],
                ['Base stats', teamScore.power],
              ].map(([label, score]) => (
                <div key={label}>
                  <span>{label}</span>
                  <meter min="0" max="100" value={score} />
                  <strong>{score}</strong>
                </div>
              ))}
            </div>
            <p className="team-score-note">
              This is a transparent planning heuristic, not an objective verdict or guarantee of success.
            </p>

            <section className="team-role-analysis" aria-labelledby="team-role-title">
              <div>
                <p className="team-assistant-kicker">Role and synergy check</p>
                <h3 id="team-role-title">Team functions</h3>
              </div>
              <div className="team-role-grid">
                {roleCoverage.map((role) => (
                  <article key={role.id} className={role.members.length ? 'is-covered' : 'is-missing'}>
                    <strong>{role.label}</strong>
                    <span>
                      {role.members.length
                        ? role.members.map((member) => formatPokemonName(member.name)).join(', ')
                        : 'Not currently covered'}
                    </span>
                  </article>
                ))}
              </div>
              {(roleWarnings.length > 0 || teamSynergies.length > 0) && (
                <div className="team-role-findings">
                  {roleWarnings.length > 0 && (
                    <div className="is-warning">
                      <strong>Watchouts</strong>
                      <ul>{roleWarnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
                    </div>
                  )}
                  {teamSynergies.length > 0 && (
                    <div className="is-synergy">
                      <strong>Detected synergies</strong>
                      <ul>{teamSynergies.map((synergy) => <li key={synergy}>{synergy}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}
            </section>

            <div className="team-recommendation-heading">
              <div>
                <h3>Recommended next picks</h3>
                <p>{META_SOURCE_LABEL} spanning {META_SOURCE_UPDATED}. A tournament appearance is evidence of viability in that format, not a claim that the Pokémon is optimal everywhere.</p>
              </div>
            </div>

            <div className="team-recommendation-grid">
              {metaRecommendations.map((candidate) => {
                const selectedSwapTarget = teamMembers.some(
                  (member) => member.id === recommendationSwapTargets[candidate.name],
                )
                  ? recommendationSwapTargets[candidate.name]
                  : candidate.replacement?.id || '';
                const selectedSwapMember = teamMembers.find((member) => member.id === selectedSwapTarget);
                const candidateDefense = getTypeMultiplierMap(
                  candidate.types.map((typeName) => typeChart[typeName]).filter(Boolean),
                );
                const previewMoves = candidate.types.map((typeName) => ({
                  name: `preview-${typeName}`,
                  type: typeName,
                }));
                const projectedMembers = selectedSwapMember
                  ? teamMembers.map((member) => member.id === selectedSwapTarget ? {
                    ...member,
                    name: candidate.name,
                    speciesName: candidate.name,
                    types: candidate.types,
                    defenseMultipliers: candidateDefense,
                    selectedMoves: previewMoves.map((move) => move.name),
                    availableMoves: previewMoves,
                    metaContext: { metaScore: candidate.metaScore || 0 },
                  } : member)
                  : teamMembers;
                const projectedScore = calculateTeamScore(projectedMembers, metaPokemonPool);
                const currentExposure = defensiveGaps.reduce((sum, gap) => sum + gap.exposure, 0);
                const projectedExposure = summarizeTeamTypeMatchups(projectedMembers).reduce((sum, matchup) =>
                  sum + Math.max(0, matchup.weak - matchup.resist - matchup.immune),
                0);
                const projectedCoverageCount = summarizeTeamMoveCoverage(projectedMembers).length;
                const currentTypeCount = new Set(teamMembers.flatMap((member) => member.types)).size;
                const projectedTypeCount = new Set(projectedMembers.flatMap((member) => member.types)).size;
                const isRecommendedSwap = selectedSwapTarget === candidate.replacement?.id;
                const candidateRoleIds = getCandidateRoleIds(candidate);
                const selectedSwapRoleLosses = selectedSwapMember
                  ? roleCoverage.filter((role) =>
                    role.members.length === 1 &&
                    role.members[0].id === selectedSwapMember.id &&
                    !candidateRoleIds.has(role.id),
                  )
                  : [];

                return (
                <article key={candidate.name} className="team-recommendation-card">
                  <div className="team-recommendation-title">
                    <img src={getPokemonSpriteUrl(candidate.pokemonId)} alt="" aria-hidden="true" loading="lazy" />
                    <div>
                      <h3>{formatPokemonName(candidate.name)}</h3>
                      <div className="type-row">
                        {candidate.types.map((typeName) => <TypeBadge key={typeName} type={typeName} />)}
                      </div>
                    </div>
                    <strong className="team-fit-score">{candidate.fitScore}% fit</strong>
                  </div>
                  <p className="team-recommendation-role">{candidate.role}</p>
                  <p className="team-recommendation-evidence">
                    <span>{candidate.format}</span>
                    <a href={candidate.sourceUrl} target="_blank" rel="noreferrer">{candidate.sourceLabel}</a>
                    <small>{formatPokemonName(candidate.evidenceAlignment.label)}</small>
                  </p>
                  {candidate.eraWarning && (
                    <p className="team-era-warning">
                      <strong>Historical mechanics:</strong> {candidate.eraWarning}
                    </p>
                  )}
                  <ul>
                    {candidate.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                  </ul>
                  {candidate.replacement && (
                    <>
                      <p className="team-swap-note">
                        {isRecommendedSwap
                          ? candidate.replacementBenefit > 0
                            ? `Recommended: replace ${formatPokemonName(candidate.replacement.name)} to reduce stacked weaknesses without unnecessarily dropping unique team roles.`
                            : `Recommended: replace ${formatPokemonName(candidate.replacement.name)} as the lowest-cost swap across type gaps and unique team roles.`
                          : `Alternative: replace ${formatPokemonName(selectedSwapMember?.name)} instead of the recommended ${formatPokemonName(candidate.replacement.name)}.`}
                      </p>
                      {selectedSwapRoleLosses.length > 0 && (
                        <p className="team-swap-role-warning">
                          Role warning: this removes the team&apos;s only{' '}
                          {selectedSwapRoleLosses.map((role) => role.label.toLowerCase()).join(' and ')} provider.
                        </p>
                      )}
                    </>
                  )}
                  <div className="team-recommendation-actions">
                    {candidate.replacement && (
                      <label className="team-swap-control">
                        <span>Swap out</span>
                        <select
                          value={selectedSwapTarget}
                          onChange={(event) => setRecommendationSwapTargets((currentTargets) => ({
                            ...currentTargets,
                            [candidate.name]: event.target.value,
                          }))}
                          disabled={loadingTeamMember}
                          aria-label={`Choose which Pokemon to replace with ${formatPokemonName(candidate.name)}`}
                        >
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {formatPokemonName(member.name)}
                              {member.id === candidate.replacement.id ? ' (Recommended)' : ''}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    {selectedSwapMember && (
                      <button
                        type="button"
                        className="team-impact-button nes-btn"
                        onClick={() => setSelectedSwapImpact({
                          candidateName: candidate.name,
                          outgoingName: selectedSwapMember.name,
                          rows: [
                            { label: 'Team score', before: teamScore.total, after: projectedScore.total },
                            { label: 'Weakness exposure', before: currentExposure, after: projectedExposure },
                            { label: 'Coverage', before: strongAgainstTypes.length, after: projectedCoverageCount },
                            { label: 'Type variety', before: currentTypeCount, after: projectedTypeCount },
                          ],
                        })}
                      >
                        View estimated impact
                      </button>
                    )}
                    <button
                      type="button"
                      className="nes-btn is-primary"
                      onClick={() => applyRecommendation(candidate, selectedSwapTarget || null)}
                      disabled={loadingTeamMember}
                    >
                      {selectedSwapMember
                        ? `Replace ${formatPokemonName(selectedSwapMember.name)} with ${formatPokemonName(candidate.name)}`
                        : 'Add recommendation'}
                    </button>
                  </div>
                </article>
                );
              })}
              {!metaRecommendations.length && (
                <p className="pokedex-status">
                  No unused sourced picks are available in this game Pokedex. Select National Pokedex for the
                  broadest cross-format tournament pool.
                </p>
              )}
            </div>
            {lastRecommendationSwap && teamMembers.some(
              (member) => member.id === lastRecommendationSwap.incomingId,
            ) && (
              <div className="team-swap-undo" role="status">
                <p>
                  Replaced {formatPokemonName(lastRecommendationSwap.outgoingMember.name)} with{' '}
                  {formatPokemonName(lastRecommendationSwap.incomingName)}.
                </p>
                <button
                  type="button"
                  className="nes-btn is-warning"
                  onClick={undoRecommendationSwap}
                  disabled={loadingTeamMember}
                >
                  Undo swap
                </button>
              </div>
            )}
          </section>

          <section className="team-analysis-grid">
            <div className="team-analysis-summary">
              <article className="team-analysis-card team-stat-card">
                <div className="team-stat-card-heading">
                  <div>
                    <h2>{useNatureAdjustedStats ? 'Nature-Adjusted Stats' : 'Base Stats'}</h2>
                    <p>
                      {useNatureAdjustedStats
                        ? 'Selected nature effects are included.'
                        : 'Selected natures are kept, but their stat effects are ignored.'}
                    </p>
                  </div>
                  <label className="team-nature-stat-toggle">
                    <input
                      type="checkbox"
                      checked={useNatureAdjustedStats}
                      onChange={(event) => setUseNatureAdjustedStats(event.target.checked)}
                    />
                    <span className="team-nature-stat-switch" aria-hidden="true">
                      <span />
                    </span>
                    <span>
                      Nature effects
                      <strong>{useNatureAdjustedStats ? 'On' : 'Off'}</strong>
                    </span>
                  </label>
                </div>
                <div
                  className="team-stat-chart"
                  aria-label={`Team average ${useNatureAdjustedStats ? 'nature-adjusted' : 'base'} stats, shown on a scale from 0 to 150 or higher`}
                >
                  <div className="team-stat-axis" aria-hidden="true">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150+</span>
                  </div>
                  {averageStats.map((stat) => (
                    <div key={stat.id} className="team-stat-row">
                      <span className="team-stat-label">{stat.label}</span>
                      <span
                        className="team-stat-track"
                        role="img"
                        aria-label={`${stat.label}: ${stat.value}`}
                      >
                        <span
                          className={`team-stat-bar stat-${stat.id}`}
                          style={{ '--team-stat-value': `${Math.min(100, (stat.value / 150) * 100)}%` }}
                        />
                      </span>
                      <strong>{stat.value}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="team-analysis-card team-move-profile-card">
                <h2>Move Profile</h2>
                <div className="team-move-profile">
                  {moveProfile.map(({ damageClass, count }) => (
                    <div key={damageClass}>
                      <span>{formatPokemonName(damageClass)}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
                <p className="team-analysis-copy">
                  {selectedMoveDetails.length
                    ? `${selectedMoveDetails.length} selected moves cover ${strongAgainstTypes.length} of ${TYPE_NAMES.length} defending types.`
                    : 'Choose moves to analyse physical, special, and status balance.'}
                </p>
              </article>
            </div>

            <article className="team-analysis-card">
              <h2>Coverage Strengths</h2>
              <div className="team-analysis-split">
                <section className="team-analysis-subsection">
                  <h3>Resistances</h3>
                  <div className="team-type-list">
                    {teamResistances.map((matchup) => (
                      <TypeBadge
                        key={matchup.type}
                        type={matchup.type}
                        detail={matchup.immune ? `immune ${matchup.immune}` : `resist ${matchup.resist}`}
                      />
                    ))}
                    {!teamResistances.length && <p className="pokedex-status">No resistances yet.</p>}
                  </div>
                </section>

                <section className="team-analysis-subsection">
                  <h3>Strong Against</h3>
                  <div className="team-type-list">
                    {strongAgainstTypes.map((typeName) => (
                      <TypeBadge key={typeName} type={typeName} />
                    ))}
                    {!strongAgainstTypes.length && <p className="pokedex-status">Choose moves to see offensive strengths.</p>}
                  </div>
                </section>
              </div>
            </article>

            <article className="team-analysis-card">
              <h2>Coverage Gaps</h2>
              <div className="team-analysis-split">
                <section className="team-analysis-subsection">
                  <h3>Defensive Gaps</h3>
                  <div className="team-type-list">
                    {defensiveGaps.map((matchup) => (
                      <TypeBadge
                        key={matchup.type}
                        type={matchup.type}
                        detail={`${matchup.weak} weak / ${matchup.resist + matchup.immune} answers`}
                      />
                    ))}
                    {!defensiveGaps.length && <p className="pokedex-status">No uncovered defensive pressure detected.</p>}
                  </div>
                </section>

                <section className="team-analysis-subsection">
                  <h3>Offensive Gaps</h3>
                  <div className="team-type-list">
                    {coverageGaps.map((typeName) => <TypeBadge key={typeName} type={typeName} />)}
                    {!coverageGaps.length && <p className="pokedex-status">Selected moves reach every defensive type.</p>}
                  </div>
                </section>
              </div>
            </article>

          </section>
        </main>
      </section>

      {selectedBuildPicker && selectedBuildPickerMember && (
        <div
          className="team-ability-overlay"
          role="presentation"
          onClick={() => setSelectedBuildPicker(null)}
        >
          <article
            className="team-ability-dialog team-build-picker-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-build-picker-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedBuildPicker(null)}
              aria-label="Close build choice panel"
            >
              Close
            </button>
            <p className="team-assistant-kicker">
              Nature · {formatPokemonName(selectedBuildPickerMember.name)}
            </p>
            <h2 id="team-build-picker-title">Choose a nature</h2>
            <p className="team-build-picker-guidance">
              The evidence-based recommendation is pinned first. Search or choose another option if it better suits your plan.
            </p>
            <label className="team-build-picker-search">
              <span>Find a nature or boosted stat</span>
              <input
                type="search"
                value={selectedBuildPicker.query}
                onChange={(event) => setSelectedBuildPicker((currentPicker) => ({
                  ...currentPicker,
                  query: event.target.value,
                }))}
                placeholder="Try “Speed”, “Attack”, or “Jolly”"
                autoFocus
              />
            </label>
            {statChangingNatureOptions.length > 0 && (
              <section className="team-nature-choice-group" aria-labelledby="stat-changing-natures">
                <h3 id="stat-changing-natures">Stat-changing natures</h3>
                <div className="team-nature-radio-list">
                  {statChangingNatureOptions.map((optionName) => (
                    <label
                      key={optionName}
                      className={`team-nature-radio-row${optionName === selectedBuildPickerMember.selectedNatureName ? ' is-selected' : ''}${optionName === selectedBuildPickerMember.natureRecommendation?.name ? ' is-recommended' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`nature-${selectedBuildPickerMember.id}`}
                        value={optionName}
                        checked={optionName === selectedBuildPickerMember.selectedNatureName}
                        onChange={() => {
                          updateTeamNature(selectedBuildPickerMember.id, optionName);
                          setSelectedBuildPicker(null);
                        }}
                      />
                      <span className="team-nature-radio-mark" aria-hidden="true" />
                      <span className="team-nature-radio-copy">
                        <span className="team-build-choice-heading">
                          <strong>{formatPokemonName(optionName)}</strong>
                          {optionName === selectedBuildPickerMember.natureRecommendation?.name && <em>Recommended</em>}
                          {optionName === selectedBuildPickerMember.selectedNatureName && <em>Selected</em>}
                        </span>
                        <small>{getNatureSummary(optionName)}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}
            {neutralNatureOptions.length > 0 && (
              <section className="team-nature-choice-group is-neutral" aria-labelledby="neutral-natures">
                <h3 id="neutral-natures">Neutral natures</h3>
                <p>These natures do not raise or lower any stats.</p>
                <div className="team-nature-radio-list">
                  {neutralNatureOptions.map((optionName) => (
                    <label
                      key={optionName}
                      className={`team-nature-radio-row${optionName === selectedBuildPickerMember.selectedNatureName ? ' is-selected' : ''}${optionName === selectedBuildPickerMember.natureRecommendation?.name ? ' is-recommended' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`nature-${selectedBuildPickerMember.id}`}
                        value={optionName}
                        checked={optionName === selectedBuildPickerMember.selectedNatureName}
                        onChange={() => {
                          updateTeamNature(selectedBuildPickerMember.id, optionName);
                          setSelectedBuildPicker(null);
                        }}
                      />
                      <span className="team-nature-radio-mark" aria-hidden="true" />
                      <span className="team-nature-radio-copy">
                        <span className="team-build-choice-heading">
                          <strong>{formatPokemonName(optionName)}</strong>
                          {optionName === selectedBuildPickerMember.natureRecommendation?.name && <em>Recommended</em>}
                          {optionName === selectedBuildPickerMember.selectedNatureName && <em>Selected</em>}
                        </span>
                        <small>No stat changes</small>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}
            {!buildPickerOptions.length && (
              <p className="pokedex-status">No choices match that search.</p>
            )}
          </article>
        </div>
      )}

      {selectedSwapImpact && (
        <div
          className="team-ability-overlay"
          role="presentation"
          onClick={() => setSelectedSwapImpact(null)}
        >
          <article
            className="team-ability-dialog team-impact-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-impact-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedSwapImpact(null)}
              aria-label="Close estimated team impact"
            >
              Close
            </button>
            <p className="team-assistant-kicker">Swap preview</p>
            <h2 id="team-impact-dialog-title">Estimated team impact</h2>
            <p className="team-impact-summary">
              Replace {formatPokemonName(selectedSwapImpact.outgoingName)} with{' '}
              {formatPokemonName(selectedSwapImpact.candidateName)}
            </p>
            <dl className="team-impact-metrics">
              {selectedSwapImpact.rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.before} → {row.after} ({formatScoreChange(row.after - row.before)})</dd>
                </div>
              ))}
            </dl>
            <p className="team-impact-disclaimer">
              Estimate uses the candidate&apos;s STAB coverage and holds power constant until the swap loads.
            </p>
          </article>
        </div>
      )}

      {selectedAbility && (
        <div
          className="team-ability-overlay"
          role="presentation"
          onClick={() => setSelectedAbility(null)}
        >
          <article
            className="team-ability-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-ability-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close nes-btn"
              onClick={() => setSelectedAbility(null)}
              aria-label="Close ability details"
            >
              Close
            </button>
            <p className="team-assistant-kicker">
              {selectedAbility.isHidden ? 'Hidden Ability' : 'Ability'} · {formatPokemonName(selectedAbility.pokemonName)}
            </p>
            <h2 id="team-ability-dialog-title">{formatPokemonName(selectedAbility.name)}</h2>
            {loadingAbility && <p className="pokedex-status">Loading ability details...</p>}
            {!loadingAbility && selectedAbility.error && (
              <p className="pokedex-error">{selectedAbility.error}</p>
            )}
            {!loadingAbility && !selectedAbility.error && (
              <>
                <section>
                  <h3>What it does</h3>
                  <p>{selectedAbility.effect || selectedAbility.shortEffect || 'No detailed effect is available.'}</p>
                </section>
                {selectedAbility.flavorText && (
                  <section>
                    <h3>In-game description</h3>
                    <p>{selectedAbility.flavorText}</p>
                  </section>
                )}
              </>
            )}
          </article>
        </div>
      )}

      {pendingDuplicatePokemon && (
        <div
          className="team-ability-overlay"
          role="presentation"
          onClick={() => setPendingDuplicatePokemon(null)}
        >
          <article
            className="team-ability-dialog team-duplicate-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-duplicate-dialog-title"
            aria-describedby="team-duplicate-dialog-description"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="team-assistant-kicker">Duplicate Pokémon</p>
            <h2 id="team-duplicate-dialog-title">
              Add another {formatPokemonName(pendingDuplicatePokemon.name)}?
            </h2>
            <p id="team-duplicate-dialog-description">
              Your team already contains {formatPokemonName(pendingDuplicatePokemon.existingName)}.
              {' '}Duplicate species are blocked by default, but you can add this Pokémon if you want to build without that restriction.
            </p>
            <div className="team-duplicate-actions">
              <button
                type="button"
                className="nes-btn"
                onClick={() => setPendingDuplicatePokemon(null)}
                autoFocus
              >
                Keep One
              </button>
              <button
                type="button"
                className="nes-btn is-warning"
                onClick={() => addPokemonToTeam(pendingDuplicatePokemon.name, { allowDuplicate: true })}
              >
                Add Duplicate
              </button>
            </div>
          </article>
        </div>
      )}

      {pendingChampionFill && (
        <div
          className="team-ability-overlay"
          role="presentation"
          onClick={() => setPendingChampionFill(false)}
        >
          <article
            className="team-ability-dialog team-duplicate-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-champion-dialog-title"
            aria-describedby="team-champion-dialog-description"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="team-assistant-kicker">Champion Team Fill</p>
            <h2 id="team-champion-dialog-title">
              {teamMembers.length < 6 ? 'Fill the remaining team slots?' : 'Replace your current team?'}
            </h2>
            <p id="team-champion-dialog-description">
              {teamMembers.length < 6
                ? `Fill Remaining keeps your ${teamMembers.length} selected Pokémon and chooses ${6 - teamMembers.length} unused members from ${selectedWorldChampionTeam.champion}'s ${selectedWorldChampionTeam.year} winning roster based on your team's defensive gaps, move coverage, and type variety. Replace Team discards the current team and loads the exact winning roster.`
                : `Your team is already full. Continuing will remove its six Pokémon and load ${selectedWorldChampionTeam.champion}'s complete ${selectedWorldChampionTeam.year} winning roster.`}
            </p>
            <a href={selectedWorldChampionTeam.sourceUrl} target="_blank" rel="noreferrer">
              View winning roster source
            </a>
            <div className="team-duplicate-actions">
              <button
                type="button"
                className="nes-btn"
                onClick={() => setPendingChampionFill(false)}
                autoFocus
              >
                Cancel
              </button>
              {teamMembers.length < 6 && (
                <button
                  type="button"
                  className="nes-btn is-success"
                  onClick={() => fillWorldChampionTeam({ preserveExisting: true })}
                >
                  Fill Remaining
                </button>
              )}
              <button
                type="button"
                className="nes-btn is-warning"
                onClick={() => fillWorldChampionTeam({ preserveExisting: false })}
              >
                Replace Team
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

export default PokemonTeamPlanner;
