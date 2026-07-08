/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
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

function StationNav({ activeStation, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeStationLabel =
    STATION_NAV_OPTIONS.find((station) => station.id === activeStation)?.label || 'Station';

  const handleNavigate = (stationId) => {
    setIsMenuOpen(false);
    if (stationId !== activeStation) {
      onNavigate(stationId);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <div className="header-actions">
      <button
        type="button"
        className="nes-btn station-menu-button"
        onClick={() => setIsMenuOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isMenuOpen}
      >
        Menu
      </button>
      <GitHubRepoLink />
      {isMenuOpen && (
        <div className="station-menu-overlay" role="presentation">
          <button
            type="button"
            className="station-menu-scrim"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close station menu"
          />
          <div
            className="station-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${activeStation}-station-menu-title`}
          >
            <div className="station-menu-heading">
              <div>
                <p>Current station</p>
                <h2 id={`${activeStation}-station-menu-title`}>{activeStationLabel}</h2>
              </div>
              <button
                type="button"
                className="nes-btn station-menu-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close station menu"
              >
                X
              </button>
            </div>
            <div className="station-menu-list" aria-label="Choose station">
              {STATION_NAV_OPTIONS.map((station) => (
                <button
                  key={station.id}
                  type="button"
                  className={`nes-btn station-menu-option ${
                    station.id === activeStation ? 'is-active' : ''
                  }`}
                  onClick={() => handleNavigate(station.id)}
                >
                  <span>{station.label}</span>
                  {station.id === activeStation && <strong>Now</strong>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StationNav;
