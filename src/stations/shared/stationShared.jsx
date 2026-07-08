import bugTypeIcon from '../../../pokedex/types/bug.png';
import darkTypeIcon from '../../../pokedex/types/dark.png';
import dragonTypeIcon from '../../../pokedex/types/dragon.png';
import electricTypeIcon from '../../../pokedex/types/electric.png';
import fairyTypeIcon from '../../../pokedex/types/fairy.png';
import fightingTypeIcon from '../../../pokedex/types/fighting.png';
import fireTypeIcon from '../../../pokedex/types/fire.png';
import flyingTypeIcon from '../../../pokedex/types/flying.png';
import ghostTypeIcon from '../../../pokedex/types/ghost.png';
import grassTypeIcon from '../../../pokedex/types/grass.png';
import groundTypeIcon from '../../../pokedex/types/ground.png';
import iceTypeIcon from '../../../pokedex/types/ice.png';
import normalTypeIcon from '../../../pokedex/types/normal.png';
import poisonTypeIcon from '../../../pokedex/types/poison.png';
import psychicTypeIcon from '../../../pokedex/types/psychic.png';
import rockTypeIcon from '../../../pokedex/types/rock.png';
import steelTypeIcon from '../../../pokedex/types/steel.png';
import waterTypeIcon from '../../../pokedex/types/water.png';
import physicalMoveIcon from '../../../pokedex/moves/move-physical.png';
import specialMoveIcon from '../../../pokedex/moves/move-special.png';
import statusMoveIcon from '../../../pokedex/moves/move-status.png';
import alphaSapphireGameArt from '../../../pokedex/games/AlphaSapphire.png';
import blackGameArt from '../../../pokedex/games/Black.png';
import diamondGameArt from '../../../pokedex/games/Diamond.jpg';
import emeraldGameArt from '../../../pokedex/games/Emerald.jpg';
import fireRedGameArt from '../../../pokedex/games/FireRed.png';
import heartGoldGameArt from '../../../pokedex/games/HeartGold.jpg';
import leafGreenGameArt from '../../../pokedex/games/LeafGreen.png';
import moonGameArt from '../../../pokedex/games/Moon.png';
import omegaRubyGameArt from '../../../pokedex/games/OmegaRuby.png';
import pearlGameArt from '../../../pokedex/games/Pearl.jpg';
import platinumGameArt from '../../../pokedex/games/Platinum.png';
import rubyGameArt from '../../../pokedex/games/Ruby.png';
import sapphireGameArt from '../../../pokedex/games/Sapphire.png';
import scarletGameArt from '../../../pokedex/games/Scarlet.png';
import shieldGameArt from '../../../pokedex/games/Shield.png';
import soulSilverGameArt from '../../../pokedex/games/SoulSilver.jpg';
import sunGameArt from '../../../pokedex/games/Sun.png';
import swordGameArt from '../../../pokedex/games/Sword.png';
import violetGameArt from '../../../pokedex/games/Violet.png';
import whiteGameArt from '../../../pokedex/games/White.png';
import xGameArt from '../../../pokedex/games/X.png';
import yGameArt from '../../../pokedex/games/Y.png';
import platform3ds from '../../../pokedex/platform/3DS.png';
import platformDs from '../../../pokedex/platform/DS.png';
import platformGameBoyAdvance from '../../../pokedex/platform/GameBoyAdvance.png';
import platformSwitch from '../../../pokedex/platform/Switch.png';

const COLLECTION_STORAGE_KEY = 'pokemon-pack-simulator-collection';
const WHO_LEADERBOARD_STORAGE_KEY = 'whos-that-pokemon-leaderboard';
const CARD_FLIP_DELAY = 200;
const PACK_PREP_DELAY = 900;
const TEN_PACK_FLIP_DELAY = CARD_FLIP_DELAY / 10;
const CARD_BACK_IMAGE = 'https://images.pokemontcg.io/unbroken-bond/back.png';
const REPOSITORY_URL = 'https://github.com/TeohHW/Pokemon-TCG-Simulator-React';
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEAPI_CACHE_DB_NAME = 'pokemon-pack-simulator-pokeapi-cache';
const POKEAPI_CACHE_STORE_NAME = 'resources';
const POKEAPI_CACHE_DB_VERSION = 1;
const POKEDEX_OPTIONS = [
  {
    id: 'kanto',
    label: 'FireRed / LeafGreen',
    region: 'Kanto',
    art: [fireRedGameArt, leafGreenGameArt],
    releaseDate: '2004',
    director: 'Junichi Masuda',
    summary: 'You play as a new Trainer from Pallet Town, travel across Kanto, defeat Gym Leaders, disrupt Team Rocket, and challenge the Pokemon League while completing the Pokedex.',
    platforms: [{ name: 'Game Boy Advance', icon: platformGameBoyAdvance }],
    starters: [1, 4, 7],
  },
  {
    id: 'hoenn',
    label: 'Ruby / Sapphire / Emerald',
    region: 'Hoenn',
    art: [rubyGameArt, sapphireGameArt, emeraldGameArt],
    releaseDate: '2002-2004',
    director: 'Junichi Masuda / Shigeki Morimoto',
    summary: 'You play as a young Trainer newly moved to Hoenn, pursue Gym Badges, and become caught between Team Magma and Team Aqua as ancient Pokemon threaten the region\'s balance.',
    platforms: [{ name: 'Game Boy Advance', icon: platformGameBoyAdvance }],
    starters: [252, 255, 258],
  },
  {
    id: 'updated-johto',
    label: 'HeartGold / SoulSilver',
    region: 'Johto',
    art: [heartGoldGameArt, soulSilverGameArt],
    releaseDate: '2009',
    director: 'Shigeki Morimoto',
    summary: 'You play as a Johto Trainer, investigate Team Rocket\'s return, earn Gym Badges across Johto, then travel through Kanto before confronting Red at Mt. Silver.',
    platforms: [{ name: 'Nintendo DS', icon: platformDs }],
    starters: [152, 155, 158],
  },
  {
    id: 'extended-sinnoh',
    label: 'Diamond / Pearl / Platinum',
    region: 'Sinnoh',
    art: [diamondGameArt, pearlGameArt, platinumGameArt],
    releaseDate: '2006-2008',
    director: 'Junichi Masuda / Takeshi Kawachimaru',
    summary: 'You play as a Sinnoh Trainer pursuing the Pokemon League while Team Galactic attempts to reshape reality through legendary Pokemon, culminating at Spear Pillar and the Distortion World.',
    platforms: [{ name: 'Nintendo DS', icon: platformDs }],
    starters: [387, 390, 393],
  },
  {
    id: 'updated-unova',
    label: 'Black 2 / White 2',
    region: 'Unova',
    art: [blackGameArt, whiteGameArt],
    releaseDate: '2012',
    director: 'Takao Unno',
    summary: 'You first follow Unova\'s conflict with N and Team Plasma over whether Pokemon should be separated from people; two years later, you play as a new Trainer facing a revived Team Plasma and Kyurem\'s threat to freeze Unova.',
    platforms: [{ name: 'Nintendo DS', icon: platformDs }],
    starters: [495, 498, 501],
  },
  {
    id: 'kalos-central',
    label: 'X / Y',
    region: 'Kalos',
    art: [xGameArt, yGameArt],
    releaseDate: '2013',
    director: 'Junichi Masuda',
    summary: 'You play as a Kalos Trainer journeying with friends, battle Team Flare, and stop Lysandre from using the ultimate weapon powered by legendary Pokemon.',
    platforms: [{ name: 'Nintendo 3DS', icon: platform3ds }],
    starters: [650, 653, 656],
  },
  {
    id: 'updated-hoenn',
    label: 'Omega Ruby / Alpha Sapphire',
    region: 'Hoenn',
    art: [omegaRubyGameArt, alphaSapphireGameArt],
    releaseDate: '2014',
    director: 'Shigeru Ohmori',
    summary: 'You play as a new Hoenn Trainer, pursue the League, stop Team Magma or Team Aqua from awakening ancient Pokemon, then face the Delta Episode\'s meteor crisis.',
    platforms: [{ name: 'Nintendo 3DS', icon: platform3ds }],
    starters: [252, 255, 258],
  },
  {
    id: 'original-alola',
    label: 'Sun / Moon',
    region: 'Alola',
    art: [sunGameArt, moonGameArt],
    releaseDate: '2016',
    director: 'Shigeru Ohmori',
    summary: 'You play as a young Trainer taking Alola\'s island challenge, confront Team Skull and the Aether Foundation, and uncover the mystery of Ultra Beasts and Nebby.',
    platforms: [{ name: 'Nintendo 3DS', icon: platform3ds }],
    starters: [722, 725, 728],
  },
  {
    id: 'galar',
    label: 'Sword / Shield',
    region: 'Galar',
    art: [swordGameArt, shieldGameArt],
    releaseDate: '2019',
    director: 'Shigeru Ohmori',
    summary: 'You play as a Galar Gym Challenger competing in stadium battles while uncovering Chairman Rose\'s energy crisis and the legend of Zacian, Zamazenta, and Eternatus.',
    platforms: [{ name: 'Nintendo Switch', icon: platformSwitch }],
    starters: [810, 813, 816],
  },
  {
    id: 'paldea',
    label: 'Scarlet / Violet',
    region: 'Paldea',
    art: [scarletGameArt, violetGameArt],
    releaseDate: '2022',
    director: 'Shigeru Ohmori',
    summary: 'You play as a Paldea academy student on a treasure hunt across three paths, facing Gym Leaders, Team Star, Titan Pokemon, and the mystery of Area Zero.',
    platforms: [{ name: 'Nintendo Switch', icon: platformSwitch }],
    starters: [906, 909, 912],
  },
];
const ALL_POKEDEX_OPTION = {
  id: 'all',
  label: 'All Games',
  region: 'Every listed Pokedex',
  art: [],
  releaseDate: '1996-present',
  platforms: [
    { name: 'Game Boy Advance', icon: platformGameBoyAdvance },
    { name: 'Nintendo DS', icon: platformDs },
    { name: 'Nintendo 3DS', icon: platform3ds },
    { name: 'Nintendo Switch', icon: platformSwitch },
  ],
};
const TYPE_ICONS = {
  bug: bugTypeIcon,
  dark: darkTypeIcon,
  dragon: dragonTypeIcon,
  electric: electricTypeIcon,
  fairy: fairyTypeIcon,
  fighting: fightingTypeIcon,
  fire: fireTypeIcon,
  flying: flyingTypeIcon,
  ghost: ghostTypeIcon,
  grass: grassTypeIcon,
  ground: groundTypeIcon,
  ice: iceTypeIcon,
  normal: normalTypeIcon,
  poison: poisonTypeIcon,
  psychic: psychicTypeIcon,
  rock: rockTypeIcon,
  steel: steelTypeIcon,
  water: waterTypeIcon,
};
const MOVE_CATEGORY_ICONS = {
  physical: physicalMoveIcon,
  special: specialMoveIcon,
  status: statusMoveIcon,
};
const LATEST_VERSION_GROUPS = [
  'scarlet-violet',
  'sword-shield',
  'sun-moon',
  'omega-ruby-alpha-sapphire',
  'x-y',
  'black-2-white-2',
  'black-white',
  'heartgold-soulsilver',
  'platinum',
  'diamond-pearl',
  'emerald',
  'firered-leafgreen',
  'ruby-sapphire',
];
const POKEDEX_VERSION_GROUPS = {
  kanto: 'firered-leafgreen',
  hoenn: 'emerald',
  'updated-johto': 'heartgold-soulsilver',
  'extended-sinnoh': 'platinum',
  'updated-unova': 'black-2-white-2',
  'kalos-central': 'x-y',
  'updated-hoenn': 'omega-ruby-alpha-sapphire',
  'original-alola': 'sun-moon',
  galar: 'sword-shield',
  paldea: 'scarlet-violet',
};
const TYPE_NAMES = Object.keys(TYPE_ICONS);
const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};
const STAT_SORT_OPTIONS = [
  { id: 'hp', label: 'HP' },
  { id: 'attack', label: 'Attack' },
  { id: 'defense', label: 'Defense' },
  { id: 'special-attack', label: 'Sp. Atk' },
  { id: 'special-defense', label: 'Sp. Def' },
  { id: 'speed', label: 'Speed' },
];
const POKEDEX_METADATA_SORTS = new Set([
  'type',
  'legendary',
  'generation',
  ...STAT_SORT_OPTIONS.map((stat) => `stat-${stat.id}`),
]);
const GENERATION_ORDER = {
  'generation-i': 1,
  'generation-ii': 2,
  'generation-iii': 3,
  'generation-iv': 4,
  'generation-v': 5,
  'generation-vi': 6,
  'generation-vii': 7,
  'generation-viii': 8,
  'generation-ix': 9,
};

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const formatPokemonName = (name = '') =>
  name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatNoBreakSlashLabel = (label = '') => label.replace(/\s*\/\s*/g, '\u00a0/\u00a0');

const normalizePokemonName = (name = '') =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const normalizeSearchText = (value = '') =>
  String(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const compactSearchText = (value = '') => normalizeSearchText(value).replace(/\s+/g, '');

const POKEMON_LOOKUP_ALIASES = {
  farfetchd: 'farfetchd',
  sirfetchd: 'sirfetchd',
  'mr mime': 'mr-mime',
  mrmime: 'mr-mime',
  'mime jr': 'mime-jr',
  mimejr: 'mime-jr',
  'type null': 'type-null',
  typenull: 'type-null',
  'ho oh': 'ho-oh',
  hooh: 'ho-oh',
  'porygon z': 'porygon-z',
  porygonz: 'porygon-z',
  'jangmo o': 'jangmo-o',
  jangmoo: 'jangmo-o',
  'hakamo o': 'hakamo-o',
  hakamoo: 'hakamo-o',
  'kommo o': 'kommo-o',
  kommoo: 'kommo-o',
  'nidoran f': 'nidoran-f',
  nidoranf: 'nidoran-f',
  'nidoran female': 'nidoran-f',
  nidoranfemale: 'nidoran-f',
  'nidoran m': 'nidoran-m',
  nidoranm: 'nidoran-m',
  'nidoran male': 'nidoran-m',
  nidoranmale: 'nidoran-m',
};

const POKEMON_SEARCH_VALIDATION_MESSAGE = 'Please enter a valid Pokemon name or National Dex number.';

const getPokemonLookupValidationError = (pokemonName = '') => {
  const searchValue = String(pokemonName).trim();

  if (!searchValue) {
    return POKEMON_SEARCH_VALIDATION_MESSAGE;
  }

  if (/^-/.test(searchValue)) {
    return POKEMON_SEARCH_VALIDATION_MESSAGE;
  }

  if (/^\d+$/.test(searchValue)) {
    return Number(searchValue) > 0 ? '' : POKEMON_SEARCH_VALIDATION_MESSAGE;
  }

  return /^[a-z0-9]+(?:[ '\-.♀♂]+[a-z0-9]+)*[♀♂]?$/i.test(searchValue)
    ? ''
    : POKEMON_SEARCH_VALIDATION_MESSAGE;
};

const matchesPokemonSearch = (pokemon, searchValue = '') => {
  const normalizedSearch = normalizePokemonName(searchValue);
  if (!normalizedSearch) {
    return true;
  }

  const normalizedPokemonName = normalizePokemonName(pokemon.name);
  const entryNumber = String(pokemon.entryNumber);
  const paddedEntryNumber = entryNumber.padStart(3, '0');

  return (
    normalizedPokemonName.includes(normalizedSearch) ||
    entryNumber.includes(normalizedSearch) ||
    paddedEntryNumber.includes(normalizedSearch)
  );
};

const getPokemonIdFromUrl = (url = '') => {
  const [, id] = url.match(/\/pokemon-species\/(\d+)\//) || [];
  return id || '';
};

const getPokemonSpriteUrl = (pokemonId) =>
  pokemonId ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png` : '';

const getPokemonOfficialArtworkUrl = (pokemonId) =>
  pokemonId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
    : '';

const pokeApiMemoryCache = new Map();
let pokeApiCacheDbPromise = null;

const makeAbortError = () => {
  if (typeof DOMException !== 'undefined') {
    return new DOMException('The operation was aborted.', 'AbortError');
  }

  const error = new Error('The operation was aborted.');
  error.name = 'AbortError';
  return error;
};

const getPokeApiCacheDb = () => {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  if (!pokeApiCacheDbPromise) {
    pokeApiCacheDbPromise = new Promise((resolve) => {
      const request = window.indexedDB.open(POKEAPI_CACHE_DB_NAME, POKEAPI_CACHE_DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(POKEAPI_CACHE_STORE_NAME)) {
          db.createObjectStore(POKEAPI_CACHE_STORE_NAME, { keyPath: 'url' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    });
  }

  return pokeApiCacheDbPromise;
};

const readCachedPokeApiResource = async (url) => {
  if (pokeApiMemoryCache.has(url)) {
    return pokeApiMemoryCache.get(url);
  }

  const db = await getPokeApiCacheDb();
  if (!db) {
    return null;
  }

  return new Promise((resolve) => {
    const transaction = db.transaction(POKEAPI_CACHE_STORE_NAME, 'readonly');
    const store = transaction.objectStore(POKEAPI_CACHE_STORE_NAME);
    const request = store.get(url);

    request.onsuccess = () => {
      const data = request.result?.data || null;

      if (data) {
        pokeApiMemoryCache.set(url, data);
      }

      resolve(data);
    };
    request.onerror = () => resolve(null);
  });
};

const writeCachedPokeApiResource = async (url, data) => {
  pokeApiMemoryCache.set(url, data);

  const db = await getPokeApiCacheDb();
  if (!db) {
    return;
  }

  await new Promise((resolve) => {
    const transaction = db.transaction(POKEAPI_CACHE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(POKEAPI_CACHE_STORE_NAME);

    store.put({
      url,
      data,
      cachedAt: new Date().toISOString(),
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => resolve();
    transaction.onabort = () => resolve();
  });
};

const fetchPokeApiJson = async (url, options = {}, errorMessage = 'Unable to load PokeAPI resource.') => {
  const cacheKey = String(url);

  if (options.signal?.aborted) {
    throw makeAbortError();
  }

  const cachedResource = await readCachedPokeApiResource(cacheKey);
  if (options.signal?.aborted) {
    throw makeAbortError();
  }

  if (cachedResource) {
    return cachedResource;
  }

  const response = await fetch(cacheKey, options);

  if (!response.ok) {
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  await writeCachedPokeApiResource(cacheKey, data);
  return data;
};

const fetchPokemonListMetadata = (pokemonEntry, options = {}) =>
  fetchPokeApiJson(
    `${POKEAPI_BASE_URL}/pokemon/${pokemonEntry.pokemonId || normalizePokemonLookup(pokemonEntry.name)}`,
    options,
    'Unable to load Pokemon sort data.',
  )
    .then((pokemon) =>
      fetchPokeApiJson(pokemon.species.url, options, 'Unable to load Pokemon species sort data.')
        .then((species) => ({
          name: pokemonEntry.name,
          primaryType: pokemon.types[0]?.type?.name || '',
          types: pokemon.types.map(({ type }) => type.name),
          isLegendary: Boolean(species.is_legendary),
          generation: species.generation?.name || '',
          generationOrder: GENERATION_ORDER[species.generation?.name] || Number.MAX_SAFE_INTEGER,
          stats: Object.fromEntries(
            pokemon.stats.map((stat) => [stat.stat.name, stat.base_stat]),
          ),
        })),
    );

const normalizePokemonLookup = (pokemonName = '') =>
  {
    const searchKey = normalizeSearchText(
      String(pokemonName)
        .replace(/♀/g, ' f')
        .replace(/♂/g, ' m'),
    );
    const compactSearchKey = searchKey.replace(/\s+/g, '');

    return POKEMON_LOOKUP_ALIASES[searchKey] ||
      POKEMON_LOOKUP_ALIASES[compactSearchKey] ||
      searchKey.replace(/\s+/g, '-');
  };

const fetchPokemonByNameOrSpecies = (pokemonName, options = {}) => {
  const validationError = getPokemonLookupValidationError(pokemonName);
  if (validationError) {
    return Promise.reject(new Error(validationError));
  }

  const normalizedName = normalizePokemonLookup(pokemonName);
  if (!normalizedName) {
    return Promise.reject(new Error('Pokemon not found. Try a name or National Dex number.'));
  }

  return fetchPokeApiJson(
    `${POKEAPI_BASE_URL}/pokemon/${normalizedName}`,
    options,
    'Pokemon not found. Try a name or National Dex number.',
  )
    .catch((fetchError) => {
      if (fetchError.name === 'AbortError') {
        throw fetchError;
      }

      if (!fetchError.status) {
        throw fetchError;
      }

      return fetchPokeApiJson(
        `${POKEAPI_BASE_URL}/pokemon-species/${normalizedName}`,
        options,
        'Pokemon not found. Try a name or National Dex number.',
      )
        .then((species) => {
          const defaultVariety =
            species.varieties?.find((variety) => variety.is_default) ||
            species.varieties?.[0];

          if (!defaultVariety?.pokemon?.url) {
            throw new Error('Pokemon species found, but no default form is available.');
          }

          return fetchPokeApiJson(defaultVariety.pokemon.url, options, 'Pokemon form could not be loaded.');
        });
    });
};

const getPokemonIdFromSpeciesUrl = (url = '') => {
  const [, id] = url.match(/\/pokemon-species\/(\d+)\//) || [];
  return id || '';
};

const getPokemonIdFromPokemonUrl = (url = '') => {
  const [, id] = url.match(/\/pokemon\/(\d+)\//) || [];
  return id || '';
};

const getEnglishFlavorText = (species) => {
  const entry = species?.flavor_text_entries
    ?.filter((flavorEntry) => flavorEntry.language.name === 'en')
    .at(-1);

  return entry?.flavor_text?.replace(/[\f\n\r]/g, ' ') || '';
};

const cleanPokeApiText = (text = '') => text.replace(/[\f\n\r]/g, ' ');

const getEnglishEntry = (entries = []) =>
  entries.filter((entry) => entry.language.name === 'en').at(-1);

const getEnglishEffectText = (entries = []) => {
  const entry = getEnglishEntry(entries);
  return cleanPokeApiText(entry?.effect || entry?.short_effect || '');
};

const getEnglishShortEffectText = (entries = []) => {
  const entry = getEnglishEntry(entries);
  return cleanPokeApiText(entry?.short_effect || entry?.effect || '');
};

const getEnglishApiFlavorText = (entries = []) => {
  const entry = getEnglishEntry(entries);
  return cleanPokeApiText(entry?.flavor_text || '');
};

const formatEvolutionRequirement = (details = []) => {
  const detail = details[0];
  if (!detail) return 'Base form';

  if (detail.min_level) return `Level ${detail.min_level}`;
  if (detail.item?.name) return `Use ${formatPokemonName(detail.item.name)}`;
  if (detail.held_item?.name) return `Hold ${formatPokemonName(detail.held_item.name)}`;
  if (detail.known_move?.name) return `Know ${formatPokemonName(detail.known_move.name)}`;
  if (detail.known_move_type?.name) return `Know ${formatPokemonName(detail.known_move_type.name)} move`;
  if (detail.min_happiness) return `Happiness ${detail.min_happiness}`;
  if (detail.min_beauty) return `Beauty ${detail.min_beauty}`;
  if (detail.min_affection) return `Affection ${detail.min_affection}`;
  if (detail.location?.name) return `At ${formatPokemonName(detail.location.name)}`;
  if (detail.trade_species?.name) return `Trade for ${formatPokemonName(detail.trade_species.name)}`;
  if (detail.trigger?.name === 'trade') return 'Trade';
  if (detail.trigger?.name) return formatPokemonName(detail.trigger.name);

  return 'Special condition';
};

const buildEvolutionTree = (chainNode, requirement = 'Base form') => {
  if (!chainNode) return null;

  return {
    id: getPokemonIdFromSpeciesUrl(chainNode.species.url),
    name: chainNode.species.name,
    requirement,
    children: chainNode.evolves_to.map((evolutionNode) =>
      buildEvolutionTree(
        evolutionNode,
        formatEvolutionRequirement(evolutionNode.evolution_details),
      ),
    ),
  };
};

const getTypeWeaknesses = (typeData) => {
  const weaknesses = new Map();

  typeData.forEach((type) => {
    type.damage_relations.double_damage_from.forEach((weakType) => {
      weaknesses.set(weakType.name, (weaknesses.get(weakType.name) || 1) * 2);
    });
    type.damage_relations.half_damage_from.forEach((resistedType) => {
      weaknesses.set(resistedType.name, (weaknesses.get(resistedType.name) || 1) * 0.5);
    });
    type.damage_relations.no_damage_from.forEach((immuneType) => {
      weaknesses.set(immuneType.name, 0);
    });
  });

  return [...weaknesses.entries()]
    .filter(([, multiplier]) => multiplier > 1)
    .map(([name, multiplier]) => ({ name, multiplier }))
    .sort((firstType, secondType) => firstType.name.localeCompare(secondType.name));
};

const buildPokedexEntries = (pokedexPayloads, useNationalNumbers = false) => {
  const uniquePokemon = new Map();

  pokedexPayloads.forEach((payload) => {
    (payload.pokemon_entries || []).forEach((entry) => {
      const pokemonId = getPokemonIdFromUrl(entry.pokemon_species.url);

      if (!uniquePokemon.has(entry.pokemon_species.name)) {
        uniquePokemon.set(entry.pokemon_species.name, {
          name: entry.pokemon_species.name,
          entryNumber: useNationalNumbers ? Number(pokemonId || entry.entry_number) : entry.entry_number,
          pokemonId,
        });
      }
    });
  });

  return [...uniquePokemon.values()].sort((firstPokemon, secondPokemon) => (
    firstPokemon.entryNumber - secondPokemon.entryNumber
  ));
};

const formatVersionGroupName = (name = '') =>
  name
    .split('-')
    .map((word) => (word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');

const formatGenerationName = (name = '') => {
  const generationNumber = {
    'generation-i': '1',
    'generation-ii': '2',
    'generation-iii': '3',
    'generation-iv': '4',
    'generation-v': '5',
    'generation-vi': '6',
    'generation-vii': '7',
    'generation-viii': '8',
    'generation-ix': '9',
  }[name];

  return generationNumber ? `Generation ${generationNumber}` : formatVersionGroupName(name);
};

const getAvailableLevelUpMoveGroups = (pokemon) => {
  if (!pokemon?.moves?.length) {
    return [];
  }

  const groupNames = new Set();

  pokemon.moves.forEach((move) => {
    move.version_group_details.forEach((detail) => {
      if (detail.move_learn_method.name === 'level-up') {
        groupNames.add(detail.version_group.name);
      }
    });
  });

  return [...groupNames].filter((groupName) => LATEST_VERSION_GROUPS.includes(groupName)).sort((firstGroup, secondGroup) => {
    const firstIndex = LATEST_VERSION_GROUPS.indexOf(firstGroup);
    const secondIndex = LATEST_VERSION_GROUPS.indexOf(secondGroup);
    return (
      (firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex) -
      (secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex)
    );
  });
};

const getTeamVersionGroup = (pokedexId) =>
  POKEDEX_VERSION_GROUPS[pokedexId] || LATEST_VERSION_GROUPS[0];

const TEAM_POKEDEX_OPTIONS = [
  { ...ALL_POKEDEX_OPTION, label: 'National Pokedex', region: 'All Regions' },
  ...POKEDEX_OPTIONS,
];
const QUIZ_CATEGORY_OPTIONS = [
  { id: 'mixed', label: 'Mixed Quiz' },
  { id: 'type', label: 'Type' },
  { id: 'evolution', label: 'Evolution' },
  { id: 'generation', label: 'Generation' },
  { id: 'legendary', label: 'Legendary' },
  { id: 'pokedex-entry', label: 'Pokedex Entry' },
  { id: 'ability', label: 'Ability' },
  { id: 'comparison', label: 'Comparisons' },
  { id: 'stats', label: 'Strongest Stat' },
  { id: 'type-effectiveness', label: 'Effectiveness' },
  { id: 'move', label: 'Moves' },
  { id: 'number-region', label: 'Number / Region' },
  { id: 'cry-sprite', label: 'Cry / Sprite' },
  { id: 'starter-evolution', label: 'Starter / Evolution Line' },
];
const STATION_NAV_OPTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'pokedex', label: 'Pokedex' },
  { id: 'tcg', label: 'TCG Simulator' },
  { id: 'who', label: "Who's That?" },
  { id: 'team', label: 'Team Planner' },
  { id: 'quiz', label: 'Pokemon Quiz' },
  { id: 'trainerdex', label: 'TrainerDex' },
];
const COMMON_ABILITY_DISTRACTORS = [
  'overgrow',
  'blaze',
  'torrent',
  'shield-dust',
  'static',
  'intimidate',
  'levitate',
  'swift-swim',
  'chlorophyll',
  'pressure',
  'synchronize',
  'inner-focus',
  'sturdy',
  'compound-eyes',
  'huge-power',
  'guts',
];

const getLevelUpMovesForVersionGroup = (pokemon, versionGroup) => {
  if (!pokemon?.moves?.length || !versionGroup) {
    return [];
  }

  return pokemon.moves
    .map((move) => {
      const detail = move.version_group_details.find(
        (versionDetail) =>
          versionDetail.version_group.name === versionGroup &&
          versionDetail.move_learn_method.name === 'level-up',
      );

      return detail
        ? {
            name: move.move.name,
            url: move.move.url,
            level: detail.level_learned_at,
          }
        : null;
    })
    .filter(Boolean)
    .sort((firstMove, secondMove) => (
      firstMove.level - secondMove.level || firstMove.name.localeCompare(secondMove.name)
    ));
};

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

const summarizeTeamTypeMatchups = (teamMembers) =>
  TYPE_NAMES.map((typeName) => {
    const multipliers = teamMembers
      .map((member) => member.defenseMultipliers?.[typeName])
      .filter((multiplier) => multiplier !== undefined);

    return {
      type: typeName,
      weak: multipliers.filter((multiplier) => multiplier > 1).length,
      resist: multipliers.filter((multiplier) => multiplier > 0 && multiplier < 1).length,
      immune: multipliers.filter((multiplier) => multiplier === 0).length,
    };
  });

const summarizeTeamMoveCoverage = (teamMembers) => {
  const selectedMoveTypes = [
    ...new Set(
      teamMembers.flatMap((member) =>
        member.selectedMoves
          .map((moveName) => member.availableMoves.find((move) => move.name === moveName)?.type)
          .filter(Boolean),
      ),
    ),
  ];

  return TYPE_NAMES.map((typeName) => ({
    type: typeName,
    hitBy: selectedMoveTypes.filter((moveType) =>
      teamMembers[0]?.moveTypeCoverage?.[moveType]?.includes(typeName),
    ),
  })).filter((coverage) => coverage.hitBy.length);
};

const getTeamAverageStats = (teamMembers) =>
  STAT_SORT_OPTIONS.map((stat) => {
    const total = teamMembers.reduce((sum, member) => sum + (member.stats[stat.id] || 0), 0);
    return {
      ...stat,
      value: teamMembers.length ? Math.round(total / teamMembers.length) : 0,
    };
  });

const shuffleItems = (items) => [...items].sort(() => Math.random() - 0.5);

const makeChoices = (correctAnswer, distractors, count = 4) => {
  const uniqueDistractors = [...new Set(distractors)]
    .filter((item) => item && item !== correctAnswer);
  return shuffleItems([correctAnswer, ...shuffleItems(uniqueDistractors).slice(0, count - 1)]);
};

const getPokemonPool = (selectedDex, pokemonList) =>
  pokemonList.filter((pokemon) => pokemon.pokemonId || selectedDex === ALL_POKEDEX_OPTION.id);

const getPokemonQuizData = (pokemonEntry, options = {}) =>
  fetchPokemonByNameOrSpecies(pokemonEntry.name, options)
    .then((pokemon) =>
      fetchPokeApiJson(pokemon.species.url, options, 'Unable to load Pokemon quiz data.')
        .then((species) => ({ pokemon, species })),
    );

const getEvolutionNames = (node) =>
  node
    ? [node.species.name, ...node.evolves_to.flatMap((child) => getEvolutionNames(child))]
    : [];

const findEvolutionNode = (node, pokemonName, parentName = '') => {
  if (!node) return null;
  if (node.species.name === pokemonName) {
    return { node, parentName };
  }

  return node.evolves_to
    .map((child) => findEvolutionNode(child, pokemonName, node.species.name))
    .find(Boolean) || null;
};

const loadEvolutionChain = (species, options = {}) =>
  fetchPokeApiJson(species.evolution_chain.url, options, 'Unable to load evolution quiz data.');

const getRegionForGeneration = (generationName = '') =>
  ({
    'generation-i': 'Kanto',
    'generation-ii': 'Johto',
    'generation-iii': 'Hoenn',
    'generation-iv': 'Sinnoh',
    'generation-v': 'Unova',
    'generation-vi': 'Kalos',
    'generation-vii': 'Alola',
    'generation-viii': 'Galar',
    'generation-ix': 'Paldea',
  }[generationName] || 'Unknown');

const maskPokemonNameInText = (text = '', pokemonName = '') => {
  const nameParts = [
    pokemonName,
    formatPokemonName(pokemonName),
    ...pokemonName.split('-'),
  ]
    .filter((part) => part && part.length > 2)
    .sort((firstPart, secondPart) => secondPart.length - firstPart.length);

  return nameParts.reduce((maskedText, namePart) => {
    const escapedName = namePart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return maskedText.replace(new RegExp(`\\b${escapedName}\\b`, 'gi'), 'this Pokemon');
  }, text);
};

const buildPokemonQuizQuestion = async ({
  category,
  pokemonList,
  selectedDex,
  typeChart,
}) => {
  const pool = getPokemonPool(selectedDex, pokemonList);

  if (!pool.length) {
    throw new Error('No Pokemon are available for this quiz.');
  }

  const activeCategory = category === 'mixed'
    ? randomItem(QUIZ_CATEGORY_OPTIONS.filter((option) => option.id !== 'mixed')).id
    : category;
  const pokemonEntry = randomItem(pool);
  const { pokemon, species } = await getPokemonQuizData(pokemonEntry);
  const pokemonName = formatPokemonName(pokemon.species?.name || pokemon.name);
  const artwork = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;
  const sprite = pokemon.sprites.front_default;
  const getPoolOfficialArtwork = (pokemonNameValue) => {
    const matchingEntry = pool.find((entry) => entry.name === pokemonNameValue);
    return getPokemonOfficialArtworkUrl(matchingEntry?.pokemonId);
  };
  const randomPokemonNameChoices = () =>
    pool.map((entry) => formatPokemonName(entry.name));

  if (activeCategory === 'type') {
    const questionKind = pokemon.types.length > 1 && Math.random() > 0.45 ? 'dual' : 'single';
    const correctAnswer = pokemon.types.map(({ type }) => formatPokemonName(type.name)).join(' / ');
    const typeCombos = TYPE_NAMES.flatMap((firstType) =>
      TYPE_NAMES.map((secondType) =>
        firstType === secondType
          ? formatPokemonName(firstType)
          : `${formatPokemonName(firstType)} / ${formatPokemonName(secondType)}`,
      ),
    );

    return {
      category: questionKind === 'dual' ? 'Dual Type' : 'Pokemon Type',
      prompt: questionKind === 'dual'
        ? `Which type combination does ${pokemonName} have?`
        : `What type is ${pokemonName}?`,
      answer: correctAnswer,
      choices: makeChoices(correctAnswer, typeCombos),
      visual: { kind: 'silhouette', image: artwork, label: 'Type scan' },
    };
  }

  if (activeCategory === 'evolution' || activeCategory === 'starter-evolution') {
    const chain = await loadEvolutionChain(species);
    const match = findEvolutionNode(chain.chain, species.name);
    const chainNames = getEvolutionNames(chain.chain);
    const evolvesToNames = match?.node.evolves_to.map((evolution) => evolution.species.name) || [];
    const evolvesTo = randomItem(evolvesToNames) || '';
    const evolvesFrom = match?.parentName || '';
    const evolutionQuestionKinds = [
      evolvesTo && 'evolves-to',
      evolvesFrom && 'evolves-from',
      'final',
      chainNames.length > 1 && 'missing',
      activeCategory === 'starter-evolution' && 'starter',
      activeCategory === 'starter-evolution' && 'does-not-evolve',
    ].filter(Boolean);
    const questionKind = randomItem(evolutionQuestionKinds);

    if (questionKind === 'evolves-to') {
      const answer = formatPokemonName(evolvesTo);
      const validEvolutionAnswers = new Set(evolvesToNames.map(formatPokemonName));
      return {
        category: 'Evolution',
        prompt: evolvesToNames.length > 1
          ? `Which of these Pokemon can ${pokemonName} evolve into next?`
          : `What is the next evolution of ${pokemonName}?`,
        answer,
        choices: makeChoices(
          answer,
          randomPokemonNameChoices().filter((choice) => !validEvolutionAnswers.has(choice)),
        ),
        visual: {
          kind: 'art-line',
          images: [{ image: artwork, fallback: sprite }],
          label: `${pokemonName} -> ?`,
        },
      };
    }

    if (questionKind === 'evolves-from') {
      const answer = formatPokemonName(evolvesFrom);
      return {
        category: 'Pre-Evolution',
        prompt: `Which Pokemon evolves directly into ${pokemonName}?`,
        answer,
        choices: makeChoices(answer, randomPokemonNameChoices()),
        visual: {
          kind: 'art-line',
          images: [{ image: artwork, fallback: sprite }],
          label: `? -> ${pokemonName}`,
        },
      };
    }

    if (questionKind === 'missing') {
      const answer = formatPokemonName(chainNames.at(-1));
      const shownEvolutionNames = chainNames.slice(0, -1);
      return {
        category: 'Missing Evolution',
        prompt: `Which Pokemon completes this evolution line: ${shownEvolutionNames.map(formatPokemonName).join(' -> ')} -> ?`,
        answer,
        choices: makeChoices(answer, randomPokemonNameChoices()),
        visual: {
          kind: 'art-line',
          images: shownEvolutionNames.map((name) => {
            const matchingEntry = pool.find((entry) => entry.name === name);
            return {
              image: getPoolOfficialArtwork(name),
              fallback: getPokemonSpriteUrl(matchingEntry?.pokemonId),
            };
          }),
          label: 'Evolution line',
        },
      };
    }

    if (questionKind === 'starter') {
      const starterNames = new Set(POKEDEX_OPTIONS.flatMap((pokedex) =>
        pokedex.starters.map((starterId) =>
          pool.find((entry) => entry.pokemonId === String(starterId))?.name,
        ),
      ).filter(Boolean));
      const answer = starterNames.has(species.name) ? 'Starter Pokemon' : 'Not a starter';
      return {
        category: 'Starter Pokemon',
        prompt: `Is ${pokemonName} a starter Pokemon in this quiz pool?`,
        answer,
        choices: ['Starter Pokemon', 'Not a starter'],
        visual: { kind: 'silhouette', image: artwork, label: 'Starter check' },
      };
    }

    if (questionKind === 'does-not-evolve') {
      const noEvolutionEntries = shuffleItems(pool).slice(0, 16);
      const candidates = await Promise.all(
        noEvolutionEntries.map((entry) =>
          getPokemonQuizData(entry)
            .then(({ species: candidateSpecies }) => loadEvolutionChain(candidateSpecies))
            .then((candidateChain) => ({
              name: entry.name,
              doesNotEvolve: getEvolutionNames(candidateChain.chain).length === 1,
            }))
            .catch(() => null),
        ),
      );
      const answerEntry = candidates.find((candidate) => candidate?.doesNotEvolve);
      if (answerEntry) {
        const answer = formatPokemonName(answerEntry.name);
        return {
          category: 'Does Not Evolve',
          prompt: 'Which one of these Pokemon does not evolve?',
          answer,
          choices: makeChoices(answer, candidates.filter(Boolean).map((candidate) => formatPokemonName(candidate.name))),
          visual: { kind: 'badge', label: 'Evolution check' },
        };
      }
    }

    const answer = evolvesTo ? 'No' : 'Yes';
    return {
      category: 'Final Evolution',
      prompt: `Is ${pokemonName} the final form in its evolution line?`,
      answer,
      choices: ['Yes', 'No'],
      visual: { kind: 'silhouette', image: artwork, label: 'Final form?' },
    };
  }

  if (activeCategory === 'generation') {
    const answer = formatGenerationName(species.generation?.name);
    return {
      category: 'Generation',
      prompt: `Which generation introduced ${pokemonName}?`,
      answer,
      choices: makeChoices(answer, Object.keys(GENERATION_ORDER).map(formatGenerationName)),
      visual: { kind: 'sprite', image: sprite, label: 'Archive lookup' },
    };
  }

  if (activeCategory === 'legendary') {
    const answer = species.is_legendary ? 'Legendary' : species.is_mythical ? 'Mythical' : 'Regular';
    return {
      category: 'Legendary Status',
      prompt: `How is ${pokemonName} classified?`,
      answer,
      choices: ['Legendary', 'Mythical', 'Regular'],
      visual: { kind: 'silhouette', image: artwork, label: 'Rarity scan' },
    };
  }

  if (activeCategory === 'pokedex-entry') {
    const answer = pokemonName;
    const flavorText = getEnglishFlavorText(species) || 'No Pokedex entry found.';
    return {
      category: 'Pokedex Entry',
      prompt: 'Which Pokemon matches this Pokedex description?',
      answer,
      choices: makeChoices(answer, randomPokemonNameChoices()),
      visual: { kind: 'entry', text: maskPokemonNameInText(flavorText, species.name) },
    };
  }

  if (activeCategory === 'ability') {
    const answer = formatPokemonName(randomItem(pokemon.abilities).ability.name);
    return {
      category: 'Ability',
      prompt: `Which ability can ${pokemonName} have?`,
      answer,
      choices: makeChoices(answer, COMMON_ABILITY_DISTRACTORS.map(formatPokemonName)),
      visual: { kind: 'silhouette', image: artwork, label: 'Ability scan' },
    };
  }

  if (activeCategory === 'comparison') {
    const otherEntry = randomItem(pool.filter((entry) => entry.name !== pokemonEntry.name)) || pokemonEntry;
    const { pokemon: otherPokemon } = await getPokemonQuizData(otherEntry);
    const comparisonKinds = ['height', 'weight', ...STAT_SORT_OPTIONS.map((stat) => stat.id)];
    const comparisonKind = randomItem(comparisonKinds);
    const firstValue = comparisonKind === 'height'
      ? pokemon.height
      : comparisonKind === 'weight'
        ? pokemon.weight
        : pokemon.stats.find((stat) => stat.stat.name === comparisonKind)?.base_stat || 0;
    const secondValue = comparisonKind === 'height'
      ? otherPokemon.height
      : comparisonKind === 'weight'
        ? otherPokemon.weight
        : otherPokemon.stats.find((stat) => stat.stat.name === comparisonKind)?.base_stat || 0;
    const otherName = formatPokemonName(otherPokemon.species?.name || otherPokemon.name);
    const answer = firstValue >= secondValue ? pokemonName : otherName;
    const label = comparisonKind === 'height'
      ? 'taller'
      : comparisonKind === 'weight'
        ? 'heavier'
        : `higher ${STAT_LABELS[comparisonKind] || formatPokemonName(comparisonKind)}`;

    return {
      category: 'Comparison',
      prompt: `Which Pokemon is ${label}?`,
      answer,
      choices: [pokemonName, otherName],
      visual: {
        kind: 'versus',
        firstImage: pokemon.sprites.front_default,
        secondImage: otherPokemon.sprites.front_default,
        firstName: pokemonName,
        secondName: otherName,
      },
    };
  }

  if (activeCategory === 'type-effectiveness') {
    const typeData = pokemon.types.map(({ type }) => typeChart[type.name]).filter(Boolean);
    const multipliers = getTypeMultiplierMap(typeData);
    const matchupKinds = [
      {
        id: 'weak',
        types: TYPE_NAMES.filter((typeName) => multipliers[typeName] > 1),
      },
      {
        id: 'resist',
        types: TYPE_NAMES.filter((typeName) => multipliers[typeName] > 0 && multipliers[typeName] < 1),
      },
      {
        id: 'immune',
        types: TYPE_NAMES.filter((typeName) => multipliers[typeName] === 0),
      },
    ].filter((matchup) => matchup.types.length);
    const matchup = randomItem(matchupKinds);
    const kind = matchup.id;
    const correctTypes = matchup.types.filter((typeName) => {
      const multiplier = multipliers[typeName];
      if (kind === 'weak') return multiplier > 1;
      if (kind === 'resist') return multiplier > 0 && multiplier < 1;
      return multiplier === 0;
    });
    const answer = formatPokemonName(randomItem(correctTypes));

    return {
      category: kind === 'weak' ? 'Type Effectiveness' : kind === 'resist' ? 'Type Resistance' : 'Type Immunity',
      prompt: kind === 'weak'
        ? `Which type is super effective against ${pokemonName}?`
        : kind === 'resist'
          ? `Which type is not very effective against ${pokemonName}?`
          : `Which type has no effect against ${pokemonName}?`,
      answer,
      choices: makeChoices(answer, TYPE_NAMES.map(formatPokemonName)),
      visual: { kind: 'silhouette', image: artwork, label: 'Battle matchup' },
    };
  }

  if (activeCategory === 'move') {
    const levelUpMoves = getLevelUpMovesForVersionGroup(pokemon, getTeamVersionGroup(selectedDex)).slice(0, 60);
    const move = randomItem(levelUpMoves.length ? levelUpMoves : pokemon.moves.map(({ move: pokemonMove }) => ({
      name: pokemonMove.name,
      url: pokemonMove.url,
      level: 1,
    })).slice(0, 60));
    const moveData = await fetchPokeApiJson(move.url, {}, 'Unable to load move quiz data.');
    const answer = formatPokemonName(moveData.type.name);

    return {
      category: 'Move Type',
      prompt: `What type is ${formatPokemonName(move.name)}?`,
      answer,
      choices: makeChoices(answer, TYPE_NAMES.map(formatPokemonName)),
      visual: { kind: 'move', moveName: formatPokemonName(move.name), moveClass: formatPokemonName(moveData.damage_class.name) },
    };
  }

  if (activeCategory === 'number-region') {
    const questionKind = Math.random() > 0.5 ? 'number' : 'region';
    const answer = questionKind === 'number'
      ? String(pokemon.id)
      : getRegionForGeneration(species.generation?.name);

    return {
      category: questionKind === 'number' ? 'Pokedex Number' : 'Region',
      prompt: questionKind === 'number'
        ? `What is ${pokemonName}'s National Pokedex number?`
        : `Which region is ${pokemonName} from?`,
      answer,
      choices: questionKind === 'number'
        ? makeChoices(answer, shuffleItems(pool).map((entry) => String(entry.pokemonId || entry.entryNumber)))
        : makeChoices(answer, POKEDEX_OPTIONS.map((pokedex) => pokedex.region)),
      visual: { kind: 'sprite', image: sprite, label: 'Pokedex lookup' },
    };
  }

  if (activeCategory === 'cry-sprite') {
    const questionKind = pokemon.cries?.latest && Math.random() > 0.5 ? 'cry' : 'sprite';
    const answer = pokemonName;

    return {
      category: questionKind === 'cry' ? 'Pokemon Cry' : 'Sprite Recognition',
      prompt: questionKind === 'cry'
        ? 'Which Pokemon made this cry?'
        : 'Which Pokemon is this sprite?',
      answer,
      choices: makeChoices(answer, randomPokemonNameChoices()),
      visual: questionKind === 'cry'
        ? { kind: 'cry', cryUrl: pokemon.cries.latest || pokemon.cries.legacy }
        : { kind: 'sprite', image: sprite, label: 'Sprite scan' },
    };
  }

  const strongestStat = pokemon.stats.reduce((strongest, stat) =>
    stat.base_stat > strongest.base_stat ? stat : strongest,
  pokemon.stats[0]);
  const answer = STAT_LABELS[strongestStat.stat.name] || formatPokemonName(strongestStat.stat.name);
  return {
    category: 'Strongest Stat',
    prompt: `What is ${pokemonName}'s highest base stat?`,
    answer,
    choices: makeChoices(answer, STAT_SORT_OPTIONS.map((stat) => stat.label)),
    visual: { kind: 'silhouette', image: artwork, label: 'Stat scan' },
  };
};

const getSpriteVariants = (sprites = {}) =>
  [
    ['Animated Front', sprites.animated?.front_default],
    ['Animated Back', sprites.animated?.back_default],
    ['Animated Front Shiny', sprites.animated?.front_shiny],
    ['Animated Back Shiny', sprites.animated?.back_shiny],
    ['Front', sprites.front_default],
    ['Back', sprites.back_default],
    ['Front Shiny', sprites.front_shiny],
    ['Back Shiny', sprites.back_shiny],
  ]
    .filter(([, image]) => Boolean(image))
    .map(([label, image]) => ({ label, image }));

const getGenerationSprites = (pokemon) => {
  const versions = pokemon?.sprites?.versions || {};

  return Object.entries(versions).flatMap(([generationName, games]) =>
    Object.entries(games).flatMap(([gameName, sprites]) => {
      if (gameName.includes('icons')) {
        return [];
      }

      const variants = getSpriteVariants(sprites);
      const preview = variants[0]?.image;

      return preview
        ? [
            {
              id: `${generationName}-${gameName}`,
              generation: formatGenerationName(generationName),
              game: formatVersionGroupName(gameName),
              image: preview,
              variants,
            },
          ]
        : [];
    }),
  );
};

const getFeaturedTcgCards = (cards, pokemonNames) => {
  const normalizedPokemonNames = [...new Set([pokemonNames].flat())]
    .map((pokemonName) => compactSearchText(pokemonName))
    .filter(Boolean);

  if (!normalizedPokemonNames.length) return [];

  return cards.filter((card) => {
    const normalizedCardName = normalizeSearchText(card.name);
    const compactCardName = compactSearchText(card.name);
    const cardTokens = normalizedCardName.split(' ').map((token) => compactSearchText(token));

    return normalizedPokemonNames.some((normalizedPokemon) => (
      compactCardName === normalizedPokemon ||
      compactCardName.endsWith(normalizedPokemon) ||
      cardTokens.includes(normalizedPokemon)
    ));
  });
};

const cardMatchesSearch = (card, searchValue = '') => {
  const normalizedSearch = normalizeSearchText(searchValue);
  const compactSearch = compactSearchText(searchValue);

  if (!normalizedSearch) return true;

  if (card.searchText || card.compactSearchText) {
    return (
      card.searchText?.includes(normalizedSearch) ||
      card.compactSearchText?.includes(compactSearch)
    );
  }

  const searchableFields = [
    card.name,
    card.evolvesFrom,
    ...(card.types || []),
    ...(card.subtypes || []),
  ];

  return searchableFields.some((field) => {
    const normalizedField = normalizeSearchText(field);
    const compactField = compactSearchText(field);

    return (
      normalizedField.includes(normalizedSearch) ||
      compactField.includes(compactSearch)
    );
  });
};

const createCardSearchIndex = (card) => {
  const searchableText = [
    card.name,
    card.evolvesFrom,
    ...(card.types || []),
    ...(card.subtypes || []),
  ].join(' ');

  return {
    searchText: normalizeSearchText(searchableText),
    compactSearchText: compactSearchText(searchableText),
  };
};

const expansionHasCardMatch = (expansion, searchValue = '') => {
  if (!normalizeSearchText(searchValue)) return true;

  const searchableCards = expansion?.allCards ||
    [...(expansion?.commons || []), ...(expansion?.uncommons || []), ...(expansion?.rares || [])];

  return searchableCards.some((card) => cardMatchesSearch(card, searchValue));
};

const parseReleaseDate = (releaseDate = '') => {
  const normalizedDate = releaseDate.replaceAll('/', '-');
  const timestamp = Date.parse(`${normalizedDate}T00:00:00`);
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
};

const KNOWN_MISSING_OFFICIAL_IMAGE_SET_IDS = new Set(['mcd14', 'mcd15', 'mcd17', 'mcd18']);

const getCardImageCandidates = (card = {}) => {
  const candidates = [];
  const addCandidate = (image) => {
    if (image && !candidates.includes(image) && image !== CARD_BACK_IMAGE) {
      candidates.push(image);
    }
  };

  const setId = card.setId || card.id?.split('-')?.[0];
  const cardNumber = card.number || card.id?.split('-')?.slice(1).join('-');

  addCandidate(card.largeImage);
  addCandidate(card.images?.large);

  if (setId && cardNumber) {
    addCandidate(`https://images.pokemontcg.io/${setId}/${cardNumber}_hires.png`);
    addCandidate(`https://images.pokemontcg.io/${setId}/${cardNumber}.png`);
  }

  addCandidate(card.image);
  addCandidate(card.images?.small);

  return candidates;
};

const getCardFaceImage = (card) => getCardImageCandidates(card)[0] || CARD_BACK_IMAGE;

const getCardFallbackImage = (card) => getCardImageCandidates(card).slice(1).join('|');

const handleCardImageError = (event) => {
  const fallbackSrc = event.currentTarget.dataset.fallbackSrc;
  const [nextFallback, ...remainingFallbacks] = fallbackSrc ? fallbackSrc.split('|').filter(Boolean) : [];

  if (nextFallback) {
    event.currentTarget.src = nextFallback;
    if (remainingFallbacks.length) {
      event.currentTarget.dataset.fallbackSrc = remainingFallbacks.join('|');
    } else {
      event.currentTarget.removeAttribute('data-fallback-src');
    }
    return;
  }

  event.currentTarget.src = CARD_BACK_IMAGE;
};

const loadCollection = () => {
  try {
    const savedCollection = localStorage.getItem(COLLECTION_STORAGE_KEY);
    return savedCollection ? JSON.parse(savedCollection) : {};
  } catch {
    return {};
  }
};

const loadWhoLeaderboard = () => {
  try {
    const savedLeaderboard = localStorage.getItem(WHO_LEADERBOARD_STORAGE_KEY);
    return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
  } catch {
    return [];
  }
};

const saveWhoLeaderboard = (entries) => {
  localStorage.setItem(WHO_LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
};

const formatLeaderboardDate = (dateValue) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateValue));

const isPokemonGuessCorrect = (guess, pokemon) => {
  const normalizedGuess = normalizePokemonLookup(guess);
  const answerNames = new Set([
    pokemon?.name,
    pokemon?.species?.name,
    formatPokemonName(pokemon?.name || ''),
    formatPokemonName(pokemon?.species?.name || ''),
  ]);

  return [...answerNames]
    .filter(Boolean)
    .some((answerName) => normalizePokemonLookup(answerName) === normalizedGuess);
};

const buildPokemonHintChoices = (pokemon, regionEntries = []) => {
  const answer = pokemon?.species?.name || pokemon?.name;
  if (!answer) return [];

  const wrongChoices = regionEntries
    .filter((entry) => normalizePokemonLookup(entry.name) !== normalizePokemonLookup(answer))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((entry) => entry.name);

  return [answer, ...wrongChoices]
    .sort(() => Math.random() - 0.5)
    .map((pokemonName) => ({
      name: pokemonName,
      label: formatPokemonName(pokemonName),
    }));
};

const buildBoosterPack = (expansion, selectedSet, packIndex = 0) => {
  const createdAt = Date.now();
  const createPackCard = (card, packId, isRare = false) => ({
    ...card,
    packId,
    flipped: false,
    isRare,
    setId: selectedSet,
    setName: expansion.setName,
  });
  const pack = [];

  for (let i = 0; i < 6; i++) {
    const card = randomItem(expansion.commons);
    pack.push(createPackCard(card, `pack-${packIndex}-c-${i}-${createdAt}`));
  }

  for (let i = 0; i < 3; i++) {
    const card = randomItem(expansion.uncommons);
    pack.push(createPackCard(card, `pack-${packIndex}-u-${i}-${createdAt}`));
  }

  const rareCard = randomItem(expansion.rares);
  pack.push(createPackCard(rareCard, `pack-${packIndex}-r-1-${createdAt}`, true));

  return pack;
};

const buildGodPack = (expansion, selectedSet) => {
  const createdAt = Date.now();
  return Array.from({ length: 10 }, (_, index) => ({
    ...randomItem(expansion.rares),
    packId: `god-${index}-${createdAt}`,
    flipped: false,
    isRare: true,
    setId: selectedSet,
    setName: expansion.setName,
  }));
};

const hasKnownMissingOfficialImages = (expansion) =>
  KNOWN_MISSING_OFFICIAL_IMAGE_SET_IDS.has(expansion?.setId);

const getExpansionCards = (expansion) =>
  hasKnownMissingOfficialImages(expansion)
    ? []
    : [
        ...(expansion?.commons || []),
        ...(expansion?.uncommons || []),
        ...(expansion?.rares || []),
      ];

const hasFeaturedTcgCards = (expansion) => getExpansionCards(expansion).length > 0;

const isReferenceOnlyExpansion = (expansion) => expansion?.series === 'Other';

const hasPlayableCards = (expansion) =>
  !hasKnownMissingOfficialImages(expansion) &&
  !isReferenceOnlyExpansion(expansion) &&
  Boolean(
    expansion?.commons?.length &&
      expansion?.uncommons?.length &&
      expansion?.rares?.length,
  );

const getExpansionCategory = (expansion) => {
  const setName = normalizeSearchText(expansion?.setName || '');
  const series = normalizeSearchText(expansion?.series || '');

  if (setName.includes('black star promos')) return 'Promo';
  if (setName.includes('mcdonald')) return 'Limited';
  if (setName.includes('trainer kit')) return 'Trainer Kit';
  if (series === 'pop' || setName.includes('pop series')) return 'POP';
  if (setName.includes('detective pikachu')) return 'Special';
  if (series === 'other') return 'Special';
  if (!hasPlayableCards(expansion)) return 'Special';
  return 'Booster';
};

function GitHubRepoLink() {
  return (
    <a
      className="repo-link"
      href={REPOSITORY_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Open GitHub repository"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.86c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    </a>
  );
}

function EvolutionBranch({ node, onChoosePokemon }) {
  if (!node) return null;

  return (
    <div className="evolution-branch">
      <article
        className="evolution-node"
        role="button"
        tabIndex={0}
        onClick={() => onChoosePokemon(node.name)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onChoosePokemon(node.name);
          }
        }}
      >
        <img src={getPokemonSpriteUrl(node.id)} alt={formatPokemonName(node.name)} loading="lazy" />
        <strong>{formatPokemonName(node.name)}</strong>
        <span>{node.requirement}</span>
      </article>
      {node.children.length > 0 && (
        <div className="evolution-children">
          {node.children.map((child) => (
            <EvolutionBranch
              key={`${child.id}-${child.name}`}
              node={child}
              onChoosePokemon={onChoosePokemon}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export {
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
  hasPlayableCards,
  isReferenceOnlyExpansion,
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
};
