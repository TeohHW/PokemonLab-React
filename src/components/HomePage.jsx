import pokedexLogo from '../../logos/pokedex.png';
import quizLogo from '../../logos/pokemon_quiz.png';
import tcgLogo from '../../logos/tcg_simulator.png';
import teamLogo from '../../logos/team_planner.png';
import trainerdexLogo from '../../logos/trainerdex.png';
import whoLogo from '../../logos/whos_that_pokemon.png';
import { GitHubRepoLink, loadCollection } from '../stations/shared/stationShared';
import { useAppState } from '../utils/appState';

const TEAM_PLANNER_STORAGE_KEY = 'pokemon-team-planner-saved-team';
const TCG_VIEW_STORAGE_KEY = 'pokemon-lab-tcg-view-v1';

const loadSavedTeamCount = () => {
  try {
    const savedTeam = JSON.parse(localStorage.getItem(TEAM_PLANNER_STORAGE_KEY));
    return Array.isArray(savedTeam?.teamMembers) ? savedTeam.teamMembers.length : 0;
  } catch {
    return 0;
  }
};

const getContinueTasks = (appState) => {
  const tasks = [];
  const savedTeamCount = loadSavedTeamCount();
  const collection = loadCollection();
  const collectedCards = Object.values(collection).filter((card) => card?.count > 0);

  if (savedTeamCount > 0) {
    tasks.push({
      id: 'team',
      station: 'team',
      title: 'Team Planner',
      detail: `${savedTeamCount} of 6 Pokemon selected`,
      params: {},
    });
  }

  if (collectedCards.length > 0) {
    const cardCount = collectedCards.reduce((total, card) => total + card.count, 0);
    const savedSet = localStorage.getItem(TCG_VIEW_STORAGE_KEY) || '';
    tasks.push({
      id: 'tcg',
      station: 'tcg',
      title: 'TCG Binder',
      detail: `${collectedCards.length} unique / ${cardCount} total cards`,
      params: savedSet ? { set: savedSet } : {},
    });
  }

  return tasks.sort((firstTask, secondTask) => (
    Number(secondTask.station === appState.lastStation)
    - Number(firstTask.station === appState.lastStation)
  ));
};

const HOME_STATIONS = [
  {
    id: 'pokedex',
    icon: '#',
    logo: pokedexLogo,
    title: 'Pokedex',
    copy: 'Search Pokemon and explore their stats, moves, evolutions, and more using live PokeAPI data.',
  },
  {
    id: 'tcg',
    icon: 'TCG',
    logo: tcgLogo,
    title: 'Pokemon TCG Simulator',
    copy: 'Browse cards and sets, open booster packs, and build your binder.',
  },
  {
    id: 'who',
    icon: '?',
    logo: whoLogo,
    title: "Who's That Pokemon?",
    copy: 'Guess silhouetted Pokemon by region and compete for the top score.',
  },
  {
    id: 'team',
    icon: 'TEAM',
    logo: teamLogo,
    title: 'Pokemon Team Planner',
    copy: 'Build a six-Pokemon team, choose moves, and check its strengths and weaknesses.',
  },
  {
    id: 'quiz',
    icon: 'Q',
    logo: quizLogo,
    title: 'Pokemon Quiz',
    copy: 'Test your Pokemon knowledge with questions about types, evolutions, stats, cries, and more.',
  },
  {
    id: 'trainerdex',
    icon: 'VS',
    logo: trainerdexLogo,
    title: 'TrainerDex',
    copy: 'Browse notable trainers and explore their teams and matchups by region.',
  },
];

function HomePage({ onChoose }) {
  const { appState } = useAppState();
  const continueTasks = getContinueTasks(appState);

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

        {continueTasks.length > 0 && (
          <section className="home-continue-row" aria-labelledby="continue-title">
            <h2 id="continue-title">Continue</h2>
            <div className="home-continue-list">
              {continueTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className={`home-continue-item home-continue-item-${task.station} nes-btn`}
                  onClick={() => onChoose(task.station, task.params)}
                >
                  <span>
                    <strong>{task.title}</strong>
                    <small>{task.detail}</small>
                  </span>
                  <span className="home-continue-arrow" aria-hidden="true">&gt;</span>
                </button>
              ))}
            </div>
          </section>
        )}

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
