import test from 'node:test';
import assert from 'node:assert/strict';

import { TRAINERDEX_TRAINERS } from './trainerDexData.js';

const trainer = (id) => {
  const match = TRAINERDEX_TRAINERS.find((entry) => entry.id === id);
  assert.ok(match, `Missing trainer ${id}`);
  return match;
};

const stage = (trainerId, gameId, stageId) => {
  const match = trainer(trainerId).gameData?.[gameId]?.battleStages?.[stageId]
    || trainer(trainerId).battleStages?.[stageId];
  assert.ok(match, `Missing ${trainerId}/${gameId}/${stageId}`);
  return match;
};

const roster = (team) => team.map(({ name, level }) => `${name}:${level}`);

test('all stored teams use explicit arrays with at most four move slots', () => {
  const teams = [];
  const addContainerTeams = (context, container = {}) => {
    teams.push([context, container.team]);
    for (const [variantIndex, variant] of (container.teamVariants || []).entries()) {
      teams.push([`${context}/variant-${variantIndex}`, variant.team]);
    }
  };

  for (const entry of TRAINERDEX_TRAINERS) {
    addContainerTeams(`${entry.id}/base`, entry);
    for (const [stageId, battleStage] of Object.entries(entry.battleStages || {})) {
      addContainerTeams(`${entry.id}/${stageId}`, battleStage);
    }
    for (const [gameId, gameData] of Object.entries(entry.gameData || {})) {
      addContainerTeams(`${entry.id}/${gameId}`, gameData);
      for (const [stageId, battleStage] of Object.entries(gameData.battleStages || {})) {
        addContainerTeams(`${entry.id}/${gameId}/${stageId}`, battleStage);
      }
    }
  }

  for (const [context, team] of teams) {
    if (!team) continue;
    assert.ok(team.length > 0, `${context} has an empty team`);
    for (const member of team) {
      assert.ok(Array.isArray(member.moves), `${context}/${member.name} moves must be an array`);
      assert.ok(member.moves.length <= 4, `${context}/${member.name} has more than four moves`);
    }
  }
});

test('Blue groups all three starter-dependent teams inside each battle stage', () => {
  const blue = trainer('blue-kanto');
  const frlg = blue.gameData['firered-leafgreen'];
  const rematch = frlg.battleStages.rematch;

  assert.equal(frlg.initialStageLabel, 'Champion battle');
  assert.equal(rematch.label, 'League rematch');
  assert.deepEqual(Object.keys(frlg.battleStages), ['rematch']);
  assert.equal(frlg.teamVariants.length, 3);
  assert.equal(rematch.teamVariants.length, 3);
  for (const starter of ['Bulbasaur', 'Charmander', 'Squirtle']) {
    assert.ok(frlg.teamVariants.some(({ label }) => label === `Player chose ${starter}`));
    assert.ok(rematch.teamVariants.some(({ label }) => label === `Player chose ${starter}`));
  }

  for (const variant of rematch.teamVariants) {
    assert.deepEqual(
      roster(variant.team).slice(0, 3),
      ['Heracross:72', 'Alakazam:73', 'Tyranitar:72'],
    );
  }
  const charmanderRematch = rematch.teamVariants.find(
    ({ label }) => label === 'Player chose Charmander',
  );
  assert.ok(roster(charmanderRematch.team).includes('Arcanine:73'));
});

test('canonical rematch systems are represented for the supported games', () => {
  const frlgLeague = ['lorelei-kanto', 'bruno-kanto', 'agatha-kanto', 'lance-kanto'];
  frlgLeague.forEach((id) => stage(id, 'firered-leafgreen', 'rematch'));

  const hgssGyms = [
    'brock-kanto', 'misty-kanto', 'lt-surge-kanto', 'erika-kanto',
    'janine-kanto', 'sabrina-kanto', 'blaine-kanto', 'blue-kanto',
    'falkner-johto', 'bugsy-johto', 'whitney-johto', 'morty-johto',
    'chuck-johto', 'jasmine-johto', 'pryce-johto', 'clair-johto',
  ];
  hgssGyms.forEach((id) => stage(id, 'heartgold-soulsilver', 'rematch'));

  const emeraldGyms = [
    'roxanne-hoenn', 'brawly-hoenn', 'wattson-hoenn', 'flannery-hoenn',
    'norman-hoenn', 'winona-hoenn', 'liza-tate-hoenn', 'juan-hoenn',
  ];
  emeraldGyms.forEach((id) => {
    for (const tier of [1, 2, 3, 4]) stage(id, 'emerald', `match-call-${tier}`);
  });

  const sinnoh = [
    'roark-sinnoh', 'gardenia-sinnoh', 'maylene-sinnoh', 'wake-sinnoh',
    'fantina-sinnoh', 'byron-sinnoh', 'candice-sinnoh', 'volkner-sinnoh',
    'aaron-sinnoh', 'bertha-sinnoh', 'flint-sinnoh', 'lucian-sinnoh',
    'cynthia-sinnoh',
  ];
  sinnoh.forEach((id) => stage(id, 'platinum', 'rematch'));

  const paldea = [
    'katy-paldea', 'brassius-paldea', 'iono-paldea', 'kofu-paldea',
    'larry-paldea', 'ryme-paldea', 'tulip-paldea', 'grusha-paldea',
  ];
  paldea.forEach((id) => stage(id, 'scarlet-violet', 'rematch'));
});

test('game-specific team splits do not fall back to a different game roster', () => {
  const fantina = trainer('fantina-sinnoh').gameData;
  assert.deepEqual(roster(fantina.platinum.team), ['Duskull:24', 'Haunter:24', 'Mismagius:26']);
  assert.deepEqual(roster(fantina['diamond-pearl'].team), ['Drifblim:32', 'Gengar:34', 'Mismagius:36']);

  const n = trainer('n-unova').gameData['black-2-white-2'];
  assert.deepEqual(roster(n.team), ['Zekrom:70']);
  for (const season of ['spring', 'summer', 'autumn', 'winter']) {
    assert.equal(n.battleStages[season].team.length, 6);
  }

  const iris = trainer('iris-unova').gameData['black-2-white-2'];
  assert.equal(iris.division, 'champion');
  assert.equal(iris.team.length, 6);
});

test('starter- and form-dependent current entries expose their conditions', () => {
  const kukui = trainer('kukui-alola').gameData['sun-moon'];
  const kukuiLabels = kukui.teamVariants.map(({ label }) => label).join(' ');
  for (const starter of ['Rowlet', 'Litten', 'Popplio']) assert.match(kukuiLabels, new RegExp(starter));

  const leon = trainer('leon-galar').gameData['sword-shield'];
  const leonLabels = leon.teamVariants.map(({ label }) => label).join(' ');
  for (const starter of ['Grookey', 'Scorbunny', 'Sobble']) assert.match(leonLabels, new RegExp(starter));

  const mustardLabels = [
    trainer('mustard-galar').initialStageLabel,
    ...Object.values(trainer('mustard-galar').battleStages).map(({ label }) => label),
  ].join(' ');
  assert.match(mustardLabels, /Tower of Darkness/);
  assert.match(mustardLabels, /Tower of Waters/);
});

test('identical repeat battles are not stored as redundant stages', () => {
  const red = trainer('red-johto');
  assert.equal(red.gameData['heartgold-soulsilver'].battleStages, undefined);
  assert.equal(red.gameData['gold-silver'].battleStages, undefined);

  const mustardStages = trainer('mustard-galar').battleStages;
  assert.ok(!Object.keys(mustardStages).some((stageId) => stageId.startsWith('daily-')));
});

test('facility pools are not presented as fictional fixed six-Pokemon teams', () => {
  const cynthia = trainer('cynthia-alola');
  assert.match(cynthia.teamContext, /not a fixed six-Pokemon team/i);
  assert.equal(cynthia.team.length, 5);
  assert.ok(!cynthia.team.some(({ name }) => name === 'Roserade'));
});
