# MakanManaWeh 🎡

A decision-wheel app for picking a nearby restaurant when you can't decide where to eat. Set a search radius and cuisine, spin the wheel, and let it choose for you.

## How it works

1. **Onboarding** — quick intro to what the app does.
2. **Location permission** — asked with context up front, before the OS prompt.
3. **Setup** — pick a search radius, wheel size (number of restaurants), and cuisine filter.
4. **Search** — nearby restaurants are pulled from OpenStreetMap (via the free, keyless Overpass API) within your filters.
5. **Spin** — restaurants land on a spinning wheel/reel.
6. **Result** — see the winner, open it in Maps, spin again, or adjust your filters.

Edge cases are handled explicitly: zero results for the current filters, location permission denied (with a way to retry), and returning users who already granted permission skip straight past the ask.

## Tech stack

- [Expo](https://docs.expo.dev/versions/v54.0.0/) / React Native (~54), TypeScript
- [Expo Location](https://docs.expo.dev/versions/v54.0.0/sdk/location/) for foreground location
- [OpenStreetMap Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) for restaurant data — no API key required
- `react-native-svg` for the wheel graphics, `expo-linear-gradient` for the visual polish
- Fredoka / Quicksand via `@expo-google-fonts`

## Getting started

```bash
npm install
npm start
```

Then scan the QR code with **Expo Go** on your phone (iOS/Android), or press `i` / `a` in the terminal for a simulator/emulator.

```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # web (limited — location/wheel UX is built for mobile)
```

## Project structure

```
App.tsx                   # screen-state machine driving the whole flow
src/screens/               # one component per screen (Onboarding, Setup, Spin, Result, …)
src/components/            # DecorativeWheel, Reel, Mascot, FadeIn transition
src/hooks/                 # useFilters, useLocation, useWheel
src/services/               # Overpass API restaurant search
src/theme/                  # colors, typography, component tokens
```

## Status

Actively in development — see [MakanManaWeh-ROADMAP.md](./MakanManaWeh-ROADMAP.md) for the current build phase and what's next (App Store deployment, tests, optional features).
