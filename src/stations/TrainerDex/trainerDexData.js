const makeMember = (name, level, moves = [], label, apiName) => ({
  name,
  label,
  level,
  moves: Array.isArray(moves) ? moves : [],
  apiName,
});

const makeTrainer = ({
  id,
  name,
  regionId,
  division = 'gym',
  role,
  specialty,
  signature,
  summary,
  team,
  teamVariants,
  teamVariantCondition,
  battleStages,
  gameIds,
  gameData,
  initialStageLabel,
  teamContext,
  sources,
}) => ({
  id,
  name,
  regionId,
  division,
  role,
  specialty,
  signature,
  summary,
  team,
  teamVariants,
  teamVariantCondition,
  battleStages,
  gameIds,
  gameData,
  initialStageLabel,
  teamContext,
  sources,
});

// A blank list is intentional: a type-themed template is not an in-game
// moveset. Encounters keep moves only when the four slots were source-checked.
const unverifiedMoves = [];
const moves = {
  rock: unverifiedMoves,
  water: unverifiedMoves,
  electric: unverifiedMoves,
  grass: unverifiedMoves,
  poison: unverifiedMoves,
  psychic: unverifiedMoves,
  fire: unverifiedMoves,
  ground: unverifiedMoves,
  ice: unverifiedMoves,
  fighting: unverifiedMoves,
  ghost: unverifiedMoves,
  dragon: unverifiedMoves,
  dark: unverifiedMoves,
  bug: unverifiedMoves,
  flying: unverifiedMoves,
  steel: unverifiedMoves,
  normal: unverifiedMoves,
  fairy: unverifiedMoves,
};

const dianthaPokemonLeagueTeam = [
  makeMember('Hawlucha', 64, ['Swords Dance', 'Flying Press', 'X-Scissor', 'Poison Jab']),
  makeMember('Tyrantrum', 65, ['Head Smash', 'Earthquake', 'Dragon Claw', 'Crunch']),
  makeMember('Aurorus', 65, ['Thunder', 'Blizzard', 'Light Screen', 'Reflect']),
  makeMember('Gourgeist', 65, ['Trick-or-Treat', 'Phantom Force', 'Seed Bomb', 'Shadow Sneak']),
  makeMember('Goodra', 66, ['Dragon Pulse', 'Muddy Water', 'Fire Blast', 'Focus Blast']),
  makeMember('Gardevoir', 68, ['Moonblast', 'Psychic', 'Shadow Ball', 'Thunderbolt']),
];

const makeTeam = (members) =>
  members.map(([name, level, moveType = 'normal', label, apiName]) =>
    makeMember(
      name,
      level,
      Array.isArray(moveType) ? moveType : moves[moveType] || moves.normal,
      label,
      apiName,
    ));

const sourceCheckedTrainerTeams = {
  'roark-sinnoh': makeTeam([
    ['Geodude', 12, 'rock'],
    ['Onix', 12, 'rock'],
    ['Cranidos', 14, 'rock'],
  ]),
  'gardenia-sinnoh': makeTeam([
    ['Turtwig', 20, 'grass'],
    ['Cherrim', 20, 'grass'],
    ['Roserade', 22, 'grass'],
  ]),
  'wake-sinnoh': makeTeam([
    ['Gyarados', 33, 'water'],
    ['Quagsire', 34, 'water'],
    ['Floatzel', 37, 'water'],
  ]),
  'maylene-sinnoh': makeTeam([
    ['Meditite', 28, 'fighting'],
    ['Machoke', 29, 'fighting'],
    ['Lucario', 32, 'fighting'],
  ]),
  'fantina-sinnoh': makeTeam([
    ['Duskull', 24, 'ghost'],
    ['Haunter', 24, 'ghost'],
    ['Mismagius', 26, 'ghost'],
  ]),
  'byron-sinnoh': makeTeam([
    ['Magneton', 37, 'electric'],
    ['Steelix', 38, 'steel'],
    ['Bastiodon', 41, 'steel'],
  ]),
  'candice-sinnoh': makeTeam([
    ['Sneasel', 40, 'dark'],
    ['Piloswine', 40, 'ice'],
    ['Abomasnow', 42, 'ice'],
    ['Froslass', 44, 'ice'],
  ]),
  'volkner-sinnoh': makeTeam([
    ['Jolteon', 46, 'electric'],
    ['Raichu', 46, 'electric'],
    ['Luxray', 48, 'electric'],
    ['Electivire', 50, 'electric'],
  ]),
  'aaron-sinnoh': makeTeam([
    ['Yanmega', 49, 'bug'],
    ['Scizor', 49, 'bug'],
    ['Heracross', 51, 'bug'],
    ['Vespiquen', 50, 'bug'],
    ['Drapion', 53, 'poison'],
  ]),
  'bertha-sinnoh': makeTeam([
    ['Whiscash', 50, 'ground'],
    ['Gliscor', 53, 'ground'],
    ['Golem', 52, 'rock'],
    ['Rhyperior', 52, 'ground'],
    ['Hippowdon', 55, 'ground'],
  ]),
  'flint-sinnoh': makeTeam([
    ['Houndoom', 52, 'fire'],
    ['Flareon', 55, 'fire'],
    ['Rapidash', 53, 'fire'],
    ['Infernape', 55, 'fire'],
    ['Magmortar', 57, 'fire'],
  ]),
  'lucian-sinnoh': makeTeam([
    ['Mr. Mime', 53, 'psychic', 'Mr. Mime'],
    ['Espeon', 55, 'psychic'],
    ['Bronzong', 54, 'steel'],
    ['Alakazam', 56, 'psychic'],
    ['Gallade', 59, 'psychic'],
  ]),
  'cynthia-sinnoh': makeTeam([
    ['Spiritomb', 58, 'ghost'],
    ['Togekiss', 60, 'fairy'],
    ['Roserade', 58, 'grass'],
    ['Milotic', 58, 'water'],
    ['Lucario', 60, 'fighting'],
    ['Garchomp', 62, 'dragon'],
  ]),
  'cilan-unova': makeTeam([
    ['Lillipup', 12, ['Bite', 'Work Up', 'Odor Sleuth', 'Helping Hand']],
    ['Pansage', 14, ['Vine Whip', 'Work Up', 'Lick', 'Fury Swipes']],
  ]),
  'chili-unova': makeTeam([
    ['Lillipup', 12, ['Bite', 'Work Up', 'Odor Sleuth', 'Helping Hand']],
    ['Pansear', 14, ['Incinerate', 'Work Up', 'Lick', 'Fury Swipes']],
  ]),
  'cress-unova': makeTeam([
    ['Lillipup', 12, ['Bite', 'Work Up', 'Odor Sleuth', 'Helping Hand']],
    ['Panpour', 14, ['Water Gun', 'Work Up', 'Lick', 'Fury Swipes']],
  ]),
  'lenora-unova': makeTeam([['Herdier', 18, 'normal'], ['Watchog', 20, 'normal']]),
  'burgh-unova': makeTeam([['Whirlipede', 21, 'bug'], ['Dwebble', 21, 'bug'], ['Leavanny', 23, 'bug']]),
  'elesa-unova': makeTeam([['Emolga', 25, 'electric'], ['Emolga', 25, 'electric'], ['Zebstrika', 27, 'electric']]),
  'clay-unova': makeTeam([['Krokorok', 29, 'ground'], ['Palpitoad', 29, 'water'], ['Excadrill', 31, 'ground']]),
  'skyla-unova': makeTeam([['Swoobat', 33, 'flying'], ['Unfezant', 33, 'flying'], ['Swanna', 35, 'water']]),
  'brycen-unova': makeTeam([['Vanillish', 37, 'ice'], ['Cryogonal', 37, 'ice'], ['Beartic', 39, 'ice']]),
  'drayden-unova': makeTeam([['Fraxure', 41, 'dragon'], ['Druddigon', 41, 'dragon'], ['Haxorus', 43, 'dragon']]),
  'iris-unova': makeTeam([['Fraxure', 41, 'dragon'], ['Druddigon', 41, 'dragon'], ['Haxorus', 43, 'dragon']]),
  'cheren-unova': makeTeam([['Patrat', 11, 'normal'], ['Lillipup', 13, 'normal']]),
  'roxie-unova': makeTeam([['Koffing', 16, 'poison'], ['Whirlipede', 18, 'poison']]),
  'shauntal-unova': makeTeam([['Cofagrigus', 48, 'ghost'], ['Jellicent', 48, 'water'], ['Golurk', 48, 'ground'], ['Chandelure', 50, 'ghost']]),
  'grimsley-unova': makeTeam([['Scrafty', 48, 'dark'], ['Liepard', 48, 'dark'], ['Krookodile', 48, 'ground'], ['Bisharp', 50, 'dark']]),
  'caitlin-unova': makeTeam([['Reuniclus', 48, 'psychic'], ['Musharna', 48, 'psychic'], ['Sigilyph', 48, 'psychic'], ['Gothitelle', 50, 'psychic']]),
  'marshal-unova': makeTeam([['Throh', 48, 'fighting'], ['Sawk', 48, 'fighting'], ['Conkeldurr', 48, 'fighting'], ['Mienshao', 50, 'fighting']]),
  'alder-unova': makeTeam([['Accelgor', 75, 'bug'], ['Bouffalant', 75, 'normal'], ['Druddigon', 75, 'dragon'], ['Escavalier', 75, 'bug'], ['Vanilluxe', 75, 'ice'], ['Volcarona', 77, 'bug']]),
  'viola-kalos': makeTeam([['Surskit', 10, 'water'], ['Vivillon', 12, 'bug']]),
  'grant-kalos': makeTeam([['Amaura', 25, 'rock'], ['Tyrunt', 25, 'rock']]),
  'korrina-kalos': makeTeam([['Mienfoo', 29, 'fighting'], ['Machoke', 28, 'fighting'], ['Hawlucha', 32, 'fighting']]),
  'ramos-kalos': makeTeam([['Jumpluff', 30, 'grass'], ['Weepinbell', 31, 'grass'], ['Gogoat', 34, 'grass']]),
  'clemont-kalos': makeTeam([['Emolga', 35, 'electric'], ['Magneton', 35, 'electric'], ['Heliolisk', 37, 'electric']]),
  'valerie-kalos': makeTeam([['Mawile', 38, 'fairy'], ['Mr. Mime', 39, 'psychic', 'Mr. Mime'], ['Sylveon', 42, 'fairy']]),
  'olympia-kalos': makeTeam([['Sigilyph', 44, 'psychic'], ['Slowking', 45, 'psychic'], ['Meowstic', 48, 'psychic']]),
  'wulfric-kalos': makeTeam([['Abomasnow', 56, 'ice'], ['Cryogonal', 55, 'ice'], ['Avalugg', 59, 'ice']]),
  'malva-kalos': makeTeam([['Pyroar', 63, 'fire'], ['Torkoal', 63, 'fire'], ['Chandelure', 63, 'fire'], ['Talonflame', 65, 'fire']]),
  'siebold-kalos': makeTeam([['Clawitzer', 63, 'water'], ['Gyarados', 63, 'water'], ['Starmie', 63, 'water'], ['Barbaracle', 65, 'water']]),
  'wikstrom-kalos': makeTeam([['Klefki', 63, 'steel'], ['Probopass', 63, 'rock'], ['Scizor', 63, 'bug'], ['Aegislash-shield', 65, 'steel', 'Aegislash']]),
  'drasna-kalos': makeTeam([['Dragalge', 63, 'dragon'], ['Druddigon', 63, 'dragon'], ['Altaria', 63, 'dragon'], ['Noivern', 65, 'dragon']]),
  'diantha-kalos': dianthaPokemonLeagueTeam,
  'milo-galar': makeTeam([['Gossifleur', 19, 'grass'], ['Eldegoss', 20, 'grass']]),
  'nessa-galar': makeTeam([['Goldeen', 22, 'water'], ['Arrokuda', 23, 'water'], ['Drednaw', 24, 'water']]),
  'kabu-galar': makeTeam([['Ninetales', 25, 'fire'], ['Arcanine', 25, 'fire'], ['Centiskorch', 27, 'fire']]),
  'bea-galar': makeTeam([['Hitmontop', 34, 'fighting'], ['Pangoro', 34, 'fighting'], ['Sirfetchd', 35, 'fighting', "Sirfetch'd"], ['Machamp', 36, 'fighting']]),
  'allister-galar': makeTeam([['Yamask-galar', 34, 'ghost', 'Yamask'], ['Mimikyu', 34, 'ghost'], ['Cursola', 35, 'ghost'], ['Gengar', 36, 'ghost']]),
  'opal-galar': makeTeam([['Weezing-galar', 36, 'fairy', 'Weezing'], ['Mawile', 36, 'fairy'], ['Togekiss', 37, 'fairy'], ['Alcremie', 38, 'fairy']]),
  'gordie-galar': makeTeam([['Barbaracle', 40, 'rock'], ['Shuckle', 40, 'rock'], ['Stonjourner', 41, 'rock'], ['Coalossal', 42, 'rock']]),
  'melony-galar': makeTeam([['Frosmoth', 40, 'ice'], ['Darmanitan-galar-standard', 40, 'ice', 'Darmanitan'], ['Eiscue-ice', 41, 'ice', 'Eiscue'], ['Lapras', 42, 'ice']]),
  'piers-galar': makeTeam([['Scrafty', 44, 'dark'], ['Malamar', 45, 'dark'], ['Skuntank', 45, 'poison'], ['Obstagoon', 46, 'dark']]),
  'raihan-galar': makeTeam([['Gigalith', 46, 'rock'], ['Flygon', 47, 'dragon'], ['Sandaconda', 46, 'ground'], ['Duraludon', 48, 'dragon']]),
  'leon-galar': makeTeam([['Aegislash-shield', 62, 'steel', 'Aegislash'], ['Dragapult', 62, 'dragon'], ['Haxorus', 63, 'dragon'], ['Seismitoad', 64, 'water'], ['Cinderace', 64, 'fire'], ['Charizard', 65, 'fire']]),
  'katy-paldea': makeTeam([['Nymble', 14, 'bug'], ['Tarountula', 14, 'bug'], ['Teddiursa', 15, 'normal']]),
  'brassius-paldea': makeTeam([['Petilil', 16, 'grass'], ['Smoliv', 16, 'grass'], ['Sudowoodo', 17, 'rock']]),
  'iono-paldea': makeTeam([['Wattrel', 23, 'electric'], ['Bellibolt', 23, 'electric'], ['Luxio', 23, 'electric'], ['Mismagius', 24, 'ghost']]),
  'kofu-paldea': makeTeam([['Veluza', 29, 'water'], ['Wugtrio', 29, 'water'], ['Crabominable', 30, 'fighting']]),
  'larry-paldea': makeTeam([['Komala', 35, 'normal'], ['Dudunsparce-two-segment', 35, 'normal', 'Dudunsparce'], ['Staraptor', 36, 'flying']]),
  'ryme-paldea': makeTeam([['Banette', 41, 'ghost'], ['Mimikyu', 41, 'ghost'], ['Houndstone', 41, 'ghost'], ['Toxtricity-low-key', 42, 'poison', 'Toxtricity (Low Key Form)']]),
  'tulip-paldea': makeTeam([['Farigiraf', 44, 'psychic'], ['Gardevoir', 44, 'psychic'], ['Espathra', 44, 'psychic'], ['Florges', 45, 'fairy']]),
  'grusha-paldea': makeTeam([['Frosmoth', 47, 'ice'], ['Beartic', 47, 'ice'], ['Cetitan', 47, 'ice'], ['Altaria', 48, 'dragon']]),
  'rika-paldea': makeTeam([['Whiscash', 57, 'ground'], ['Camerupt', 57, 'ground'], ['Donphan', 57, 'ground'], ['Dugtrio', 57, 'ground'], ['Clodsire', 58, 'ground']]),
  'poppy-paldea': makeTeam([['Copperajah', 58, 'steel'], ['Corviknight', 58, 'steel'], ['Bronzong', 58, 'steel'], ['Magnezone', 58, 'electric'], ['Tinkaton', 59, 'steel']]),
  'larry-paldea-elite': makeTeam([['Tropius', 59, 'flying'], ['Oricorio-baile', 59, 'flying', 'Oricorio'], ['Altaria', 59, 'dragon'], ['Staraptor', 59, 'flying'], ['Flamigo', 60, 'flying']]),
  'hassel-paldea': makeTeam([['Noivern', 60, 'dragon'], ['Haxorus', 60, 'dragon'], ['Dragalge', 60, 'dragon'], ['Flapple', 60, 'dragon'], ['Baxcalibur', 61, 'dragon']]),
  'geeta-paldea': makeTeam([['Espathra', 61, 'psychic'], ['Gogoat', 61, 'grass'], ['Veluza', 61, 'water'], ['Avalugg', 61, 'ice'], ['Kingambit', 61, 'dark'], ['Glimmora', 62, 'rock']]),
};

const emeraldRematchSources = [
  {
    label: 'pret Emerald trainer party data',
    url: 'https://github.com/pret/pokeemerald/blob/master/src/data/trainer_parties.h',
  },
  {
    label: 'Bulbapedia Gym Leader rematch mechanics',
    url: 'https://bulbapedia.bulbagarden.net/wiki/Gym_Leader_Rematch',
  },
];

const hoennTrainerSources = [
  {
    label: 'pret Emerald trainer party data',
    url: 'https://github.com/pret/pokeemerald/blob/master/src/data/trainer_parties.h',
  },
  {
    label: 'Pokemon Database ORAS battle tables',
    url: 'https://pokemondb.net/omega-ruby-alpha-sapphire/gymleaders-elitefour',
  },
];

const wallySources = [
  {
    label: 'Bulbapedia Wally battle tables',
    url: 'https://bulbapedia.bulbagarden.net/wiki/Wally',
  },
  {
    label: 'Serebii Battle Resort tables',
    url: 'https://www.serebii.net/pokearth/hoenn/battleresort.shtml',
  },
];

const emeraldGymRematchTeams = {
  roxanne: [
    makeTeam([['Golem', 32], ['Kabuto', 35], ['Onix', 35], ['Nosepass', 37]]),
    makeTeam([['Omanyte', 37], ['Golem', 37], ['Kabutops', 40], ['Onix', 40], ['Nosepass', 42]]),
    makeTeam([['Omastar', 42], ['Golem', 42], ['Kabutops', 45], ['Onix', 45], ['Nosepass', 47]]),
    makeTeam([['Aerodactyl', 47], ['Golem', 47], ['Omastar', 47], ['Kabutops', 50], ['Steelix', 50], ['Nosepass', 52]]),
  ],
  brawly: [
    makeTeam([['Machamp', 33], ['Meditite', 33], ['Hitmontop', 35], ['Hariyama', 37]]),
    makeTeam([['Machamp', 38], ['Medicham', 38], ['Hitmontop', 40], ['Hariyama', 42]]),
    makeTeam([['Hitmonchan', 40], ['Machamp', 43], ['Medicham', 43], ['Hitmontop', 45], ['Hariyama', 47]]),
    makeTeam([['Hitmonlee', 46], ['Hitmonchan', 46], ['Machamp', 48], ['Medicham', 48], ['Hitmontop', 50], ['Hariyama', 52]]),
  ],
  wattson: [
    makeTeam([['Mareep', 36], ['Electrode', 36], ['Magneton', 38], ['Manectric', 40]]),
    makeTeam([['Pikachu', 39], ['Flaaffy', 41], ['Electrode', 41], ['Magneton', 43], ['Manectric', 45]]),
    makeTeam([['Raichu', 44], ['Ampharos', 46], ['Electrode', 46], ['Magneton', 48], ['Manectric', 50]]),
    makeTeam([['Electabuzz', 50], ['Raichu', 51], ['Ampharos', 51], ['Electrode', 53], ['Magneton', 53], ['Manectric', 55]]),
  ],
  flannery: [
    makeTeam([['Magcargo', 38], ['Ponyta', 36], ['Camerupt', 38], ['Torkoal', 40]]),
    makeTeam([['Growlithe', 41], ['Magcargo', 43], ['Ponyta', 41], ['Camerupt', 43], ['Torkoal', 45]]),
    makeTeam([['Houndour', 46], ['Growlithe', 46], ['Magcargo', 48], ['Rapidash', 46], ['Camerupt', 48], ['Torkoal', 50]]),
    makeTeam([['Arcanine', 51], ['Magcargo', 53], ['Houndoom', 51], ['Rapidash', 51], ['Camerupt', 53], ['Torkoal', 55]]),
  ],
  norman: [
    makeTeam([['Chansey', 42], ['Slaking', 42], ['Spinda', 43], ['Slaking', 45]]),
    makeTeam([['Slaking', 47], ['Chansey', 47], ['Kangaskhan', 45], ['Spinda', 48], ['Slaking', 50]]),
    makeTeam([['Slaking', 52], ['Blissey', 52], ['Kangaskhan', 50], ['Spinda', 53], ['Slaking', 55]]),
    makeTeam([['Slaking', 57], ['Blissey', 57], ['Kangaskhan', 55], ['Tauros', 57], ['Spinda', 58], ['Slaking', 60]]),
  ],
  winona: [
    makeTeam([['Dratini', 40], ['Tropius', 38], ['Pelipper', 41], ['Skarmory', 43], ['Altaria', 45]]),
    makeTeam([['Hoothoot', 43], ['Tropius', 43], ['Dragonair', 45], ['Pelipper', 46], ['Skarmory', 48], ['Altaria', 50]]),
    makeTeam([['Noctowl', 48], ['Tropius', 49], ['Dragonair', 50], ['Pelipper', 51], ['Skarmory', 53], ['Altaria', 55]]),
    makeTeam([['Noctowl', 53], ['Tropius', 54], ['Pelipper', 55], ['Dragonite', 55], ['Skarmory', 58], ['Altaria', 60]]),
  ],
  'liza-tate': [
    makeTeam([['Slowpoke', 48], ['Claydol', 49], ['Xatu', 49], ['Lunatone', 50], ['Solrock', 50]]),
    makeTeam([['Drowzee', 53], ['Slowpoke', 53], ['Claydol', 54], ['Xatu', 54], ['Lunatone', 55], ['Solrock', 55]]),
    makeTeam([['Hypno', 58], ['Claydol', 59], ['Slowpoke', 58], ['Xatu', 59], ['Lunatone', 60], ['Solrock', 60]]),
    makeTeam([['Hypno', 63], ['Claydol', 64], ['Slowking', 63], ['Xatu', 64], ['Lunatone', 65], ['Solrock', 65]]),
  ],
  juan: [
    makeTeam([['Poliwag', 46], ['Whiscash', 46], ['Walrein', 48], ['Crawdaunt', 48], ['Kingdra', 51]]),
    makeTeam([['Poliwhirl', 50], ['Whiscash', 51], ['Walrein', 53], ['Crawdaunt', 53], ['Kingdra', 56]]),
    makeTeam([['Lapras', 56], ['Whiscash', 58], ['Poliwhirl', 56], ['Walrein', 58], ['Crawdaunt', 58], ['Kingdra', 61]]),
    makeTeam([['Lapras', 61], ['Whiscash', 63], ['Politoed', 61], ['Walrein', 63], ['Crawdaunt', 63], ['Kingdra', 66]]),
  ],
};

const makeEmeraldRematchStages = (teams) => teams
  ? {
      'match-call-1': { label: 'First Match Call rematch', teamContext: 'Post-Hall-of-Fame Double Battle.', team: teams[0], sources: emeraldRematchSources },
      'match-call-2': { label: 'Second Match Call rematch', teamContext: 'Escalating post-Hall-of-Fame Double Battle.', team: teams[1], sources: emeraldRematchSources },
      'match-call-3': { label: 'Third Match Call rematch', teamContext: 'Escalating post-Hall-of-Fame Double Battle.', team: teams[2], sources: emeraldRematchSources },
      'match-call-4': { label: 'Fourth+ Match Call rematch', teamContext: 'Final repeatable post-Hall-of-Fame Double Battle tier.', team: teams[3], sources: emeraldRematchSources },
    }
  : undefined;

const hoennGameData = {
  roxanne: {
    'ruby-sapphire': { team: makeTeam([['Geodude', 14, 'rock'], ['Nosepass', 15, 'rock']]) },
    emerald: { team: makeTeam([['Geodude', 12, 'rock'], ['Geodude', 12, 'rock'], ['Nosepass', 15, 'rock']]) },
  },
  brawly: {
    'ruby-sapphire': { team: makeTeam([['Machop', 17, 'fighting'], ['Makuhita', 18, 'fighting']]) },
    emerald: { team: makeTeam([['Machop', 16, 'fighting'], ['Meditite', 16, 'psychic'], ['Makuhita', 19, 'fighting']]) },
  },
  wattson: {
    'ruby-sapphire': { team: makeTeam([['Magnemite', 22, 'electric'], ['Voltorb', 20, 'electric'], ['Magneton', 23, 'electric']]) },
    emerald: { signature: 'Manectric', team: makeTeam([['Voltorb', 20, 'electric'], ['Magneton', 22, 'electric'], ['Electrike', 20, 'electric'], ['Manectric', 24, 'electric']]) },
  },
  flannery: {
    'ruby-sapphire': { team: makeTeam([['Slugma', 26, 'fire'], ['Slugma', 26, 'fire'], ['Torkoal', 28, 'fire']]) },
    emerald: { team: makeTeam([['Numel', 24, 'fire'], ['Slugma', 24, 'fire'], ['Camerupt', 26, 'fire'], ['Torkoal', 29, 'fire']]) },
  },
  norman: {
    'ruby-sapphire': { team: makeTeam([['Slaking', 28, 'normal'], ['Vigoroth', 30, 'normal'], ['Slaking', 31, 'normal']]) },
    emerald: { team: makeTeam([['Spinda', 27, 'normal'], ['Vigoroth', 27, 'normal'], ['Linoone', 29, 'normal'], ['Slaking', 31, 'normal']]) },
  },
  winona: {
    'ruby-sapphire': { team: makeTeam([['Swellow', 31, 'flying'], ['Pelipper', 30, 'water'], ['Skarmory', 32, 'steel'], ['Altaria', 33, 'dragon']]) },
    emerald: { team: makeTeam([['Swablu', 29, 'flying'], ['Tropius', 29, 'grass'], ['Pelipper', 30, 'water'], ['Skarmory', 31, 'steel'], ['Altaria', 33, 'dragon']]) },
  },
  'liza-tate': {
    'ruby-sapphire': { team: makeTeam([['Lunatone', 42, 'psychic'], ['Solrock', 42, 'psychic']]) },
    emerald: { team: makeTeam([['Claydol', 41, 'psychic'], ['Xatu', 41, 'psychic'], ['Lunatone', 42, 'psychic'], ['Solrock', 42, 'psychic']]) },
  },
  wallace: {
    'ruby-sapphire': { team: makeTeam([['Luvdisc', 40, 'water'], ['Whiscash', 42, 'water'], ['Sealeo', 40, 'ice'], ['Seaking', 42, 'water'], ['Milotic', 43, 'water']]) },
    emerald: {
      division: 'champion',
      role: 'Hoenn Champion',
      specialty: ['water'],
      signature: 'Milotic',
      summary: 'Wallace is the Hoenn Champion in Pokemon Emerald and uses a full Water-type final team.',
      team: makeTeam([['Wailord', 57, 'water'], ['Tentacruel', 55, 'poison'], ['Whiscash', 56, 'water'], ['Ludicolo', 56, 'water'], ['Gyarados', 56, 'water'], ['Milotic', 58, 'water']]),
    },
  },
  juan: {
    emerald: {
      division: 'gym',
      role: 'Sootopolis City Gym Leader',
      specialty: ['water'],
      signature: 'Kingdra',
      summary: 'Juan replaces Wallace as Sootopolis Gym Leader in Pokemon Emerald.',
      team: makeTeam([['Luvdisc', 41, 'water'], ['Whiscash', 41, 'water'], ['Sealeo', 43, 'ice'], ['Crawdaunt', 43, 'water'], ['Kingdra', 46, 'water']]),
    },
  },
  sidney: {
    'ruby-sapphire': { team: makeTeam([['Mightyena', 46, 'dark'], ['Cacturne', 46, 'dark'], ['Shiftry', 48, 'dark'], ['Sharpedo', 48, 'water'], ['Absol', 49, 'dark']]) },
    emerald: { team: makeTeam([['Mightyena', 46, 'dark'], ['Cacturne', 46, 'dark'], ['Shiftry', 48, 'dark'], ['Crawdaunt', 48, 'water'], ['Absol', 49, 'dark']]) },
    'omega-ruby-alpha-sapphire': { battleStages: { rematch: { label: 'Pokemon League rematch (after Delta Episode)', team: makeTeam([['Scrafty', 70, 'dark'], ['Shiftry', 70, 'dark'], ['Sharpedo', 70, 'water'], ['Zoroark', 70, 'dark'], ['Mandibuzz', 70, 'dark'], ['Absol', 72, 'dark']]) } } },
  },
  phoebe: {
    'ruby-sapphire': { signature: 'Dusclops', team: makeTeam([['Dusclops', 48, 'ghost'], ['Banette', 49, 'ghost'], ['Banette', 49, 'ghost'], ['Sableye', 50, 'dark'], ['Dusclops', 51, 'ghost']]) },
    emerald: { signature: 'Dusclops', team: makeTeam([['Dusclops', 48, 'ghost'], ['Banette', 49, 'ghost'], ['Banette', 49, 'ghost'], ['Sableye', 50, 'dark'], ['Dusclops', 51, 'ghost']]) },
    'omega-ruby-alpha-sapphire': { battleStages: { rematch: { label: 'Pokemon League rematch (after Delta Episode)', team: makeTeam([['Banette', 71, 'ghost'], ['Mismagius', 71, 'ghost'], ['Drifblim', 71, 'ghost'], ['Chandelure', 71, 'ghost'], ['Dusknoir', 71, 'ghost'], ['Sableye', 73, 'dark']]) } } },
  },
  glacia: {
    'ruby-sapphire': { team: makeTeam([['Glalie', 50, 'ice'], ['Sealeo', 50, 'ice'], ['Glalie', 52, 'ice'], ['Sealeo', 52, 'ice'], ['Walrein', 53, 'ice']]) },
    emerald: { team: makeTeam([['Glalie', 50, 'ice'], ['Sealeo', 50, 'ice'], ['Glalie', 52, 'ice'], ['Sealeo', 52, 'ice'], ['Walrein', 53, 'ice']]) },
    'omega-ruby-alpha-sapphire': { battleStages: { rematch: { label: 'Pokemon League rematch (after Delta Episode)', team: makeTeam([['Abomasnow', 72, 'ice'], ['Beartic', 72, 'ice'], ['Froslass', 72, 'ice'], ['Vanilluxe', 72, 'ice'], ['Walrein', 72, 'ice'], ['Glalie', 74, 'ice']]) } } },
  },
  drake: {
    'ruby-sapphire': { team: makeTeam([['Shelgon', 52, 'dragon'], ['Altaria', 54, 'dragon'], ['Flygon', 53, 'ground'], ['Flygon', 53, 'ground'], ['Salamence', 55, 'dragon']]) },
    emerald: { team: makeTeam([['Shelgon', 52, 'dragon'], ['Altaria', 54, 'dragon'], ['Kingdra', 53, 'water'], ['Flygon', 53, 'ground'], ['Salamence', 55, 'dragon']]) },
    'omega-ruby-alpha-sapphire': { battleStages: { rematch: { label: 'Pokemon League rematch (after Delta Episode)', team: makeTeam([['Altaria', 73, 'dragon'], ['Dragalge', 73, 'dragon'], ['Kingdra', 73, 'water'], ['Flygon', 73, 'ground'], ['Haxorus', 73, 'dragon'], ['Salamence', 75, 'dragon']]) } } },
  },
  steven: {
    'ruby-sapphire': { team: makeTeam([['Skarmory', 57, 'steel'], ['Cradily', 56, 'rock'], ['Claydol', 55, 'psychic'], ['Armaldo', 56, 'bug'], ['Aggron', 56, 'steel'], ['Metagross', 58, 'steel']]) },
    emerald: {
      division: 'postgame',
      role: 'Meteor Falls Postgame Boss',
      summary: 'Steven challenges the player in Meteor Falls after the Emerald Champion battle.',
      team: makeTeam([['Skarmory', 77, 'steel'], ['Claydol', 75, 'psychic'], ['Aggron', 76, 'steel'], ['Cradily', 76, 'rock'], ['Armaldo', 76, 'bug'], ['Metagross', 78, 'steel']]),
    },
    'omega-ruby-alpha-sapphire': { battleStages: { rematch: { label: 'Pokemon League rematch (after Delta Episode)', team: makeTeam([['Skarmory', 77, 'steel'], ['Claydol', 77, 'psychic'], ['Carbink', 77, 'rock'], ['Aerodactyl', 77, 'rock'], ['Aggron', 77, 'steel'], ['Metagross', 79, 'steel']]) } } },
  },
};

const getHoennGameData = (name) => {
  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const gameData = hoennGameData[key] || {};
  const sourcedGameData = Object.fromEntries(
    Object.entries(gameData).map(([gameId, data]) => [gameId, { ...data, sources: hoennTrainerSources }]),
  );
  const emeraldStages = makeEmeraldRematchStages(emeraldGymRematchTeams[key]);

  if (!emeraldStages) {
    return sourcedGameData;
  }

  return {
    ...sourcedGameData,
    emerald: {
      ...(sourcedGameData.emerald || {}),
      initialStageLabel: 'Gym battle',
      sources: emeraldRematchSources,
      battleStages: {
        ...(sourcedGameData.emerald?.battleStages || {}),
        ...emeraldStages,
      },
    },
  };
};

const sinnohTrainerSources = [
  {
    label: 'Pokemon Database Diamond/Pearl tables',
    url: 'https://pokemondb.net/diamond-pearl/gymleaders-elitefour',
  },
  {
    label: 'Serebii Platinum rematch tables',
    url: 'https://www.serebii.net/platinum/gym-rematches.shtml',
  },
];

const diamondPearlTeams = {
  'roark-sinnoh': makeTeam([['Geodude', 12], ['Onix', 12], ['Cranidos', 14]]),
  'gardenia-sinnoh': makeTeam([['Cherubi', 19], ['Turtwig', 19], ['Roserade', 22]]),
  'maylene-sinnoh': makeTeam([['Meditite', 27], ['Machoke', 27], ['Lucario', 30]]),
  'wake-sinnoh': makeTeam([['Gyarados', 27], ['Quagsire', 27], ['Floatzel', 30]]),
  'fantina-sinnoh': makeTeam([['Drifblim', 32], ['Gengar', 34], ['Mismagius', 36]]),
  'byron-sinnoh': makeTeam([['Bronzor', 36], ['Steelix', 36], ['Bastiodon', 39]]),
  'candice-sinnoh': makeTeam([['Snover', 38], ['Sneasel', 38], ['Medicham', 40], ['Abomasnow', 42]]),
  'volkner-sinnoh': makeTeam([['Raichu', 46], ['Ambipom', 47], ['Octillery', 48], ['Luxray', 49]]),
  'aaron-sinnoh': makeTeam([['Dustox', 53], ['Beautifly', 53], ['Heracross', 54], ['Vespiquen', 54], ['Drapion', 57]]),
  'bertha-sinnoh': makeTeam([['Quagsire', 55], ['Whiscash', 55], ['Golem', 56], ['Sudowoodo', 57], ['Hippowdon', 59]]),
  'flint-sinnoh': makeTeam([['Rapidash', 58], ['Steelix', 57], ['Lopunny', 57], ['Drifblim', 58], ['Infernape', 61]]),
  'lucian-sinnoh': makeTeam([['Mr. Mime', 59], ['Girafarig', 59], ['Medicham', 60], ['Alakazam', 60], ['Bronzong', 63]]),
  'cynthia-sinnoh': makeTeam([['Spiritomb', 61], ['Gastrodon', 60], ['Roserade', 60], ['Milotic', 63], ['Lucario', 63], ['Garchomp', 66]]),
};

const platinumRematchTeams = {
  'roark-sinnoh': makeTeam([['Aerodactyl', 62], ['Probopass', 61], ['Golem', 61], ['Rampardos', 63], ['Tyranitar', 65]]),
  'gardenia-sinnoh': makeTeam([['Jumpluff', 61], ['Bellossom', 61], ['Cherrim', 62], ['Torterra', 63], ['Roserade', 65]]),
  'fantina-sinnoh': makeTeam([['Banette', 62], ['Mismagius', 62], ['Dusknoir', 62], ['Gengar', 63], ['Drifblim', 66]]),
  'maylene-sinnoh': makeTeam([['Hitmontop', 62], ['Breloom', 62], ['Medicham', 63], ['Machamp', 64], ['Lucario', 66]]),
  'wake-sinnoh': makeTeam([['Sharpedo', 61], ['Floatzel', 63], ['Quagsire', 63], ['Ludicolo', 65], ['Gyarados', 66]]),
  'byron-sinnoh': makeTeam([['Skarmory', 61], ['Steelix', 61], ['Magnezone', 62], ['Bastiodon', 63], ['Aggron', 65]]),
  'candice-sinnoh': makeTeam([['Weavile', 62], ['Abomasnow', 61], ['Mamoswine', 61], ['Froslass', 63], ['Glaceon', 65]]),
  'volkner-sinnoh': makeTeam([['Jolteon', 61], ['Raichu', 61], ['Luxray', 62], ['Lanturn', 63], ['Electivire', 65]]),
  'aaron-sinnoh': makeTeam([['Yanmega', 65], ['Scizor', 65], ['Vespiquen', 66], ['Heracross', 67], ['Drapion', 69]]),
  'bertha-sinnoh': makeTeam([['Whiscash', 66], ['Gliscor', 69], ['Golem', 68], ['Rhyperior', 71], ['Hippowdon', 68]]),
  'flint-sinnoh': makeTeam([['Houndoom', 68], ['Flareon', 71], ['Rapidash', 69], ['Infernape', 71], ['Magmortar', 73]]),
  'lucian-sinnoh': makeTeam([['Mr. Mime', 69], ['Espeon', 71], ['Bronzong', 70], ['Alakazam', 72], ['Gallade', 75]]),
  'cynthia-sinnoh': makeTeam([['Spiritomb', 74], ['Roserade', 74], ['Togekiss', 76], ['Lucario', 76], ['Milotic', 74], ['Garchomp', 78]]),
};

const getSinnohGameData = (id, division) => ({
  platinum: {
    initialStageLabel: division === 'gym' ? 'Gym battle' : 'Pokemon League battle',
    ...(id === 'lucian-sinnoh' ? { signature: 'Gallade' } : {}),
    team: sourceCheckedTrainerTeams[id],
    sources: sinnohTrainerSources,
    battleStages: platinumRematchTeams[id]
      ? {
          rematch: {
            label: division === 'gym'
              ? 'Battleground rematch (after Stark Mountain)'
              : 'Pokemon League rematch (after Stark Mountain)',
            team: platinumRematchTeams[id],
            sources: sinnohTrainerSources,
          },
        }
      : undefined,
  },
  'diamond-pearl': {
    initialStageLabel: division === 'gym' ? 'Gym battle' : 'Pokemon League battle',
    ...(id === 'lucian-sinnoh' ? { signature: 'Bronzong' } : {}),
    teamContext: division === 'gym'
      ? 'Diamond and Pearl use this team; Platinum is shown separately.'
      : 'Diamond/Pearl League repeat battles reuse this same team.',
    team: diamondPearlTeams[id],
    sources: sinnohTrainerSources,
  },
});

const unovaTrainerSources = [
  {
    label: 'Serebii Black/White battle tables',
    url: 'https://www.serebii.net/blackwhite/gyms.shtml',
  },
  {
    label: 'Serebii Black 2/White 2 battle tables',
    url: 'https://www.serebii.net/black2white2/gyms.shtml',
  },
];

const unovaSpecialSources = [
  {
    label: 'Serebii Black/White special trainers',
    url: 'https://www.serebii.net/blackwhite/strongtrainers.shtml',
  },
  {
    label: 'Serebii Black 2/White 2 special trainers',
    url: 'https://www.serebii.net/black2white2/strongtrainers.shtml',
  },
];

const nTrainerSources = [
  {
    label: 'Serebii N battle tables',
    url: 'https://www.serebii.net/black2white2/n.shtml',
  },
  {
    label: 'Bulbapedia N encounter tables',
    url: 'https://bulbapedia.bulbagarden.net/wiki/N_(game)',
  },
];

const nBwCommonTeam = makeTeam([
  ['Carracosta', 50, ['Aqua Jet', 'Waterfall', 'Stone Edge', 'Crunch']],
  ['Vanilluxe', 50, ['Frost Breath', 'Blizzard', 'Hail', 'Flash Cannon']],
  ['Archeops', 50, ['Dragon Claw', 'Acrobatics', 'Stone Edge', 'Crunch']],
  ['Zoroark', 50, ['Night Slash', 'Flamethrower', 'Focus Blast', 'Retaliate']],
  ['Klinklang', 50, ['Thunderbolt', 'Flash Cannon', 'Hyper Beam', 'Metal Sound']],
]);

const nTeams = {
  bwBlack: [
    makeMember('Zekrom', 52, ['Zen Headbutt', 'Giga Impact', 'Light Screen', 'Fusion Bolt']),
    ...nBwCommonTeam,
  ],
  bwWhite: [
    makeMember('Reshiram', 52, ['Extrasensory', 'Hyper Beam', 'Reflect', 'Fusion Flare']),
    ...nBwCommonTeam,
  ],
  b2Black: [makeMember('Zekrom', 70, ['Zen Headbutt', 'Fusion Bolt', 'Dragon Claw', 'Imprison'])],
  b2White: [makeMember('Reshiram', 70, ['Extrasensory', 'Fusion Flare', 'Dragon Pulse', 'Imprison'])],
  spring: makeTeam([
    ['Politoed', 77, ['Hydro Pump', 'Focus Blast', 'Psychic', 'Hypnosis']],
    ['Lanturn', 75, ['Thunder', 'Signal Beam', 'Hydro Pump', 'Stockpile']],
    ['Tentacruel', 75, ['Rain Dance', 'Giga Drain', 'Scald', 'Barrier']],
    ['Omastar', 75, ['Rain Dance', 'Hydro Pump', 'Ice Beam', 'Earth Power']],
    ['Kabutops', 75, ['Stone Edge', 'Aqua Jet', 'X-Scissor', 'Low Kick']],
    ['Starmie', 75, ['Hydro Pump', 'Thunder', 'Psychic', 'Ice Beam']],
  ]),
  summer: makeTeam([
    ['Ninetales', 77, ['Fire Blast', 'Solar Beam', 'Foul Play', 'Confuse Ray']],
    ['Arcanine', 75, ['Extreme Speed', 'Overheat', 'Wild Charge', 'Outrage']],
    ['Rapidash', 75, ['Megahorn', 'Drill Run', 'Flare Blitz', 'Solar Beam']],
    ['Shiftry', 75, ['Dark Pulse', 'Solar Beam', 'Focus Blast', 'Sunny Day']],
    ['Ninjask', 75, ['Sunny Day', 'X-Scissor', 'Solar Beam', 'Protect']],
    ['Leafeon', 75, ['Leaf Blade', 'X-Scissor', 'Attract', 'Iron Tail']],
  ]),
  autumn: makeTeam([
    ['Hippowdon', 77, ['Stone Edge', 'Crunch', 'Superpower', 'Stealth Rock']],
    ['Gastrodon', 75, ['Earth Power', 'Muddy Water', 'Ice Beam', 'Sandstorm']],
    ['Cradily', 75, ['Sandstorm', 'Giga Drain', 'Confuse Ray', 'Stockpile']],
    ['Armaldo', 75, ['Rock Slide', 'X-Scissor', 'Aqua Tail', 'Rock Polish']],
    ['Scizor', 75, ['Bullet Punch', 'Double Hit', 'Bug Bite', 'Aerial Ace']],
    ['Rhyperior', 75, ['Earthquake', 'Stone Edge', 'Fire Punch', 'Ice Punch']],
  ]),
  winter: makeTeam([
    ['Abomasnow', 77, ['Blizzard', 'Wood Hammer', 'Earthquake', 'Grass Whistle']],
    ['Vanilluxe', 75, ['Blizzard', 'Flash Cannon', 'Signal Beam', 'Hail']],
    ['Cloyster', 75, ['Icicle Spear', 'Hydro Pump', 'Ice Shard', 'Shell Smash']],
    ['Mamoswine', 75, ['Earthquake', 'Ice Shard', 'Blizzard', 'Stone Edge']],
    ['Froslass', 75, ['Blizzard', 'Shadow Ball', 'Psychic', 'Hail']],
    ['Glaceon', 75, ['Blizzard', 'Shadow Ball', 'Signal Beam', 'Attract']],
  ]),
};

const b2w2GymTeams = {
  'cheren-unova': makeTeam([
    ['Patrat', 11, ['Work Up', 'Bite', 'Tackle', 'Detect']],
    ['Lillipup', 13, ['Work Up', 'Bite', 'Tackle', 'Helping Hand']],
  ]),
  'roxie-unova': makeTeam([
    ['Koffing', 16, ['Smog', 'Assurance', 'Tackle', 'Clear Smog']],
    ['Whirlipede', 18, ['Venoshock', 'Poison Sting', 'Protect', 'Pursuit']],
  ]),
  'burgh-unova': makeTeam([
    ['Swadloon', 22, ['Struggle Bug', 'Razor Leaf', 'String Shot', 'Protect']],
    ['Dwebble', 22, ['Struggle Bug', 'Smack Down', 'Faint Attack', 'Rock Polish']],
    ['Leavanny', 24, ['Struggle Bug', 'Razor Leaf', 'Cut', 'String Shot']],
  ]),
  'elesa-unova': makeTeam([
    ['Emolga', 28, ['Volt Switch', 'Quick Attack', 'Pursuit', 'Electro Ball']],
    ['Flaaffy', 28, ['Volt Switch', 'Take Down', 'Thunder Wave', 'Electro Ball']],
    ['Zebstrika', 30, ['Volt Switch', 'Flame Charge', 'Quick Attack', 'Pursuit']],
  ]),
  'clay-unova': makeTeam([
    ['Krokorok', 31, ['Bulldoze', 'Crunch', 'Sand Tomb', 'Torment']],
    ['Sandslash', 31, ['Bulldoze', 'Crush Claw', 'Rollout', 'Fury Cutter']],
    ['Excadrill', 33, ['Bulldoze', 'Metal Claw', 'Slash', 'Rock Slide']],
  ]),
  'skyla-unova': makeTeam([
    ['Swoobat', 37, ['Acrobatics', 'Heart Stamp', 'Assurance', 'Attract']],
    ['Skarmory', 37, ['Air Cutter', 'Steel Wing', 'Fury Attack', 'Agility']],
    ['Swanna', 39, ['Air Slash', 'Bubble Beam', 'Roost', 'Feather Dance']],
  ]),
  'drayden-unova': makeTeam([
    ['Druddigon', 46, ['Dragon Tail', 'Revenge', 'Slash', 'Crunch']],
    ['Flygon', 46, ['Dragon Tail', 'Crunch', 'Earth Power', 'Rock Slide']],
    ['Haxorus', 48, ['Dragon Tail', 'Slash', 'Assurance', 'Dragon Dance']],
  ]),
};

const b2w2LeagueTeams = {
  'shauntal-unova': makeTeam([['Cofagrigus', 56], ['Drifblim', 56], ['Golurk', 56], ['Chandelure', 58]]),
  'grimsley-unova': makeTeam([['Liepard', 56], ['Scrafty', 56], ['Krookodile', 56], ['Bisharp', 58]]),
  'caitlin-unova': makeTeam([['Musharna', 56], ['Sigilyph', 56], ['Reuniclus', 56], ['Gothitelle', 58]]),
  'marshal-unova': makeTeam([['Throh', 56], ['Sawk', 56], ['Mienshao', 56], ['Conkeldurr', 58]]),
};

const b2w2LeagueRematchTeams = {
  'shauntal-unova': makeTeam([['Cofagrigus', 72], ['Mismagius', 72], ['Froslass', 72], ['Drifblim', 72], ['Golurk', 72], ['Chandelure', 74]]),
  'grimsley-unova': makeTeam([['Liepard', 72], ['Honchkrow', 72], ['Scrafty', 72], ['Houndoom', 72], ['Krookodile', 72], ['Bisharp', 74]]),
  'caitlin-unova': makeTeam([['Musharna', 72], ['Sigilyph', 72], ['Gallade', 72], ['Reuniclus', 72], ['Gothitelle', 72], ['Metagross', 74]]),
  'marshal-unova': makeTeam([['Throh', 72], ['Sawk', 72], ['Medicham', 72], ['Lucario', 72], ['Mienshao', 72], ['Conkeldurr', 74]]),
};

const irisB2w2InitialTeam = makeTeam([
  ['Hydreigon', 57], ['Druddigon', 57], ['Archeops', 57], ['Aggron', 57], ['Lapras', 57], ['Haxorus', 59],
]);

const irisB2w2RematchTeam = makeTeam([
  ['Hydreigon', 76, ['Fire Blast', 'Focus Blast', 'Dragon Pulse', 'Surf']],
  ['Druddigon', 76, ['Fire Punch', 'Thunder Punch', 'Outrage', 'Focus Blast']],
  ['Archeops', 76, ['Acrobatics', 'Stone Edge', 'Dragon Claw', 'Endeavor']],
  ['Aggron', 76, ['Earthquake', 'Double-Edge', 'Stone Edge', 'Autotomize']],
  ['Lapras', 76, ['Hydro Pump', 'Blizzard', 'Thunder', 'Sing']],
  ['Haxorus', 78, ['Earthquake', 'Guillotine', 'Outrage', 'Dragon Dance']],
]);

const bwLeagueRematchTeams = {
  'shauntal-unova': makeTeam([['Cofagrigus', 71], ['Jellicent', 71], ['Froslass', 71], ['Drifblim', 71], ['Golurk', 71], ['Chandelure', 73]]),
  'grimsley-unova': makeTeam([['Sharpedo', 71], ['Liepard', 71], ['Scrafty', 71], ['Drapion', 71], ['Krookodile', 71], ['Bisharp', 73]]),
  'caitlin-unova': makeTeam([['Musharna', 71], ['Sigilyph', 71], ['Bronzong', 71], ['Reuniclus', 71], ['Gothitelle', 71], ['Metagross', 73]]),
  'marshal-unova': makeTeam([['Breloom', 71], ['Throh', 71], ['Sawk', 71], ['Toxicroak', 71], ['Mienshao', 71], ['Conkeldurr', 73]]),
};

const unovaGameData = Object.fromEntries(
  ['shauntal', 'grimsley', 'caitlin', 'marshal'].map((name) => {
    const id = `${name}-unova`;
    return [name, {
      'black-white': {
        initialStageLabel: 'Pokemon League battle',
        team: sourceCheckedTrainerTeams[id],
        sources: unovaTrainerSources,
        battleStages: {
          rematch: {
            label: 'Pokemon League rematch',
            team: bwLeagueRematchTeams[id],
            sources: unovaTrainerSources,
          },
        },
      },
      'black-2-white-2': {
        initialStageLabel: 'Pokemon League battle (Normal Mode)',
        teamContext: 'Normal Mode team; Easy and Challenge Mode alter levels and, in some battles, party details.',
        team: b2w2LeagueTeams[id],
        sources: unovaTrainerSources,
        battleStages: {
          rematch: {
            label: 'Pokemon League rematch (Normal Mode)',
            team: b2w2LeagueRematchTeams[id],
            sources: unovaTrainerSources,
          },
        },
      },
    }];
  }),
);

unovaGameData.alder = {
  'black-white': {
    initialStageLabel: 'Postgame Champion battle',
    team: sourceCheckedTrainerTeams['alder-unova'],
    sources: unovaTrainerSources,
  },
  'black-2-white-2': {
    role: 'Floccesy Town one-time battle',
    initialStageLabel: 'Floccesy Town battle',
    team: makeTeam([
      ['Accelgor', 60, ['Bug Buzz', 'Focus Blast', 'Giga Drain', 'Acid Spray']],
      ['Escavalier', 60, ['X-Scissor', 'Iron Head', 'Reversal', 'Swords Dance']],
      ['Bouffalant', 60, ['Head Charge', 'Megahorn', 'Earthquake', 'Wild Charge']],
      ['Conkeldurr', 60, ['Superpower', 'Stone Edge', 'Poison Jab', 'Earthquake']],
      ['Braviary', 60, ['Crush Claw', 'Superpower', 'Aerial Ace', 'Rock Slide']],
      ['Volcarona', 62, ['Heat Wave', 'Quiver Dance', 'Silver Wind', 'Psychic']],
    ]),
    sources: unovaTrainerSources,
  },
};

const getUnovaGameData = (name) => unovaGameData[name.toLowerCase().replace(/[^a-z0-9]+/g, '-')] || {};

const bwOnlyGymIds = new Set([
  'cilan-unova', 'chili-unova', 'cress-unova', 'lenora-unova', 'brycen-unova',
]);
const b2w2OnlyGymIds = new Set(['cheren-unova', 'roxie-unova']);

const getUnovaGymGameIds = (id) => {
  if (bwOnlyGymIds.has(id)) return ['black-white'];
  if (b2w2OnlyGymIds.has(id)) return ['black-2-white-2'];
  return ['black-white', 'black-2-white-2'];
};

const getUnovaGymGameData = (id) => {
  const gameData = {};

  if (!b2w2OnlyGymIds.has(id)) {
    const starterLabels = {
      'cilan-unova': ['Gym battle - Player chose Oshawott', 'Cilan is fought only when the player chose Oshawott.'],
      'chili-unova': ['Gym battle - Player chose Snivy', 'Chili is fought only when the player chose Snivy.'],
      'cress-unova': ['Gym battle - Player chose Tepig', 'Cress is fought only when the player chose Tepig.'],
    };
    const starterLabel = starterLabels[id];
    gameData['black-white'] = {
      initialStageLabel: starterLabel?.[0] || 'Gym battle',
      teamContext: starterLabel?.[1]
        || (id === 'drayden-unova'
          ? 'Drayden is Opelucid Gym Leader in Black; Iris is the White counterpart.'
          : id === 'iris-unova'
            ? 'Iris is Opelucid Gym Leader in White; Drayden is the Black counterpart.'
            : undefined),
      team: sourceCheckedTrainerTeams[id],
      sources: unovaTrainerSources,
    };
  }

  if (!bwOnlyGymIds.has(id)) {
    gameData['black-2-white-2'] = id === 'iris-unova'
      ? {
          division: 'champion',
          role: 'Unova Champion',
          initialStageLabel: 'Champion battle (Normal Mode)',
          teamContext: 'Normal Mode team; Easy and Challenge Mode use different levels.',
          team: irisB2w2InitialTeam,
          sources: unovaTrainerSources,
          battleStages: {
            rematch: {
              label: 'Champion rematch (Normal Mode)',
              team: irisB2w2RematchTeam,
              sources: unovaTrainerSources,
            },
          },
        }
      : {
          initialStageLabel: 'Gym battle (Normal Mode)',
          teamContext: 'Normal Mode team; Easy and Challenge Mode use different levels.',
          team: b2w2GymTeams[id],
          sources: unovaTrainerSources,
        };
  }

  return gameData;
};

const alolaTrainerSources = [
  {
    label: 'Serebii Sun/Moon battle tables',
    url: 'https://www.serebii.net/sunmoon/elitefour.shtml',
  },
  {
    label: 'Serebii Ultra Sun/Ultra Moon battle tables',
    url: 'https://www.serebii.net/ultrasunultramoon/elitefour.shtml',
  },
];

const battleTreeSources = [
  {
    label: 'Bulbapedia Battle Tree trainer rules',
    url: 'https://bulbapedia.bulbagarden.net/wiki/List_of_Battle_Tree_Trainers',
  },
  {
    label: 'Serebii Battle Tree catalogue',
    url: 'https://www.serebii.net/sunmoon/battletree/',
  },
];

const kalosTrainerSources = [
  {
    label: 'Pokemon Database X/Y battle tables',
    url: 'https://pokemondb.net/x-y/gymleaders-elitefour',
  },
  {
    label: 'Serebii Battle Chateau mechanics',
    url: 'https://www.serebii.net/xy/battlechateau.shtml',
  },
];

const usumGrandTrialTeams = {
  'hala-alola': makeTeam([
    ['Machop', 15, ['Karate Chop', 'Revenge', 'Focus Energy']],
    ['Makuhita', 15, ['Arm Thrust', 'Sand Attack', 'Fake Out']],
    ['Crabrawler', 16, ['Pursuit', 'Power-Up Punch', 'Leer']],
  ]),
  'olivia-alola': makeTeam([
    ['Anorith', 27, ['Bug Bite', 'Smack Down', 'Metal Claw']],
    ['Lileep', 27, ['Giga Drain', 'Ancient Power', 'Brine']],
    ['Lycanroc-midday', 28, ['Bite', 'Rock Tomb'], 'Lycanroc'],
  ]),
  'nanu-alola': makeTeam([['Sableye', 43], ['Krokorok', 43], ['Persian-alola', 44, [], 'Persian']]),
  'hapu-alola': makeTeam([
    ['Golurk', 53, ['Hammer Arm', 'Earthquake', 'Shadow Punch', 'Stealth Rock']],
    ['Gastrodon', 53, ['Muddy Water', 'Mud Bomb', 'Recover']],
    ['Flygon', 53, ['Earth Power', 'Dragon Breath']],
    ['Mudsdale', 54, ['Heavy Slam', 'Earthquake', 'Double Kick', 'Payback']],
  ]),
};

const smEliteRematchTeams = {
  'acerola-alola': makeTeam([
    ['Sableye', 63, ['Shadow Claw', 'Zen Headbutt', 'Brick Break', 'Fake Out']],
    ['Drifblim', 63, ['Shadow Ball', 'Thunderbolt', 'Psychic', 'Will-O-Wisp']],
    ['Dhelmise', 63, ['Phantom Force', 'Heavy Slam', 'Earthquake', 'Brutal Swing']],
    ['Froslass', 63, ['Blizzard', 'Shadow Ball', 'Thunderbolt', 'Ice Shard']],
    ['Palossand', 63, ['Shadow Ball', 'Earth Power', 'Sludge Bomb', 'Giga Drain']],
  ]),
  'kahili-alola': makeTeam([
    ['Skarmory', 63, ['Steel Wing', 'Night Slash', 'Rock Slide', 'Spikes']],
    ['Crobat', 63, ['Air Slash', 'Shadow Ball', 'Dark Pulse', 'Sludge Bomb']],
    ['Oricorio-baile', 63, ['Revelation Dance', 'Teeter Dance', 'Air Slash', 'Feather Dance'], 'Oricorio'],
    ['Mandibuzz', 63, ['Snarl', 'Air Slash', 'Roost', 'Toxic']],
    ['Toucannon', 63, ['Bullet Seed', 'Rock Blast', 'Beak Blast', 'Brick Break']],
  ]),
};

const usumEliteTeams = {
  'acerola-alola': {
    initial: makeTeam([['Banette', 56], ['Drifblim', 56], ['Dhelmise', 56], ['Froslass', 56], ['Palossand', 57]]),
    rematch: makeTeam([['Banette', 66], ['Drifblim', 66], ['Dhelmise', 66], ['Froslass', 66], ['Palossand', 66]]),
  },
  'kahili-alola': {
    initial: makeTeam([['Braviary', 56], ['Hawlucha', 56], ['Oricorio-baile', 56, [], 'Oricorio'], ['Mandibuzz', 56], ['Toucannon', 57]]),
    rematch: makeTeam([['Braviary', 66], ['Hawlucha', 66], ['Oricorio-baile', 66, [], 'Oricorio'], ['Mandibuzz', 66], ['Toucannon', 66]]),
  },
};

const kukuiFixedTeam = (level) => makeTeam([
  ['Lycanroc-midday', level, ['Stone Edge', 'Accelerock', 'Crunch', 'Stealth Rock'], 'Lycanroc'],
  ['Ninetales-alola', level, ['Dazzling Gleam', 'Blizzard', 'Ice Shard', 'Safeguard'], 'Ninetales'],
  ['Braviary', level, ['Crush Claw', 'Brave Bird', 'Whirlwind', 'Tailwind']],
  ['Magnezone', level, ['Thunderbolt', 'Flash Cannon', 'Thunder Wave', 'Mirror Coat']],
  ['Snorlax', level, ['Body Slam', 'Crunch', 'Heavy Slam', 'High Horsepower']],
]);

const kukuiStarter = {
  rowlet: (level) => makeMember('Incineroar', level, ['Flare Blitz', 'Darkest Lariat', 'Outrage', 'Cross Chop']),
  litten: (level) => makeMember('Primarina', level, ['Sparkling Aria', 'Moonblast', 'Aqua Jet', 'Hyper Voice']),
  popplio: (level) => makeMember('Decidueye', level, ['Leaf Blade', 'Spirit Shackle', 'Brave Bird', 'Sucker Punch']),
};

const makeKukuiTeam = (fixedLevel, starterLevel, starter) => [
  ...kukuiFixedTeam(fixedLevel),
  kukuiStarter[starter](starterLevel),
];

const getAlolaGameData = (id, baseTeam) => {
  if (id === 'kukui-alola') {
    return {
      'sun-moon': {
        initialStageLabel: 'League final',
        team: makeKukuiTeam(56, 58, 'rowlet').map((member, index) => index === 0 ? { ...member, level: 57 } : member),
        teamVariantCondition: 'player-starter',
        teamVariants: [
          { label: 'Player chose Rowlet', team: makeKukuiTeam(56, 58, 'rowlet').map((member, index) => index === 0 ? { ...member, level: 57 } : member) },
          { label: 'Player chose Litten', team: makeKukuiTeam(56, 58, 'litten').map((member, index) => index === 0 ? { ...member, level: 57 } : member) },
          { label: 'Player chose Popplio', team: makeKukuiTeam(56, 58, 'popplio').map((member, index) => index === 0 ? { ...member, level: 57 } : member) },
        ],
        sources: alolaTrainerSources,
        battleStages: {
          rematch: {
            label: 'Title defense',
            team: makeKukuiTeam(65, 65, 'rowlet'),
            teamVariantCondition: 'player-starter',
            teamVariants: [
              { label: 'Player chose Rowlet', team: makeKukuiTeam(65, 65, 'rowlet') },
              { label: 'Player chose Litten', team: makeKukuiTeam(65, 65, 'litten') },
              { label: 'Player chose Popplio', team: makeKukuiTeam(65, 65, 'popplio') },
            ],
            sources: alolaTrainerSources,
          },
        },
      },
      'ultra-sun-ultra-moon': {
        role: 'Title Defense Challenger',
        initialStageLabel: 'Title defense',
        team: makeKukuiTeam(68, 69, 'rowlet'),
        teamVariantCondition: 'player-starter',
        teamVariants: [
          { label: 'Player chose Rowlet', team: makeKukuiTeam(68, 69, 'rowlet') },
          { label: 'Player chose Litten', team: makeKukuiTeam(68, 69, 'litten') },
          { label: 'Player chose Popplio', team: makeKukuiTeam(68, 69, 'popplio') },
        ],
        sources: alolaTrainerSources,
      },
    };
  }

  if (smEliteRematchTeams[id]) {
    return {
      'sun-moon': {
        initialStageLabel: 'Pokemon League battle',
        team: sourceCheckedTrainerTeams[id] || baseTeam,
        sources: alolaTrainerSources,
        battleStages: { rematch: { label: 'Pokemon League rematch', team: smEliteRematchTeams[id], sources: alolaTrainerSources } },
      },
      'ultra-sun-ultra-moon': {
        initialStageLabel: 'Pokemon League battle',
        team: usumEliteTeams[id].initial,
        sources: alolaTrainerSources,
        battleStages: { rematch: { label: 'Pokemon League rematch', team: usumEliteTeams[id].rematch, sources: alolaTrainerSources } },
      },
    };
  }

  return {
    'sun-moon': { initialStageLabel: 'Grand Trial', team: sourceCheckedTrainerTeams[id] || baseTeam, sources: alolaTrainerSources },
    'ultra-sun-ultra-moon': { initialStageLabel: 'Grand Trial', team: usumGrandTrialTeams[id], sources: alolaTrainerSources },
  };
};

const galarTrainerSources = [
  {
    label: 'Serebii Champion Cup tables',
    url: 'https://www.serebii.net/swordshield/championcuprematch.shtml',
  },
  {
    label: 'Bulbapedia Leon battle tables',
    url: 'https://bulbapedia.bulbagarden.net/wiki/Leon',
  },
];

const mustardSources = [
  {
    label: 'Serebii Mustard battle tables',
    url: 'https://www.serebii.net/swordshield/mustard.shtml',
  },
  {
    label: 'Serebii daily rematch tables',
    url: 'https://www.serebii.net/swordshield/dailyevent.shtml',
  },
];

const makeMustardTeam = (urshifuForm, late = false) => {
  const levels = late ? [78, 78, 79, 80, 80, 80] : [73, 73, 74, 75, 75, 75];
  const isRapid = urshifuForm === 'rapid';
  return makeTeam([
    ['Mienshao', levels[0], ['Fake Out', 'U-turn', 'Blaze Kick', 'Close Combat']],
    ['Luxray', levels[1], ['Psychic Fangs', 'Wild Charge', 'Crunch', 'Play Rough']],
    ['Corviknight', levels[2], ['Iron Head', 'Brave Bird', 'Body Press', 'Light Screen']],
    ['Lycanroc-dusk', levels[3], ['Accelerock', 'Stealth Rock', 'Stone Edge', 'Play Rough'], 'Lycanroc'],
    ['Kommo-o', levels[4], ['Clanging Scales', 'Aura Sphere', 'Flash Cannon', 'Clangorous Soul']],
    [
      isRapid ? 'Urshifu-rapid-strike' : 'Urshifu-single-strike',
      levels[5],
      [isRapid ? 'Surging Strikes' : 'Wicked Blow', 'Close Combat', 'Poison Jab', 'Iron Head'],
      `Urshifu (${isRapid ? 'Rapid Strike' : 'Single Strike'} Style)`,
    ],
  ]);
};

const galarGymRematchTeams = {
  'milo-galar': {
    sword: makeTeam([['Shiftry', 60], ['Eldegoss', 60], ['Bellossom', 61], ['Cherrim', 61], ['Flapple', 62]]),
    shield: makeTeam([['Ludicolo', 60], ['Eldegoss', 60], ['Bellossom', 61], ['Cherrim', 61], ['Appletun', 62]]),
  },
  'nessa-galar': makeTeam([['Golisopod', 60], ['Pelipper', 60], ['Quagsire', 61], ['Toxapex', 61], ['Drednaw', 62]]),
  'kabu-galar': makeTeam([['Torkoal', 60], ['Ninetales', 60], ['Arcanine', 61], ['Salazzle', 61], ['Centiskorch', 62]]),
  'bea-galar': makeTeam([['Hawlucha', 60], ['Grapploct', 60], ['Sirfetchd', 61, [], "Sirfetch'd"], ['Falinks', 61], ['Machamp', 62]]),
  'allister-galar': makeTeam([['Dusknoir', 60], ['Chandelure', 60], ['Cursola', 61], ['Runerigus', 61], ['Gengar', 62]]),
  'gordie-galar': makeTeam([['Barbaracle', 60], ['Shuckle', 60], ['Stonjourner', 61], ['Tyranitar', 61], ['Coalossal', 62]]),
  'melony-galar': makeTeam([['Frosmoth', 60], ['Mr. Rime', 60], ['Eiscue-ice', 61, [], 'Eiscue'], ['Darmanitan-galar-standard', 61, [], 'Darmanitan'], ['Lapras', 62]]),
  'piers-galar': makeTeam([['Scrafty', 60], ['Malamar', 60], ['Skuntank', 61], ['Toxtricity-amped', 61, [], 'Toxtricity'], ['Obstagoon', 62]]),
  'raihan-galar': makeTeam([['Torkoal', 60], ['Goodra', 60], ['Turtonator', 61], ['Flygon', 61], ['Duraludon', 62]]),
};

const leonInitialTeams = {
  grookey: makeTeam([
    ['Aegislash-shield', 62, ['King\'s Shield', 'Shadow Ball', 'Sacred Sword', 'Flash Cannon'], 'Aegislash'],
    ['Dragapult', 62, ['Shadow Ball', 'Flamethrower', 'Thunderbolt', 'Dragon Breath']],
    ['Haxorus', 63, ['Poison Jab', 'Iron Tail', 'Outrage', 'Earthquake']],
    ['Seismitoad', 64, ['Toxic', 'Drain Punch', 'Liquidation', 'Earthquake']],
    ['Cinderace', 64, ['Pyro Ball', 'Feint', 'Acrobatics', 'Quick Attack']],
    ['Charizard', 65, ['Fire Blast', 'Air Slash', 'Solar Beam', 'Ancient Power']],
  ]),
  scorbunny: makeTeam([
    ['Aegislash-shield', 62, ['King\'s Shield', 'Shadow Ball', 'Sacred Sword', 'Flash Cannon'], 'Aegislash'],
    ['Dragapult', 62, ['Shadow Ball', 'Flamethrower', 'Thunderbolt', 'Dragon Breath']],
    ['Haxorus', 63, ['Poison Jab', 'Iron Tail', 'Outrage', 'Earthquake']],
    ['Mr. Rime', 64, ['Teeter Dance', 'Psychic', 'Freeze-Dry', 'Thunderbolt']],
    ['Inteleon', 64, ['Snipe Shot', 'Dark Pulse', 'Mud Shot', 'Tearful Look']],
    ['Charizard', 65, ['Fire Blast', 'Air Slash', 'Solar Beam', 'Ancient Power']],
  ]),
  sobble: makeTeam([
    ['Aegislash-shield', 62, ['King\'s Shield', 'Shadow Ball', 'Sacred Sword', 'Flash Cannon'], 'Aegislash'],
    ['Dragapult', 62, ['Shadow Ball', 'Flamethrower', 'Thunderbolt', 'Dragon Breath']],
    ['Haxorus', 63, ['Poison Jab', 'Iron Tail', 'Outrage', 'Earthquake']],
    ['Rhyperior', 64, ['Earthquake', 'Stone Edge', 'Megahorn', 'Heat Crash']],
    ['Rillaboom', 64, ['Drum Beating', 'Knock Off', 'High Horsepower', 'Endeavor']],
    ['Charizard', 65, ['Fire Blast', 'Air Slash', 'Solar Beam', 'Ancient Power']],
  ]),
};

const makeLeonRematchTeam = (starter, late = false) => {
  const branch = {
    grookey: ['Seismitoad', 'Cinderace'],
    scorbunny: ['Mr. Rime', 'Inteleon'],
    sobble: ['Rhyperior', 'Rillaboom'],
  }[starter];
  const levels = late ? [80, 78, 79, 80, 80] : [70, 68, 69, 70, 70];
  return makeTeam([
    ['Aegislash-shield', levels[0], [], 'Aegislash'],
    ['Dragapult', levels[1]],
    [branch[0], levels[2]],
    [branch[1], levels[3]],
    ['Charizard', levels[4]],
  ]);
};

const getGalarGameData = (id) => {
  if (id === 'leon-galar') {
    return {
      'sword-shield': {
        initialStageLabel: 'Champion battle',
        team: leonInitialTeams.grookey,
        teamVariantCondition: 'player-starter',
        teamVariants: [
          { label: 'Player chose Grookey', team: leonInitialTeams.grookey },
          { label: 'Player chose Scorbunny', team: leonInitialTeams.scorbunny },
          { label: 'Player chose Sobble', team: leonInitialTeams.sobble },
        ],
        sources: galarTrainerSources,
        battleStages: {
          rematch: {
            label: 'Champion Cup rematch',
            team: makeLeonRematchTeam('grookey'),
            teamVariantCondition: 'player-starter',
            teamVariants: [
              { label: 'Player chose Grookey', team: makeLeonRematchTeam('grookey') },
              { label: 'Player chose Scorbunny', team: makeLeonRematchTeam('scorbunny') },
              { label: 'Player chose Sobble', team: makeLeonRematchTeam('sobble') },
            ],
            sources: galarTrainerSources,
          },
          late: {
            label: 'Post-Star Tournament',
            team: makeLeonRematchTeam('grookey', true),
            teamVariantCondition: 'player-starter',
            teamVariants: [
              { label: 'Player chose Grookey', team: makeLeonRematchTeam('grookey', true) },
              { label: 'Player chose Scorbunny', team: makeLeonRematchTeam('scorbunny', true) },
              { label: 'Player chose Sobble', team: makeLeonRematchTeam('sobble', true) },
            ],
            sources: galarTrainerSources,
          },
        },
      },
    };
  }

  const rematch = galarGymRematchTeams[id];
  const versionContext = {
    'bea-galar': 'Sword version Gym Leader.',
    'gordie-galar': 'Sword version Gym Leader.',
    'allister-galar': 'Shield version Gym Leader.',
    'melony-galar': 'Shield version Gym Leader.',
  }[id];

  if (!rematch) {
    return versionContext ? { 'sword-shield': { teamContext: versionContext } } : {};
  }

  const battleStages = id === 'milo-galar'
    ? {
        'rematch-sword': { label: 'Champion Cup rematch - Sword', team: rematch.sword, sources: galarTrainerSources },
        'rematch-shield': { label: 'Champion Cup rematch - Shield', team: rematch.shield, sources: galarTrainerSources },
      }
    : {
        rematch: { label: 'Champion Cup rematch', team: rematch, sources: galarTrainerSources },
      };

  return {
    'sword-shield': {
      teamContext: versionContext,
      battleStages,
    },
  };
};

const legendsZaSources = [
  {
    label: 'Serebii Legends: Z-A main-mission battles',
    url: 'https://www.serebii.net/legendsz-a/mainmissions.shtml',
  },
  {
    label: 'Serebii Z-A Royale battle tables',
    url: 'https://www.serebii.net/legendsz-a/z-aroyale.shtml',
  },
];

const legendsZaTrainers = [
  makeTrainer({
    id: 'urbain-legends-za',
    name: 'Urbain',
    regionId: 'legends-za',
    division: 'rival',
    role: 'Team MZ Leader and Rival',
    specialty: ['mixed'],
    signature: 'Manectric',
    summary: 'Urbain (or counterpart Taunie) uses the two first partners not chosen by the player alongside Mega Manectric.',
    gameIds: ['legends-za'],
    initialStageLabel: 'Mega Evolution battle',
    team: makeTeam([
      ['Bayleef', 25, ['Giga Drain', 'Leech Seed', 'Body Slam', 'Disarming Voice']],
      ['Croconaw', 25, ['Aqua Jet', 'Tackle', 'Slash', 'Bite']],
      ['Manectric', 26, ['Thunder Fang', 'Spark', 'Bite', 'Fire Fang'], 'Mega Manectric', 'manectric-mega'],
    ]),
    teamVariantCondition: 'player-starter',
    teamVariants: [
      {
        label: 'Player chose Tepig',
        team: makeTeam([
          ['Bayleef', 25, ['Giga Drain', 'Leech Seed', 'Body Slam', 'Disarming Voice']],
          ['Croconaw', 25, ['Aqua Jet', 'Tackle', 'Slash', 'Bite']],
          ['Manectric', 26, ['Thunder Fang', 'Spark', 'Bite', 'Fire Fang'], 'Mega Manectric', 'manectric-mega'],
        ]),
      },
      {
        label: 'Player chose Chikorita',
        team: makeTeam([
          ['Croconaw', 25, ['Aqua Jet', 'Tackle', 'Slash', 'Bite']],
          ['Pignite', 25, ['Power-Up Punch', 'Rollout', 'Flame Wheel', 'Tackle']],
          ['Manectric', 26, ['Thunder Fang', 'Spark', 'Bite', 'Fire Fang'], 'Mega Manectric', 'manectric-mega'],
        ]),
      },
      {
        label: 'Player chose Totodile',
        team: makeTeam([
          ['Pignite', 25, ['Power-Up Punch', 'Rollout', 'Flame Wheel', 'Tackle']],
          ['Bayleef', 25, ['Giga Drain', 'Leech Seed', 'Body Slam', 'Disarming Voice']],
          ['Manectric', 26, ['Thunder Fang', 'Spark', 'Bite', 'Fire Fang'], 'Mega Manectric', 'manectric-mega'],
        ]),
      },
    ],
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'lida-legends-za',
    name: 'Lida',
    regionId: 'legends-za',
    division: 'special',
    role: 'Team MZ Member',
    specialty: ['water'],
    signature: 'Staryu',
    summary: 'Lida is a dancer and Team MZ member whose partner Staryu later evolves and gains the power to Mega Evolve.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Clauncher', 22, ['Mud Shot', 'Aqua Jet', 'Bubble Beam', 'Water Gun']],
      ['Vanillite', 22, ['Tackle', 'Taunt', 'Icy Wind', 'Harden']],
      ['Staryu', 23, ['Confuse Ray', 'Water Gun', 'Harden', 'Bubble Beam']],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'naveen-legends-za',
    name: 'Naveen',
    regionId: 'legends-za',
    division: 'special',
    role: 'Team MZ Member and Fashion Designer',
    specialty: ['dark', 'bug'],
    signature: 'Scraggy',
    summary: 'Naveen is Team MZ\'s aspiring fashion designer and battles with a team led by his partner Scraggy.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Spinarak', 16, ['Absorb', 'Infestation', 'Shadow Sneak', 'X-Scissor']],
      ['Sableye', 16, ['Tackle', 'Leer', 'Shadow Sneak', 'Take Down']],
      ['Scraggy', 17, ['Tackle', 'Headbutt', 'Power-Up Punch', 'Rock Tomb']],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'vinnie-legends-za',
    name: 'Vinnie',
    regionId: 'legends-za',
    division: 'royale',
    role: 'Quasartico Secretary and Z-A Royale Opponent',
    specialty: ['mixed'],
    signature: 'Drampa',
    summary: 'Vinnie is Jett\'s efficient secretary and the special promotion opponent whose ace is Mega Drampa.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Houndoom', 30, ['Fire Fang', 'Fire Spin', 'Bite', 'Roar']],
      ['Sharpedo', 30, ['Whirlpool', 'Aqua Jet', 'Night Slash', 'Slash']],
      ['Buneary', 30, ['Charm', 'Quick Attack', 'Draining Kiss', 'Brutal Swing']],
      ['Drampa', 32, ['Safeguard', 'Icy Wind', 'Twister', 'Glare'], 'Mega Drampa', 'drampa-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'canari-legends-za',
    name: 'Canari',
    regionId: 'legends-za',
    division: 'royale',
    role: 'DYN4MO Streamer and Rank F Opponent',
    specialty: ['electric'],
    signature: 'Eelektross',
    summary: 'Canari is Lumiose City\'s popular gamer and streamer, using an Electric team crowned by Mega Eelektross.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Heliolisk', 37, ['Swift', 'Parabolic Charge', 'Volt Switch', 'Bulldoze']],
      ['Ampharos', 38, ['Cotton Guard', 'Discharge', 'Power Gem', 'Dragon Pulse']],
      ['Stunfisk', 38, ['Discharge', 'Spark', 'Charge', 'Mud Shot']],
      ['Eelektross', 39, ['Discharge', 'Crunch', 'Volt Switch', 'Eerie Impulse'], 'Mega Eelektross', 'eelektross-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'ivor-legends-za',
    name: 'Ivor',
    regionId: 'legends-za',
    division: 'royale',
    role: 'Fist of Justice Leader and Rank E Opponent',
    specialty: ['fighting'],
    signature: 'Falinks',
    summary: 'Ivor leads the Fist of Justice and tests the player with a physical Fighting team and Mega Falinks.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Heracross', 45, ['Rock Blast', 'Pin Missile', 'Aerial Ace', 'Brick Break']],
      ['Medicham', 46, ['Zen Headbutt', 'Rock Smash', 'Protect', 'Ice Punch']],
      ['Machamp', 46, ['Bulldoze', 'Brick Break', 'Brutal Swing', 'Bulk Up']],
      ['Falinks', 47, ['Iron Head', 'Brick Break', 'Rock Slide', 'No Retreat'], 'Mega Falinks', 'falinks-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'gwynn-legends-za',
    name: 'Gwynn',
    regionId: 'legends-za',
    division: 'special',
    role: 'Fist of Justice Assistant',
    specialty: ['ghost'],
    signature: 'Chandelure',
    summary: 'Gwynn is Ivor\'s assistant and a Ghost-type specialist whose partner is Mega Chandelure.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Banette', 43, ['Shadow Sneak', 'Shadow Claw', 'Knock Off', 'Heal Block']],
      ['Gourgeist-small', 44, ['Trick-or-Treat', 'Shadow Claw', 'Bullet Seed', 'Brutal Swing'], 'Gourgeist'],
      ['Chandelure', 45, ['Flamethrower', 'Fire Spin', 'Shadow Ball', 'Protect'], 'Mega Chandelure', 'chandelure-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'corbeau-legends-za',
    name: 'Corbeau',
    regionId: 'legends-za',
    division: 'royale',
    role: 'Rust Syndicate Boss and Rank D Opponent',
    specialty: ['poison'],
    signature: 'Scolipede',
    summary: 'Corbeau leads the Rust Syndicate and uses a Poison-centered promotion team with Mega Scolipede.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Arbok', 50, ['Poison Jab', 'Fire Fang', 'Toxic', 'Leech Life']],
      ['Gyarados', 51, ['Crunch', 'Waterfall', 'Dragon Rush', 'Bounce']],
      ['Roserade', 51, ['Giga Drain', 'Synthesis', 'Sludge Bomb', 'Shadow Ball']],
      ['Scolipede', 52, ['Gunk Shot', 'Protect', 'X-Scissor', 'Earthquake'], 'Mega Scolipede', 'scolipede-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'philippe-legends-za',
    name: 'Philippe',
    regionId: 'legends-za',
    division: 'special',
    role: 'Rust Syndicate Administrator',
    specialty: ['steel'],
    signature: 'Skarmory',
    summary: 'Philippe is Corbeau\'s trusted administrator and fights with a durable Steel team led by Mega Skarmory.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Steelix', 46, ['Heavy Slam', 'Stealth Rock', 'Crunch', 'Rock Slide']],
      ['Scizor', 46, ['Air Slash', 'Swords Dance', 'X-Scissor', 'Bullet Punch']],
      ['Skarmory', 47, ['Drill Run', 'Night Slash', 'Steel Wing', 'Air Slash'], 'Mega Skarmory', 'skarmory-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'lebanne-legends-za',
    name: 'Lebanne',
    regionId: 'legends-za',
    division: 'special',
    role: 'Society of Battle Connoisseurs Right Hand',
    specialty: ['dragon'],
    signature: 'Dragalge',
    summary: 'Lebanne is Jacinthe\'s fierce right hand and uses an aggressive Dragon team led by Mega Dragalge.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Noivern', 53, ['Hurricane', 'Super Fang', 'Dragon Pulse', 'Air Slash']],
      ['Tyrantrum', 53, ['Earthquake', 'Breaking Swipe', 'Rock Slide', 'Crunch']],
      ['Garchomp', 53, ['Earthquake', 'Swords Dance', 'Dragon Claw', 'Iron Head']],
      ['Dragalge', 54, ['Sludge Bomb', 'Dragon Pulse', 'Hydro Pump', 'Protect'], 'Mega Dragalge', 'dragalge-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'jacinthe-legends-za',
    name: 'Jacinthe',
    regionId: 'legends-za',
    division: 'royale',
    role: 'SBC Leader and Rank C Opponent',
    specialty: ['fairy'],
    signature: 'Clefable',
    summary: 'Jacinthe leads the Society of Battle Connoisseurs and fields an elegant Fairy team with Mega Clefable.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Carbink', 57, ['Stealth Rock', 'Stone Edge', 'Moonblast', 'Flash Cannon']],
      ['Mawile', 58, ['Play Rough', 'Iron Head', 'Crunch', 'Fire Fang']],
      ['Aurorus', 58, ['Blizzard', 'Freeze-Dry', 'Rock Blast', 'Protect']],
      ['Gardevoir', 58, ['Moonblast', 'Mystical Fire', 'Psychic', 'Calm Mind']],
      ['Clefable', 59, ['Air Slash', 'Moonblast', 'Mystical Fire', 'Protect'], 'Mega Clefable', 'clefable-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'tarragon-legends-za',
    name: 'Tarragon',
    regionId: 'legends-za',
    division: 'special',
    role: 'Racine Construction President',
    specialty: ['ground'],
    signature: 'Excadrill',
    summary: 'Tarragon runs Racine Construction, promotes his granddaughter Canari, and battles with Mega Excadrill.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Hippowdon', 36, ['Heavy Slam', 'Amnesia', 'Crunch', 'Stealth Rock']],
      ['Diggersby', 36, ['Swords Dance', 'Take Down', 'Bounce', 'Bulldoze']],
      ['Excadrill', 37, ['Swords Dance', 'Dig', 'Rock Slide', 'X-Scissor'], 'Mega Excadrill', 'excadrill-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'emma-legends-za',
    name: 'Emma',
    regionId: 'legends-za',
    division: 'special',
    role: 'Lumiose Detective',
    specialty: ['mixed'],
    signature: 'Malamar',
    summary: 'Emma returns as Lumiose City\'s lead detective with a varied team of Mega-capable partners headed by Mega Malamar.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Ampharos', 57, ['Thunder', 'Power Gem', 'Dragon Pulse', 'Light Screen']],
      ['Mawile', 57, ['Play Rough', 'Dynamic Punch', 'Crunch', 'Iron Head']],
      ['Lopunny', 57, ['Fire Punch', 'Ice Punch', 'Thunder Punch', 'Power-Up Punch']],
      ['Lucario', 57, ['Aura Sphere', 'Flash Cannon', 'Psychic', 'Calm Mind']],
      ['Malamar', 58, ['Poison Jab', 'Night Slash', 'Psycho Cut', 'Slash'], 'Mega Malamar', 'malamar-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'griselle-legends-za',
    name: 'Griselle',
    regionId: 'legends-za',
    division: 'royale',
    role: 'Team Flare Nouveau Administrator',
    specialty: ['fire'],
    signature: 'Pyroar',
    summary: 'Griselle is a former Team Flare member whose diverse firepower culminates in Mega Pyroar.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Talonflame', 59, ['Flare Blitz', 'Steel Wing', 'Quick Attack', 'U-turn']],
      ['Camerupt', 59, ['Earthquake', 'Lava Plume', 'Rock Slide', 'Protect']],
      ['Aerodactyl', 60, ['Stone Edge', 'Iron Head', 'Crunch', 'Thunder Fang']],
      ['Metagross', 60, ['Bullet Punch', 'Psycho Cut', 'Brutal Swing', 'Ice Punch']],
      ['Pyroar', 61, ['Flamethrower', 'Earth Power', 'Hyper Voice', 'Snarl'], 'Mega Pyroar', 'pyroar-mega'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'grisham-legends-za',
    name: 'Grisham',
    regionId: 'legends-za',
    division: 'royale',
    role: 'Team Flare Nouveau Leader and Rank B Opponent',
    specialty: ['dark', 'fire'],
    signature: 'Charizard',
    summary: 'Grisham leads Team Flare Nouveau and stands between the player and Rank A with Mega Charizard X.',
    gameIds: ['legends-za'],
    team: makeTeam([
      ['Pangoro', 61, ['Brick Break', 'Crunch', 'Bullet Punch', 'Protect']],
      ['Malamar', 61, ['Hypnosis', 'Psyshock', 'Night Slash', 'Liquidation']],
      ['Pyroar', 61, ['Overheat', 'Earth Power', 'Snarl', 'Hyper Voice'], undefined, 'pyroar-male'],
      ['Tyranitar', 62, ['Stone Edge', 'Ice Punch', 'Crunch', 'Earthquake']],
      ['Salamence', 62, ['Aerial Ace', 'Earthquake', 'Fire Fang', 'Draco Meteor']],
      ['Charizard', 63, ['Flare Blitz', 'Air Slash', 'Dragon Rush', 'Protect'], 'Mega Charizard X', 'charizard-mega-x'],
    ]),
    sources: legendsZaSources,
  }),
  makeTrainer({
    id: 'korrina-legends-za',
    name: 'Korrina',
    regionId: 'legends-za',
    division: 'special',
    role: 'Mega Evolution Successor and Team MZ Member',
    specialty: ['fighting', 'steel'],
    signature: 'Lucario',
    summary: 'Korrina returns in Mega Dimension as Team MZ\'s Mega Evolution expert and challenges the player with Mega Lucario Z.',
    gameIds: ['legends-za'],
    team: [makeMember('Lucario', 100, ['Extreme Speed', 'Hyper Beam', 'Focus Blast', 'Detect'], 'Mega Lucario Z', 'lucario-mega-z')],
    sources: legendsZaSources,
    battleStages: {
      rematch: {
        label: 'Ultra Hardcore Lucario rematch',
        team: [makeMember('Lucario', 100, ['Focus Blast', 'Hyper Beam', 'Detect', 'Flash Cannon'], 'Mega Lucario Z', 'lucario-mega-z')],
        sources: legendsZaSources,
      },
    },
  }),
];

const blueFrlgSources = [
  {
    label: 'Bulbapedia encounter tables',
    url: 'https://bulbapedia.bulbagarden.net/wiki/Blue_(game)',
  },
  {
    label: 'Pokémon Database League tables',
    url: 'https://pokemondb.net/firered-leafgreen/gymleaders-elitefour',
  },
];

const blueFrlgInitialCore = [
  makeMember('Pidgeot', 59, ['Aerial Ace', 'Feather Dance', 'Sand Attack', 'Whirlwind']),
  makeMember('Alakazam', 57, ['Psychic', 'Future Sight', 'Recover', 'Reflect']),
  makeMember('Rhydon', 59, ['Take Down', 'Earthquake', 'Rock Tomb', 'Scary Face']),
];

const blueFrlgRematchCore = [
  makeMember('Heracross', 72, ['Megahorn', 'Earthquake', 'Counter', 'Rock Tomb']),
  makeMember('Alakazam', 73, ['Psychic', 'Shadow Ball', 'Calm Mind', 'Reflect']),
  makeMember('Tyranitar', 72, ['Crunch', 'Earthquake', 'Thunderbolt', 'Aerial Ace']),
];

const blueFrlgTeams = {
  initialBulbasaur: [
    ...blueFrlgInitialCore,
    makeMember('Exeggutor', 59, ['Giga Drain', 'Egg Bomb', 'Sleep Powder', 'Light Screen']),
    makeMember('Gyarados', 61, ['Hydro Pump', 'Dragon Rage', 'Bite', 'Thrash']),
    makeMember('Charizard', 63, ['Fire Blast', 'Aerial Ace', 'Slash', 'Fire Spin']),
  ],
  initialCharmander: [
    ...blueFrlgInitialCore,
    makeMember('Arcanine', 59, ['Extreme Speed', 'Flamethrower', 'Roar', 'Bite']),
    makeMember('Exeggutor', 61, ['Giga Drain', 'Egg Bomb', 'Sleep Powder', 'Light Screen']),
    makeMember('Blastoise', 63, ['Hydro Pump', 'Rain Dance', 'Skull Bash', 'Bite']),
  ],
  initialSquirtle: [
    ...blueFrlgInitialCore,
    makeMember('Gyarados', 59, ['Hydro Pump', 'Dragon Rage', 'Bite', 'Thrash']),
    makeMember('Arcanine', 61, ['Extreme Speed', 'Flamethrower', 'Roar', 'Bite']),
    makeMember('Venusaur', 63, ['Solar Beam', 'Synthesis', 'Sunny Day', 'Growth']),
  ],
  rematchBulbasaur: [
    ...blueFrlgRematchCore,
    makeMember('Exeggutor', 73, ['Giga Drain', 'Psychic', 'Sleep Powder', 'Light Screen']),
    makeMember('Gyarados', 73, ['Hydro Pump', 'Dragon Dance', 'Earthquake', 'Hyper Beam']),
    makeMember('Charizard', 75, ['Fire Blast', 'Dragon Claw', 'Aerial Ace', 'Earthquake']),
  ],
  rematchCharmander: [
    ...blueFrlgRematchCore,
    makeMember('Arcanine', 73, ['Extreme Speed', 'Overheat', 'Aerial Ace', 'Iron Tail']),
    makeMember('Exeggutor', 73, ['Giga Drain', 'Psychic', 'Sleep Powder', 'Light Screen']),
    makeMember('Blastoise', 75, ['Hydro Pump', 'Ice Beam', 'Earthquake', 'Rain Dance']),
  ],
  rematchSquirtle: [
    ...blueFrlgRematchCore,
    makeMember('Gyarados', 73, ['Hydro Pump', 'Dragon Dance', 'Earthquake', 'Hyper Beam']),
    makeMember('Arcanine', 73, ['Extreme Speed', 'Overheat', 'Aerial Ace', 'Iron Tail']),
    makeMember('Venusaur', 75, ['Solar Beam', 'Sludge Bomb', 'Earthquake', 'Sunny Day']),
  ],
};

const paldeaGymRematchSources = [
  {
    label: 'Serebii Gym rematch tables',
    url: 'https://www.serebii.net/scarletviolet/gymrematches.shtml',
  },
  {
    label: 'Nintendo Life Gym rematch guide',
    url: 'https://www.nintendolife.com/guides/pokemon-scarlet-and-violet-all-gym-leader-rematches',
  },
];

const geetaSources = [
  {
    label: 'Serebii Academy Ace Tournament tables',
    url: 'https://www.serebii.net/scarletviolet/academyacetournament.shtml',
  },
  {
    label: 'Bulbapedia Geeta battle tables',
    url: 'https://bulbapedia.bulbagarden.net/wiki/Geeta',
  },
];

const kieranSources = [
  {
    label: 'Serebii Blueberry League battle tables',
    url: 'https://www.serebii.net/scarletviolet/blueberryelitefour.shtml',
  },
  {
    label: 'Serebii League Club rematch tables',
    url: 'https://www.serebii.net/scarletviolet/leagueclubbattles.shtml',
  },
];

const paldeaGymRematchTeams = {
  'katy-paldea': makeTeam([
    ['Lokix', 65, ['Axe Kick', 'Sucker Punch', 'Lunge', 'Bounce']],
    ['Forretress', 65, ['Bug Bite', 'Gyro Ball', 'Curse', 'Stone Edge']],
    ['Spidops', 65, ['Skitter Smack', 'Throat Chop', 'Brick Break', 'Silk Trap']],
    ['Heracross', 65, ['Megahorn', 'Close Combat', 'Stone Edge', 'Night Slash']],
    ['Ursaring', 66, ['Fury Cutter', 'High Horsepower', 'Play Rough', 'Crunch']],
  ]),
  'brassius-paldea': makeTeam([
    ['Lilligant', 65, ['Petal Blizzard', 'Light Screen', 'Quiver Dance', 'Hyper Beam']],
    ['Breloom', 65, ['Mach Punch', 'Seed Bomb', 'Spore', 'Thunder Punch']],
    ['Tsareena', 65, ['Trop Kick', 'High Jump Kick', 'Play Rough', 'Zen Headbutt']],
    ['Arboliva', 65, ['Terrain Pulse', 'Energy Ball', 'Leech Seed', 'Grassy Terrain']],
    ['Sudowoodo', 66, ['Trailblaze', 'Stone Edge', 'Fire Punch', 'Ice Punch']],
  ]),
  'iono-paldea': makeTeam([
    ['Kilowattrel', 65, ['Hurricane', 'Quick Attack', 'Discharge', 'Tailwind']],
    ['Bellibolt', 65, ['Water Pulse', 'Thunder', 'Reflect', 'Sucker Punch']],
    ['Electrode', 65, ['Foul Play', 'Magnet Rise', 'Discharge', 'Electric Terrain']],
    ['Luxray', 65, ['Crunch', 'Wild Charge', 'Psychic Fangs', 'Ice Fang']],
    ['Mismagius', 66, ['Charge Beam', 'Shadow Ball', 'Mystical Fire', 'Dazzling Gleam']],
  ]),
  'kofu-paldea': makeTeam([
    ['Veluza', 65, ['Aqua Jet', 'Aqua Cutter', 'Psycho Cut', 'Night Slash']],
    ['Pelipper', 65, ['Hurricane', 'Blizzard', 'Surf', 'Quick Attack']],
    ['Wugtrio', 65, ['Triple Dive', 'Throat Chop', 'Sucker Punch', 'Stomping Tantrum']],
    ['Clawitzer', 65, ['Water Pulse', 'Dark Pulse', 'Dragon Pulse', 'Aura Sphere']],
    ['Crabominable', 66, ['Crabhammer', 'Ice Hammer', 'Zen Headbutt', 'Close Combat']],
  ]),
  'larry-paldea': makeTeam([
    ['Oinkologne', 65, ['Body Slam', 'Bullet Seed', 'Zen Headbutt', 'Iron Head']],
    ['Komala', 65, ['Yawn', 'Sucker Punch', 'Wood Hammer', 'Zen Headbutt']],
    ['Braviary', 65, ['Brave Bird', 'Crush Claw', 'Close Combat', 'Rock Tomb']],
    ['Dudunsparce-two-segment', 65, ['Hyper Drill', 'Drill Run', 'Dragon Rush', 'Stone Edge'], 'Dudunsparce'],
    ['Staraptor', 66, ['Facade', 'Brave Bird', 'Close Combat', 'Thief']],
  ]),
  'ryme-paldea': makeTeam([
    ['Banette', 65, ['Icy Wind', 'Sucker Punch', 'Shadow Sneak', 'Phantom Force']],
    ['Mimikyu', 65, ['Light Screen', 'Shadow Sneak', 'Slash', 'Play Rough']],
    ['Spiritomb', 65, ['Protect', 'Sucker Punch', 'Curse', 'Will-O-Wisp']],
    ['Houndstone', 65, ['Play Rough', 'Crunch', 'Phantom Force', 'Ice Fang']],
    ['Toxtricity-low-key', 66, ['Overdrive', 'Hex', 'Boomburst', 'Sludge Bomb'], 'Toxtricity (Low Key Form)'],
  ]),
  'tulip-paldea': makeTeam([
    ['Farigiraf', 65, ['Crunch', 'Zen Headbutt', 'Reflect', 'Iron Head']],
    ['Gardevoir', 65, ['Psychic', 'Dazzling Gleam', 'Energy Ball', 'Mystical Fire']],
    ['Espathra', 65, ['Psychic', 'Quick Attack', 'Shadow Ball', 'Dazzling Gleam']],
    ['Gallade', 65, ['Psycho Cut', 'Leaf Blade', 'X-Scissor', 'Close Combat']],
    ['Florges', 66, ['Psychic', 'Moonblast', 'Petal Blizzard', 'Charm']],
  ]),
  'grusha-paldea': makeTeam([
    ['Frosmoth', 65, ['Blizzard', 'Bug Buzz', 'Tailwind']],
    ['Beartic', 65, ['Aqua Jet', 'Icicle Crash', 'Earthquake']],
    ['Cetitan', 65, ['Ice Spinner', 'Liquidation', 'Ice Shard', 'Bounce']],
    ['Weavile', 65, ['Night Slash', 'Ice Punch', 'Shadow Claw', 'X-Scissor']],
    ['Altaria', 66, ['Ice Beam', 'Dragon Pulse', 'Moonblast', 'Hurricane']],
  ]),
};

const frlgTrainerSources = [
  {
    label: 'pret FireRed/LeafGreen party data',
    url: 'https://github.com/pret/pokefirered/blob/master/src/data/trainer_parties.h',
  },
  {
    label: 'Pokemon Database Gym and League tables',
    url: 'https://pokemondb.net/firered-leafgreen/gymleaders-elitefour',
  },
];

const frlgTeams = {
  brock: makeTeam([
    ['Geodude', 12, ['Tackle', 'Defense Curl']],
    ['Onix', 14, ['Tackle', 'Bind', 'Rock Tomb']],
  ]),
  misty: makeTeam([
    ['Staryu', 18, ['Tackle', 'Harden', 'Recover', 'Water Pulse']],
    ['Starmie', 21, ['Swift', 'Recover', 'Rapid Spin', 'Water Pulse']],
  ]),
  'lt-surge': makeTeam([
    ['Voltorb', 21, ['Sonic Boom', 'Tackle', 'Screech', 'Shock Wave']],
    ['Pikachu', 18, ['Quick Attack', 'Thunder Wave', 'Double Team', 'Shock Wave']],
    ['Raichu', 24, ['Quick Attack', 'Thunder Wave', 'Double Team', 'Shock Wave']],
  ]),
  erika: makeTeam([
    ['Victreebel', 29, ['Stun Spore', 'Acid', 'Poison Powder', 'Giga Drain']],
    ['Tangela', 24, ['Poison Powder', 'Constrict', 'Ingrain', 'Giga Drain']],
    ['Vileplume', 29, ['Sleep Powder', 'Acid', 'Stun Spore', 'Giga Drain']],
  ]),
  koga: makeTeam([
    ['Koffing', 37, ['Self-Destruct', 'Sludge', 'Smokescreen', 'Toxic']],
    ['Muk', 39, ['Minimize', 'Sludge', 'Acid Armor', 'Toxic']],
    ['Koffing', 37, ['Self-Destruct', 'Sludge', 'Smokescreen', 'Toxic']],
    ['Weezing', 43, ['Tackle', 'Sludge', 'Smokescreen', 'Toxic']],
  ]),
  sabrina: makeTeam([
    ['Kadabra', 38, ['Psybeam', 'Reflect', 'Future Sight', 'Calm Mind']],
    ['Mr. Mime', 37, ['Barrier', 'Psybeam', 'Baton Pass', 'Calm Mind']],
    ['Venomoth', 38, ['Psybeam', 'Gust', 'Leech Life', 'Supersonic']],
    ['Alakazam', 43, ['Psychic', 'Recover', 'Future Sight', 'Calm Mind']],
  ]),
  blaine: makeTeam([
    ['Growlithe', 42, ['Bite', 'Roar', 'Take Down', 'Fire Blast']],
    ['Ponyta', 40, ['Stomp', 'Bounce', 'Fire Spin', 'Fire Blast']],
    ['Rapidash', 42, ['Stomp', 'Bounce', 'Fire Spin', 'Fire Blast']],
    ['Arcanine', 47, ['Bite', 'Roar', 'Take Down', 'Fire Blast']],
  ]),
  giovanni: makeTeam([
    ['Rhyhorn', 45, ['Take Down', 'Rock Blast', 'Scary Face', 'Earthquake']],
    ['Dugtrio', 42, ['Slash', 'Sand Tomb', 'Mud-Slap', 'Earthquake']],
    ['Nidoqueen', 44, ['Body Slam', 'Double Kick', 'Poison Sting', 'Earthquake']],
    ['Nidoking', 45, ['Thrash', 'Double Kick', 'Poison Sting', 'Earthquake']],
    ['Rhyhorn', 50, ['Take Down', 'Rock Blast', 'Scary Face', 'Earthquake']],
  ]),
  lorelei: {
    initial: makeTeam([
      ['Dewgong', 52, ['Ice Beam', 'Surf', 'Hail', 'Safeguard']],
      ['Cloyster', 51, ['Spikes', 'Protect', 'Hail', 'Dive']],
      ['Slowbro', 52, ['Ice Beam', 'Surf', 'Amnesia', 'Yawn']],
      ['Jynx', 54, ['Ice Punch', 'Double Slap', 'Lovely Kiss', 'Attract']],
      ['Lapras', 54, ['Confuse Ray', 'Ice Beam', 'Surf', 'Body Slam']],
    ]),
    rematch: makeTeam([
      ['Dewgong', 64, ['Ice Beam', 'Surf', 'Signal Beam', 'Double Team']],
      ['Cloyster', 63, ['Ice Beam', 'Surf', 'Supersonic', 'Rain Dance']],
      ['Piloswine', 63, ['Blizzard', 'Earthquake', 'Double-Edge', 'Rock Slide']],
      ['Jynx', 66, ['Ice Beam', 'Psychic', 'Lovely Kiss', 'Attract']],
      ['Lapras', 66, ['Ice Beam', 'Surf', 'Psychic', 'Thunder']],
    ]),
  },
  bruno: {
    initial: makeTeam([
      ['Onix', 51, ['Earthquake', 'Rock Tomb', 'Iron Tail', 'Roar']],
      ['Hitmonchan', 53, ['Sky Uppercut', 'Mach Punch', 'Rock Tomb', 'Counter']],
      ['Hitmonlee', 53, ['Mega Kick', 'Foresight', 'Brick Break', 'Facade']],
      ['Onix', 54, ['Double-Edge', 'Earthquake', 'Iron Tail', 'Sand Tomb']],
      ['Machamp', 56, ['Cross Chop', 'Bulk Up', 'Scary Face', 'Rock Tomb']],
    ]),
    rematch: makeTeam([
      ['Steelix', 65, ['Earthquake', 'Iron Tail', 'Crunch', 'Rock Tomb']],
      ['Hitmonchan', 65, ['Sky Uppercut', 'Mach Punch', 'Rock Slide', 'Counter']],
      ['Hitmonlee', 65, ['Mega Kick', 'Foresight', 'Earthquake', 'Rock Slide']],
      ['Steelix', 66, ['Earthquake', 'Iron Tail', 'Crunch', 'Dragon Breath']],
      ['Machamp', 68, ['Cross Chop', 'Earthquake', 'Brick Break', 'Rock Slide']],
    ]),
  },
  agatha: {
    initial: makeTeam([
      ['Gengar', 54, ['Shadow Punch', 'Confuse Ray', 'Toxic', 'Double Team']],
      ['Golbat', 54, ['Confuse Ray', 'Poison Fang', 'Air Cutter', 'Bite']],
      ['Haunter', 53, ['Hypnosis', 'Dream Eater', 'Curse', 'Mean Look']],
      ['Arbok', 56, ['Sludge Bomb', 'Screech', 'Iron Tail', 'Bite']],
      ['Gengar', 58, ['Shadow Ball', 'Sludge Bomb', 'Hypnosis', 'Nightmare']],
    ]),
    rematch: makeTeam([
      ['Gengar', 66, ['Shadow Ball', 'Psychic', 'Confuse Ray', 'Hypnosis']],
      ['Crobat', 66, ['Sludge Bomb', 'Air Cutter', 'Shadow Ball', 'Confuse Ray']],
      ['Misdreavus', 65, ['Shadow Ball', 'Psychic', 'Thunderbolt', 'Attract']],
      ['Arbok', 68, ['Sludge Bomb', 'Earthquake', 'Giga Drain', 'Double Team']],
      ['Gengar', 70, ['Shadow Ball', 'Psychic', 'Thunderbolt', 'Sludge Bomb']],
    ]),
  },
  lance: {
    initial: makeTeam([
      ['Gyarados', 56, ['Hyper Beam', 'Dragon Rage', 'Twister', 'Bite']],
      ['Dragonair', 54, ['Hyper Beam', 'Safeguard', 'Dragon Rage', 'Outrage']],
      ['Dragonair', 54, ['Hyper Beam', 'Safeguard', 'Thunder Wave', 'Outrage']],
      ['Aerodactyl', 58, ['Hyper Beam', 'Ancient Power', 'Wing Attack', 'Scary Face']],
      ['Dragonite', 60, ['Hyper Beam', 'Safeguard', 'Outrage', 'Wing Attack']],
    ]),
    rematch: makeTeam([
      ['Gyarados', 68, ['Hyper Beam', 'Dragon Dance', 'Earthquake', 'Thunder Wave']],
      ['Dragonite', 66, ['Hyper Beam', 'Earthquake', 'Dragon Claw', 'Flamethrower']],
      ['Kingdra', 66, ['Hyper Beam', 'Dragon Dance', 'Surf', 'Ice Beam']],
      ['Aerodactyl', 70, ['Hyper Beam', 'Ancient Power', 'Aerial Ace', 'Earthquake']],
      ['Dragonite', 72, ['Hyper Beam', 'Outrage', 'Thunderbolt', 'Ice Beam']],
    ]),
  },
};

const hgssTrainerSources = [
  {
    label: 'pret HeartGold/SoulSilver trainer data',
    url: 'https://github.com/pret/pokeheartgold/blob/master/files/poketool/trainer/trainers.json',
  },
  {
    label: 'Serebii Gym and Fighting Dojo tables',
    url: 'https://www.serebii.net/heartgoldsoulsilver/gym-rematch.shtml',
  },
];

const goldSilverTrainerSources = [
  {
    label: 'pret Gold/Silver trainer party data',
    url: 'https://github.com/pret/pokegold/blob/master/data/trainers/parties.asm',
  },
  {
    label: 'Serebii Gold/Silver Red guide',
    url: 'https://www.serebii.net/gs/red.shtml',
  },
];

const hgssKantoTeams = {
  brock: {
    initial: makeTeam([
      ['Graveler', 51, ['Defense Curl', 'Rock Slide', 'Rollout', 'Earthquake']],
      ['Rhyhorn', 51, ['Sandstorm', 'Scary Face', 'Earthquake', 'Horn Drill']],
      ['Omastar', 53, ['Ancient Power', 'Brine', 'Protect', 'Spike Cannon']],
      ['Onix', 54, ['Iron Tail', 'Rock Slide', 'Screech', 'Sandstorm']],
      ['Kabutops', 52, ['Rock Slide', 'Aqua Jet', 'Endure', 'Giga Drain']],
    ]),
    rematch: makeTeam([
      ['Golem', 55, ['Sandstorm', 'Rock Slide', 'Rock Polish', 'Earthquake']],
      ['Relicanth', 54, ['Head Smash', 'Aqua Tail', 'Earthquake', 'Rest']],
      ['Omastar', 56, ['Ancient Power', 'Brine', 'Protect', 'Sandstorm']],
      ['Onix', 61, ['Stealth Rock', 'Rock Slide', 'Rock Polish', 'Sandstorm']],
      ['Kabutops', 55, ['Rock Slide', 'Aqua Jet', 'Endure', 'Giga Drain']],
      ['Rampardos', 57, ['Earthquake', 'Stone Edge', 'Avalanche', 'Rock Polish']],
    ]),
  },
  misty: {
    initial: makeTeam([
      ['Golduck', 49, ['Water Pulse', 'Disable', 'Psych Up', 'Psychic']],
      ['Quagsire', 49, ['Water Pulse', 'Amnesia', 'Earthquake', 'Rain Dance']],
      ['Lapras', 52, ['Water Pulse', 'Sing', 'Ice Beam', 'Body Slam']],
      ['Starmie', 54, ['Water Pulse', 'Confuse Ray', 'Recover', 'Ice Beam']],
    ]),
    rematch: makeTeam([
      ['Starmie', 60, ['Thunderbolt', 'Psychic', 'Ice Beam', 'Surf']],
      ['Quagsire', 56, ['Water Pulse', 'Amnesia', 'Earthquake', 'Rain Dance']],
      ['Lapras', 56, ['Surf', 'Perish Song', 'Blizzard', 'Rain Dance']],
      ['Lanturn', 54, ['Confuse Ray', 'Thunderbolt', 'Surf', 'Thunder Wave']],
      ['Floatzel', 54, ['Agility', 'Ice Fang', 'Waterfall', 'Baton Pass']],
      ['Milotic', 60, ['Hydro Pump', 'Ice Beam', 'Rest', 'Sleep Talk']],
    ]),
  },
  'lt-surge': {
    initial: makeTeam([
      ['Raichu', 51, ['Thunder Wave', 'Quick Attack', 'Shock Wave', 'Double Team']],
      ['Electrode', 47, ['Thunder Wave', 'Double Team', 'Shock Wave', 'Light Screen']],
      ['Magneton', 47, ['Supersonic', 'Double Team', 'Shock Wave', 'Mirror Shot']],
      ['Electrode', 47, ['Screech', 'Double Team', 'Self-Destruct', 'Charge Beam']],
      ['Electabuzz', 53, ['Quick Attack', 'Shock Wave', 'Light Screen', 'Low Kick']],
    ]),
    rematch: makeTeam([
      ['Raichu', 60, ['Thunder Wave', 'Quick Attack', 'Thunderbolt', 'Grass Knot']],
      ['Manectric', 52, ['Thunder Wave', 'Natural Gift', 'Discharge', 'Overheat']],
      ['Magnezone', 52, ['Thunderbolt', 'Double Team', 'Magnet Rise', 'Mirror Shot']],
      ['Electrode', 52, ['Thunder Wave', 'Double Team', 'Thunderbolt', 'Explosion']],
      ['Pachirisu', 58, ['Quick Attack', 'Super Fang', 'Discharge', 'Sweet Kiss']],
      ['Electivire', 56, ['Thunderbolt', 'Cross Chop', 'Ice Punch', 'Earthquake']],
    ]),
  },
  erika: {
    initial: makeTeam([
      ['Jumpluff', 51, ['U-turn', 'Leech Seed', 'Sunny Day', 'Giga Drain']],
      ['Tangela', 52, ['Ancient Power', 'Wring Out', 'Giga Drain', 'Sleep Powder']],
      ['Victreebel', 56, ['Sunny Day', 'Synthesis', 'Grass Knot', 'Leaf Storm']],
      ['Bellossom', 56, ['Sunny Day', 'Synthesis', 'Giga Drain', 'Solar Beam']],
    ]),
    rematch: makeTeam([
      ['Shiftry', 54, ['Leaf Storm', 'Sucker Punch', 'Explosion', 'Sunny Day']],
      ['Jumpluff', 53, ['U-turn', 'Memento', 'Sleep Powder', 'Giga Drain']],
      ['Victreebel', 56, ['Natural Gift', 'Sludge Bomb', 'Leaf Storm', 'Leaf Blade']],
      ['Bellossom', 56, ['Sunny Day', 'Solar Beam', 'Giga Drain', 'Attract']],
      ['Tangrowth', 60, ['Swords Dance', 'Power Whip', 'Rock Slide', 'Earthquake']],
      ['Roserade', 55, ['Weather Ball', 'Energy Ball', 'Sludge Bomb', 'Stun Spore']],
    ]),
  },
  janine: {
    initial: makeTeam([
      ['Crobat', 47, ['Screech', 'Supersonic', 'Confuse Ray', 'Wing Attack']],
      ['Weezing', 44, ['Double Hit', 'Sludge Bomb', 'Toxic', 'Explosion']],
      ['Ariados', 47, ['Scary Face', 'Poison Jab', 'Pin Missile', 'Psychic']],
      ['Ariados', 47, ['Pin Missile', 'Poison Jab', 'Swagger', 'Night Shade']],
      ['Venomoth', 50, ['Sludge Bomb', 'Double Team', 'Signal Beam', 'Psychic']],
    ]),
    rematch: makeTeam([
      ['Crobat', 52, ['Heat Wave', 'Cross Poison', 'Confuse Ray', 'U-turn']],
      ['Weezing', 56, ['Thunderbolt', 'Sludge Bomb', 'Toxic', 'Explosion']],
      ['Toxicroak', 52, ['Cross Chop', 'Poison Jab', 'Attract', 'Substitute']],
      ['Ariados', 58, ['Toxic', 'Bounce', 'Swagger', 'Night Shade']],
      ['Venomoth', 59, ['Sleep Powder', 'Double Team', 'Bug Buzz', 'Psychic']],
      ['Drapion', 55, ['Cross Poison', 'Confuse Ray', 'Crunch', 'Swords Dance']],
    ]),
  },
  sabrina: {
    initial: makeTeam([
      ['Espeon', 53, ['Shadow Ball', 'Skill Swap', 'Calm Mind', 'Psychic']],
      ['Mr. Mime', 53, ['Mimic', 'Light Screen', 'Skill Swap', 'Psychic']],
      ['Alakazam', 55, ['Skill Swap', 'Psychic', 'Energy Ball', 'Reflect']],
    ]),
    rematch: makeTeam([
      ['Alakazam', 60, ['Gravity', 'Focus Blast', 'Energy Ball', 'Psychic']],
      ['Espeon', 58, ['Calm Mind', 'Baton Pass', 'Shadow Ball', 'Psychic']],
      ['Mr. Mime', 56, ['Reflect', 'Skill Swap', 'Thunder', 'Psychic']],
      ['Jynx', 54, ['Blizzard', 'Perish Song', 'Psychic', 'Focus Blast']],
      ['Wobbuffet', 53, ['Counter', 'Mirror Coat', 'Destiny Bond', 'Encore']],
      ['Gallade', 53, ['Close Combat', 'Psycho Cut', 'Night Slash', 'Stone Edge']],
    ]),
  },
  blaine: {
    initial: makeTeam([
      ['Magcargo', 54, ['Sunny Day', 'Smog', 'Overheat', 'Rock Slide']],
      ['Magmar', 54, ['Thunder Punch', 'Overheat', 'Sunny Day', 'Confuse Ray']],
      ['Rapidash', 59, ['Quick Attack', 'Flare Blitz', 'Bounce', 'Overheat']],
    ]),
    rematch: makeTeam([
      ['Torkoal', 54, ['Sunny Day', 'Yawn', 'Body Slam', 'Overheat']],
      ['Camerupt', 57, ['Earthquake', 'Eruption', 'Solar Beam', 'Sunny Day']],
      ['Rapidash', 60, ['Megahorn', 'Quick Attack', 'Overheat', 'Flare Blitz']],
      ['Magcargo', 58, ['Curse', 'Gyro Ball', 'Overheat', 'Stone Edge']],
      ['Houndoom', 54, ['Shadow Ball', 'Dark Pulse', 'Flamethrower', 'Sucker Punch']],
      ['Magmortar', 62, ['Thunderbolt', 'Low Kick', 'Flamethrower', 'Confuse Ray']],
    ]),
  },
  blue: {
    initial: makeTeam([
      ['Exeggutor', 55, ['Leaf Storm', 'Psychic', 'Hypnosis', 'Trick Room']],
      ['Arcanine', 58, ['Roar', 'Dragon Pulse', 'Flare Blitz', 'Extreme Speed']],
      ['Rhydon', 58, ['Megahorn', 'Stone Edge', 'Thunder Fang', 'Earthquake']],
      ['Gyarados', 52, ['Ice Fang', 'Waterfall', 'Dragon Dance', 'Return']],
      ['Machamp', 56, ['Dynamic Punch', 'Earthquake', 'Stone Edge', 'Thunder Punch']],
      ['Pidgeot', 60, ['Return', 'Whirlwind', 'Air Slash', 'Mirror Move']],
    ]),
    rematch: makeTeam([
      ['Exeggutor', 67, ['Leaf Storm', 'Psychic', 'Explosion', 'Trick Room']],
      ['Machamp', 69, ['Dynamic Punch', 'Stone Edge', 'Fling', 'Attract']],
      ['Rhyperior', 70, ['Megahorn', 'Stone Edge', 'Thunder Fang', 'Earthquake']],
      ['Arcanine', 68, ['Flare Blitz', 'Extreme Speed', 'Thunder Fang', 'Crunch']],
      ['Tyranitar', 70, ['Low Kick', 'Fire Fang', 'Rock Slide', 'Earthquake']],
      ['Pidgeot', 72, ['Return', 'Double Team', 'Air Slash', 'Steel Wing']],
    ]),
  },
};

const hgssJohtoGymTeams = {
  'falkner-johto': {
    initial: makeTeam([
      ['Pidgey', 9, ['Tackle', 'Sand Attack']],
      ['Pidgeotto', 13, ['Tackle', 'Roost', 'Gust']],
    ]),
    rematch: makeTeam([
      ['Staraptor', 50, ['Attract', 'Brave Bird', 'Close Combat', 'U-turn']],
      ['Noctowl', 52, ['Roost', 'Air Slash', 'Shadow Ball', 'Feather Dance']],
      ['Swellow', 52, ['Facade', 'Protect', 'Double Team', 'Endeavor']],
      ['Honchkrow', 54, ['Night Slash', 'Sucker Punch', 'Thunder Wave', 'Dark Pulse']],
      ['Pelipper', 48, ['Surf', 'Tailwind', 'Ice Beam', 'Hidden Power']],
      ['Pidgeot', 56, ['Return', 'Double Team', 'Swagger', 'Roost']],
    ]),
  },
  'bugsy-johto': {
    initial: makeTeam([
      ['Scyther', 17, ['Quick Attack', 'Leer', 'U-turn', 'Focus Energy']],
      ['Kakuna', 15, ['Poison Sting']],
      ['Metapod', 15, ['Tackle']],
    ]),
    rematch: makeTeam([
      ['Scizor', 56, ['Bullet Punch', 'X-Scissor', 'Swords Dance', 'Superpower']],
      ['Shedinja', 48, ['Toxic', 'X-Scissor', 'Shadow Sneak', 'Swagger']],
      ['Yanmega', 52, ['Detect', 'Bug Buzz', 'Air Slash', 'Ancient Power']],
      ['Pinsir', 55, ['Earthquake', 'Guillotine', 'X-Scissor', 'Rock Tomb']],
      ['Heracross', 54, ['Close Combat', 'Megahorn', 'Stone Edge', 'Counter']],
      ['Vespiquen', 52, ['Protect', 'Confuse Ray', 'Attack Order', 'Defend Order']],
    ]),
  },
  'whitney-johto': {
    initial: makeTeam([
      ['Clefairy', 17, ['Double Slap', 'Mimic', 'Encore', 'Metronome']],
      ['Miltank', 19, ['Rollout', 'Attract', 'Stomp', 'Milk Drink']],
    ]),
    rematch: makeTeam([
      ['Girafarig', 52, ['Psychic', 'Shadow Ball', 'Calm Mind', 'Baton Pass']],
      ['Lickilicky', 50, ['Wring Out', 'Flamethrower', 'Ice Beam', 'Thunderbolt']],
      ['Bibarel', 54, ['Double Team', 'Charge Beam', 'Surf', 'Ice Beam']],
      ['Delcatty', 54, ['Fake Out', 'Assist', 'Calm Mind', 'Baton Pass']],
      ['Clefable', 52, ['Blizzard', 'Thunder', 'Fire Blast', 'Calm Mind']],
      ['Miltank', 58, ['Body Slam', 'Attract', 'Sleep Talk', 'Rest']],
    ]),
  },
  'morty-johto': {
    initial: makeTeam([
      ['Gastly', 21, ['Lick', 'Spite', 'Mean Look', 'Curse']],
      ['Haunter', 21, ['Hypnosis', 'Dream Eater', 'Curse', 'Nightmare']],
      ['Gengar', 25, ['Hypnosis', 'Shadow Ball', 'Mean Look', 'Sucker Punch']],
      ['Haunter', 23, ['Curse', 'Mean Look', 'Sucker Punch', 'Night Shade']],
    ]),
    rematch: makeTeam([
      ['Drifblim', 52, ['Destiny Bond', 'Substitute', 'Thunderbolt', 'Shadow Ball']],
      ['Dusknoir', 52, ['Pain Split', 'Will-O-Wisp', 'Substitute', 'Payback']],
      ['Sableye', 52, ['Sucker Punch', 'Brick Break', 'Ice Punch', 'Fake Out']],
      ['Mismagius', 54, ['Perish Song', 'Mean Look', 'Confuse Ray', 'Astonish']],
      ['Gengar', 57, ['Hypnosis', 'Confuse Ray', 'Shadow Ball', 'Focus Blast']],
      ['Gengar', 57, ['Substitute', 'Shadow Ball', 'Thunderbolt', 'Destiny Bond']],
    ]),
  },
  'chuck-johto': {
    initial: makeTeam([
      ['Primeape', 29, ['Leer', 'Double Team', 'Focus Punch', 'Rock Slide']],
      ['Poliwrath', 31, ['Hypnosis', 'Surf', 'Focus Punch', 'Body Slam']],
    ]),
    rematch: makeTeam([
      ['Medicham', 54, ['Hi Jump Kick', 'Psycho Cut', 'Attract', 'Thunder Punch']],
      ['Hitmonchan', 52, ['Mach Punch', 'Swagger', 'Focus Punch', 'Double Team']],
      ['Hitmonlee', 55, ['Hi Jump Kick', 'Fake Out', 'Blaze Kick', 'Bulk Up']],
      ['Breloom', 54, ['Substitute', 'Focus Punch', 'Drain Punch', 'Stone Edge']],
      ['Primeape', 56, ['Close Combat', 'Payback', 'Thunder Punch', 'Swagger']],
      ['Poliwrath', 60, ['Double Team', 'Waterfall', 'Focus Punch', 'Substitute']],
    ]),
  },
  'jasmine-johto': {
    initial: makeTeam([
      ['Magnemite', 30, ['Thunderbolt', 'Supersonic', 'Sonic Boom', 'Thunder Wave']],
      ['Magnemite', 30, ['Thunderbolt', 'Supersonic', 'Sonic Boom', 'Thunder Wave']],
      ['Steelix', 35, ['Screech', 'Sandstorm', 'Rock Throw', 'Iron Tail']],
    ]),
    rematch: makeTeam([
      ['Metagross', 52, ['Meteor Mash', 'Bullet Punch', 'Gravity', 'Explosion']],
      ['Magnezone', 56, ['Zap Cannon', 'Lock-On', 'Mirror Coat', 'Metal Sound']],
      ['Skarmory', 52, ['Air Slash', 'Spikes', 'Night Slash', 'Steel Wing']],
      ['Bronzong', 50, ['Gyro Ball', 'Hypnosis', 'Dream Eater', 'Gravity']],
      ['Empoleon', 52, ['Hydro Pump', 'Blizzard', 'Aqua Jet', 'Roar']],
      ['Steelix', 62, ['Stone Edge', 'Stealth Rock', 'Roar', 'Iron Tail']],
    ]),
  },
  'pryce-johto': {
    initial: makeTeam([
      ['Seel', 30, ['Snore', 'Hail', 'Icy Wind', 'Rest']],
      ['Dewgong', 32, ['Sleep Talk', 'Ice Shard', 'Aurora Beam', 'Rest']],
      ['Piloswine', 34, ['Hail', 'Ice Fang', 'Mud Bomb', 'Blizzard']],
    ]),
    rematch: makeTeam([
      ['Abomasnow', 56, ['Ice Shard', 'Wood Hammer', 'Earthquake', 'Blizzard']],
      ['Dewgong', 58, ['Dive', 'Sheer Cold', 'Sleep Talk', 'Rest']],
      ['Glalie', 52, ['Payback', 'Torment', 'Attract', 'Blizzard']],
      ['Froslass', 52, ['Ice Shard', 'Confuse Ray', 'Attract', 'Blizzard']],
      ['Walrein', 54, ['Hail', 'Body Slam', 'Swagger', 'Blizzard']],
      ['Mamoswine', 60, ['Earthquake', 'Avalanche', 'Stone Edge', 'Double Team']],
    ]),
  },
  'clair-johto': {
    initial: makeTeam([
      ['Gyarados', 38, ['Twister', 'Dragon Rage', 'Bite', 'Dragon Pulse']],
      ['Dragonair', 38, ['Thunder Wave', 'Fire Blast', 'Slam', 'Dragon Pulse']],
      ['Dragonair', 38, ['Thunder Wave', 'Aqua Tail', 'Slam', 'Dragon Pulse']],
      ['Kingdra', 41, ['Smokescreen', 'Hydro Pump', 'Hyper Beam', 'Dragon Pulse']],
    ]),
    rematch: makeTeam([
      ['Gyarados', 56, ['Dragon Dance', 'Earthquake', 'Waterfall', 'Dragon Pulse']],
      ['Dragonair', 52, ['Thunder Wave', 'Dragon Rush', 'Thunderbolt', 'Flamethrower']],
      ['Aerodactyl', 52, ['Earthquake', 'Thunder Fang', 'Rock Slide', 'Roar']],
      ['Kingdra', 56, ['Yawn', 'Hydro Pump', 'Ice Beam', 'Dragon Breath']],
      ['Charizard', 52, ['Shadow Claw', 'Air Slash', 'Dragon Claw', 'Fire Fang']],
      ['Dragonite', 60, ['Thunder', 'Safeguard', 'Dragon Breath', 'Hyper Beam']],
    ]),
  },
};

const goldSilverJohtoTeams = {
  'falkner-johto': makeTeam([
    ['Pidgey', 7, ['Tackle', 'Mud-Slap']],
    ['Pidgeotto', 9, ['Tackle', 'Mud-Slap', 'Gust']],
  ]),
  'bugsy-johto': makeTeam([
    ['Metapod', 14, ['Tackle', 'String Shot', 'Harden']],
    ['Kakuna', 14, ['Poison Sting', 'String Shot', 'Harden']],
    ['Scyther', 16, ['Quick Attack', 'Leer', 'Fury Cutter']],
  ]),
  'whitney-johto': makeTeam([
    ['Clefairy', 18, ['Double Slap', 'Mimic', 'Encore', 'Metronome']],
    ['Miltank', 20, ['Rollout', 'Attract', 'Stomp', 'Milk Drink']],
  ]),
  'morty-johto': makeTeam([
    ['Gastly', 21, ['Lick', 'Spite', 'Mean Look', 'Curse']],
    ['Haunter', 21, ['Hypnosis', 'Mimic', 'Curse', 'Night Shade']],
    ['Gengar', 25, ['Hypnosis', 'Shadow Ball', 'Mean Look', 'Dream Eater']],
    ['Haunter', 23, ['Spite', 'Mean Look', 'Mimic', 'Night Shade']],
  ]),
  'chuck-johto': makeTeam([
    ['Primeape', 27, ['Leer', 'Rage', 'Karate Chop', 'Fury Swipes']],
    ['Poliwrath', 30, ['Hypnosis', 'Mind Reader', 'Surf', 'Dynamic Punch']],
  ]),
  'jasmine-johto': makeTeam([
    ['Magnemite', 30, ['Thunderbolt', 'Supersonic', 'Sonic Boom', 'Thunder Wave']],
    ['Magnemite', 30, ['Thunderbolt', 'Supersonic', 'Sonic Boom', 'Thunder Wave']],
    ['Steelix', 35, ['Screech', 'Sunny Day', 'Rock Throw', 'Iron Tail']],
  ]),
  'pryce-johto': makeTeam([
    ['Seel', 27, ['Headbutt', 'Icy Wind', 'Aurora Beam', 'Rest']],
    ['Dewgong', 29, ['Headbutt', 'Icy Wind', 'Aurora Beam', 'Rest']],
    ['Piloswine', 31, ['Icy Wind', 'Fury Attack', 'Mist', 'Blizzard']],
  ]),
  'clair-johto': makeTeam([
    ['Dragonair', 37, ['Thunder Wave', 'Surf', 'Slam', 'Dragon Breath']],
    ['Dragonair', 37, ['Thunder Wave', 'Thunderbolt', 'Slam', 'Dragon Breath']],
    ['Dragonair', 37, ['Thunder Wave', 'Ice Beam', 'Slam', 'Dragon Breath']],
    ['Kingdra', 40, ['Smokescreen', 'Surf', 'Hyper Beam', 'Dragon Breath']],
  ]),
};

const hgssJohtoLeagueTeams = {
  'will-johto': {
    initial: makeTeam([
      ['Xatu', 40, ['U-turn', 'Me First', 'Confuse Ray', 'Psychic']],
      ['Jynx', 41, ['Double Slap', 'Lovely Kiss', 'Ice Punch', 'Psychic']],
      ['Exeggutor', 41, ['Reflect', 'Hypnosis', 'Egg Bomb', 'Psychic']],
      ['Slowbro', 41, ['Curse', 'Amnesia', 'Water Pulse', 'Psychic']],
      ['Xatu', 42, ['Aerial Ace', 'Ominous Wind', 'Confuse Ray', 'Psychic']],
    ]),
    rematch: makeTeam([
      ['Bronzong', 58, ['Reflect', 'Payback', 'Gravity', 'Psychic']],
      ['Jynx', 60, ['Fake Tears', 'Lovely Kiss', 'Blizzard', 'Dream Eater']],
      ['Grumpig', 59, ['Confuse Ray', 'Signal Beam', 'Power Gem', 'Psychic']],
      ['Slowbro', 60, ['Curse', 'Amnesia', 'Body Slam', 'Psychic']],
      ['Gardevoir', 61, ['Focus Blast', 'Charge Beam', 'Calm Mind', 'Psychic']],
      ['Xatu', 62, ['Quick Attack', 'Shadow Ball', 'Confuse Ray', 'Psychic']],
    ]),
  },
  'koga-johto': {
    initial: makeTeam([
      ['Ariados', 40, ['Poison Jab', 'Spider Web', 'Baton Pass', 'Giga Drain']],
      ['Venomoth', 41, ['Supersonic', 'Gust', 'Psychic', 'Toxic']],
      ['Forretress', 43, ['Protect', 'Swift', 'Explosion', 'Toxic Spikes']],
      ['Muk', 42, ['Minimize', 'Screech', 'Gunk Shot', 'Toxic']],
      ['Crobat', 44, ['Double Team', 'Quick Attack', 'Wing Attack', 'Poison Fang']],
    ]),
    rematch: makeTeam([
      ['Skuntank', 61, ['Sucker Punch', 'Dig', 'Toxic', 'Explosion']],
      ['Venomoth', 63, ['Double Team', 'Baton Pass', 'Psychic', 'Silver Wind']],
      ['Toxicroak', 60, ['Cross Chop', 'X-Scissor', 'Swagger', 'Gunk Shot']],
      ['Muk', 62, ['Minimize', 'Screech', 'Swagger', 'Toxic']],
      ['Crobat', 64, ['Toxic', 'Mean Look', 'Fly', 'Cross Poison']],
      ['Swalot', 62, ['Yawn', 'Amnesia', 'Pain Split', 'Sludge Bomb']],
    ]),
  },
  'bruno-johto': {
    initial: makeTeam([
      ['Hitmontop', 42, ['Counter', 'Quick Attack', 'Dig', 'Triple Kick']],
      ['Hitmonlee', 42, ['Swagger', 'Focus Energy', 'Hi Jump Kick', 'Blaze Kick']],
      ['Hitmonchan', 42, ['Thunder Punch', 'Ice Punch', 'Fire Punch', 'Bullet Punch']],
      ['Onix', 43, ['Dragon Breath', 'Earthquake', 'Sandstorm', 'Rock Slide']],
      ['Machamp', 46, ['Rock Slide', 'Foresight', 'Revenge', 'Cross Chop']],
    ]),
    rematch: makeTeam([
      ['Hitmontop', 62, ['Counter', 'Quick Attack', 'Close Combat', 'Earthquake']],
      ['Hitmonlee', 61, ['Swagger', 'Close Combat', 'Reversal', 'Blaze Kick']],
      ['Hitmonchan', 61, ['Substitute', 'Drain Punch', 'Close Combat', 'Bullet Punch']],
      ['Hariyama', 62, ['Low Kick', 'Payback', 'Bullet Punch', 'Bulk Up']],
      ['Machamp', 64, ['Bullet Punch', 'Foresight', 'Stone Edge', 'Dynamic Punch']],
      ['Lucario', 64, ['Extreme Speed', 'Close Combat', 'Counter', 'Iron Tail']],
    ]),
  },
  'karen-johto': {
    initial: makeTeam([
      ['Umbreon', 42, ['Double Team', 'Confuse Ray', 'Faint Attack', 'Payback']],
      ['Vileplume', 42, ['Stun Spore', 'Acid', 'Moonlight', 'Petal Dance']],
      ['Gengar', 45, ['Lick', 'Spite', 'Focus Blast', 'Destiny Bond']],
      ['Murkrow', 44, ['Pluck', 'Whirlwind', 'Sucker Punch', 'Faint Attack']],
      ['Houndoom', 47, ['Nasty Plot', 'Dark Pulse', 'Flamethrower', 'Crunch']],
    ]),
    rematch: makeTeam([
      ['Weavile', 62, ['Ice Shard', 'Night Slash', 'Ice Punch', 'Low Kick']],
      ['Spiritomb', 62, ['Curse', 'Confuse Ray', 'Pain Split', 'Sucker Punch']],
      ['Absol', 62, ['Night Slash', 'Psycho Cut', 'Detect', 'Perish Song']],
      ['Honchkrow', 64, ['Drill Peck', 'Whirlwind', 'Sucker Punch', 'Thunder Wave']],
      ['Houndoom', 63, ['Nasty Plot', 'Dark Pulse', 'Flamethrower', 'Sludge Bomb']],
      ['Umbreon', 64, ['Curse', 'Payback', 'Confuse Ray', 'Sucker Punch']],
    ]),
  },
  'lance-johto': {
    initial: makeTeam([
      ['Gyarados', 46, ['Flail', 'Dragon Pulse', 'Waterfall', 'Ice Fang']],
      ['Dragonite', 49, ['Thunder Wave', 'Dragon Rush', 'Thunder', 'Hyper Beam']],
      ['Dragonite', 49, ['Thunder Wave', 'Dragon Rush', 'Blizzard', 'Hyper Beam']],
      ['Aerodactyl', 48, ['Aerial Ace', 'Crunch', 'Rock Slide', 'Thunder Fang']],
      ['Charizard', 48, ['Shadow Claw', 'Air Slash', 'Dragon Claw', 'Fire Fang']],
      ['Dragonite', 50, ['Fire Blast', 'Safeguard', 'Outrage', 'Hyper Beam']],
    ]),
    rematch: makeTeam([
      ['Salamence', 72, ['Flamethrower', 'Shadow Claw', 'Dragon Claw', 'Rest']],
      ['Gyarados', 68, ['Thunder Wave', 'Ice Fang', 'Waterfall', 'Dragon Dance']],
      ['Garchomp', 72, ['Swords Dance', 'Outrage', 'Earthquake', 'Roar']],
      ['Altaria', 73, ['Perish Song', 'Dragon Breath', 'Double Team', 'Hyper Beam']],
      ['Charizard', 68, ['Flamethrower', 'Air Slash', 'Dragon Claw', 'Hyper Beam']],
      ['Dragonite', 75, ['Fire Blast', 'Safeguard', 'Draco Meteor', 'Hyper Beam']],
    ]),
  },
};

const goldSilverJohtoLeagueTeams = {
  'will-johto': makeTeam([
    ['Xatu', 40, ['Quick Attack', 'Future Sight', 'Confuse Ray', 'Psychic']],
    ['Jynx', 41, ['Double Slap', 'Lovely Kiss', 'Ice Punch', 'Psychic']],
    ['Exeggutor', 41, ['Reflect', 'Leech Seed', 'Egg Bomb', 'Psychic']],
    ['Slowbro', 41, ['Curse', 'Amnesia', 'Body Slam', 'Psychic']],
    ['Xatu', 42, ['Quick Attack', 'Future Sight', 'Confuse Ray', 'Psychic']],
  ]),
  'koga-johto': makeTeam([
    ['Ariados', 40, ['Double Team', 'Spider Web', 'Baton Pass', 'Giga Drain']],
    ['Venomoth', 41, ['Supersonic', 'Gust', 'Psychic', 'Toxic']],
    ['Forretress', 43, ['Protect', 'Swift', 'Explosion', 'Spikes']],
    ['Muk', 42, ['Minimize', 'Acid Armor', 'Sludge Bomb', 'Toxic']],
    ['Crobat', 44, ['Double Team', 'Quick Attack', 'Wing Attack', 'Toxic']],
  ]),
  'bruno-johto': makeTeam([
    ['Hitmontop', 42, ['Pursuit', 'Quick Attack', 'Dig', 'Detect']],
    ['Hitmonlee', 42, ['Swagger', 'Double Kick', 'Hi Jump Kick', 'Foresight']],
    ['Hitmonchan', 42, ['Thunder Punch', 'Ice Punch', 'Fire Punch', 'Mach Punch']],
    ['Onix', 43, ['Bind', 'Earthquake', 'Sandstorm', 'Rock Slide']],
    ['Machamp', 46, ['Rock Slide', 'Foresight', 'Vital Throw', 'Cross Chop']],
  ]),
  'karen-johto': makeTeam([
    ['Umbreon', 42, ['Sand Attack', 'Confuse Ray', 'Faint Attack', 'Mean Look']],
    ['Vileplume', 42, ['Stun Spore', 'Acid', 'Moonlight', 'Petal Dance']],
    ['Gengar', 45, ['Lick', 'Spite', 'Curse', 'Destiny Bond']],
    ['Murkrow', 44, ['Quick Attack', 'Whirlwind', 'Pursuit', 'Faint Attack']],
    ['Houndoom', 47, ['Roar', 'Pursuit', 'Flamethrower', 'Crunch']],
  ]),
  'lance-johto': makeTeam([
    ['Gyarados', 44, ['Flail', 'Rain Dance', 'Surf', 'Hyper Beam']],
    ['Dragonite', 47, ['Thunder Wave', 'Twister', 'Thunder', 'Hyper Beam']],
    ['Dragonite', 47, ['Thunder Wave', 'Twister', 'Blizzard', 'Hyper Beam']],
    ['Aerodactyl', 46, ['Wing Attack', 'Ancient Power', 'Rock Slide', 'Hyper Beam']],
    ['Charizard', 46, ['Flamethrower', 'Wing Attack', 'Slash', 'Hyper Beam']],
    ['Dragonite', 50, ['Fire Blast', 'Safeguard', 'Outrage', 'Hyper Beam']],
  ]),
};

const hgssRedTeam = makeTeam([
  ['Pikachu', 88, ['Volt Tackle', 'Iron Tail', 'Quick Attack', 'Thunderbolt']],
  ['Lapras', 80, ['Blizzard', 'Brine', 'Psychic', 'Body Slam']],
  ['Snorlax', 82, ['Shadow Ball', 'Crunch', 'Blizzard', 'Giga Impact']],
  ['Venusaur', 84, ['Sludge Bomb', 'Giga Drain', 'Sleep Powder', 'Frenzy Plant']],
  ['Charizard', 84, ['Flare Blitz', 'Air Slash', 'Blast Burn', 'Dragon Pulse']],
  ['Blastoise', 84, ['Focus Blast', 'Hydro Cannon', 'Blizzard', 'Flash Cannon']],
]);

const goldSilverRedTeam = makeTeam([
  ['Pikachu', 81, ['Charm', 'Quick Attack', 'Thunderbolt', 'Thunder']],
  ['Espeon', 73, ['Mud-Slap', 'Reflect', 'Swift', 'Psychic']],
  ['Snorlax', 75, ['Amnesia', 'Snore', 'Rest', 'Body Slam']],
  ['Venusaur', 77, ['Sunny Day', 'Giga Drain', 'Synthesis', 'Solar Beam']],
  ['Charizard', 77, ['Flamethrower', 'Wing Attack', 'Slash', 'Fire Spin']],
  ['Blastoise', 77, ['Rain Dance', 'Surf', 'Blizzard', 'Whirlpool']],
]);

export const TRAINERDEX_OPTIONS = [
  { id: 'kanto', label: 'FireRed / LeafGreen', region: 'Kanto', art: ['FireRed.png', 'LeafGreen.png'], games: [{ id: 'firered-leafgreen', label: 'FireRed LeafGreen' }, { id: 'heartgold-soulsilver', label: 'HeartGold SoulSilver' }] },
  { id: 'johto', label: 'HeartGold / SoulSilver', region: 'Johto', art: ['HeartGold.jpg', 'SoulSilver.jpg'], games: [{ id: 'heartgold-soulsilver', label: 'HeartGold SoulSilver' }, { id: 'gold-silver', label: 'Gold Silver' }] },
  { id: 'hoenn', label: 'Omega Ruby / Alpha Sapphire', region: 'Hoenn', art: ['OmegaRuby.png', 'AlphaSapphire.png'], games: [{ id: 'omega-ruby-alpha-sapphire', label: 'Omega Ruby Alpha Sapphire' }, { id: 'emerald', label: 'Emerald' }, { id: 'ruby-sapphire', label: 'Ruby Sapphire' }] },
  { id: 'sinnoh', label: 'Diamond / Pearl / Platinum', region: 'Sinnoh', art: ['Diamond.jpg', 'Pearl.jpg', 'Platinum.png'], games: [{ id: 'platinum', label: 'Platinum' }, { id: 'diamond-pearl', label: 'Diamond Pearl' }] },
  { id: 'unova', label: 'Black / White / Black 2 / White 2', region: 'Unova', art: ['Black.png', 'White.png'], games: [{ id: 'black-white', label: 'Black White' }, { id: 'black-2-white-2', label: 'Black 2 White 2' }] },
  { id: 'kalos', label: 'X / Y', region: 'Kalos', art: ['X.png', 'Y.png'], games: [{ id: 'x-y', label: 'X Y' }] },
  { id: 'alola', label: 'Sun / Moon', region: 'Alola', art: ['Sun.png', 'Moon.png'], games: [{ id: 'sun-moon', label: 'Sun Moon' }, { id: 'ultra-sun-ultra-moon', label: 'Ultra Sun Ultra Moon' }] },
  { id: 'galar', label: 'Sword / Shield', region: 'Galar', art: ['Sword.png', 'Shield.png'], games: [{ id: 'sword-shield', label: 'Sword Shield' }] },
  { id: 'paldea', label: 'Scarlet / Violet', region: 'Paldea', art: ['Scarlet.png', 'Violet.png'], games: [{ id: 'scarlet-violet', label: 'Scarlet Violet' }] },
  { id: 'legends-za', label: 'Legends: Z-A', region: 'Lumiose City', art: ['Z-A.jpg'], games: [{ id: 'legends-za', label: 'Legends: Z-A' }] },
];

export const TRAINER_GROUPS = [
  { id: 'royale', label: 'Z-A Royale' },
  { id: 'gym', label: 'Gym Leaders' },
  { id: 'kahuna', label: 'Kahunas' },
  { id: 'elite', label: 'Elite Four' },
  { id: 'champion', label: 'Champions' },
  { id: 'rival', label: 'Rivals' },
  { id: 'postgame', label: 'Postgame Bosses' },
  { id: 'facility', label: 'Facility Bosses' },
  { id: 'special', label: 'Special Trainers' },
];

export const TRAINERDEX_TRAINERS = [
  makeTrainer({
    id: 'brock-kanto',
    name: 'Brock',
    regionId: 'kanto',
    role: 'Pewter City Gym Leader',
    specialty: ['rock'],
    signature: 'Onix',
    summary: 'Brock awards the Boulder Badge and tests early teams with Rock-type defense.',
    team: frlgTeams.brock,
    sources: frlgTrainerSources,
    gameData: {
      'heartgold-soulsilver': {
        initialStageLabel: 'Pewter Gym battle',
        team: hgssKantoTeams.brock.initial,
        sources: hgssTrainerSources,
        battleStages: {
          rematch: {
            label: 'Fighting Dojo rematch',
            teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
            team: hgssKantoTeams.brock.rematch,
            sources: hgssTrainerSources,
          },
        },
      },
    },
  }),
  makeTrainer({
    id: 'misty-kanto',
    name: 'Misty',
    regionId: 'kanto',
    role: 'Cerulean City Gym Leader',
    specialty: ['water'],
    signature: 'Starmie',
    summary: 'Misty awards the Cascade Badge and pressures Kanto teams with fast Water Pokemon.',
    team: frlgTeams.misty,
    sources: frlgTrainerSources,
    gameData: {
      'heartgold-soulsilver': {
        initialStageLabel: 'Cerulean Gym battle',
        team: hgssKantoTeams.misty.initial,
        sources: hgssTrainerSources,
        battleStages: {
          rematch: {
            label: 'Fighting Dojo rematch',
            teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
            team: hgssKantoTeams.misty.rematch,
            sources: hgssTrainerSources,
          },
        },
      },
    },
  }),
  makeTrainer({
    id: 'lt-surge-kanto',
    name: 'Lt. Surge',
    regionId: 'kanto',
    role: 'Vermilion City Gym Leader',
    specialty: ['electric'],
    signature: 'Raichu',
    summary: 'Lt. Surge awards the Thunder Badge and leans on paralysis and quick Electric attacks.',
    team: frlgTeams['lt-surge'],
    sources: frlgTrainerSources,
    gameData: {
      'heartgold-soulsilver': {
        initialStageLabel: 'Vermilion Gym battle',
        team: hgssKantoTeams['lt-surge'].initial,
        sources: hgssTrainerSources,
        battleStages: {
          rematch: {
            label: 'Fighting Dojo rematch',
            teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
            team: hgssKantoTeams['lt-surge'].rematch,
            sources: hgssTrainerSources,
          },
        },
      },
    },
  }),
  makeTrainer({
    id: 'erika-kanto',
    name: 'Erika',
    regionId: 'kanto',
    role: 'Celadon City Gym Leader',
    specialty: ['grass', 'poison'],
    signature: 'Vileplume',
    summary: 'Erika awards the Rainbow Badge with a status-heavy Grass team.',
    team: frlgTeams.erika,
    sources: frlgTrainerSources,
    gameData: {
      'heartgold-soulsilver': {
        initialStageLabel: 'Celadon Gym battle',
        team: hgssKantoTeams.erika.initial,
        sources: hgssTrainerSources,
        battleStages: {
          rematch: {
            label: 'Fighting Dojo rematch',
            teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
            team: hgssKantoTeams.erika.rematch,
            sources: hgssTrainerSources,
          },
        },
      },
    },
  }),
  makeTrainer({
    id: 'koga-kanto',
    name: 'Koga',
    regionId: 'kanto',
    role: 'Fuchsia City Gym Leader',
    specialty: ['poison'],
    signature: 'Weezing',
    summary: 'Koga awards the Soul Badge and uses poison, evasion, and disruptive tactics.',
    team: frlgTeams.koga,
    sources: frlgTrainerSources,
    gameIds: ['firered-leafgreen'],
  }),
  makeTrainer({
    id: 'janine-kanto',
    name: 'Janine',
    regionId: 'kanto',
    role: 'Fuchsia City Gym Leader',
    specialty: ['poison'],
    signature: 'Venomoth',
    summary: 'Janine succeeds Koga as Fuchsia City Gym Leader in HeartGold / SoulSilver.',
    team: hgssKantoTeams.janine.initial,
    gameIds: ['heartgold-soulsilver'],
    sources: hgssTrainerSources,
    initialStageLabel: 'Fuchsia Gym battle',
    battleStages: {
      rematch: {
        label: 'Fighting Dojo rematch',
        teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
        team: hgssKantoTeams.janine.rematch,
        sources: hgssTrainerSources,
      },
    },
  }),
  makeTrainer({
    id: 'sabrina-kanto',
    name: 'Sabrina',
    regionId: 'kanto',
    role: 'Saffron City Gym Leader',
    specialty: ['psychic'],
    signature: 'Alakazam',
    summary: 'Sabrina awards the Marsh Badge and uses high-special Psychic Pokemon.',
    team: frlgTeams.sabrina,
    sources: frlgTrainerSources,
    gameData: {
      'heartgold-soulsilver': {
        initialStageLabel: 'Saffron Gym battle',
        team: hgssKantoTeams.sabrina.initial,
        sources: hgssTrainerSources,
        battleStages: {
          rematch: {
            label: 'Fighting Dojo rematch',
            teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
            team: hgssKantoTeams.sabrina.rematch,
            sources: hgssTrainerSources,
          },
        },
      },
    },
  }),
  makeTrainer({
    id: 'blaine-kanto',
    name: 'Blaine',
    regionId: 'kanto',
    role: 'Cinnabar Island Gym Leader',
    specialty: ['fire'],
    signature: 'Arcanine',
    summary: 'Blaine awards the Volcano Badge after a quiz-themed Fire-type Gym.',
    team: frlgTeams.blaine,
    sources: frlgTrainerSources,
    gameData: {
      'heartgold-soulsilver': {
        role: 'Seafoam Islands Gym Leader',
        initialStageLabel: 'Seafoam Gym battle',
        team: hgssKantoTeams.blaine.initial,
        sources: hgssTrainerSources,
        battleStages: {
          rematch: {
            label: 'Fighting Dojo rematch',
            teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
            team: hgssKantoTeams.blaine.rematch,
            sources: hgssTrainerSources,
          },
        },
      },
    },
  }),
  makeTrainer({
    id: 'giovanni-kanto',
    name: 'Giovanni',
    regionId: 'kanto',
    role: 'Viridian City Gym Leader',
    specialty: ['ground'],
    signature: 'Rhyhorn',
    summary: 'Giovanni is Team Rocket\'s boss and Kanto\'s final Gym Leader.',
    team: frlgTeams.giovanni,
    sources: frlgTrainerSources,
    gameIds: ['firered-leafgreen'],
  }),
  makeTrainer({
    id: 'lorelei-kanto',
    name: 'Lorelei',
    regionId: 'kanto',
    division: 'elite',
    role: 'Kanto Elite Four',
    specialty: ['ice', 'water'],
    signature: 'Lapras',
    summary: 'Lorelei opens the Kanto Elite Four with Ice and Water Pokemon.',
    team: frlgTeams.lorelei.initial,
    sources: frlgTrainerSources,
    battleStages: {
      rematch: {
        label: 'Pokemon League rematch (post-Sevii quest)',
        teamContext: 'Upgraded Indigo Plateau team unlocked after completing the Sevii Network Machine quest.',
        team: frlgTeams.lorelei.rematch,
        sources: frlgTrainerSources,
      },
    },
    gameIds: ['firered-leafgreen'],
  }),
  makeTrainer({
    id: 'bruno-kanto',
    name: 'Bruno',
    regionId: 'kanto',
    division: 'elite',
    role: 'Kanto / Johto Elite Four',
    specialty: ['fighting', 'rock'],
    signature: 'Machamp',
    summary: 'Bruno mixes Fighting specialists with Rock-type support.',
    team: frlgTeams.bruno.initial,
    sources: frlgTrainerSources,
    battleStages: {
      rematch: {
        label: 'Pokemon League rematch (post-Sevii quest)',
        teamContext: 'Upgraded Indigo Plateau team unlocked after completing the Sevii Network Machine quest.',
        team: frlgTeams.bruno.rematch,
        sources: frlgTrainerSources,
      },
    },
    gameIds: ['firered-leafgreen'],
  }),
  makeTrainer({
    id: 'agatha-kanto',
    name: 'Agatha',
    regionId: 'kanto',
    division: 'elite',
    role: 'Kanto Elite Four',
    specialty: ['ghost', 'poison'],
    signature: 'Gengar',
    summary: 'Agatha uses Ghost and Poison tactics built around status and confusion.',
    team: frlgTeams.agatha.initial,
    sources: frlgTrainerSources,
    battleStages: {
      rematch: {
        label: 'Pokemon League rematch (post-Sevii quest)',
        teamContext: 'Upgraded Indigo Plateau team unlocked after completing the Sevii Network Machine quest.',
        team: frlgTeams.agatha.rematch,
        sources: frlgTrainerSources,
      },
    },
    gameIds: ['firered-leafgreen'],
  }),
  makeTrainer({
    id: 'lance-kanto',
    name: 'Lance',
    regionId: 'kanto',
    division: 'elite',
    role: 'Kanto Elite Four',
    specialty: ['dragon', 'flying'],
    signature: 'Dragonite',
    summary: 'Lance closes the Kanto Elite Four with Dragon-themed Pokemon.',
    team: frlgTeams.lance.initial,
    sources: frlgTrainerSources,
    battleStages: {
      rematch: {
        label: 'Pokemon League rematch (post-Sevii quest)',
        teamContext: 'Upgraded Indigo Plateau team unlocked after completing the Sevii Network Machine quest.',
        team: frlgTeams.lance.rematch,
        sources: frlgTrainerSources,
      },
    },
    gameIds: ['firered-leafgreen'],
  }),
  makeTrainer({
    id: 'blue-kanto',
    name: 'Blue',
    regionId: 'kanto',
    division: 'champion',
    role: 'Kanto Champion',
    specialty: ['mixed'],
    signature: 'Charizard',
    summary: 'Blue is the Kanto Champion and the final FireRed / LeafGreen League battle.',
    team: blueFrlgTeams.initialBulbasaur,
    gameData: {
      'firered-leafgreen': {
        initialStageLabel: 'Champion battle',
        sources: blueFrlgSources,
        teamVariantCondition: 'player-starter',
        teamVariants: [
          { label: 'Player chose Bulbasaur', team: blueFrlgTeams.initialBulbasaur },
          { label: 'Player chose Charmander', team: blueFrlgTeams.initialCharmander },
          { label: 'Player chose Squirtle', team: blueFrlgTeams.initialSquirtle },
        ],
        battleStages: {
          rematch: {
            label: 'League rematch',
            team: blueFrlgTeams.rematchBulbasaur,
            sources: blueFrlgSources,
            teamVariantCondition: 'player-starter',
            teamVariants: [
              { label: 'Player chose Bulbasaur', team: blueFrlgTeams.rematchBulbasaur },
              { label: 'Player chose Charmander', team: blueFrlgTeams.rematchCharmander },
              { label: 'Player chose Squirtle', team: blueFrlgTeams.rematchSquirtle },
            ],
          },
        },
      },
      'heartgold-soulsilver': {
        division: 'gym',
        role: 'Viridian City Gym Leader',
        signature: 'Pidgeot',
        summary: 'Blue returns as Viridian City Gym Leader in HeartGold / SoulSilver and can be rematched at the Fighting Dojo.',
        initialStageLabel: 'Viridian Gym battle',
        team: hgssKantoTeams.blue.initial,
        sources: hgssTrainerSources,
        battleStages: {
          rematch: {
            label: 'Fighting Dojo rematch',
            teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
            team: hgssKantoTeams.blue.rematch,
            sources: hgssTrainerSources,
          },
        },
      },
    },
  }),
  ...[
    ['Falkner', 'Violet City Gym Leader', ['flying'], 'Pidgeotto'],
    ['Bugsy', 'Azalea Town Gym Leader', ['bug'], 'Scyther'],
    ['Whitney', 'Goldenrod City Gym Leader', ['normal'], 'Miltank'],
    ['Morty', 'Ecruteak City Gym Leader', ['ghost'], 'Gengar'],
    ['Chuck', 'Cianwood City Gym Leader', ['fighting'], 'Poliwrath'],
    ['Jasmine', 'Olivine City Gym Leader', ['steel'], 'Steelix'],
    ['Pryce', 'Mahogany Town Gym Leader', ['ice'], 'Piloswine'],
    ['Clair', 'Blackthorn City Gym Leader', ['dragon'], 'Kingdra'],
  ].map(([name, role, specialty, signature]) => {
    const id = `${name.toLowerCase()}-johto`;
    const hgssTeams = hgssJohtoGymTeams[id];
    return makeTrainer({
      id,
      name,
      regionId: 'johto',
      role,
      specialty,
      signature,
      summary: `${name} is a Johto Gym Leader whose badge battle focuses on ${specialty.join(' / ')} Pokemon.`,
      team: hgssTeams.initial,
      sources: hgssTrainerSources,
      gameData: {
        'heartgold-soulsilver': {
          initialStageLabel: 'Gym battle',
          team: hgssTeams.initial,
          sources: hgssTrainerSources,
          battleStages: {
            rematch: {
              label: 'Fighting Dojo rematch',
              teamContext: 'Repeatable HeartGold/SoulSilver rematch arranged through the Pokegear.',
              team: hgssTeams.rematch,
              sources: hgssTrainerSources,
            },
          },
        },
        'gold-silver': {
          initialStageLabel: 'Gym battle',
          teamContext: 'Gold and Silver use this same team; Crystal is not included in this selector.',
          team: goldSilverJohtoTeams[id],
          sources: goldSilverTrainerSources,
        },
      },
    });
  }),
  makeTrainer({
    id: 'will-johto',
    name: 'Will',
    regionId: 'johto',
    division: 'elite',
    role: 'Johto Elite Four',
    specialty: ['psychic'],
    signature: 'Xatu',
    summary: 'Will opens Johto\'s Elite Four with a Psychic-focused team built around Xatu.',
    team: hgssJohtoLeagueTeams['will-johto'].initial,
    gameData: {
      'heartgold-soulsilver': {
        team: hgssJohtoLeagueTeams['will-johto'].initial,
        sources: hgssTrainerSources,
        battleStages: { rematch: { label: 'Second round (after all 16 Badges)', team: hgssJohtoLeagueTeams['will-johto'].rematch, sources: hgssTrainerSources } },
      },
      'gold-silver': { team: goldSilverJohtoLeagueTeams['will-johto'], sources: goldSilverTrainerSources },
    },
  }),
  makeTrainer({
    id: 'koga-johto',
    name: 'Koga',
    regionId: 'johto',
    division: 'elite',
    role: 'Johto Elite Four',
    specialty: ['poison'],
    signature: 'Crobat',
    summary: 'Koga joins the Johto Elite Four after leaving the Fuchsia Gym.',
    team: hgssJohtoLeagueTeams['koga-johto'].initial,
    gameData: {
      'heartgold-soulsilver': {
        team: hgssJohtoLeagueTeams['koga-johto'].initial,
        sources: hgssTrainerSources,
        battleStages: { rematch: { label: 'Second round (after all 16 Badges)', team: hgssJohtoLeagueTeams['koga-johto'].rematch, sources: hgssTrainerSources } },
      },
      'gold-silver': { team: goldSilverJohtoLeagueTeams['koga-johto'], sources: goldSilverTrainerSources },
    },
  }),
  makeTrainer({
    id: 'bruno-johto',
    name: 'Bruno',
    regionId: 'johto',
    division: 'elite',
    role: 'Johto Elite Four',
    specialty: ['fighting'],
    signature: 'Machamp',
    summary: 'Bruno returns in Johto with a mostly Fighting-type team.',
    team: hgssJohtoLeagueTeams['bruno-johto'].initial,
    gameData: {
      'heartgold-soulsilver': {
        team: hgssJohtoLeagueTeams['bruno-johto'].initial,
        sources: hgssTrainerSources,
        battleStages: { rematch: { label: 'Second round (after all 16 Badges)', team: hgssJohtoLeagueTeams['bruno-johto'].rematch, sources: hgssTrainerSources } },
      },
      'gold-silver': { team: goldSilverJohtoLeagueTeams['bruno-johto'], sources: goldSilverTrainerSources },
    },
  }),
  makeTrainer({
    id: 'karen-johto',
    name: 'Karen',
    regionId: 'johto',
    division: 'elite',
    role: 'Johto Elite Four',
    specialty: ['dark'],
    signature: 'Houndoom',
    summary: 'Karen is Johto\'s Dark-type Elite Four member and closes the Elite Four before the Champion battle.',
    team: hgssJohtoLeagueTeams['karen-johto'].initial,
    gameData: {
      'heartgold-soulsilver': {
        team: hgssJohtoLeagueTeams['karen-johto'].initial,
        sources: hgssTrainerSources,
        battleStages: { rematch: { label: 'Second round (after all 16 Badges)', team: hgssJohtoLeagueTeams['karen-johto'].rematch, sources: hgssTrainerSources } },
      },
      'gold-silver': { team: goldSilverJohtoLeagueTeams['karen-johto'], sources: goldSilverTrainerSources },
    },
  }),
  makeTrainer({
    id: 'lance-johto',
    name: 'Lance',
    regionId: 'johto',
    division: 'champion',
    role: 'Johto Champion',
    specialty: ['dragon', 'flying'],
    signature: 'Dragonite',
    summary: 'Lance serves as Champion for the Johto League.',
    team: hgssJohtoLeagueTeams['lance-johto'].initial,
    gameData: {
      'heartgold-soulsilver': {
        team: hgssJohtoLeagueTeams['lance-johto'].initial,
        sources: hgssTrainerSources,
        battleStages: { rematch: { label: 'Second round (after all 16 Badges)', team: hgssJohtoLeagueTeams['lance-johto'].rematch, sources: hgssTrainerSources } },
      },
      'gold-silver': { team: goldSilverJohtoLeagueTeams['lance-johto'], sources: goldSilverTrainerSources },
    },
  }),
  makeTrainer({
    id: 'red-johto',
    name: 'Red',
    regionId: 'johto',
    division: 'special',
    role: 'Mt. Silver Trainer',
    specialty: ['mixed'],
    signature: 'Pikachu',
    summary: 'Red is the silent final postgame trainer waiting at the summit of Mt. Silver.',
    team: hgssRedTeam,
    gameData: {
      'heartgold-soulsilver': {
        initialStageLabel: 'Mt. Silver battle',
        team: hgssRedTeam,
        sources: hgssTrainerSources,
      },
      'gold-silver': {
        initialStageLabel: 'Mt. Silver battle',
        teamContext: 'Gold and Silver use this same team; Crystal is not included in this selector.',
        team: goldSilverRedTeam,
        sources: goldSilverTrainerSources,
      },
    },
  }),
  ...[
    ['Roxanne', 'hoenn', 'Rustboro City Gym Leader', ['rock'], 'Nosepass', [makeMember('Geodude', 12, moves.rock), makeMember('Nosepass', 14, moves.rock)]],
    ['Brawly', 'hoenn', 'Dewford Town Gym Leader', ['fighting'], 'Makuhita', [makeMember('Machop', 14, moves.fighting), makeMember('Makuhita', 16, moves.fighting)]],
    ['Wattson', 'hoenn', 'Mauville City Gym Leader', ['electric'], 'Magneton', [makeMember('Magnemite', 19, moves.electric), makeMember('Voltorb', 19, moves.electric), makeMember('Magneton', 21, moves.electric)]],
    ['Flannery', 'hoenn', 'Lavaridge Town Gym Leader', ['fire'], 'Torkoal', [makeMember('Slugma', 26, moves.fire), makeMember('Numel', 26, moves.fire), makeMember('Torkoal', 28, moves.fire)]],
    ['Norman', 'hoenn', 'Petalburg City Gym Leader', ['normal'], 'Slaking', [makeMember('Slaking', 28, moves.normal), makeMember('Vigoroth', 28, moves.normal), makeMember('Slaking', 30, moves.normal)]],
    ['Winona', 'hoenn', 'Fortree City Gym Leader', ['flying'], 'Altaria', [makeMember('Swellow', 33, moves.flying), makeMember('Pelipper', 33, moves.water), makeMember('Skarmory', 33, moves.steel), makeMember('Altaria', 35, moves.dragon)]],
    ['Liza & Tate', 'hoenn', 'Mossdeep City Gym Leaders', ['psychic'], 'Solrock', [makeMember('Lunatone', 45, moves.psychic), makeMember('Solrock', 45, moves.psychic)]],
    ['Wallace', 'hoenn', 'Sootopolis City Gym Leader', ['water'], 'Milotic', [makeMember('Luvdisc', 44, moves.water), makeMember('Whiscash', 44, moves.water), makeMember('Sealeo', 44, moves.ice), makeMember('Seaking', 44, moves.water), makeMember('Milotic', 46, moves.water)]],
  ].map(([name, regionId, role, specialty, signature, team]) => makeTrainer({ id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${regionId}`, name, regionId, role, specialty, signature, summary: `${name} represents ${specialty.join(' / ')} types in the ${role}.`, team, sources: hoennTrainerSources, gameData: getHoennGameData(name) })),
  makeTrainer({
    id: 'juan-hoenn',
    name: 'Juan',
    regionId: 'hoenn',
    role: 'Sootopolis City Gym Leader',
    specialty: ['water'],
    signature: 'Kingdra',
    summary: 'Juan replaces Wallace as Sootopolis Gym Leader in Pokemon Emerald.',
    team: hoennGameData.juan.emerald.team,
    gameIds: ['emerald'],
    gameData: getHoennGameData('Juan'),
  }),
  ...[
    ['Sidney', 'hoenn', 'elite', 'Hoenn Elite Four', ['dark'], 'Absol', [makeMember('Mightyena', 50, moves.dark), makeMember('Shiftry', 50, moves.dark), makeMember('Cacturne', 50, moves.dark), makeMember('Sharpedo', 50, moves.water), makeMember('Absol', 52, moves.dark)]],
    ['Phoebe', 'hoenn', 'elite', 'Hoenn Elite Four', ['ghost'], 'Dusknoir', [makeMember('Dusclops', 51, moves.ghost), makeMember('Banette', 51, moves.ghost), makeMember('Sableye', 51, moves.dark), makeMember('Banette', 51, moves.ghost), makeMember('Dusknoir', 53, moves.ghost)]],
    ['Glacia', 'hoenn', 'elite', 'Hoenn Elite Four', ['ice'], 'Walrein', [makeMember('Glalie', 52, moves.ice), makeMember('Froslass', 52, moves.ice), makeMember('Glalie', 52, moves.ice), makeMember('Froslass', 52, moves.ice), makeMember('Walrein', 54, moves.ice)]],
    ['Drake', 'hoenn', 'elite', 'Hoenn Elite Four', ['dragon'], 'Salamence', [makeMember('Altaria', 53, moves.dragon), makeMember('Flygon', 53, moves.ground), makeMember('Kingdra', 53, moves.water), makeMember('Flygon', 53, moves.ground), makeMember('Salamence', 55, moves.dragon)]],
    ['Steven', 'hoenn', 'champion', 'Hoenn Champion', ['steel', 'rock'], 'Metagross', [makeMember('Skarmory', 57, moves.steel), makeMember('Claydol', 57, moves.psychic), makeMember('Aggron', 57, moves.steel), makeMember('Cradily', 57, moves.rock), makeMember('Armaldo', 57, moves.bug), makeMember('Metagross', 59, moves.steel)]],
  ].map(([name, regionId, division, role, specialty, signature, team]) => makeTrainer({ id: `${name.toLowerCase()}-${regionId}`, name, regionId, division, role, specialty, signature, summary: `${name} is a ${role} trainer specializing in ${specialty.join(' / ')} Pokemon.`, team, sources: hoennTrainerSources, gameIds: name === 'Steven' ? ['ruby-sapphire', 'omega-ruby-alpha-sapphire'] : undefined, gameData: getHoennGameData(name) })),
  ...[
    ['Roark', 'sinnoh', 'Oreburgh City Gym Leader', ['rock'], 'Cranidos'],
    ['Gardenia', 'sinnoh', 'Eterna City Gym Leader', ['grass'], 'Roserade'],
    ['Wake', 'sinnoh', 'Pastoria City Gym Leader', ['water'], 'Floatzel'],
    ['Maylene', 'sinnoh', 'Veilstone City Gym Leader', ['fighting'], 'Lucario'],
    ['Fantina', 'sinnoh', 'Hearthome City Gym Leader', ['ghost'], 'Mismagius'],
    ['Byron', 'sinnoh', 'Canalave City Gym Leader', ['steel'], 'Bastiodon'],
    ['Candice', 'sinnoh', 'Snowpoint City Gym Leader', ['ice'], 'Abomasnow'],
    ['Volkner', 'sinnoh', 'Sunyshore City Gym Leader', ['electric'], 'Luxray'],
  ].map(([name, regionId, role, specialty, signature], index) => {
    const id = `${name.toLowerCase()}-${regionId}`;
    const team = sourceCheckedTrainerTeams[id] || [makeMember(signature, 14 + index * 5, moves[specialty[0]] || moves.normal), makeMember(index < 4 ? ['Geodude', 'Turtwig', 'Quagsire', 'Machoke'][index] : ['Drifblim', 'Steelix', 'Sneasel', 'Raichu'][index - 4], 12 + index * 5, moves[specialty[0]] || moves.normal)];
    return makeTrainer({ id, name, regionId, role, specialty, signature, summary: `${name} is a Sinnoh Gym Leader whose main challenge centers on ${specialty.join(' / ')} coverage.`, team, gameData: getSinnohGameData(id, 'gym') });
  }),
  ...[
    ['Aaron', 'sinnoh', 'elite', 'Sinnoh Elite Four', ['bug'], 'Drapion'],
    ['Bertha', 'sinnoh', 'elite', 'Sinnoh Elite Four', ['ground'], 'Hippowdon'],
    ['Flint', 'sinnoh', 'elite', 'Sinnoh Elite Four', ['fire'], 'Infernape'],
    ['Lucian', 'sinnoh', 'elite', 'Sinnoh Elite Four', ['psychic'], 'Bronzong'],
    ['Cynthia', 'sinnoh', 'champion', 'Sinnoh Champion', ['mixed'], 'Garchomp'],
  ].map(([name, regionId, division, role, specialty, signature], index) => {
    const id = `${name.toLowerCase()}-${regionId}`;
    const team = sourceCheckedTrainerTeams[id] || [makeMember(signature, 53 + index, moves[specialty[0]] || moves.dragon), makeMember(['Yanmega', 'Rhyperior', 'Rapidash', 'Alakazam', 'Spiritomb'][index], 49 + index, moves[specialty[0]] || moves.ghost), makeMember(['Vespiquen', 'Gliscor', 'Steelix', 'Mr. Mime', 'Milotic'][index], 50 + index, moves[specialty[0]] || moves.water)];
    return makeTrainer({ id, name, regionId, division, role, specialty, signature, summary: `${name} is part of Sinnoh's Pokemon League challenge.`, team, gameData: getSinnohGameData(id, division) });
  }),
  ...[
    ['Cilan', 'unova', 'Striaton City Gym Leader', ['grass'], 'Pansage'],
    ['Chili', 'unova', 'Striaton City Gym Leader', ['fire'], 'Pansear'],
    ['Cress', 'unova', 'Striaton City Gym Leader', ['water'], 'Panpour'],
    ['Lenora', 'unova', 'Nacrene City Gym Leader', ['normal'], 'Watchog'],
    ['Burgh', 'unova', 'Castelia City Gym Leader', ['bug'], 'Leavanny'],
    ['Elesa', 'unova', 'Nimbasa City Gym Leader', ['electric'], 'Zebstrika'],
    ['Clay', 'unova', 'Driftveil City Gym Leader', ['ground'], 'Excadrill'],
    ['Skyla', 'unova', 'Mistralton City Gym Leader', ['flying'], 'Swanna'],
    ['Brycen', 'unova', 'Icirrus City Gym Leader', ['ice'], 'Beartic'],
    ['Drayden', 'unova', 'Opelucid City Gym Leader', ['dragon'], 'Haxorus'],
    ['Iris', 'unova', 'Opelucid City Gym Leader / Champion', ['dragon'], 'Haxorus'],
    ['Cheren', 'unova', 'Aspertia City Gym Leader', ['normal'], 'Lillipup'],
    ['Roxie', 'unova', 'Virbank City Gym Leader', ['poison'], 'Whirlipede'],
  ].map(([name, regionId, role, specialty, signature], index) => {
    const id = `${name.toLowerCase()}-${regionId}`;
    const team = sourceCheckedTrainerTeams[id] || [makeMember(signature, 14 + index * 3, moves[specialty[0]] || moves.dragon), makeMember(['Lillipup', 'Tepig', 'Oshawott', 'Herdier', 'Dwebble', 'Emolga', 'Krokorok', 'Swoobat', 'Cryogonal', 'Druddigon', 'Druddigon', 'Patrat', 'Koffing'][index], 12 + index * 3, moves[specialty[0]] || moves.normal)];
    return makeTrainer({ id, name, regionId, role, specialty, signature, summary: `${name} appears in Unova's Gym challenge with a ${specialty.join(' / ')}-focused team.`, team, gameIds: getUnovaGymGameIds(id), gameData: getUnovaGymGameData(id) });
  }),
  ...[
    ['Shauntal', 'unova', 'elite', 'Unova Elite Four', ['ghost'], 'Chandelure'],
    ['Grimsley', 'unova', 'elite', 'Unova Elite Four', ['dark'], 'Bisharp'],
    ['Caitlin', 'unova', 'elite', 'Unova Elite Four', ['psychic'], 'Gothitelle'],
    ['Marshal', 'unova', 'elite', 'Unova Elite Four', ['fighting'], 'Conkeldurr'],
    ['Alder', 'unova', 'champion', 'Unova Champion', ['mixed'], 'Volcarona'],
  ].map(([name, regionId, division, role, specialty, signature], index) => {
    const id = `${name.toLowerCase()}-${regionId}`;
    const team = sourceCheckedTrainerTeams[id] || [makeMember(signature, 50 + index, moves[specialty[0]] || moves.bug), makeMember(['Cofagrigus', 'Scrafty', 'Reuniclus', 'Throh', 'Bouffalant'][index], 48 + index, moves[specialty[0]] || moves.normal), makeMember(['Golurk', 'Krookodile', 'Sigilyph', 'Sawk', 'Druddigon'][index], 48 + index, moves[specialty[0]] || moves.dragon)];
    return makeTrainer({ id, name, regionId, division, role, specialty, signature, summary: `${name} is part of Unova's Pokemon League challenge.`, team, gameData: getUnovaGameData(name) });
  }),
  ...[
    ['Viola', 'kalos', 'Santalune City Gym Leader', ['bug'], 'Vivillon'],
    ['Grant', 'kalos', 'Cyllage City Gym Leader', ['rock'], 'Tyrunt'],
    ['Korrina', 'kalos', 'Shalour City Gym Leader', ['fighting'], 'Lucario'],
    ['Ramos', 'kalos', 'Coumarine City Gym Leader', ['grass'], 'Gogoat'],
    ['Clemont', 'kalos', 'Lumiose City Gym Leader', ['electric'], 'Heliolisk'],
    ['Valerie', 'kalos', 'Laverre City Gym Leader', ['fairy'], 'Sylveon'],
    ['Olympia', 'kalos', 'Anistar City Gym Leader', ['psychic'], 'Meowstic'],
    ['Wulfric', 'kalos', 'Snowbelle City Gym Leader', ['ice'], 'Avalugg'],
    ['Malva', 'kalos', 'elite', 'Kalos Elite Four', ['fire'], 'Talonflame'],
    ['Siebold', 'kalos', 'elite', 'Kalos Elite Four', ['water'], 'Clawitzer'],
    ['Wikstrom', 'kalos', 'elite', 'Kalos Elite Four', ['steel'], 'Aegislash-shield'],
    ['Drasna', 'kalos', 'elite', 'Kalos Elite Four', ['dragon'], 'Noivern'],
    ['Diantha', 'kalos', 'champion', 'Kalos Champion', ['mixed'], 'Gardevoir'],
  ].map(([name, regionId, divisionOrRole, roleOrSpecialty, specialtyOrSignature, signatureMaybe], index) => {
    const division = ['elite', 'champion'].includes(divisionOrRole) ? divisionOrRole : 'gym';
    const role = division === 'gym' ? divisionOrRole : roleOrSpecialty;
    const specialty = division === 'gym' ? roleOrSpecialty : specialtyOrSignature;
    const signature = division === 'gym' ? specialtyOrSignature : signatureMaybe;
    const id = `${name.toLowerCase()}-${regionId}`;
    const team = sourceCheckedTrainerTeams[id] || [makeMember(signature, 12 + index * 4, moves[specialty[0]] || moves.psychic), makeMember(['Surskit', 'Amaura', 'Machoke', 'Jumpluff', 'Magneton', 'Mr. Mime', 'Slowking', 'Cryogonal', 'Pyroar', 'Starmie', 'Probopass', 'Dragalge', 'Hawlucha'][index], 10 + index * 4, moves[specialty[0]] || moves.flying)];
    return makeTrainer({
      id,
      name,
      regionId,
      division,
      role,
      specialty,
      signature,
      summary: `${name} is a Kalos ${division === 'gym' ? 'Gym Leader' : 'League trainer'} using ${specialty.join(' / ')} pressure.`,
      team,
      gameIds: ['x-y'],
      teamContext: division === 'gym'
        ? 'X/Y has no single fixed upgraded Gym rematch: Battle Chateau appearances use two Pokemon with rank- and writ-dependent levels.'
        : 'Pokemon League repeat battles reuse this same team and level set.',
      sources: kalosTrainerSources,
    });
  }),
  ...legendsZaTrainers,
  ...[
    ['Hala', 'alola', 'kahuna', 'Melemele Island Kahuna', ['fighting'], 'Crabrawler', [makeMember('Mankey', 14, moves.fighting), makeMember('Makuhita', 14, moves.fighting), makeMember('Crabrawler', 15, moves.fighting)]],
    ['Olivia', 'alola', 'kahuna', 'Akala Island Kahuna', ['rock'], 'Lycanroc', [makeMember('Nosepass', 26, moves.rock), makeMember('Boldore', 26, moves.rock), makeMember('Lycanroc-midday', 27, moves.rock, 'Lycanroc')]],
    ['Nanu', 'alola', 'kahuna', 'Ula\'ula Island Kahuna', ['dark'], 'Persian', [makeMember('Sableye', 38, moves.dark), makeMember('Krokorok', 38, moves.ground), makeMember('Persian-alola', 39, moves.dark, 'Persian')]],
    ['Hapu', 'alola', 'kahuna', 'Poni Island Kahuna', ['ground'], 'Mudsdale', [makeMember('Dugtrio-alola', 47, moves.ground, 'Dugtrio'), makeMember('Flygon', 47, moves.dragon), makeMember('Gastrodon', 47, moves.water), makeMember('Mudsdale', 48, moves.ground)]],
    ['Acerola', 'alola', 'elite', 'Alola Elite Four', ['ghost'], 'Palossand', [makeMember('Sableye', 54, moves.dark), makeMember('Drifblim', 54, moves.ghost), makeMember('Dhelmise', 54, moves.ghost), makeMember('Froslass', 54, moves.ice), makeMember('Palossand', 55, moves.ghost)]],
    ['Kahili', 'alola', 'elite', 'Alola Elite Four', ['flying'], 'Toucannon', [makeMember('Skarmory', 54, moves.steel), makeMember('Crobat', 54, moves.poison), makeMember('Oricorio-baile', 54, moves.fire, 'Oricorio'), makeMember('Mandibuzz', 54, moves.dark), makeMember('Toucannon', 55, moves.flying)]],
    ['Kukui', 'alola', 'champion', 'Alola Pokemon League Final', ['mixed'], 'Lycanroc', [makeMember('Lycanroc-midday', 57, moves.rock, 'Lycanroc'), makeMember('Ninetales-alola', 56, moves.ice, 'Ninetales'), makeMember('Braviary', 56, moves.flying), makeMember('Magnezone', 56, moves.electric), makeMember('Snorlax', 56, moves.normal), makeMember('Incineroar', 58, moves.fire)]],
  ].map(([name, regionId, division, role, specialty, signature, team]) => {
    const id = `${name.toLowerCase()}-${regionId}`;
    return makeTrainer({ id, name, regionId, division, role, specialty, signature, summary: `${name} is part of Alola's island challenge or League path.`, team, gameData: getAlolaGameData(id, team) });
  }),
  ...[
    ['Milo', 'galar', 'Turffield Stadium Gym Leader', ['grass'], 'Eldegoss'],
    ['Nessa', 'galar', 'Hulbury Stadium Gym Leader', ['water'], 'Drednaw'],
    ['Kabu', 'galar', 'Motostoke Stadium Gym Leader', ['fire'], 'Centiskorch'],
    ['Bea', 'galar', 'Stow-on-Side Stadium Gym Leader', ['fighting'], 'Machamp'],
    ['Allister', 'galar', 'Stow-on-Side Stadium Gym Leader', ['ghost'], 'Gengar'],
    ['Opal', 'galar', 'Ballonlea Stadium Gym Leader', ['fairy'], 'Alcremie'],
    ['Gordie', 'galar', 'Circhester Stadium Gym Leader', ['rock'], 'Coalossal'],
    ['Melony', 'galar', 'Circhester Stadium Gym Leader', ['ice'], 'Lapras'],
    ['Piers', 'galar', 'Spikemuth Gym Leader', ['dark'], 'Obstagoon'],
    ['Raihan', 'galar', 'Hammerlocke Stadium Gym Leader', ['dragon'], 'Duraludon'],
    ['Leon', 'galar', 'champion', 'Galar Champion', ['mixed'], 'Charizard'],
  ].map(([name, regionId, divisionOrRole, roleOrSpecialty, specialtyOrSignature, signatureMaybe], index) => {
    const division = divisionOrRole === 'champion' ? 'champion' : 'gym';
    const role = division === 'gym' ? divisionOrRole : roleOrSpecialty;
    const specialty = division === 'gym' ? roleOrSpecialty : specialtyOrSignature;
    const signature = division === 'gym' ? specialtyOrSignature : signatureMaybe;
    const id = `${name.toLowerCase()}-${regionId}`;
    const team = sourceCheckedTrainerTeams[id] || [makeMember(signature, 20 + index * 4, moves[specialty[0]] || moves.fire), makeMember(['Gossifleur', 'Arrokuda', 'Ninetales', 'Sirfetchd', 'Mimikyu', 'Weezing-galar', 'Shuckle', 'Frosmoth', 'Scrafty', 'Flygon', 'Aegislash-shield'][index], 18 + index * 4, moves[specialty[0]] || moves.dragon)];
    return makeTrainer({ id, name, regionId, division, role, specialty, signature, summary: `${name} represents Galar's stadium-format Gym Challenge.`, team, gameData: getGalarGameData(id) });
  }),
  ...[
    ['Katy', 'paldea', 'Cortondo Gym Leader', ['bug'], 'Teddiursa'],
    ['Brassius', 'paldea', 'Artazon Gym Leader', ['grass'], 'Sudowoodo'],
    ['Iono', 'paldea', 'Levincia Gym Leader', ['electric'], 'Mismagius'],
    ['Kofu', 'paldea', 'Cascarrafa Gym Leader', ['water'], 'Crabominable'],
    ['Larry', 'paldea', 'Medali Gym Leader', ['normal'], 'Staraptor'],
    ['Ryme', 'paldea', 'Montenevera Gym Leader', ['ghost'], 'Toxtricity'],
    ['Tulip', 'paldea', 'Alfornada Gym Leader', ['psychic'], 'Florges'],
    ['Grusha', 'paldea', 'Glaseado Gym Leader', ['ice'], 'Altaria'],
    ['Rika', 'paldea', 'elite', 'Paldea Elite Four', ['ground'], 'Clodsire'],
    ['Poppy', 'paldea', 'elite', 'Paldea Elite Four', ['steel'], 'Tinkaton'],
    ['Larry', 'paldea-elite', 'elite', 'Paldea Elite Four', ['flying'], 'Flamigo'],
    ['Hassel', 'paldea', 'elite', 'Paldea Elite Four', ['dragon'], 'Baxcalibur'],
    ['Geeta', 'paldea', 'champion', 'Paldea Top Champion', ['mixed'], 'Glimmora'],
  ].map(([name, regionIdRaw, divisionOrRole, roleOrSpecialty, specialtyOrSignature, signatureMaybe], index) => {
    const regionId = regionIdRaw === 'paldea-elite' ? 'paldea' : regionIdRaw;
    const division = ['elite', 'champion'].includes(divisionOrRole) ? divisionOrRole : 'gym';
    const role = division === 'gym' ? divisionOrRole : roleOrSpecialty;
    const specialty = division === 'gym' ? roleOrSpecialty : specialtyOrSignature;
    const signature = division === 'gym' ? specialtyOrSignature : signatureMaybe;
    const id = `${name.toLowerCase()}-${regionIdRaw}`;
    const team = sourceCheckedTrainerTeams[id] || [makeMember(signature, 15 + index * 4, moves[specialty[0]] || moves.rock), makeMember(['Nymble', 'Petilil', 'Wattrel', 'Wugtrio', 'Komala', 'Banette', 'Farigiraf', 'Frosmoth', 'Whiscash', 'Corviknight', 'Tropius', 'Noivern', 'Espathra'][index], 14 + index * 4, moves[specialty[0]] || moves.psychic)];
    const rematchTeam = paldeaGymRematchTeams[id];
    let gameData;
    if (rematchTeam) {
      gameData = {
        'scarlet-violet': {
          initialStageLabel: 'Victory Road Gym battle',
          battleStages: {
            rematch: {
              label: 'Postgame Gym inspection',
              ...(id === 'katy-paldea' ? { signature: 'Ursaring' } : {}),
              teamContext: 'Academy Ace Tournament unlock quest; this is the mandatory postgame Gym inspection battle.',
              team: rematchTeam,
              sources: paldeaGymRematchSources,
            },
          },
        },
      };
    } else if (id === 'geeta-paldea') {
      gameData = {
        'scarlet-violet': {
          initialStageLabel: 'Champion Assessment',
          battleStages: {
            academy: {
              label: 'Academy Ace Tournament',
              team: makeTeam([['Espathra', 69], ['Gogoat', 69], ['Veluza', 69], ['Avalugg', 69], ['Kingambit', 69], ['Glimmora', 70]]),
              sources: geetaSources,
            },
            'indigo-disk': {
              label: 'Academy Ace Tournament (after The Indigo Disk)',
              signature: 'Kingambit',
              teamContext: 'Updated repeatable tournament team; Kingambit is the Flying-Tera ace.',
              team: makeTeam([
                ['Glimmora', 84, ['Power Gem', 'Sludge Wave', 'Earth Power', 'Light Screen']],
                ['Espathra', 84, ['Lumina Crash', 'Dazzling Gleam', 'Shadow Ball', 'Protect']],
                ['Chesnaught', 84, ['Spiky Shield', 'Leech Seed', 'Drain Punch', 'Bulk Up']],
                ['Avalugg', 84, ['Avalanche', 'Heavy Slam', 'Earthquake', 'Body Press']],
                ['Dragapult', 84, ['Dragon Darts', 'Sucker Punch', 'Thunderbolt', 'Shadow Ball']],
                ['Kingambit', 85, ['Iron Head', 'Kowtow Cleave', 'Tera Blast', 'Stone Edge']],
              ]),
              sources: geetaSources,
            },
          },
        },
      };
    }
    return makeTrainer({ id, name, regionId, division, role, specialty, signature, summary: `${name} is a Paldea ${division === 'gym' ? 'Gym Leader' : 'League trainer'} with a ${specialty.join(' / ')} focus.`, team, gameData });
  }),
  makeTrainer({
    id: 'n-unova',
    name: 'N',
    regionId: 'unova',
    division: 'rival',
    role: 'Team Plasma King',
    specialty: ['mixed'],
    signature: 'Zekrom',
    summary: 'N is Team Plasma\'s king and returns in Black 2 / White 2 for seasonal postgame battles at N\'s Castle.',
    team: nTeams.bwBlack,
    gameData: {
      'black-white': {
        role: 'N\'s Castle Final Boss',
        signature: 'Zekrom',
        initialStageLabel: 'Final battle - Black',
        teamContext: 'In Pokemon Black, N has Zekrom. The White version branch is selectable separately.',
        team: nTeams.bwBlack,
        sources: nTrainerSources,
        battleStages: {
          white: {
            label: 'Final battle - White',
            signature: 'Reshiram',
            teamContext: 'In Pokemon White, N has Reshiram.',
            team: nTeams.bwWhite,
            sources: nTrainerSources,
          },
        },
      },
      'black-2-white-2': {
        role: 'N\'s Castle Postgame Battles',
        initialStageLabel: 'First postgame battle - Black 2',
        teamContext: 'This first encounter is legendary-only; the six-member teams are later seasonal rematches.',
        team: nTeams.b2Black,
        sources: nTrainerSources,
        battleStages: {
          white: { label: 'First postgame battle - White 2', signature: 'Reshiram', team: nTeams.b2White, sources: nTrainerSources },
          spring: { label: 'Spring rematch', team: nTeams.spring, sources: nTrainerSources },
          summer: { label: 'Summer rematch', team: nTeams.summer, sources: nTrainerSources },
          autumn: { label: 'Autumn rematch', team: nTeams.autumn, sources: nTrainerSources },
          winter: { label: 'Winter rematch', team: nTeams.winter, sources: nTrainerSources },
        },
      },
    },
  }),
  makeTrainer({
    id: 'cynthia-unova',
    name: 'Cynthia',
    regionId: 'unova',
    division: 'postgame',
    role: 'Undella Town Postgame Boss',
    specialty: ['mixed'],
    signature: 'Garchomp',
    summary: 'Cynthia visits Undella Town in Unova and can be challenged as a postgame boss.',
    team: makeTeam([
      ['Spiritomb', 75, ['Sucker Punch', 'Shadow Ball', 'Will-O-Wisp', 'Double Team']],
      ['Eelektross', 75, ['Crunch', 'Wild Charge', 'Dragon Claw', 'Flamethrower']],
      ['Milotic', 75, ['Hydro Pump', 'Blizzard', 'Bulldoze', 'Dragon Tail']],
      ['Braviary', 75, ['Brave Bird', 'Crush Claw', 'Shadow Claw', 'Retaliate']],
      ['Lucario', 75, ['Extreme Speed', 'Dragon Pulse', 'Close Combat', 'Aura Sphere']],
      ['Garchomp', 77, ['Dragon Rush', 'Crunch', 'Earthquake', 'Stone Edge']],
    ]),
    gameData: {
      'black-white': {
        team: makeTeam([
          ['Spiritomb', 75, ['Sucker Punch', 'Shadow Ball', 'Will-O-Wisp', 'Double Team']],
          ['Eelektross', 75, ['Crunch', 'Wild Charge', 'Dragon Claw', 'Flamethrower']],
          ['Milotic', 75, ['Hydro Pump', 'Blizzard', 'Bulldoze', 'Dragon Tail']],
          ['Braviary', 75, ['Brave Bird', 'Crush Claw', 'Shadow Claw', 'Retaliate']],
          ['Lucario', 75, ['Extreme Speed', 'Dragon Pulse', 'Close Combat', 'Aura Sphere']],
          ['Garchomp', 77, ['Dragon Rush', 'Crunch', 'Earthquake', 'Stone Edge']],
        ]),
        sources: unovaSpecialSources,
      },
      'black-2-white-2': {
        role: 'Undella Town Postgame Boss',
        team: makeTeam([
          ['Spiritomb', 76, ['Shadow Ball', 'Double Team', 'Dream Eater', 'Hypnosis']],
          ['Milotic', 76, ['Blizzard', 'Hydro Pump', 'Attract', 'Rest']],
          ['Togekiss', 76, ['Extreme Speed', 'Aura Sphere', 'Air Slash', 'Thunder Wave']],
          ['Lucario', 76, ['Extreme Speed', 'Close Combat', 'Flash Cannon', 'Psychic']],
          ['Glaceon', 76, ['Ice Beam', 'Shadow Ball', 'Signal Beam', 'Barrier']],
          ['Garchomp', 78, ['Dragon Rush', 'Earthquake', 'Stone Edge', 'Fire Blast']],
        ]),
        sources: unovaSpecialSources,
      },
    },
  }),
  makeTrainer({
    id: 'benga-unova',
    name: 'Benga',
    regionId: 'unova',
    division: 'facility',
    role: 'Black Tower / White Treehollow Boss Trainer',
    specialty: ['mixed'],
    signature: 'Latios',
    summary: 'Benga is the final Boss Trainer of Area 10 in Black Tower or White Treehollow.',
    team: makeTeam([
      ['Latios', 80, ['Draco Meteor', 'Psychic', 'Icy Wind', 'Thunderbolt']],
      ['Garchomp', 80, ['Outrage', 'Earthquake', 'Fire Blast', 'Stone Edge']],
      ['Volcarona', 80, ['Fire Blast', 'Bug Buzz', 'Psychic', 'Quiver Dance']],
    ]),
    gameIds: ['black-2-white-2'],
    gameData: {
      'black-2-white-2': {
        initialStageLabel: 'Black 2 - Black Tower',
        sources: unovaSpecialSources,
        battleStages: {
          'white-treehollow': {
            label: 'White 2 - White Treehollow',
            team: makeTeam([
              ['Latias', 80, ['Draco Meteor', 'Psychic', 'Icy Wind', 'Thunderbolt']],
              ['Dragonite', 80, ['Outrage', 'Focus Blast', 'Fire Blast', 'Dragon Dance']],
              ['Volcarona', 80, ['Fire Blast', 'Bug Buzz', 'Psychic', 'Quiver Dance']],
            ]),
            sources: unovaSpecialSources,
          },
        },
      },
    },
  }),
  makeTrainer({
    id: 'colress-unova',
    name: 'Colress',
    regionId: 'unova',
    division: 'postgame',
    role: 'Plasma Frigate Postgame Rematch',
    specialty: ['steel', 'electric'],
    signature: 'Klinklang',
    summary: 'Colress can be rematched aboard the Plasma Frigate after the Black 2 / White 2 story.',
    team: makeTeam([
      ['Magneton', 72, ['Volt Switch', 'Flash Cannon', 'Tri Attack', 'Thunder Wave']],
      ['Rotom-wash', 72, ['Discharge', 'Hydro Pump', 'Will-O-Wisp', 'Substitute'], 'Rotom'],
      ['Metagross', 72, ['Meteor Mash', 'Zen Headbutt', 'Rock Slide', 'Agility']],
      ['Beheeyem', 72, ['Psychic', 'Energy Ball', 'Calm Mind', 'Recover']],
      ['Magnezone', 72, ['Thunderbolt', 'Flash Cannon', 'Hyper Beam', 'Thunder Wave']],
      ['Klinklang', 74, ['Gear Grind', 'Wild Charge', 'Giga Impact', 'Shift Gear']],
    ]),
    sources: unovaSpecialSources,
    gameIds: ['black-2-white-2'],
  }),
  makeTrainer({
    id: 'wally-hoenn',
    name: 'Wally',
    regionId: 'hoenn',
    division: 'rival',
    role: 'Hoenn Rival',
    specialty: ['mixed'],
    signature: 'Gallade',
    summary: 'Wally is a recurring Hoenn rival whose repeatable battles differ substantially between generations.',
    team: makeTeam([['Altaria', 46], ['Delcatty', 46], ['Roselia', 46], ['Magneton', 46], ['Gallade', 48]]),
    gameData: {
      'omega-ruby-alpha-sapphire': {
        role: 'Victory Road Rival / Battle Resort Rematch',
        signature: 'Gallade',
        initialStageLabel: 'Victory Road battle',
        team: makeTeam([['Altaria', 46], ['Delcatty', 46], ['Roselia', 46], ['Magneton', 46], ['Gallade', 48]]),
        sources: wallySources,
        battleStages: {
          'maison-first': {
            label: 'Battle Maison rematch (first)',
            teamContext: 'Unlocked after defeating a Super Battle Chatelaine.',
            team: makeTeam([['Altaria', 64], ['Delcatty', 64], ['Roserade', 64], ['Magnezone', 64], ['Gallade', 66]]),
            sources: wallySources,
          },
          'maison-repeat': {
            label: 'Battle Maison rematches (second onward)',
            team: makeTeam([['Roserade', 79], ['Talonflame', 79], ['Azumarill', 79], ['Magnezone', 79], ['Garchomp', 79], ['Gallade', 81]]),
            sources: wallySources,
          },
        },
      },
      'ruby-sapphire': {
        role: 'Victory Road Rival',
        signature: 'Gardevoir',
        initialStageLabel: 'Victory Road battle',
        team: makeTeam([['Altaria', 44], ['Delcatty', 43], ['Roselia', 44], ['Magneton', 41], ['Gardevoir', 45]]),
        sources: wallySources,
        battleStages: {
          'daily-1': { label: 'First daily rematch', team: makeTeam([['Altaria', 47], ['Delcatty', 46], ['Roselia', 47], ['Magneton', 44], ['Gardevoir', 48]]), sources: wallySources },
          'daily-2': { label: 'Second daily rematch', team: makeTeam([['Altaria', 50], ['Delcatty', 49], ['Roselia', 50], ['Magneton', 47], ['Gardevoir', 51]]), sources: wallySources },
          'daily-3': { label: 'Third daily rematch', team: makeTeam([['Altaria', 53], ['Delcatty', 52], ['Roselia', 53], ['Magneton', 50], ['Gardevoir', 54]]), sources: wallySources },
          'daily-4': { label: 'Fourth+ daily rematch', team: makeTeam([['Altaria', 56], ['Delcatty', 55], ['Roselia', 56], ['Magneton', 53], ['Gardevoir', 57]]), sources: wallySources },
        },
      },
      emerald: {
        role: 'Victory Road Rival',
        signature: 'Gardevoir',
        initialStageLabel: 'Victory Road battle',
        team: makeTeam([['Altaria', 44], ['Delcatty', 43], ['Roselia', 44], ['Magneton', 41], ['Gardevoir', 45]]),
        sources: wallySources,
        battleStages: {
          'daily-1': { label: 'First daily rematch', team: makeTeam([['Altaria', 47], ['Delcatty', 46], ['Roselia', 47], ['Magneton', 44], ['Gardevoir', 48]]), sources: wallySources },
          'daily-2': { label: 'Second daily rematch', team: makeTeam([['Altaria', 50], ['Delcatty', 49], ['Roselia', 50], ['Magneton', 47], ['Gardevoir', 51]]), sources: wallySources },
          'daily-3': { label: 'Third daily rematch', team: makeTeam([['Altaria', 53], ['Delcatty', 52], ['Roselia', 53], ['Magneton', 50], ['Gardevoir', 54]]), sources: wallySources },
          'daily-4': { label: 'Fourth+ daily rematch', team: makeTeam([['Altaria', 56], ['Delcatty', 55], ['Roselia', 56], ['Magneton', 53], ['Gardevoir', 57]]), sources: wallySources },
        },
      },
    },
  }),
  makeTrainer({
    id: 'zinnia-hoenn',
    name: 'Zinnia',
    regionId: 'hoenn',
    division: 'postgame',
    role: 'Delta Episode Final Boss',
    specialty: ['dragon'],
    signature: 'Salamence',
    summary: 'Zinnia is the climactic Delta Episode battle in Omega Ruby / Alpha Sapphire.',
    team: makeTeam([['Goodra', 60, 'dragon'], ['Tyrantrum', 60, 'rock'], ['Altaria', 60, 'dragon'], ['Noivern', 60, 'dragon'], ['Salamence', 62, 'dragon']]),
    gameIds: ['omega-ruby-alpha-sapphire'],
  }),
  makeTrainer({
    id: 'red-alola',
    name: 'Red',
    regionId: 'alola',
    division: 'facility',
    role: 'Battle Tree Entrance Opponent',
    specialty: ['mixed'],
    signature: 'Charizard',
    summary: 'Red can be selected for the six-Pokemon entrance battle before the Battle Tree.',
    team: makeTeam([['Pikachu', 70], ['Lapras', 65], ['Snorlax', 65], ['Venusaur', 66], ['Charizard', 66], ['Blastoise', 66]]),
    gameData: {
      'sun-moon': {
        teamContext: 'Six-Pokemon Battle Tree entrance battle. Later facility boss battles use a random 3-Pokemon Singles or 4-Pokemon Doubles selection at flat level 50.',
        team: makeTeam([['Pikachu', 70], ['Lapras', 65], ['Snorlax', 65], ['Venusaur', 66], ['Charizard', 66], ['Blastoise', 66]]),
        sources: battleTreeSources,
      },
      'ultra-sun-ultra-moon': {
        teamContext: 'Six-Pokemon Battle Tree entrance battle. Later facility boss battles use a random 3-Pokemon Singles or 4-Pokemon Doubles selection at flat level 50.',
        team: makeTeam([['Pikachu', 74], ['Lapras', 69], ['Snorlax', 69], ['Venusaur', 70], ['Charizard', 70], ['Blastoise', 70]]),
        sources: battleTreeSources,
      },
    },
  }),
  makeTrainer({
    id: 'blue-alola',
    name: 'Blue',
    regionId: 'alola',
    division: 'facility',
    role: 'Battle Tree Entrance Opponent',
    specialty: ['mixed'],
    signature: 'Alakazam',
    summary: 'Blue can be selected for the six-Pokemon entrance battle before the Battle Tree.',
    team: makeTeam([['Alakazam', 65], ['Machamp', 65], ['Exeggutor', 65], ['Arcanine', 65], ['Gyarados', 65], ['Aerodactyl', 65]]),
    gameData: {
      'sun-moon': {
        teamContext: 'Six-Pokemon Battle Tree entrance battle. Later facility boss battles use a random 3-Pokemon Singles or 4-Pokemon Doubles selection at flat level 50.',
        team: makeTeam([['Alakazam', 65], ['Machamp', 65], ['Exeggutor', 65], ['Arcanine', 65], ['Gyarados', 65], ['Aerodactyl', 65]]),
        sources: battleTreeSources,
      },
      'ultra-sun-ultra-moon': {
        teamContext: 'Six-Pokemon Battle Tree entrance battle. Later facility boss battles use a random 3-Pokemon Singles or 4-Pokemon Doubles selection at flat level 50.',
        team: makeTeam([['Alakazam', 69], ['Machamp', 69], ['Exeggutor', 69], ['Arcanine', 69], ['Gyarados', 69], ['Aerodactyl', 69]]),
        sources: battleTreeSources,
      },
    },
  }),
  makeTrainer({
    id: 'cynthia-alola',
    name: 'Cynthia',
    regionId: 'alola',
    division: 'facility',
    role: 'Battle Tree Trainer',
    specialty: ['mixed'],
    signature: 'Garchomp',
    summary: 'Cynthia returns as a scoutable Battle Tree trainer in Alola.',
    teamContext: 'Facility pool, not a fixed six-Pokemon team: Singles selects 3, Doubles 4, and Multi Battles 2 at flat level 50. Each species also has multiple possible sets.',
    team: makeTeam([['Milotic', 50], ['Spiritomb', 50], ['Garchomp', 50], ['Lucario', 50], ['Togekiss', 50]]),
    sources: battleTreeSources,
    gameIds: ['sun-moon', 'ultra-sun-ultra-moon'],
  }),
  makeTrainer({
    id: 'mustard-galar',
    name: 'Mustard',
    regionId: 'galar',
    division: 'postgame',
    role: 'Master Dojo Final Boss',
    specialty: ['fighting'],
    signature: 'Urshifu',
    summary: 'Mustard is the Isle of Armor Master Dojo final battle after the Galar main story.',
    team: makeMustardTeam('rapid'),
    gameIds: ['sword-shield'],
    initialStageLabel: 'Final battle - Player chose Tower of Darkness',
    teamContext: 'Mustard uses the Urshifu style opposite the player\'s: a Single Strike player faces Rapid Strike, and vice versa.',
    sources: mustardSources,
    battleStages: {
      'final-waters': {
        label: 'Final battle - Player chose Tower of Waters',
        team: makeMustardTeam('single'),
        sources: mustardSources,
      },
      'late-darkness': {
        label: 'Post-Star Tournament - Player chose Tower of Darkness',
        team: makeMustardTeam('rapid', true),
        sources: mustardSources,
      },
      'late-waters': {
        label: 'Post-Star Tournament - Player chose Tower of Waters',
        team: makeMustardTeam('single', true),
        sources: mustardSources,
      },
    },
  }),
  makeTrainer({
    id: 'kieran-paldea',
    name: 'Kieran',
    regionId: 'paldea',
    division: 'rival',
    role: 'Blueberry Academy Champion',
    specialty: ['mixed'],
    signature: 'Hydrapple',
    summary: 'Kieran becomes Blueberry Academy Champion in The Indigo Disk and challenges the player in a Double Battle.',
    teamContext: 'Blueberry League Double Battle; Hydrapple is Fighting Tera. The listed order is the in-game party order.',
    team: makeTeam([
      ['Politoed', 80, ['Ice Beam', 'Weather Ball', 'Psychic', 'Helping Hand']],
      ['Dragonite', 80, ['Hurricane', 'Thunder', 'Extreme Speed', 'Breaking Swipe']],
      ['Grimmsnarl', 81, ['Sucker Punch', 'Spirit Break', 'Light Screen', 'Reflect']],
      ['Porygon-Z', 81, ['Hyper Beam', 'Ice Beam', 'Thunderbolt', 'Shadow Ball']],
      ['Incineroar', 81, ['Darkest Lariat', 'Brick Break', 'Flare Blitz', 'Fake Out']],
      ['Hydrapple', 82, ['Fickle Beam', 'Gyro Ball', 'Tera Blast', 'Earth Power']],
    ]),
    sources: kieranSources,
    gameIds: ['scarlet-violet'],
    battleStages: {
      rematch: {
        label: 'League Club rematch',
        teamContext: 'Repeatable Double Battle with the same moves and held items at higher levels.',
        team: makeTeam([
          ['Politoed', 85, ['Ice Beam', 'Weather Ball', 'Psychic', 'Helping Hand']],
          ['Dragonite', 85, ['Hurricane', 'Thunder', 'Extreme Speed', 'Breaking Swipe']],
          ['Grimmsnarl', 86, ['Sucker Punch', 'Spirit Break', 'Light Screen', 'Reflect']],
          ['Porygon-Z', 86, ['Hyper Beam', 'Ice Beam', 'Thunderbolt', 'Shadow Ball']],
          ['Incineroar', 86, ['Darkest Lariat', 'Brick Break', 'Flare Blitz', 'Fake Out']],
          ['Hydrapple', 87, ['Fickle Beam', 'Gyro Ball', 'Tera Blast', 'Earth Power']],
        ]),
        sources: kieranSources,
      },
    },
  }),
];
