import pokedexLogo from '../../logos/pokedex.png';
import quizLogo from '../../logos/pokemon_quiz.png';
import tcgLogo from '../../logos/tcg_simulator.png';
import teamLogo from '../../logos/team_planner.png';
import trainerdexLogo from '../../logos/trainerdex.png';
import whoLogo from '../../logos/whos_that_pokemon.png';
import { GitHubRepoLink } from '../stations/shared/stationShared';
import { useAppState } from '../utils/appState';

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
  const { appState } = useAppState();
  const lastStation = HOME_STATIONS.find((station) => station.id === appState.lastStation);
  const recentItems = [
    ...appState.recent.pokemon.map((item) => ({ ...item, kind: 'Pokemon', station: 'pokedex', params: { pokemon: item.id } })),
    ...appState.recent.trainers.map((item) => ({ ...item, kind: 'Trainer', station: 'trainerdex', params: { trainer: item.id } })),
    ...appState.recent.cards.map((item) => ({ ...item, kind: 'Card', station: 'tcg', params: { set: item.setId || '' } })),
  ].sort((a, b) => b.viewedAt - a.viewedAt).slice(0, 4);

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

        {lastStation && (
          <section className="home-continue-panel" aria-labelledby="continue-title">
            <div>
              <p className="home-section-kicker">Continue</p>
              <h2 id="continue-title">{lastStation.title}</h2>
            </div>
            <button
              type="button"
              className="nes-btn is-success"
              onClick={() => onChoose(
                appState.lastRoute?.station || lastStation.id,
                appState.lastRoute?.params || {},
              )}
            >
              Resume
            </button>
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

        {recentItems.length > 0 && (
          <div className="home-library-grid">
            <section className="home-library-panel" aria-labelledby="recent-title">
              <h2 id="recent-title">Recently Viewed</h2>
              <div className="home-library-list">
                {recentItems.map((item) => (
                  <button
                    key={`${item.kind}-${item.id}`}
                    type="button"
                    className={`home-library-item home-library-item-${item.station} nes-btn`}
                    onClick={() => onChoose(item.station, item.params)}
                  >
                    <span className="home-library-item-kind">{item.kind}</span>
                    <strong>{item.label}</strong>
                    <span className="home-library-item-arrow" aria-hidden="true">&gt;</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        <p className="choice-prompt">Choose a station.</p>
      </section>
    </main>
  );
}

export default HomePage;
