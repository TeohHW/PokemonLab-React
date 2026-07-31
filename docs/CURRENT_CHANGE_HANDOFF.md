# Pokemon Lab Current Change Handoff

This document is a copy-ready prompt for reviewing the work currently in the repository. It separates the implemented scope from excluded ideas and provides a regression checklist for comparing the working tree with the previous committed scope.

## Copy-ready review prompt

```text
You are reviewing the current Pokemon Lab React working tree.

Baseline
- Compare the working tree against commit 2b36276:
  "Improve TCG combined search and artwork toggle".
- Include modified tracked files and untracked files.
- Treat the working tree as the proposed implementation. Do not describe an intermediate feature unless it still exists in the final diff.

Review objective
1. Confirm what changed from the baseline.
2. Verify that the implemented behavior matches the scope below.
3. Test regressions in existing station behavior.
4. Identify bugs, inconsistent UI, stale documentation, accessibility issues, and unnecessary complexity.
5. Recommend or implement only changes that support a casual Pokemon utility application.

Implemented scope to verify

Shared application experience
- Hash-based station routes support browser Back/Forward navigation.
- Pokedex Pokemon, TCG sets, and TrainerDex trainers can be restored from their routes.
- The last visited station and route are saved locally and exposed through Home's Continue action.
- Home shows at most four recently viewed Pokemon, trainers, or cards.
- There is no favorites feature or favorites persistence.
- The station menu contains a themed "Limit animations" preference with explanatory help.
- Dialogs trap keyboard focus, close with Escape, restore focus, and lock background scrolling.
- Desktop, tablet, and mobile layouts remain usable without clipped controls or inaccessible content.

Home
- Continue resumes the last station and selected route where supported.
- Recently Viewed shows no more than four items.
- Recent-item buttons visually match their station and the retro application theme.
- Empty Continue or Recently Viewed data does not leave blank panels.

Pokedex
- The last selected Pokedex and Pokemon are restored locally.
- Pokemon routes update without filling browser history with every internal state update.
- Search offers type-ahead suggestions and a custom in-field clear control.
- Previous and Next navigation selects adjacent Pokemon and handles list boundaries.
- Compare Stats can load a second Pokemon and display a readable side-by-side comparison.
- Loading failures expose a useful Retry action.
- Loading skeletons do not cause major layout shifts.
- Generation sprites, level-up moves, and featured TCG cards use progressive disclosure.
- Ability effects remain under the heading "Effect", prefer concise effect text, and avoid encyclopedic analysis.
- Long ability, move, and game-description text is separated into readable paragraphs.
- Slot and Introduced In metadata use one consistent Pokemon-style font and panel treatment.

TCG Simulator
- The last selected set is restored locally and represented in the route.
- Expansion-data failures expose Retry without breaking the rest of the page.
- Binder filters work for All, Owned, Missing, Duplicates, and Latest Pull.
- Reveal All and Skip Animation correctly finish the current reveal and add the cards only once.
- Pack cards can be revealed with pointer, Enter, or Space.
- The selected-set action area remains accessible while scrolling.
- Pull history stores at most ten entries and reports the set, card count, new count, rare names, and time.
- Collection clearing still requires the existing confirmation flow.
- Reference-only products remain non-playable and do not affect binder completion.

Card artwork
- A card back is never used as a replacement for missing or failed front artwork.
- Cards with no usable face image are omitted from galleries.
- Failed image candidates are attempted in order before the card is hidden.
- TrainerDex removes failed cards from its data list so card counts and pagination update.
- A detail dialog closes if its selected card has no usable artwork.
- Intentional face-down card backs in booster-pack reveals still work.

Who's That Pokemon
- Playing does not require an account.
- Easy shows answer choices.
- Normal offers Region, Type, and masked Pokedex hints in order.
- Each Normal hint reduces the available correct-answer score by 0.25, down to 0.25.
- Hard provides no hints.
- Ten-round sessions end with a summary; Endless continues normally.
- The local leaderboard, pause flow, region changes, and leave confirmations still work.

Pokemon Quiz
- Playing does not require an account.
- Easy, Normal, and Hard show two, three, and four choices respectively.
- Ten-question, twenty-question, and Endless sessions work.
- Finite sessions stop at the selected length and show score, accuracy, and category results.
- Best score and best streak persist locally.
- Auto-continue does not advance beyond the end of a finite session.
- Changing the pool, category, difficulty, or session length resets the active quiz safely.

Team Planner
- Users can create, name, save, load, update, and delete up to twelve local teams.
- Existing single-team local persistence remains compatible with the current planner snapshot.
- Build and Analysis tabs separate editing from team guidance.
- The tab row has no green enclosing border.
- Per-member build options are collapsed by default but remain keyboard accessible.
- Existing team generation, legality checks, move selection, nature selection, recommendations, suggested swaps, and undo behavior still work.

TrainerDex
- The selected trainer, represented game, and battle stage restore locally.
- Trainer routes open the intended trainer.
- Previous and Next browse valid adjacent trainers and respect boundaries.
- The trainer hero, toolbar, featured games, description, and statistics remain aligned at desktop and mobile widths.
- Trainer descriptions use readable body typography.
- Data failures expose Retry and loading states use skeleton feedback.
- Trainer and team-member card galleries remove unusable artwork and maintain correct pagination.

Explicitly excluded scope
- Do not add a favorites feature.
- Do not add cross-station copy actions.
- Do not add held-item recommendations, EV/IV editors, Tera editors, damage calculations, or battle simulation.
- Do not add team import/export, share codes, or downloadable team images.
- Do not add an account requirement.
- Do not add a shared seeded Daily Quiz.
- Do not add a daily silhouette challenge or streak.
- Do not add "Copy team to Team Planner" from TrainerDex.

Required automated checks
- Run `npm run build`.
- Run `npm run lint`.
- Run `git diff --check`.
- Report build errors, lint errors, warning counts, and bundle-size warnings separately.
- The repository currently has no automated test script; do not claim automated behavioral coverage.

Required manual test matrix

Run the app with `npm run dev` and test at representative desktop, tablet, and mobile widths.

1. Routing and restoration
   - Open every station directly by hash.
   - Open a routed Pokemon, set, and trainer.
   - Use Back and Forward.
   - Reload and confirm supported selections restore.
   - Confirm Home's Continue action resumes the correct route.

2. Local state
   - Test with empty localStorage.
   - Test with existing collection, leaderboard, team, quiz-best, and app-state data.
   - Confirm recent entries deduplicate and Home displays only four.
   - Confirm no favorites UI or favorites behavior remains.

3. Dialog accessibility
   - Open each major dialog.
   - Confirm initial focus, Tab and Shift+Tab containment, Escape closing, focus restoration, and background scroll lock.
   - Confirm nested card dialogs do not leave focus or scroll state stuck.

4. Reduced motion
   - Test the in-app Limit animations setting on and off.
   - Test with the operating system reduced-motion preference.
   - Confirm content and game outcomes are unchanged when animation is limited.

5. Pokedex
   - Search by name, number, suggestion, and supported alias.
   - Test the in-field clear button and the larger reset action.
   - Browse Previous and Next at the start, middle, and end of the list.
   - Compare two Pokemon and trigger a failed comparison lookup.
   - Inspect short and historically verbose ability effects.
   - Inspect a long move effect and game description.
   - Exercise sprites, forms, evolution links, cries, moves, and featured cards.

6. TCG
   - Search sets and cards.
   - Open one pack, ten packs, a random pack, and a God Pack.
   - Test normal reveal, Reveal All, and Skip Animation.
   - Confirm cards are not added twice.
   - Exercise every binder filter and both sort modes.
   - Verify latest-pull filtering and ten-entry pull-history truncation.
   - Test active-set clear and clear-all confirmation.
   - Verify reference-only products cannot open packs.

7. Missing artwork
   - Simulate a failed face-image URL in Pokedex, TCG, Who's That Pokemon, and TrainerDex card galleries.
   - Confirm no replacement card back appears.
   - Confirm the failed tile is omitted.
   - Confirm TrainerDex pagination/counts update.
   - Confirm a failed detail image closes the detail dialog.
   - Confirm unopened booster cards still show the intentional back.

8. Casual games
   - Complete Easy, Normal, and Hard Who's That Pokemon rounds.
   - Use zero, one, and all three Normal hints and verify scoring.
   - Finish a ten-round session and test Endless mode.
   - Complete quiz sessions at all three difficulties.
   - Finish ten- and twenty-question sessions and test Endless.
   - Verify personal-best and leaderboard persistence after reload.

9. Team Planner
   - Build and edit a six-Pokemon team.
   - Save multiple named teams, update one, load another, delete one, and start a new team.
   - Verify the twelve-team cap.
   - Switch between Build and Analysis.
   - Expand and collapse member build options with pointer and keyboard.
   - Exercise meta fill, random fill, champion fill, legality feedback, recommendations, swaps, and undo.

10. Responsive and content review
   - Test around 1200 px, 900 px, 760 px, and 640 px breakpoints.
   - Confirm mobile filter toggles expose all controls.
   - Check long trainer names, long ability text, card grids, navigation toolbars, and dialogs for clipping.
   - Confirm recently viewed buttons and all new controls use the application's visual language.
   - Compare README screenshots and walkthroughs with the current UI and flag stale media.

Known non-blocking items to report separately
- Vite currently warns that the main JavaScript chunk exceeds 500 kB after minification.
- ESLint currently reports `react-refresh/only-export-components` warnings in `stationShared.jsx`.
- Existing screenshots and GIF walkthroughs may need refreshing if their flows or layouts no longer match.

Expected review output
- Start with an overall pass/fail assessment.
- List verified changes by station.
- List automated-check results.
- List manual scenarios tested and the viewport/browser used.
- Separate confirmed defects from optional polish.
- For every defect include severity, reproduction steps, expected result, actual result, and affected file or component.
- Identify documentation or screenshot updates separately.
- Do not expand the application beyond the explicit scope without approval.
```

## Maintainer note

The detailed description of the application as it currently exists is maintained in [`STATION_FEATURES.md`](STATION_FEATURES.md). Update both documents when the implemented scope changes so the review prompt does not drift from the application.
