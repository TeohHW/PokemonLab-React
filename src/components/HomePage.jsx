import pokedexLogo from '../../logos/pokedex.png';
import quizLogo from '../../logos/pokemon_quiz.png';
import tcgLogo from '../../logos/tcg_simulator.png';
import teamLogo from '../../logos/team_planner.png';
import trainerdexLogo from '../../logos/trainerdex.png';
import whoLogo from '../../logos/whos_that_pokemon.png';
import { GitHubRepoLink } from '../stations/shared/stationShared';
import { useAppState } from '../utils/appState';

const formatRouteLabel = (value = '') => value
  .split('-')
  .filter(Boolean)
  .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
  .join(' ');

const getContinueDetail = (station, params = {}) => {
  if (station === 'pokedex' && params.pokemon) {
    return `Last Pokemon: ${formatRouteLabel(params.pokemon)}`;
  }
  if (station === 'trainerdex' && params.trainer) {
    return `Last trainer: ${formatRouteLabel(params.trainer)}`;
  }
  if (station === 'tcg') return 'Return to your selected set and binder';
  if (station === 'team') return 'Return to your current team';
  if (station === 'quiz') return 'Return to the quiz';
  if (station === 'who') return 'Return to your challenge';
  return 'Return to where you left off';
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
  const continueStationId = appState.lastRoute?.station || appState.lastStation;
  const continueStation = HOME_STATIONS.find((station) => station.id === continueStationId);
  const continueParams = appState.lastRoute?.station === continueStationId
    ? appState.lastRoute.params || {}
    : {};

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

        {continueStation && (
          <section className="home-continue-panel" aria-labelledby="continue-title">
            <h2 id="continue-title">Continue</h2>
            <div className="home-continue-list">
              <div className="home-continue-task">
                <span className="home-continue-copy">
                  <strong>{continueStation.title}</strong>
                  <small>{getContinueDetail(continueStation.id, continueParams)}</small>
                </span>
                <button
                  type="button"
                  className="nes-btn is-success"
                  onClick={() => onChoose(continueStation.id, {
                    ...continueParams,
                    resume: '1',
                  })}
                >
                  Resume
                </button>
              </div>
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
