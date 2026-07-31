## Pokemon Lab

A browser-based Pokémon lab built with React, combining a Pokédex, TCG simulator, Trainer Dex, Team Planner, Quiz, and "Who's That Pokémon?" in one retro-styled interface.

Demo: https://pokemon-lab-react.vercel.app/

## Screenshots

| Pokédex | TCG Simulator |
| --- | --- |
| ![Pokédex station showing Zamazenta's profile and stats](docs/screenshots/pokedex.png) | ![TCG Simulator expansion browser](docs/screenshots/tcg-simulator.png) |
| **Who's That Pokémon?** | **Team Planner** |
| ![Who's That Pokémon silhouette challenge](docs/screenshots/whos-that-pokemon.png) | ![Team Planner with a six-Pokémon team](docs/screenshots/team-planner-v2.png) |
| **Pokémon Quiz** | **TrainerDex** |
| ![Pokémon Quiz comparison question](docs/screenshots/quiz.png) | ![TrainerDex trainer browser and team analysis](docs/screenshots/trainer-dex.png) |

### Video walkthroughs

**Pokédex — search for Pikachu, browse Featured TCG Cards, and open a card**

![Pokédex search followed by opening a featured Pikachu TCG card](docs/demos/pokedex-search-to-tcg-v4.gif)

**TCG Simulator — open a Base Set pack and verify the binder increases from 0 to 9 unique cards**

![TCG Simulator pack opening followed by the increased binder collection](docs/demos/tcg-pack-to-binder-v2.gif)

**Who's That Pokémon? — start a Kanto challenge, use a hint, and reveal the answer**

![Who's That Pokémon Kanto round followed by a hint and answer reveal](docs/demos/whos-that-pokemon-round-v4.gif)

**Team Planner — generate a six-Pokémon team and review its team-building guidance**

![Team Planner randomizing a full team followed by its team analysis](docs/demos/team-planner-random-team-v2.gif)

**Pokémon Quiz — start a mixed quiz and answer a question**

![Pokémon Quiz question followed by the selected answer and result](docs/demos/pokemon-quiz-question-v2.gif)

**TrainerDex — browse trainer profiles, review team analysis, and explore featured cards**

![TrainerDex trainer profile, team analysis, featured cards, and card detail](docs/demos/trainerdex-featured-tcg-v4.gif)

## Features

Pokemon Lab is a collection of casual Pokemon reference and game stations. No account is required. The application supports bookmarkable station routes, browser Back/Forward navigation, a Continue shortcut, four recently viewed items, remembered station choices, accessible dialogs, and an optional `Limit animations` preference. On smaller screens, long station controls collapse behind dedicated toggles.

- **Pokédex** — browse by game/region, search, view stats, weaknesses, abilities, evolutions, forms, moves, cries, and generation sprites
- **TCG Simulator** — open single, ten-pack, random, and God Pack pulls; filter a persistent binder; review recent pulls; and search cards across released sets
- **Trainer Dex** — browse notable in-game trainers by region and game, inspect initial/rematch teams, review matchup guidance, and explore related TCG cards
- **Team Planner** — build and locally save up to 12 named casual teams; configure forms, abilities, moves, and natures; and review roles, format warnings, coverage, and suggested swaps
- **Who's That Pokémon?** — play Easy, Normal, or Hard silhouette rounds in ten-round or Endless sessions with staged hints and a local leaderboard
- **Pokémon Quiz** — play Easy, Normal, or Hard mixed-category quizzes in ten-question, twenty-question, or Endless sessions with local best-score tracking

See:

- [Detailed station feature reference](docs/STATION_FEATURES.md) for the current application behavior, data sources, persistence, and scope.
- [Current change handoff and QA prompt](docs/CURRENT_CHANGE_HANDOFF.md) for a copy-ready comparison against the previous committed scope and the required regression matrix.

Retro NES/Game Boy visual style with responsive layouts. PokéAPI responses and sprites are cached locally via IndexedDB to minimise repeat requests.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm run lint
git diff --check
```

There is currently no automated test script. Behavioral changes should be checked using the manual matrix in the [change handoff](docs/CURRENT_CHANGE_HANDOFF.md). The current build may report a non-blocking large-chunk warning, and lint may report Fast Refresh warnings for the shared station module.

## About

Personal project, not for commercial use. Built to study React and experiment with Pokémon data and small game-like tools. AI coding tools were used during development. All Pokémon, TCG, and related assets belong to their respective owners.
