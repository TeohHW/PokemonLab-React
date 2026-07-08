/* eslint-disable no-unused-vars */
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
} from '../stations/shared/stationShared';

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
            <p className="eyebrow">Pokemon Lab</p>
            <h1>Choose Your Station</h1>
          </div>
        </div>

        <div className="choice-grid" aria-label="Choose an app">
          <button
            type="button"
            className="choice-card nes-btn is-error"
            onClick={() => onChoose('pokedex')}
          >
            <span className="choice-icon" aria-hidden="true">
              #
            </span>
            <span className="choice-title">Pokedex</span>
            <span className="choice-copy">
              Search Pokemon by name or number using live PokeAPI data.
            </span>
          </button>

          <button
            type="button"
            className="choice-card nes-btn is-primary"
            onClick={() => onChoose('tcg')}
          >
            <span className="choice-icon" aria-hidden="true">
              TCG
            </span>
            <span className="choice-title">Pokemon TCG Simulator</span>
            <span className="choice-copy">
              Open booster packs, reveal cards, and build your binder.
            </span>
          </button>

          <button
            type="button"
            className="choice-card nes-btn is-warning"
            onClick={() => onChoose('who')}
          >
            <span className="choice-icon" aria-hidden="true">
              ?
            </span>
            <span className="choice-title">Who's That Pokemon?</span>
            <span className="choice-copy">
              Guess silhouetted Pokemon by region and climb the leaderboard.
            </span>
          </button>

          <button
            type="button"
            className="choice-card nes-btn is-success"
            onClick={() => onChoose('team')}
          >
            <span className="choice-icon" aria-hidden="true">
              TEAM
            </span>
            <span className="choice-title">Pokemon Team Planner</span>
            <span className="choice-copy">
              Build a six-Pokemon team, pick moves, and inspect matchups.
            </span>
          </button>

          <button
            type="button"
            className="choice-card quiz-choice-card nes-btn"
            onClick={() => onChoose('quiz')}
          >
            <span className="choice-icon" aria-hidden="true">
              Q
            </span>
            <span className="choice-title">Pokemon Quiz</span>
            <span className="choice-copy">
              Test types, evolutions, stats, cries, and Pokedex knowledge.
            </span>
          </button>

          <button
            type="button"
            className="choice-card trainerdex-choice-card nes-btn"
            onClick={() => onChoose('trainerdex')}
          >
            <span className="choice-icon" aria-hidden="true">
              VS
            </span>
            <span className="choice-title">TrainerDex</span>
            <span className="choice-copy">
              Browse Gym Leader, Kahuna, and Elite Four teams by region.
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
