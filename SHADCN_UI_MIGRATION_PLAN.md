# Shadcn UI Migration Plan

## Goal

Move the application to a shadcn-first UI architecture so that most user-facing interface elements are composed from shadcn primitives and patterns instead of one-off Tailwind markup.

The target is not only visual consistency. The target is also:

- reusable layout and state components
- consistent interaction patterns
- simpler future UI changes
- a stronger mobile story
- better accessibility defaults through Radix/shadcn components

## Current State Summary

The repository already has part of the shadcn foundation in place:

- `components.json` is configured for shadcn
- `app/globals.css` already defines tokenized theme variables
- a small set of `app/_components/ui/*` primitives already exists

However, the application is still mostly custom Tailwind UI:

- auth pages use manual labels, inputs, buttons, and layout wrappers
- navigation is hand-built and not responsive enough
- profile screens are large blocks of bespoke markup
- match/discovery screens use custom cards, state views, and notification overlays
- chat surfaces use hand-rolled message layout, composer, and call prompts
- the same loading, empty, and error patterns are repeated across many pages

## Important Finding

The existing form helper layer is not ready for use as-is.

- `app/_components/ui/field.tsx` imports `@/app/lib/utilstils`
- this path is incorrect and must be fixed before that component can be adopted broadly

This should be the first repair before any larger migration.

## TSX Audit

### Existing shadcn primitives

- `app/_components/ui/button.tsx`
- `app/_components/ui/card.tsx`
- `app/_components/ui/input.tsx`
- `app/_components/ui/label.tsx`
- `app/_components/ui/navigation-menu.tsx`
- `app/_components/ui/separator.tsx`
- `app/_components/ui/field.tsx` (currently broken import)

### App pages using mostly bespoke UI

- `app/page.tsx`
- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/sign-up/page.tsx`
- `app/(auth)/confirm/page.tsx`
- `app/(auth)/error/page.tsx`
- `app/global-error.tsx`
- `app/matches/page.tsx`
- `app/matches/list/page.tsx`
- `app/chat/page.tsx`
- `app/chat/[userId]/page.tsx`
- `app/profile/page.tsx`
- `app/profile/edit/page.tsx`

### Shared components using bespoke UI

- `components/Navbar.tsx`
- `components/MatchCard.tsx`
- `components/MatchButtons.tsx`
- `components/MatchNotification.tsx`
- `components/PhotoUpload.tsx`
- `components/ChatHeader.tsx`
- `components/StreamChatInterface.tsx`
- `components/VideoCall.tsx`

## Repeated UI Patterns That Should Be Standardized

These patterns currently appear in multiple files and should become reusable app-level components built on top of shadcn:

- page background shell with gradient and centered container
- page header with title and subtitle
- loading state with spinner and helper text
- empty state with icon, message, and CTA
- generic error state with retry/back action
- section card wrappers
- action rows
- avatar + text list rows
- form section blocks
- dialog/sheet overlays

## Missing Shadcn Components To Add

To make the app truly shadcn-heavy, the current set of primitives is too small.

Recommended additions:

- `avatar`
- `badge`
- `alert`
- `textarea`
- `select`
- `checkbox`
- `dialog`
- `sheet`
- `scroll-area`
- `tabs`
- `progress`
- `skeleton`
- `tooltip`
- `dropdown-menu`
- `alert-dialog`

Optional but likely useful:

- `slider`
- `toast` or `sonner`
- `popover`
- `hover-card`

## Migration Strategy

The migration should happen in layers. Do not restyle screen-by-screen without first fixing the base system, or the result will stay inconsistent.

### Phase 1: Foundation Repair

Scope:

- fix `app/_components/ui/field.tsx`
- verify existing `button`, `card`, `input`, `label`, `separator`, `navigation-menu`
- add missing shadcn components listed above
- introduce a small app-specific design layer using shadcn primitives

New reusable app components to create:

- `app/_components/page-shell.tsx`
- `app/_components/page-header.tsx`
- `app/_components/loading-state.tsx`
- `app/_components/empty-state.tsx`
- `app/_components/error-state.tsx`
- `app/_components/section-card.tsx`

Outcome:

- all screens can compose from the same shell and state views
- visual drift drops immediately

### Phase 2: Global Navigation

Target:

- `components/Navbar.tsx`

Changes:

- use shadcn navigation patterns instead of custom links
- add a proper mobile menu using `Sheet`
- use `Button` for primary/sign-out actions
- use active-state styling based on theme tokens instead of page-specific link colors
- make the top bar visually match the rest of the app surfaces

Outcome:

- consistent chrome across desktop and mobile

### Phase 3: Auth and Error Surfaces

Targets:

- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/sign-up/page.tsx`
- `app/(auth)/confirm/page.tsx`
- `app/(auth)/error/page.tsx`
- `app/global-error.tsx`

Changes:

- use `Card`, `CardHeader`, `CardContent`, `CardFooter`
- use `Label`, `Input`, `Button`
- use `Alert` for error display
- move auth pages onto a shared auth shell
- tighten spacing, hierarchy, and CTA treatment

Outcome:

- the first-run experience immediately reflects the new design system

### Phase 4: Landing Page

Target:

- `app/page.tsx`

Changes:

- replace raw links with `Button` variants
- use a structured hero with card-style content areas
- keep the strong visual identity, but align with theme tokens and shared shell patterns

Outcome:

- homepage matches the rest of the product instead of feeling separate

### Phase 5: Discovery and Matches

Targets:

- `app/matches/page.tsx`
- `app/discover/page.tsx` (currently re-exporting matches)
- `app/matches/list/page.tsx`
- `components/MatchCard.tsx`
- `components/MatchButtons.tsx`
- `components/MatchNotification.tsx`

Changes:

- rebuild discovery card as a shadcn-driven feature card
- replace bespoke like/pass controls with icon `Button`s
- show feed progress with `Progress`
- replace floating custom match notification with `Dialog` or toast
- rebuild matches list using `Card`, `Avatar`, `Badge`, `Button`
- standardize loading, empty, and exhausted-feed states

Outcome:

- swipe flow becomes the app’s main visual showcase while staying systemized

### Phase 6: Profile View

Target:

- `app/profile/page.tsx`

Changes:

- use `Avatar` for profile photo
- convert major areas into `SectionCard`s
- use `Separator` and data rows instead of manual label/value blocks
- use `Badge` for profile traits or status where appropriate
- convert quick actions into shadcn action items or buttons

Outcome:

- profile page reads as structured product UI, not a static layout block

### Phase 7: Profile Edit Form

Target:

- `app/profile/edit/page.tsx`
- `components/PhotoUpload.tsx`

Changes:

- move to shadcn form primitives
- replace raw inputs and select with `Input`, `Textarea`, `Select`, `Checkbox`
- consider `Slider` for distance and age-range interactions if it improves UX
- display validation or request failures in `Alert`
- make photo upload integrate with `Avatar` and `Button`
- break the page into distinct form sections

Outcome:

- this becomes the canonical app form implementation

### Phase 8: Messaging List

Target:

- `app/chat/page.tsx`

Changes:

- rebuild conversation list with `Card`, `Avatar`, `Badge`, and better row structure
- standardize empty and loading states
- use shared page shell and header components

Outcome:

- messages page aligns with profile/matches instead of using separate patterns

### Phase 9: Conversation Surface

Targets:

- `app/chat/[userId]/page.tsx`
- `components/ChatHeader.tsx`
- `components/StreamChatInterface.tsx`
- `components/VideoCall.tsx`

Changes:

- use shadcn `Avatar`, `Button`, `ScrollArea`, `Dialog`, `Alert`
- rebuild the message composer with `Input` and icon button patterns
- refactor incoming call prompt into `Dialog`
- standardize loading and error blocks
- keep Stream SDK functionality intact while replacing only the surrounding interface layer

Outcome:

- the chat experience becomes visually consistent with the rest of the app without risking messaging logic

## Visual Direction

The app already has a warm, romantic color base in its tokens. That should stay.

What should change:

- reduce arbitrary gray and hard-coded color usage in page code
- use token-driven `bg-background`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`
- reserve gradients for hero areas, premium actions, and discovery moments
- stop using page-by-page custom color behavior for links and buttons
- use card surfaces and layered containers more consistently

Design principles:

- stronger hierarchy
- fewer one-off styles
- cleaner mobile layouts
- deliberate motion only where it adds value
- UI should feel like one product, not several separate experiments

## Concrete Refactor Map

### Highest priority files

- `app/_components/ui/field.tsx`
- `components/Navbar.tsx`
- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/sign-up/page.tsx`
- `app/profile/edit/page.tsx`
- `app/matches/page.tsx`
- `components/StreamChatInterface.tsx`

### Best candidates for immediate replacement with shadcn primitives

- raw `<button>` to `Button`
- raw `<input>` to `Input`
- raw `<label>` to `Label` or `FieldLabel`
- custom white boxes to `Card`
- custom overlays to `Dialog` or `Sheet`
- custom list wrappers to `Card` + `Separator`

### Areas where app-specific wrappers are preferable

- page shells
- empty states
- loading states
- form section layout
- profile metadata rows
- conversation list rows

## Risks and Constraints

- the repo uses a Next.js version with local project guidance to consult local docs before framework-specific changes
- production build should not be the default verification path
- chat and video-call screens depend on Stream SDK behavior, so UI refactors there should avoid logic rewrites unless needed
- some current UI classes imply dark mode handling, but there is no obvious full dark-mode control flow in the audited files; consistency should be checked before expanding dark variants

## Verification Plan

Per repository instructions, routine verification should be:

- `./node_modules/.bin/eslint .`
- `./node_modules/.bin/tsc --noEmit`

Recommended working rhythm:

1. finish one migration phase
2. run eslint
3. run tsc
4. fix regressions immediately
5. move to the next phase

## Recommended Execution Order

1. Repair and expand the shadcn component foundation.
2. Create shared app-shell and state components.
3. Refactor navbar and auth surfaces.
4. Refactor profile view and profile edit.
5. Refactor discovery and matches.
6. Refactor messages list.
7. Refactor conversation and video-call overlays.
8. Remove leftover duplicated Tailwind patterns and consolidate.

## Definition of Done

The migration is complete when:

- most interactive UI elements are built from shadcn primitives
- page shells and state views are shared instead of duplicated
- bespoke buttons/inputs/cards/dialog-like overlays are mostly eliminated
- navigation works cleanly on desktop and mobile
- forms use the same field structure throughout the app
- loading, empty, and error states are visually consistent
- eslint and TypeScript pass

## Recommended First Implementation Batch

If this plan is executed incrementally, the best first batch is:

- fix `app/_components/ui/field.tsx`
- add missing shadcn primitives
- build shared `PageShell`, `PageHeader`, `LoadingState`, `EmptyState`, `ErrorState`
- refactor `Navbar`
- refactor sign-in and sign-up

That batch creates the base system without touching the most fragile business flows first.
