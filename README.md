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

- **Pokédex** — browse by game/region, search, view stats, weaknesses, abilities, evolutions, forms, moves, cries, and generation sprites
- **TCG Simulator** — open single, ten-pack, random, and God Pack pulls; track collection in a binder with set filters, search, and card detail views
- **Trainer Dex** — browse Gym Leaders, Elite Four, Champions, Kahunas, and special trainers by region, with teams, type analysis, counters, and rematch info
- **Team Planner** — build a casual six-Pokémon team manually or with meta-aware, random, and World Champion roster fills; configure forms, abilities, moves, and natures; and review format legality, team roles, nature-adjusted stats, move balance, type coverage, and suggested swaps
- **Who's That Pokémon?** — silhouette guessing game with hints, scoring, and a saved leaderboard
- **Pokémon Quiz** — mixed-category questions covering types, evolutions, generations, stats, cries, moves, and effectiveness

See the [detailed station feature reference](docs/STATION_FEATURES.md) for complete behavior, data sources, persistence, and current scope.

Retro NES/Game Boy visual style with responsive layouts. PokéAPI responses and sprites are cached locally via IndexedDB to minimise repeat requests.

## Development

```bash
npm install
npm run dev
```

## About

Personal project, not for commercial use. Built to study React and experiment with Pokémon data and small game-like tools. AI coding tools were used during development. All Pokémon, TCG, and related assets belong to their respective owners.
