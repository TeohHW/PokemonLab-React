## PokeLab

A browser-based Pokemon lab built with React. It combines a Pokedex, TCG simulator, TrainerDex, team planner, quiz station, and "Who's That Pokemon?" game in one retro-styled interface.

Demo: https://pokemon-lab-react.vercel.app/

## Features

- Home screen and station menu for switching between Pokedex, TCG Simulator, TrainerDex, Who's That Pokemon, Team Planner, and Pokemon Quiz stations.
- TCG pack opening with single-pack, ten-pack, random-pack, and God Pack options.
- Binder collection tracking with saved progress, set filters, search, featured cards, and card detail views.
- Pokedex browser with game/region filters, paged Pokemon lists, search, stats, weaknesses, abilities, evolutions, forms, cries, level-up moves, TCG links, and generation sprites.
- Generation sprite viewer with lazy image loading and broken upstream sprite filtering for missing CDN files.
- TrainerDex dossiers for Gym Leaders, Elite Four members, Champions, Kahunas, and special trainers, including teams, roles, type analysis, counters, featured TCG cards, and rematch stages where available.
- Team Planner station for building a six-Pokemon team, choosing moves, and reviewing type matchups, coverage, and team stats.
- Who's That Pokemon guessing station with silhouette rounds, hints, scoring, and saved leaderboard entries.
- Pokemon Quiz station with mixed category questions for types, evolutions, generations, stats, cries, moves, Pokedex entries, and effectiveness.
- Updated type badge artwork shared across Pokedex, moves, teams, TrainerDex, and quiz views.
- Retro-inspired NES/Game Boy visual style with responsive layouts.

## Data and API Caching

- PokeAPI JSON resources are cached locally with IndexedDB, with an in-memory fallback for the current session.
- PokeAPI sprite images are loaded through the PokeAPI sprites CDN and cached as image blobs when available.
- Failed remote sprite URLs are remembered during the session so missing generational sprite files are not repeatedly retried.
- Repeated Pokemon, Pokedex, type, move, species, evolution, ability, and image requests reuse cached data when available.
- Local app progress such as the TCG collection and Who's That Pokemon leaderboard remains saved in browser storage.

## Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run build
npm run lint
```

## About

Personal project, not intended for commercial use. Built to study React and experiment with Pokemon data, collection views, and small game-like tools. AI coding tools such as Codex were used during development.

All Pokemon, TCG, game, sprite, and related assets belong to their respective owners.
