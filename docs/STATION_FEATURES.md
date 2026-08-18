# Pokemon Lab Station Features

This document is the detailed feature reference for the stations currently implemented in Pokemon Lab. It describes the behavior in the application itself; planned features are intentionally excluded.

## Current application at a glance

| Area | Current behavior |
| --- | --- |
| Access | Every station and casual game works without an account |
| Navigation | Hash routes, browser Back/Forward, bookmarkable supported selections, and Home Continue |
| Local continuity | A compact Home shortcut for the last visited context, plus remembered Pokedex, TCG, TrainerDex, quiz-best, team, collection, and leaderboard state |
| Accessibility | Keyboard-operable controls, contained modal focus, Escape closing, focus restoration, and reduced-animation support |
| Responsive UI | Desktop, tablet, and mobile layouts with collapsible long control panels |
| Visual direction | Shared retro NES/Game Boy presentation with readable proportional fonts for long body copy |
| Excluded behavior | No favorites, account requirement, daily challenge, team sharing/import, battle simulator, or competitive stat editors |

## Shared application experience

Station and selected-item state is represented in hash-based routes, enabling browser Back/Forward navigation and bookmarkable Pokedex, TCG set, and TrainerDex views. The Home screen shows a compact Continue row that restores the last station route, including its selected Pokedex Pokemon, TCG set, or TrainerDex context when available. No account or sign-in is required.

Dialogs contain keyboard focus, close with Escape, and restore focus to their trigger. The `Limit animations` preference can be enabled from the station menu and includes explanatory help. Long secondary sections use progressive disclosure, and station controls collapse behind a dedicated toggle on smaller screens.

All stations use the same responsive, retro NES/Game Boy-inspired interface and can be opened from the shared station menu. The menu links Home, Pokedex, TCG Simulator, Who's That Pokemon, Team Planner, Pokemon Quiz, and TrainerDex without requiring a full page reload.

Pokemon and type information is loaded from PokeAPI. The shared PokeAPI client keeps an in-memory cache and an IndexedDB cache, reducing repeat requests for resources that have already been viewed. TCG stations and integrations use the locally generated `public/expansions.json` card catalog.

Interactive cards and overlays include keyboard-operable controls, labelled form inputs, loading and error states, and modal dialog semantics where appropriate. Layouts collapse for tablets and mobile screens.

## Pokedex

Recent usability additions include type-ahead search suggestions, previous/next profile navigation, side-by-side Pokemon comparison, retry actions, loading skeletons, and restoration of the most recently selected Pokedex and Pokemon.

The Pokedex is a game-aware Pokemon browser and reference station.

### Game and Pokemon browsing

- Browse the combined catalog or choose a game-specific Pokedex:
  - FireRed / LeafGreen
  - Ruby / Sapphire / Emerald
  - HeartGold / SoulSilver
  - Diamond / Pearl / Platinum
  - Black 2 / White 2
  - X / Y
  - Omega Ruby / Alpha Sapphire
  - Sun / Moon
  - Sword / Shield
  - Scarlet / Violet
  - Legends: Z-A
- Search by Pokemon name or National Pokedex number.
- Resolve supported spelling and form aliases through the shared Pokemon lookup normalization.
- Pick a random Pokemon from the full set of listed Pokedexes.
- Clear the current search and selection.
- Browse quick-pick results in pages of 24 Pokemon.
- Sort by Pokedex number, name, primary type, legendary status, or any base stat.
- Sort the combined catalog by introduction generation.
- Load additional sorting metadata in batches only when a metadata-dependent sort is selected.

When no Pokemon is selected, a regional game selection shows its region, Pokemon count, release year, director, game summary, platforms, cover artwork, and starters. Starter artwork acts as a shortcut to the corresponding entry.

### Pokemon profiles

Each selected Pokemon profile includes:

- Official artwork with sprite fallbacks
- National Pokedex number and types
- An English Pokedex flavor entry
- Defensive weaknesses and their multipliers
- Species classification, height, and weight
- All six base stats with meters
- Regular and hidden abilities
- Latest or legacy Pokemon cry playback

Ability names are interactive. Their detail dialog loads an English effect, short effect, and in-game flavor description when those fields are available.

### Evolutions, forms, and sprites

- Display the complete branching evolution tree.
- Show evolution requirements such as levels, items, held items, locations, time of day, known moves, friendship, affection, beauty, gender, party conditions, trade conditions, and other API-provided triggers.
- Navigate directly to another Pokemon by selecting it in the evolution tree.
- Browse alternate species varieties and switch directly to a different form.
- Show available sprites grouped by generation and game.
- Open a sprite set to inspect its available front, back, shiny, female, and other supplied variants.
- Hide unavailable images and use artwork or sprite fallbacks where possible.

### Move reference

- List level-up moves for every supported version group available to the selected Pokemon.
- Switch between game/version-group learnsets.
- Show level, type, physical/special/status category, power, and accuracy.
- Open a move detail dialog for its effect and in-game description.
- Cache already-loaded move details during the current session.

The move table is specifically a level-up move reference. It is not a complete TM, tutor, egg-move, or competitive legality tool.

### TCG integration

- Find locally cataloged cards matching the selected Pokemon or form.
- Display the matching set name and set category.
- Exclude cards whose front artwork is unavailable.
- Open a full card detail overlay with card metadata, abilities, attacks, rule text, weaknesses, resistances, retreat cost, artist, and other available fields.

## Pokemon TCG Simulator

Recent usability additions include Reveal All / Skip Animation, binder filters for owned, missing, duplicate, and newly pulled cards, a short local pull history, a sticky selected-set action bar, and restoration of the most recently selected set.

The TCG Simulator combines an expansion browser, animated booster opening, cross-set card search, and a persistent collection binder.

### Expansion catalog

- Browse released expansions that contain usable local card data and artwork.
- Filter expansions by series.
- Browse promos, POP releases, Trainer Kits, McDonald's releases, and other special or limited products in a separate reference-oriented category.
- Search by expansion name, series, category, release year, Pokemon, or card name.
- Search cards across every released set after entering at least two searchable characters.
- Sort expansions by oldest release, newest release, or name.
- Display set logos, symbols, series, release year, and whether a release is a booster, promo, limited set, Trainer Kit, POP set, or another special release.
- Exclude future-dated expansions and cards known to lack usable official front artwork.

Reference-only products cannot be opened as packs. Their binders are displayed as complete browsing catalogs and do not affect collection progress.

### Pack opening

Four opening modes are available:

- Open 1 Pack: six commons, three uncommons, and one rare.
- Open 10 Packs: ten standard packs, or 100 cards total.
- Open Random Pack: selects a random released, playable expansion.
- Open God Pack: ten cards sampled from the selected expansion's rare pool.

The reveal experience includes:

- A short pack preparation state
- Timed card-by-card flips
- Set logo and release year
- A holo treatment on rare slots
- A `New` marker for cards not previously owned
- A Reveal All / Skip Animation action
- Direct access to another pack without closing the overlay
- Opening an already-revealed card in the full detail view

Cards are added to the binder after the complete reveal. Each opened pack is committed once, while legitimate duplicate pulls still increase the owned quantity rather than creating separate binder entries.

### Binder and collection management

- Keep a binder for every expansion.
- Track owned quantities and unique-card completion.
- Show set completion as a fraction, percentage, and progress bar.
- Show unowned cards in grayscale by default, with a toggle to reveal their full-color art.
- Search the active binder.
- Sort cards by collector number or rarity.
- Reverse rarity sorting between rarest-first and most-common-first.
- Filter the binder by all, owned, missing, duplicate, or latest-pull cards.
- Open owned or unowned cards in the shared detail viewer.
- Clear only the active set's binder.
- Clear every binder after a confirmation dialog.

Collection data is saved to browser `localStorage`, so pulls remain available after reloading the application on the same browser profile. It is not synchronized between browsers or devices.

The ten most recent pulls are also kept locally with their set, card count, newly owned count, rare-card names, and timestamp.

### Card details

The shared card overlay can display:

- Large card artwork with pointer-based tilt and lighting effects
- Set, rarity, collector number, HP, type, stage, retreat cost, and artist
- Abilities, attacks, damage, and energy costs
- Weaknesses, resistances, rules, and other card text
- A holo overlay for rare pack pulls

## Who's That Pokemon?

No account is required. Easy mode shows answer choices, Normal mode offers three progressively revealing hints with a score tradeoff, and Hard mode keeps the silhouette unaided. Players can choose a 10-round session with a final summary or Endless play.

Who's That Pokemon is an open-ended silhouette guessing game with regional challenge pools and a saved local leaderboard.

### Challenge setup

- Enter a trainer name of up to 24 characters.
- Require a non-empty name before starting.
- Choose any listed regional/game Pokedex or Random Region.
- Preview each regional choice with its starter Pokemon.
- In Random Region mode, choose a new region independently for every round.

### Round flow and guessing

- Select a random Pokemon from the active regional Pokedex.
- Present its official artwork as a silhouette.
- Accept a free-text Pokemon name guess.
- Normalize supported Pokemon names and forms when checking the answer.
- Show answer choices automatically on Easy or up to three progressively revealing hints on Normal.
- Award one point for an unassisted correct guess. Each Normal hint reduces the available reward by 0.25, to a minimum of 0.25; an incorrect guess awards no points.
- Track the current score and number of completed rounds.
- Reveal the Pokemon after either result.
- Start the next round with a button or the Enter key.
- Automatically focus the guess field at the beginning of a round.

### Revealed entry

After a guess, the revealed Pokemon can be opened as a compact Pokedex entry containing:

- Artwork, number, and types
- English flavor text
- Species classification
- Height and weight
- Matching featured TCG cards

Featured cards open in the same detailed card viewer used by the Pokedex and TCG Simulator.

### Session controls and leaderboard

- Pause and resume the current game.
- Return to region selection.
- Start again as a new player.
- Confirm before navigating away from an active game.
- View the leaderboard from setup or the in-game menu.
- Save the best current result for each game session.
- Rank up to 12 entries by score, with more recent results breaking ties.
- Display trainer name, score, and local date/time.
- Reset the leaderboard after confirmation.

Leaderboard entries are stored in browser `localStorage`. The active round itself is not restored after a reload.

## Team Planner

The planner can create, rename, load, update, and delete up to 12 locally saved teams. Dedicated Build and Analysis tabs keep roster editing separate from coverage guidance, while each member's detailed build controls are collapsed by default for faster full-team scanning.

The Team Planner is a casual six-Pokemon composition tool with game-aware builds, format profiles, source-backed recommendations, and live team analysis.

### Team creation

- Add up to six Pokemon manually from the selected Pokedex.
- Search by name or Pokedex number.
- Browse in pages of 24 and sort by number, name, type, legendary status, or base stat.
- Fill remaining slots from a competitive evidence catalog.
- Fill remaining slots randomly with eligible Pokemon.
- Load a supported World Champion roster.
- Remove individual members or clear the team.
- Confirm duplicate Pokemon in unrestricted Open Planning.

### Game and format profiles

The same National and game-specific Pokedex selections offered by the Pokedex determine species availability and the active move version group.

Four composition profiles are available:

- Open Planning
- Singles with Species Clause
- VGC Doubles with no restricted Pokemon
- VGC Doubles with up to two restricted Pokemon

The planner checks duplicate species, restricted limits, mythicals, Mega and Primal forms, selected abilities, and moves outside the loaded learnset. Existing problems are shown rather than silently rewriting a team after a format change.

These are practical planning profiles, not exhaustive implementations of every official regulation.

### Automatic and champion fills

`Fill from Meta` uses a catalog assembled from current-format analytics, published tournament teams, World Championship results, a regional top cut, historical champion teams, and archived VGC or Smogon usage snapshots.

For every open slot, it recalculates:

- Defensive gaps
- Offensive type coverage
- Type variety
- Format and generation alignment
- Candidate competitive evidence

It then selects among the strongest-fitting candidates, allowing generated teams to vary.

World Champion rosters cover supported Masters/Senior championship years from 2009 through 2025. A user with an existing partial team may either keep it and fill the remaining slots with the best-fitting members of the champion roster, or replace it with the complete recorded roster. Published sources and historical form/mechanics warnings are linked where relevant.

### Pokemon builds

Each member supports:

- Form selection
- Regular and hidden ability selection
- Ability effect details
- Four customizable move slots
- A searchable nature picker
- Nature-adjusted stats
- Artwork, types, base-stat total, and evidence notes

Default moves and natures prefer compatible published tournament sets and generation-matched VGC or Smogon usage. When those are unavailable, the planner falls back to compatible level-up moves, move power and type variety, attacking stats, and general role assumptions.

### Team-Building Assistant

The assistant provides a transparent 0-100 heuristic composed of:

- Defense: 25%
- Offensive coverage: 25%
- Type variety: 15%
- Six-member readiness: 15%
- Competitive evidence: 10%
- Average base-stat total: 10%

It also reports:

- Physical, special, and status move balance
- Average base or nature-adjusted stats
- Team resistances and immunities
- Types hit super effectively
- Defensive and offensive coverage gaps
- Physical offense, special offense, speed control, disruption, defensive support, and weather/terrain roles
- Missing roles and single-provider warnings
- Protect-style move warnings for doubles teams
- Detected Trick Room, rain, sun, and sand synergies

Recommended next picks are ranked against the current team. A full team receives a suggested replacement, but the user can choose another member to swap out. The impact preview estimates changes to total score, weakness exposure, coverage, and type variety. The latest recommendation-driven swap can be undone.

The preview initially approximates a candidate with STAB coverage and constant power. It is guidance, not a damage calculation or battle prediction.

### Current scope

The Team Planner does not currently include held items, EVs, IVs, Tera types, exact damage calculation, battle simulation, bring-four planning, team import/export, or share codes. Up to 12 named teams can be saved to browser `localStorage` and restored on the same browser profile.

## Pokemon Quiz

No account is required. Easy and Normal target two and three answer choices, while Hard shows up to four when the category has enough meaningful answers. The 10-question, 20-question, and Endless sessions offer different play lengths. Finite sessions finish with accuracy and category results, and the best score and streak are stored on the current device.

Pokemon Quiz is an unlimited multiple-choice quiz generator backed by the selected Pokedex and live Pokemon/type data.

### Quiz configuration and scoring

- Choose the National pool or any game-specific Pokedex used elsewhere in the app.
- Choose one category or Mixed Quiz.
- Generate another random question after a transient data failure, retrying up to five total attempts.
- Track correct answers, completed rounds, and the current correct-answer streak.
- Reset the current session.
- Enable auto-continue, advancing shortly after the result.
- Confirm before navigating away while a question is active.

Answers are disabled after one selection. The correct choice is identified, and an incorrect result displays the correct answer.

The best score and streak are stored locally. There is no account-based or public leaderboard.

### Question categories

Mixed Quiz randomly selects among all non-mixed categories. Individual categories include:

- Type: identify a single or dual type combination.
- Evolution: identify a next evolution, direct pre-evolution, missing evolution, or final form.
- Generation: identify the generation in which a Pokemon debuted.
- Legendary: classify a Pokemon as regular, legendary, or mythical.
- Pokedex Entry: identify a Pokemon from flavor text with its name masked.
- Ability: choose an ability the Pokemon can have.
- Comparisons: compare height, weight, or one of the six base stats.
- Strongest Stat: identify a Pokemon's highest base stat.
- Type Effectiveness: identify a weakness, resistance, or immunity.
- Moves: identify a move's type.
- Number / Region: identify a National Pokedex number or home region.
- Cry / Sprite: identify a Pokemon from audio or a sprite.
- Starter / Evolution Line: answer starter, evolution-line, final-form, or non-evolving Pokemon questions.

### Question presentation

Questions can use:

- Artwork silhouettes
- Standard sprites
- Evolution artwork lines
- Masked Pokedex quotations
- Side-by-side Pokemon comparisons
- Move name and damage-category panels
- Playable Pokemon cries

Each question is generated from the selected pool, and distractors are drawn from Pokemon, types, abilities, generations, regions, or stats appropriate to that question.

## TrainerDex

Recent usability additions include previous/next trainer navigation, retry actions, loading skeletons, and restoration of the last viewed region, game, battle stage, and trainer.

TrainerDex is a browsable dossier of notable in-game trainers, their game-specific teams, matchup analysis, and related TCG cards.

### Trainer catalog

The current catalog contains 143 trainers across:

- Kanto
- Johto
- Hoenn
- Sinnoh
- Unova
- Kalos
- Alola
- Galar
- Paldea
- Lumiose City / Legends: Z-A

Trainers are grouped as:

- Z-A Royale
- Gym Leaders
- Kahunas
- Elite Four
- Champions
- Rivals
- Postgame bosses
- Facility bosses
- Special trainers

The regional selector supports multiple represented games where data is available, such as FireRed/LeafGreen versus HeartGold/SoulSilver Kanto, Emerald versus Omega Ruby/Alpha Sapphire Hoenn, or Sun/Moon versus Ultra Sun/Ultra Moon Alola.

### Search and game variants

- Browse trainers by region and role group.
- Search the complete trainer catalog, not only the selected region.
- Match trainer name, role, division, signature Pokemon, specialty, region, game-specific data, or any Pokemon on an initial or rematch team.
- Jump automatically to the matched trainer's region and default represented game.
- Switch between the games in which a selected trainer is featured.
- Switch between an initial battle and recorded rematch or postgame stages.

Changing game or battle stage updates the trainer's role, team, levels, moves, summary context, and analysis where corresponding data exists.

### Trainer dossier

Each trainer dossier can show:

- Trainer artwork
- Region and represented game
- Role and contextual summary
- Average team level
- Team size
- Declared specialty and actual team types
- Average base stats across the team
- Up to five recommended attacking types

Recommended types are calculated from how many team members each attacking type hits super effectively, with aggregate matchup strength used as a secondary ranking factor. They are matchup suggestions rather than a full battle strategy.

### Team inspection

Every recorded team member can include:

- Pokemon or form label
- Level
- Sprite
- Current types
- Four recorded moves

Pokemon and type data is enriched from PokeAPI when the dossier is opened. If enrichment fails for a member, the locally recorded team entry remains visible.

### TCG integration

- Show up to eight locally cataloged cards whose names match the trainer.
- Prefer trainer cards and cards combining the trainer and one of their team Pokemon.
- Select any team member to browse up to 24 matching Pokemon cards.
- Prefer cards associated with the current trainer, then newer and closer name matches.
- Open every featured card in the shared detailed TCG viewer.

TrainerDex is a curated in-game trainer reference. It does not simulate trainer AI, battle mechanics, held-item effects, or exact damage.

## Persistence summary

| Data | Persistence |
| --- | --- |
| PokeAPI response cache | IndexedDB, with an additional in-memory cache |
| Last station and reduced-motion preference | Browser `localStorage` |
| TCG binder collection and duplicate counts | Browser `localStorage` |
| TCG pull history and last selected set | Browser `localStorage` |
| Who's That Pokemon leaderboard | Browser `localStorage` |
| Active Pokedex selection and entry | Browser `localStorage` |
| Active Who's That Pokemon round | Current React session only |
| Up to 12 named Team Planner teams | Browser `localStorage` |
| Pokemon Quiz best score and streak | Browser `localStorage` |
| TrainerDex selection | Browser `localStorage` |
