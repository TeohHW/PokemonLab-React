/* eslint-disable no-unused-vars */
import pokedexLogo from '../../logos/pokedex.png';
import quizLogo from '../../logos/quiz.png';
import tcgLogo from '../../logos/tcg.png';
import teamLogo from '../../logos/team.png';
import trainerdexLogo from '../../logos/trainerdex.png';
import whoLogo from '../../logos/who.png';
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
} from '../stations/shared/stationShared';

const HOME_STATIONS = [
  {
    id: 'pokedex',
    icon: '#',
    logo: pokedexLogo,
    title: 'Pokedex',
    copy: 'Search Pokemon by name or number using live PokeAPI data.',
  },
  {
    id: 'tcg',
    icon: 'TCG',
    logo: tcgLogo,
    title: 'Pokemon TCG Simulator',
    copy: 'Open booster packs, reveal cards, and build your binder.',
  },
  {
    id: 'who',
    icon: '?',
    logo: whoLogo,
    title: "Who's That Pokemon?",
    copy: 'Guess silhouetted Pokemon by region and climb the leaderboard.',
  },
  {
    id: 'team',
    icon: 'TEAM',
    logo: teamLogo,
    title: 'Pokemon Team Planner',
    copy: 'Build a six-Pokemon team, pick moves, and inspect matchups.',
  },
  {
    id: 'quiz',
    icon: 'Q',
    logo: quizLogo,
    title: 'Pokemon Quiz',
    copy: 'Test types, evolutions, stats, cries, and Pokedex knowledge.',
  },
  {
    id: 'trainerdex',
    icon: 'VS',
    logo: trainerdexLogo,
    title: 'TrainerDex',
    copy: 'Browse Gym Leader, Kahuna, and Elite Four teams by region.',
  },
];

function HomePage({ onChoose }) {
  return (
    <main className="home-screen">
      <div className="home-repo-link">
        <GitHubRepoLink />
      </div>
      <section className="home-hero">
        <div className="home-brand">
          <span className="nes-pokeball home-pokeball" aria-hidden="true" />
          <div>
            <h1>Pokemon Lab</h1>
          </div>
        </div>

        <div className="choice-grid" aria-label="Choose an app">
          {HOME_STATIONS.map((station) => (
            <button
              key={station.id}
              type="button"
              className={`choice-card choice-card-${station.id} nes-btn`}
              onClick={() => onChoose(station.id)}
            >
              <span className="choice-icon" aria-hidden="true">
                <img src={station.logo} alt="" />
              </span>
              <span className="choice-content">
                <span className="choice-title">{station.title}</span>
                <span className="choice-copy">{station.copy}</span>
              </span>
              <span className="choice-dots" aria-hidden="true"><i /><i /><i /></span>
            </button>
          ))}
        </div>

        <p className="choice-prompt">Choose a station.</p>
      </section>
    </main>
  );
}

export default HomePage;
