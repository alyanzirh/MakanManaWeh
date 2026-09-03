# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Git checkpoint policy

When working through a multi-step implementation plan with a numbered build order (e.g. a "Phase" plan), treat each numbered step — and each individual new file within a "screen-by-screen" or "component-by-component" step — as a commit boundary. After completing each unit of work:

1. Summarize what changed and how you verified it.
2. Commit just that unit of work (one commit per component/screen, not one giant commit at the end).
3. Push to the current branch on GitHub.
4. Wait for explicit go-ahead before starting the next unit.

Never include a `Co-Authored-By` trailer, "Generated with Claude Code" footer, or session-link trailer in any commit message.
