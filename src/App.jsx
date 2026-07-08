import { useState } from 'react';
import './styles.css';
import HomePage from './components/HomePage';
import StationNav from './components/StationNav';
import PokedexPage from './stations/Pokedex/Pokedex';
import TcgSimulator from './stations/TCGSimulator/TCGSimulator';
import WhosThatPokemonPage from './stations/WhosThatPokemon/WhosThatPokemon';
import PokemonTeamPlanner from './stations/TeamPlanner/TeamPlanner';
import PokemonQuizStation from './stations/Quiz/Quiz';
import TrainerDexStation from './stations/TrainerDex/TrainerDex';

function App() {
  const [activeView, setActiveView] = useState('home');

  if (activeView === 'pokedex') {
    return (
      <PokedexPage
        onBack={() => setActiveView('home')}
        onOpenTcg={() => setActiveView('tcg')}
        onOpenWhos={() => setActiveView('who')}
        onOpenTeam={() => setActiveView('team')}
        onOpenQuiz={() => setActiveView('quiz')}
        onOpenTrainerDex={() => setActiveView('trainerdex')}
      />
    );
  }

  if (activeView === 'tcg') {
    return (
      <TcgSimulator
        onBack={() => setActiveView('home')}
        onOpenPokedex={() => setActiveView('pokedex')}
        onOpenWhos={() => setActiveView('who')}
        onOpenTeam={() => setActiveView('team')}
        onOpenQuiz={() => setActiveView('quiz')}
        onOpenTrainerDex={() => setActiveView('trainerdex')}
      />
    );
  }

  if (activeView === 'who') {
    return (
      <WhosThatPokemonPage
        onBack={() => setActiveView('home')}
        onOpenPokedex={() => setActiveView('pokedex')}
        onOpenTcg={() => setActiveView('tcg')}
        onOpenTeam={() => setActiveView('team')}
        onOpenQuiz={() => setActiveView('quiz')}
        onOpenTrainerDex={() => setActiveView('trainerdex')}
      />
    );
  }

  if (activeView === 'team') {
    return (
      <PokemonTeamPlanner
        onBack={() => setActiveView('home')}
        onOpenPokedex={() => setActiveView('pokedex')}
        onOpenTcg={() => setActiveView('tcg')}
        onOpenWhos={() => setActiveView('who')}
        onOpenQuiz={() => setActiveView('quiz')}
        onOpenTrainerDex={() => setActiveView('trainerdex')}
      />
    );
  }

  if (activeView === 'quiz') {
    return (
      <PokemonQuizStation
        onBack={() => setActiveView('home')}
        onOpenPokedex={() => setActiveView('pokedex')}
        onOpenTcg={() => setActiveView('tcg')}
        onOpenWhos={() => setActiveView('who')}
        onOpenTeam={() => setActiveView('team')}
        onOpenTrainerDex={() => setActiveView('trainerdex')}
      />
    );
  }

  if (activeView === 'trainerdex') {
    return (
      <TrainerDexStation
        onBack={() => setActiveView('home')}
        onOpenPokedex={() => setActiveView('pokedex')}
        onOpenTcg={() => setActiveView('tcg')}
        onOpenWhos={() => setActiveView('who')}
        onOpenTeam={() => setActiveView('team')}
        onOpenQuiz={() => setActiveView('quiz')}
        StationNav={StationNav}
      />
    );
  }

  return <HomePage onChoose={setActiveView} />;
}

export default App;
