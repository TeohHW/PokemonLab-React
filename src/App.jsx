import { useCallback, useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import StationNav from './components/StationNav';
import PokedexPage from './stations/Pokedex/Pokedex';
import TcgSimulator from './stations/TCGSimulator/TCGSimulator';
import WhosThatPokemonPage from './stations/WhosThatPokemon/WhosThatPokemon';
import PokemonTeamPlanner from './stations/TeamPlanner/TeamPlanner';
import PokemonQuizStation from './stations/Quiz/Quiz';
import TrainerDexStation from './stations/TrainerDex/TrainerDex';
import { rememberStation, useAppState } from './utils/appState';

const STATION_PATHS = Object.freeze({
  home: '/',
  pokedex: '/pokedex',
  tcg: '/tcg',
  who: '/who',
  team: '/team',
  quiz: '/quiz',
  trainerdex: '/trainerdex',
});

const PATH_TO_STATION = new Map(
  Object.entries(STATION_PATHS).map(([station, path]) => [path, station]),
);

const STATION_METADATA = Object.freeze({
  home: {
    title: 'Pokemon Lab | Pokedex, TCG Simulator & Team Planner',
    description: 'Explore Pokemon in a searchable Pokedex, open classic TCG packs, build teams, take quizzes, and browse iconic trainers.',
  },
  pokedex: {
    title: 'Pokedex | Pokemon Lab',
    description: 'Search Pokemon and explore stats, moves, evolutions, forms, and more in Pokemon Lab.',
  },
  tcg: {
    title: 'Pokemon TCG Simulator | Pokemon Lab',
    description: 'Open classic Pokemon TCG packs, browse card sets, and build a persistent binder.',
  },
  who: {
    title: "Who's That Pokemon? | Pokemon Lab",
    description: 'Play a Pokemon silhouette challenge with region, difficulty, and score tracking.',
  },
  team: {
    title: 'Pokemon Team Planner | Pokemon Lab',
    description: 'Build a six-Pokemon team, choose moves, and review strengths, weaknesses, and coverage.',
  },
  quiz: {
    title: 'Pokemon Quiz | Pokemon Lab',
    description: 'Test your Pokemon knowledge with mixed-category quiz challenges.',
  },
  trainerdex: {
    title: 'TrainerDex | Pokemon Lab',
    description: 'Browse notable Pokemon trainers, their teams, matchups, and related TCG cards.',
  },
});

const createRouteSearch = (params = {}) => {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  ).toString();
  return search ? `?${search}` : '';
};

function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash && !window.location.hash) return;

    const [station = '', query = ''] = hash.split('?');
    const pathname = station ? STATION_PATHS[station] : STATION_PATHS.home;
    if (!pathname) return;

    navigate({ pathname, search: query ? `?${query}` : '' }, { replace: true });
  }, [navigate]);

  return null;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { appState } = useAppState();
  const activeView = PATH_TO_STATION.get(location.pathname);
  const routeParams = useMemo(
    () => Object.fromEntries(new URLSearchParams(location.search)),
    [location.search],
  );
  const pageMetadata = STATION_METADATA[activeView] || STATION_METADATA.home;

  const navigateToStation = useCallback((station, params = {}, options = {}) => {
    navigate({
      pathname: STATION_PATHS[station] || STATION_PATHS.home,
      search: createRouteSearch(params),
    }, { replace: options.replace });
  }, [navigate]);

  useEffect(() => {
    if (activeView && activeView !== 'home') {
      rememberStation(activeView, { station: activeView, params: routeParams });
    }
  }, [activeView, routeParams]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = appState.preferences.reducedMotion
      ? 'true'
      : 'false';
  }, [appState.preferences.reducedMotion]);

  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${STATION_PATHS[activeView] || STATION_PATHS.home}`;
    const setMetaContent = (selector, content) => {
      document.querySelector(selector)?.setAttribute('content', content);
    };

    document.title = pageMetadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageMetadata.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    setMetaContent('meta[property="og:title"]', pageMetadata.title);
    setMetaContent('meta[property="og:description"]', pageMetadata.description);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', pageMetadata.title);
    setMetaContent('meta[name="twitter:description"]', pageMetadata.description);
  }, [activeView, pageMetadata]);

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
    const getInitialFocusItem = (dialog) => (
      dialog.querySelector('[data-dialog-initial-focus]') || getFocusableItems(dialog)[0]
    );
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
        if (!nextDialog.contains(document.activeElement)) {
          getInitialFocusItem(nextDialog)?.focus({ preventScroll: true });
        }
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
        if (!dialog.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? lastItem : getInitialFocusItem(dialog))?.focus();
        } else if (event.shiftKey && document.activeElement === firstItem) {
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
    onBack: () => navigateToStation('home'),
    onOpenPokedex: () => navigateToStation('pokedex'),
    onOpenTcg: () => navigateToStation('tcg'),
    onOpenWhos: () => navigateToStation('who'),
    onOpenTeam: () => navigateToStation('team'),
    onOpenQuiz: () => navigateToStation('quiz'),
    onOpenTrainerDex: () => navigateToStation('trainerdex'),
  }), [navigateToStation]);
  const updatePokedexRoute = useCallback(
    (params, options) => navigateToStation('pokedex', params, options),
    [navigateToStation],
  );
  const updateTcgRoute = useCallback(
    (params, options) => navigateToStation('tcg', params, options),
    [navigateToStation],
  );
  const updateTrainerDexRoute = useCallback(
    (params, options) => navigateToStation('trainerdex', params, options),
    [navigateToStation],
  );

  return (
    <>
      <LegacyHashRedirect />
      <Routes>
        <Route path="/" element={<HomePage onChoose={navigateToStation} />} />
        <Route
          path="/pokedex"
          element={(
            <PokedexPage
              {...navigationProps}
              routeParams={routeParams}
              onRouteChange={updatePokedexRoute}
            />
          )}
        />
        <Route
          path="/tcg"
          element={(
            <TcgSimulator
              {...navigationProps}
              routeParams={routeParams}
              onRouteChange={updateTcgRoute}
            />
          )}
        />
        <Route path="/who" element={<WhosThatPokemonPage {...navigationProps} />} />
        <Route
          path="/team"
          element={<PokemonTeamPlanner {...navigationProps} routeParams={routeParams} />}
        />
        <Route path="/quiz" element={<PokemonQuizStation {...navigationProps} />} />
        <Route
          path="/trainerdex"
          element={(
            <TrainerDexStation
              {...navigationProps}
              routeParams={routeParams}
              onRouteChange={updateTrainerDexRoute}
              StationNav={StationNav}
            />
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="app-disclaimer">
        Pokémon and Pokémon character names are trademarks of Nintendo. This project is an unofficial fan-made project and is not affiliated with, endorsed by, or sponsored by Nintendo, The Pokémon Company, or Game Freak. Pokémon data is provided through PokéAPI.
      </footer>
    </>
  );
}

export default App;
