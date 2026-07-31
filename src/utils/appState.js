import { useCallback, useEffect, useState } from 'react';

const APP_STATE_STORAGE_KEY = 'pokemon-lab-app-state-v1';
const APP_STATE_EVENT = 'pokemon-lab-state-change';

const DEFAULT_APP_STATE = {
  lastStation: null,
  lastRoute: null,
  recent: {
    pokemon: [],
    trainers: [],
    cards: [],
  },
  preferences: {
    reducedMotion: false,
  },
};

const normalizeState = (savedState = {}) => ({
  ...DEFAULT_APP_STATE,
  lastStation: savedState.lastStation ?? DEFAULT_APP_STATE.lastStation,
  lastRoute: savedState.lastRoute ?? DEFAULT_APP_STATE.lastRoute,
  recent: {
    ...DEFAULT_APP_STATE.recent,
    ...(savedState.recent || {}),
  },
  preferences: {
    ...DEFAULT_APP_STATE.preferences,
    ...(savedState.preferences || {}),
  },
});

const loadAppState = () => {
  if (typeof window === 'undefined') return DEFAULT_APP_STATE;

  try {
    const savedState = window.localStorage.getItem(APP_STATE_STORAGE_KEY);
    return normalizeState(savedState ? JSON.parse(savedState) : {});
  } catch {
    return DEFAULT_APP_STATE;
  }
};

const saveAppState = (nextState) => {
  if (typeof window === 'undefined') return nextState;

  const normalizedState = normalizeState(nextState);
  window.localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(normalizedState));
  window.dispatchEvent(new CustomEvent(APP_STATE_EVENT, { detail: normalizedState }));
  return normalizedState;
};

const updateAppState = (updater) => {
  const currentState = loadAppState();
  const nextState = typeof updater === 'function' ? updater(currentState) : updater;
  return saveAppState(nextState);
};

const rememberStation = (station, route = null) =>
  updateAppState((currentState) => ({
    ...currentState,
    lastStation: station,
    lastRoute: route || { station, params: {} },
  }));

const addRecentItem = (kind, item, limit = 8) => {
  if (!item?.id || !DEFAULT_APP_STATE.recent[kind]) return loadAppState();

  return updateAppState((currentState) => ({
    ...currentState,
    recent: {
      ...currentState.recent,
      [kind]: [
        { ...item, viewedAt: Date.now() },
        ...currentState.recent[kind].filter((candidate) => candidate.id !== item.id),
      ].slice(0, limit),
    },
  }));
};

const setPreference = (preference, value) =>
  updateAppState((currentState) => ({
    ...currentState,
    preferences: {
      ...currentState.preferences,
      [preference]: value,
    },
  }));

function useAppState() {
  const [appState, setAppState] = useState(loadAppState);

  useEffect(() => {
    const handleStateChange = (event) => {
      setAppState(event.detail || loadAppState());
    };
    const handleStorage = (event) => {
      if (event.key === APP_STATE_STORAGE_KEY) {
        setAppState(loadAppState());
      }
    };

    window.addEventListener(APP_STATE_EVENT, handleStateChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(APP_STATE_EVENT, handleStateChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updatePreference = useCallback((preference, value) => {
    setPreference(preference, value);
  }, []);

  return {
    appState,
    updatePreference,
  };
}

export {
  APP_STATE_STORAGE_KEY,
  addRecentItem,
  loadAppState,
  rememberStation,
  saveAppState,
  setPreference,
  updateAppState,
  useAppState,
};
