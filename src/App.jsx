import { useCallback, useEffect, useMemo, useState } from 'react';
import HomePage from './components/HomePage';
import StationNav from './components/StationNav';
import PokedexPage from './stations/Pokedex/Pokedex';
import TcgSimulator from './stations/TCGSimulator/TCGSimulator';
import WhosThatPokemonPage from './stations/WhosThatPokemon/WhosThatPokemon';
import PokemonTeamPlanner from './stations/TeamPlanner/TeamPlanner';
import PokemonQuizStation from './stations/Quiz/Quiz';
import TrainerDexStation from './stations/TrainerDex/TrainerDex';
import { rememberStation, useAppState } from './utils/appState';

const STATION_IDS = new Set(['pokedex', 'tcg', 'who', 'team', 'quiz', 'trainerdex']);

const parseRoute = () => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [routeName = '', query = ''] = hash.split('?');
  const station = STATION_IDS.has(routeName) ? routeName : 'home';
  return {
    station,
    params: Object.fromEntries(new URLSearchParams(query)),
  };
};

const createRouteHash = (station, params = {}) => {
  if (station === 'home') return '#/';
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  ).toString();
  return `#/${station}${search ? `?${search}` : ''}`;
};

function App() {
  const [route, setRoute] = useState(parseRoute);
  const { appState } = useAppState();
  const activeView = route.station;

  const navigate = useCallback((station, params = {}, options = {}) => {
    const nextHash = createRouteHash(station, params);
    if (options.replace) {
      window.history.replaceState(null, '', nextHash);
      setRoute(parseRoute());
    } else if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setRoute(parseRoute());
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (activeView !== 'home') {
      rememberStation(activeView, route);
    }
  }, [activeView, route]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = appState.preferences.reducedMotion
      ? 'true'
      : 'false';
  }, [appState.preferences.reducedMotion]);

  useEffect(() => {
    let activeDialog = null;
    let previousFocus = null;

    const getTopDialog = () => {
      const dialogs = [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')];
      return dialogs.at(-1) || null;
    };
    const getFocusableItems = (dialog) => [
      ...dialog.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => !element.hasAttribute('hidden'));
    const syncDialog = () => {
      const nextDialog = getTopDialog();
      if (nextDialog === activeDialog) return;

      if (!nextDialog && activeDialog) {
        document.body.classList.remove('has-open-dialog');
        previousFocus?.focus?.();
      }

      if (nextDialog) {
        if (!activeDialog) previousFocus = document.activeElement;
        document.body.classList.add('has-open-dialog');
        window.requestAnimationFrame(() => {
          if (!nextDialog.contains(document.activeElement)) {
            getFocusableItems(nextDialog)[0]?.focus();
          }
        });
      }

      activeDialog = nextDialog;
    };
    const handleDialogKeyDown = (event) => {
      const dialog = getTopDialog();
      if (!dialog) return;

      if (event.key === 'Escape') {
        const closeButton = [
          ...dialog.querySelectorAll('button'),
        ].find((button) => (
          button.matches('.modal-close, [aria-label*="Close"], [data-dialog-close]')
          || /^(close|cancel|resume|keep playing|continue playing)$/i.test(button.textContent.trim())
        ));
        if (closeButton) {
          event.preventDefault();
          closeButton.click();
        }
        return;
      }

      if (event.key === 'Tab') {
        const focusableItems = getFocusableItems(dialog);
        if (!focusableItems.length) return;
        const firstItem = focusableItems[0];
        const lastItem = focusableItems.at(-1);
        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem.focus();
        }
      }
    };

    const observer = new MutationObserver(syncDialog);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', handleDialogKeyDown);
    syncDialog();
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', handleDialogKeyDown);
      document.body.classList.remove('has-open-dialog');
    };
  }, []);

  const navigationProps = useMemo(() => ({
    onBack: () => navigate('home'),
    onOpenPokedex: () => navigate('pokedex'),
    onOpenTcg: () => navigate('tcg'),
    onOpenWhos: () => navigate('who'),
    onOpenTeam: () => navigate('team'),
    onOpenQuiz: () => navigate('quiz'),
    onOpenTrainerDex: () => navigate('trainerdex'),
  }), [navigate]);
  const updatePokedexRoute = useCallback(
    (params, options) => navigate('pokedex', params, options),
    [navigate],
  );
  const updateTcgRoute = useCallback(
    (params, options) => navigate('tcg', params, options),
    [navigate],
  );
  const updateTrainerDexRoute = useCallback(
    (params, options) => navigate('trainerdex', params, options),
    [navigate],
  );

  if (activeView === 'pokedex') {
    return (
      <PokedexPage
        {...navigationProps}
        routeParams={route.params}
        onRouteChange={updatePokedexRoute}
      />
    );
  }

  if (activeView === 'tcg') {
    return (
      <TcgSimulator
        {...navigationProps}
        routeParams={route.params}
        onRouteChange={updateTcgRoute}
      />
    );
  }

  if (activeView === 'who') {
    return (
      <WhosThatPokemonPage
        {...navigationProps}
      />
    );
  }

  if (activeView === 'team') {
    return (
      <PokemonTeamPlanner
        {...navigationProps}
      />
    );
  }

  if (activeView === 'quiz') {
    return (
      <PokemonQuizStation
        {...navigationProps}
      />
    );
  }

  if (activeView === 'trainerdex') {
    return (
      <TrainerDexStation
        {...navigationProps}
        routeParams={route.params}
        onRouteChange={updateTrainerDexRoute}
        StationNav={StationNav}
      />
    );
  }

  return <HomePage onChoose={navigate} />;
}

export default App;
