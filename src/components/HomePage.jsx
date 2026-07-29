import pokedexLogo from '../../logos/pokedex.png';
import quizLogo from '../../logos/quiz.png';
import tcgLogo from '../../logos/tcg.png';
import teamLogo from '../../logos/team.png';
import trainerdexLogo from '../../logos/trainerdex.png';
import whoLogo from '../../logos/who.png';
import { GitHubRepoLink } from '../stations/shared/stationShared';

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
