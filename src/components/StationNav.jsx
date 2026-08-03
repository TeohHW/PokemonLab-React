import { useEffect, useState } from 'react';
import {
  GitHubRepoLink,
  STATION_NAV_OPTIONS,
} from '../stations/shared/stationShared';
import { useAppState } from '../utils/appState';

function StationNav({ activeStation, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { appState, updatePreference } = useAppState();
  const activeStationLabel =
    STATION_NAV_OPTIONS.find((station) => station.id === activeStation)?.label || 'Station';

  const handleNavigate = (stationId) => {
    setIsMenuOpen(false);
    if (stationId !== activeStation) {
      onNavigate(stationId);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <div className="header-actions">
      <button
        type="button"
        className="nes-btn station-menu-button"
        onClick={() => setIsMenuOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isMenuOpen}
      >
        Menu
      </button>
      {isMenuOpen && (
        <div className="station-menu-overlay" role="presentation">
          <button
            type="button"
            className="station-menu-scrim"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close station menu"
          />
          <div
            className="station-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${activeStation}-station-menu-title`}
          >
            <div className="station-menu-heading">
              <div>
                <p>Current station</p>
                <h2 id={`${activeStation}-station-menu-title`}>{activeStationLabel}</h2>
              </div>
              <button
                type="button"
                className="nes-btn station-menu-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close station menu"
              >
                X
              </button>
            </div>
            <div className="station-menu-list" aria-label="Choose station">
              {STATION_NAV_OPTIONS.map((station) => (
                <button
                  key={station.id}
                  type="button"
                  className={`station-menu-option ${
                    station.id === activeStation ? 'is-active' : ''
                  }`}
                  data-dialog-initial-focus={station.id === 'home' ? 'true' : undefined}
                  onClick={() => handleNavigate(station.id)}
                >
                  <span>{station.label}</span>
                  {station.id === activeStation && <strong>Now</strong>}
                </button>
              ))}
            </div>
            <div className="station-menu-preferences">
              <div className="station-menu-motion-setting">
                <label className="station-menu-toggle">
                  <input
                    type="checkbox"
                    checked={appState.preferences.reducedMotion}
                    onChange={(event) => updatePreference('reducedMotion', event.target.checked)}
                    aria-describedby="animation-setting-help"
                  />
                  <span className="station-menu-toggle-track" aria-hidden="true" />
                  <span className="station-menu-toggle-copy">
                    <strong>Limit animations</strong>
                    <small>
                      {appState.preferences.reducedMotion ? 'Reduced motion' : 'Full motion'}
                    </small>
                  </span>
                </label>
                <span
                  className="station-menu-motion-help"
                  tabIndex="0"
                  aria-label="About the Limit animations setting"
                >
                  ?
                  <span id="animation-setting-help" role="tooltip">
                    Shortens interface animations and transitions. Content and game timing stay the same.
                  </span>
                </span>
              </div>
              <GitHubRepoLink />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StationNav;
