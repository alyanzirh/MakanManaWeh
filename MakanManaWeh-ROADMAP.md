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
- [ ] First clean run confirmed in Expo Go (no build errors)
- [ ] App icon + splash screen
- [ ] Apple Developer Program enrollment ($99/yr — required before TestFlight/App Store)

## Phase 1 — Design
*Where: chat with Claude*

- [ ] Finalize visual style (colors, typography, wheel look) — currently
      functional but default/unstyled
- [ ] Sketch onboarding / first-launch flow (location permission priming
      screen before the OS prompt, so users understand why you're asking)
- [ ] Decide on app icon concept and name-in-App-Store

## Phase 2 — Build
*Where: Claude Code, in the MakanManaWeh folder*

- [ ] Confirm the app runs cleanly end-to-end in Expo Go
- [ ] Handle edge cases: zero results, Overpass API down (both mirrors),
      location permission denied, no internet
- [ ] Polish wheel label overlap for 12+ restaurants
- [ ] Add app icon / splash screen assets
- [ ] (Optional) Favorites / recently-picked history
- [ ] (Optional) Dark mode support

## Phase 3 — Test
*Where: your phone (Expo Go), Claude Code for build errors*

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
