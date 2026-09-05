# MakanManaWeh — Roadmap

A decision-wheel app for picking a nearby restaurant: filter by search radius,
wheel size, and cuisine, then spin. Built with Expo/React Native, using the
free, keyless OpenStreetMap Overpass API for restaurant data.

## Current status (as of this doc)

- [x] Feature set defined: radius / cuisine / restaurant-count filters + spin wheel
- [x] Core screens built: main wheel screen, filter sheet, result card
- [x] Rewritten from native SwiftUI to Expo/React Native (Windows-only dev, no Mac)
- [x] Restaurant search via Overpass API, no API key required
- [x] Project scaffolded (`create-expo-app`), dependencies installed
- [x] Renamed and rebranded to MakanManaWeh throughout
- [x] Claude Code connected to the project folder via Claude Desktop
- [x] First clean run confirmed in Expo Go (no build errors)
- [x] App icon + splash screen
- [ ] Apple Developer Program enrollment ($99/yr — required before TestFlight/App Store)

## Phase 1 — Design
*Where: chat with Claude*

- [x] Finalize visual style (colors, typography, wheel look) — design tokens
      in `src/theme/theme.ts`, Fredoka/Quicksand type, mascot-based icon set
- [x] Sketch onboarding / first-launch flow (location permission priming
      screen before the OS prompt, so users understand why you're asking)
- [x] Decide on app icon concept and name-in-App-Store — mascot icon
      (`src/components/Mascot.tsx`), cropped tight on cream rounded-square

## Phase 2 — Build
*Where: Claude Code, in the MakanManaWeh folder*

- [x] Confirm the app runs cleanly end-to-end in Expo Go — all 7 screens +
      PermissionDeniedScreen built and reviewed live in Expo Go, screen by screen
- [x] Handle edge cases: zero results (EmptyScreen), Overpass API down
      (both mirrors tried in `restaurantSearch.ts`), location permission
      denied (PermissionDeniedScreen, auto-detects when granted later)
- [x] Polish wheel label overlap for 12+ restaurants — resolved by swapping
      the pie wheel for a reel mechanic (`DecorativeWheel`/`Reel`), which has
      no per-slice legibility limit; wheelSize caps raised to 6/10/15
- [x] Add app icon / splash screen assets — mascot-based icon, adaptive
      icon, splash, and favicon all replaced from Expo defaults

## Phase 3 — Test
*Where: your phone (Expo Go), Claude Code for build errors*

> Note: Expo Go shows its own "Experience needs permission" relay prompt on
> top of the real OS permission dialog. If a permission check keeps reading
> `denied` even after Settings is correctly set, check whether Expo Go's own
> relay prompt was also approved — this layer doesn't exist in a standalone/
> EAS build, so it's a testing-only artifact.

- [ ] Manual pass through every filter combination
- [ ] Test in an actual dense city area vs. a sparse suburb — OSM coverage
      varies a lot by region
- [ ] Test with location permission denied, and with it revoked mid-use
- [ ] (Optional) Add Jest unit tests for pure logic (haversine distance,
      cuisine tag matching) — `jest-expo` is the standard setup

## Phase 4 — Deploy
*Where: terminal / Claude Code, App Store Connect*

- [ ] Enroll in the Apple Developer Program
- [ ] `eas build --platform ios` — cloud-compiled, no Mac needed
- [ ] Internal TestFlight round (yourself, maybe a few friends)
- [ ] App Store Connect listing: screenshots, description, privacy
      nutrition label (declare location use)
- [ ] `eas submit --platform ios` → App Store review

## Phase 5 — Review & Iterate
*Where: chat with Claude, for planning the next cycle*

- [ ] Watch real usage / feedback after launch
- [ ] Use `eas update` for JS-only fixes — ships over-the-air, no new App
      Store review needed
- [ ] Revisit this roadmap, add the next batch of features

## Future Enhancements

Not scheduled to a phase yet — ideas to pull in during Phase 5 review.

- [ ] Favorites / recently-picked history
- [ ] Dark mode support — currently light-only
      (`userInterfaceStyle: "light"` in app.json)
- [ ] **"Pick your N" swap/review screen** — designed (Turn 9 concept,
      `MakanManaWeh-design/handoff-to-cc/project/MakanManaWeh Concepts.dc.html`)
      but not wired into the app. Only triggers when the search returns more
      restaurants than the wheel-size cap (e.g. 15 found, "some" caps at 10)
      — lets the user swap which ones land on the wheel before spinning,
      via a checklist UI (icon circle, name, cuisine · distance, live
      count like "8 / 8"). See `turn13-final-screens.png` in the design
      folder for how it fits alongside the 7 shipped screens.
