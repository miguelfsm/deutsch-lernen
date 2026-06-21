# Deutsch Lernen — Product Requirements Document (PRD)

> **Status:** Canonical reference. Living document.
> **Owner:** Miguel Segurado
> **Last updated:** 2026-06-21

## 1. Overview

**Deutsch Lernen** is a personal web application for learning German. It
consolidates a set of interactive learning tools — originally prototyped as
individual React/JSX components inside Claude chat artifacts — into a single,
navigable, installable app that can be extended over time using Claude Code.

## 2. Background & Context

The project began as a few questions in a chat. Claude generated a first JSX
component that worked well, and it grew organically: more content was added, and
additional standalone JSX tools were created. There are now **4 separate JSX
artifacts**, each for a different learning purpose.

The limiting factor became Claude's artifact preview pane: it renders a single
component in a small, scroll-bound window with no navigation between tools. Some
artifacts now hold so much content that meaningful parts require scrolling to
reach.

The goal of this project is to graduate from disconnected artifacts to one
maintainable application with proper navigation, full-window layout, real
version control, and a path to running it like a native app on iPhone/iPad.

## 3. Goals

- **G1 — Consolidate:** Bring the 4 existing JSX tools into one project, each as
  a navigable section/page.
- **G2 — Navigate:** Provide a navigation shell (sidebar/tabs + routing) so tools
  are reachable without scrolling through a single pane.
- **G3 — Full layout:** Give each tool the full browser viewport so content is
  usable, not cramped.
- **G4 — Extensible by Claude Code:** Structure the project so new tools and
  features can be added iteratively as ordinary code changes with history.
- **G5 — Free hosting:** Deploy as a static site at zero recurring cost.
- **G6 — Installable on mobile:** Run on iPhone/iPad like an app (home-screen
  icon, full-screen, no browser chrome) without App Store friction.

## 4. Non-Goals (for now)

- **NG1 — No backend / accounts:** No user authentication, server, or database in
  the initial scope. Tools are client-side.
- **NG2 — No App Store distribution** initially (revisit via Capacitor later).
- **NG3 — Not a commercial product:** Personal use; free-tier hosting terms are
  acceptable.
- **NG4 — No multi-user / collaboration features.**

## 5. Users

- **Primary:** Miguel — a single learner using the app on desktop, iPhone, and
  iPad.
- **Potential future:** Sharing a read-only public URL with others; not a
  requirement today.

## 6. Functional Requirements

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR1 | Host the 4 existing learning tools, each as its own route/section. | Must |
| FR2 | Navigation shell to switch between tools (sidebar or top tabs). | Must |
| FR3 | A landing/home view listing the available tools. | Must |
| FR4 | Responsive layout that works on desktop, tablet, and phone widths. | Must |
| FR5 | Installable as a PWA (home-screen icon, standalone display). | Must |
| FR6 | Add new tools/pages without restructuring the app. | Must |
| FR7 | Optional offline availability of already-loaded tools. | Should |
| FR8 | Per-tool state persists locally where useful (e.g. progress) via browser storage. | Could |

### 6.1 The four tools (to be confirmed when files are collected)

> _Placeholder — fill in as the JSX files are added._

| Tool | Purpose | Source artifact |
| ---- | ------- | --------------- |
| TBD 1 | TBD | TBD |
| TBD 2 | TBD | TBD |
| TBD 3 | TBD | TBD |
| TBD 4 | TBD | TBD |

## 7. Non-Functional Requirements

- **NFR1 — Cost:** $0 recurring for hosting; free tiers only.
- **NFR2 — Performance:** Fast first load on mobile; static assets on a CDN.
- **NFR3 — Maintainability:** Conventional, well-structured React project that
  Claude Code can navigate and extend safely.
- **NFR4 — Portability:** No lock-in to a single host; deployable to GitHub
  Pages, Cloudflare Pages, Vercel, Netlify, or Azure Static Web Apps without code
  changes.
- **NFR5 — Privacy:** No personal data leaves the device beyond standard static
  hosting/CDN logs.

## 8. Success Criteria

- All 4 tools are reachable from one URL via navigation, each using the full
  viewport.
- The site is deployed and updates automatically on every push to the default
  branch.
- The app can be added to the home screen on iPhone and iPad and launches
  full-screen.
- A new tool can be added by Claude Code as a self-contained route with no
  changes to unrelated tools.

## 9. Future / Out-of-Scope Enhancements

- **Native app via Capacitor** wrapping the same web app (App Store / TestFlight,
  native APIs). Requires Xcode and an Apple Developer account.
- **Offline-first** with full asset caching and background sync.
- **Backend** for cross-device progress sync, spaced-repetition scheduling, or
  AI-assisted exercises (could use Azure Static Web Apps managed Functions).
- **Public sharing** of selected tools.

## 10. Open Questions

- What are the exact 4 tools and their feature sets? (Pending file collection.)
- Do any tools need persistent progress/state across sessions and devices?
- Preferred initial host: GitHub Pages vs Cloudflare Pages/Vercel? (Leaning
  GitHub Pages to start — see Solution Design.)
