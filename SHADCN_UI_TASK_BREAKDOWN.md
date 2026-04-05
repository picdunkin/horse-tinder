# Shadcn UI Task Breakdown

## How to use this file

Work top to bottom.

Do not try to redesign the whole app at once.

For each task:

1. make the change
2. run:
   - `./node_modules/.bin/eslint .`
   - `./node_modules/.bin/tsc --noEmit`
3. fix errors before moving on

If a task feels too big, stop and split it into one file at a time.

## Phase 1: Fix the Foundation

- [x] Task 1. Fix the broken import

File:

- `app/_components/ui/field.tsx`

What to do:

- find the bad import: `@/app/lib/utilstils`
- replace it with the correct utils import

Why:

- this component cannot be reused safely until it compiles correctly

Done when:

- TypeScript no longer complains about this file

- [x] Task 2. Read the existing UI primitives

Files:

- `app/_components/ui/button.tsx`
- `app/_components/ui/card.tsx`
- `app/_components/ui/input.tsx`
- `app/_components/ui/label.tsx`
- `app/_components/ui/navigation-menu.tsx`
- `app/_components/ui/separator.tsx`

What to do:

- open each file
- understand how they are supposed to be used
- do not edit them yet unless something is clearly broken

Why:

- you need to know what building blocks already exist before adding more

Done when:

- you can explain when to use `Button`, `Card`, `Input`, and `Label`

- [x] Task 3. Add missing shadcn components

Components to add first:

- `avatar`
- `badge`
- `alert`
- `textarea`
- `select`
- `checkbox`
- `dialog`
- `sheet`
- `scroll-area`
- `progress`
- `skeleton`

What to do:

- add these using the repo’s shadcn setup
- place them in `app/_components/ui/`

Why:

- most app screens need these before they can be migrated cleanly

Done when:

- the files exist
- imports work
- lint and TypeScript pass

## Phase 2: Create Shared App Wrappers

- [x] Task 4. Create a reusable page shell

Suggested file:

- `app/_components/page-shell.tsx`

What it should do:

- render the page background
- center content
- provide consistent padding and max width

Why:

- many pages repeat the same container and gradient classes

Done when:

- at least one page can use this wrapper

- [x] Task 5. Create a reusable page header

Suggested file:

- `app/_components/page-header.tsx`

What it should accept:

- `title`
- `description`
- optional actions

Why:

- many pages repeat a title plus subtitle block

Done when:

- the component renders a consistent heading section

- [x] Task 6. Create reusable state components

Suggested files:

- `app/_components/loading-state.tsx`
- `app/_components/empty-state.tsx`
- `app/_components/error-state.tsx`

What to do:

- build these on top of shadcn `Card`, `Button`, `Alert`, `Skeleton`, or basic token classes

Why:

- loading, empty, and error screens are currently repeated all over the app

Done when:

- at least one existing page uses each new state component

## Phase 3: Easy Wins First

- [x] Task 7. Refactor the sign-in page

File:

- `app/(auth)/sign-in/page.tsx`

What to replace:

- raw `<input>` with `Input`
- raw `<label>` with `Label`
- raw `<button>` with `Button`
- layout wrapper with `Card`
- plain error text with `Alert`

Why:

- this is a small screen and a good first shadcn conversion

Done when:

- the page still signs in correctly
- the UI uses shadcn primitives instead of hand-written controls

- [ ] Task 8. Refactor the sign-up page

File:

- `app/(auth)/sign-up/page.tsx`

What to do:

- repeat the same approach as sign-in

Why:

- the code is almost the same, so it is good practice after sign-in

Done when:

- sign-up matches sign-in visually and structurally

- [ ] Task 9. Refactor confirm and auth error pages

Files:

- `app/(auth)/confirm/page.tsx`
- `app/(auth)/error/page.tsx`
- `app/global-error.tsx`

What to do:

- use `Card`
- use `Button`
- use `Alert` where it makes sense

Why:

- these pages are simple and help make the app feel consistent quickly

Done when:

- all auth-related pages feel like one system

## Phase 4: Navbar

- [ ] Task 10. Refactor desktop navbar

File:

- `components/Navbar.tsx`

What to do:

- replace custom action button styles with `Button`
- use the existing shadcn navigation menu where appropriate
- clean up active and hover states

Why:

- navbar is visible everywhere, so this improves the entire app at once

Done when:

- nav links and auth actions use shared styles

- [ ] Task 11. Add mobile navigation

File:

- `components/Navbar.tsx`

What to add:

- a hamburger button
- a `Sheet` for mobile navigation

Why:

- current navbar mostly assumes desktop

Done when:

- navigation works on small screens

## Phase 5: Profile Screens

- [ ] Task 12. Refactor profile view page

File:

- `app/profile/page.tsx`

What to replace:

- custom profile container with `Card`
- profile image with `Avatar`
- manual sections with reusable cards or section wrappers
- plain label/value rows with better structure

Why:

- this page is read-only, so it is less risky than the edit form

Done when:

- profile data is displayed with consistent cards and spacing

- [ ] Task 13. Refactor the profile edit page header and layout first

File:

- `app/profile/edit/page.tsx`

What to do:

- do not refactor the entire form in one commit
- first convert only:
  - page shell
  - page header
  - outer form card

Why:

- this reduces risk and gives you a stable base

Done when:

- the page layout is cleaner, even if fields are still old

- [ ] Task 14. Refactor basic text fields

File:

- `app/profile/edit/page.tsx`

Fields:

- full name
- username
- bio

What to do:

- use `Field`, `FieldLabel`, `Input`, `Textarea`

Why:

- these are the simplest form controls

Done when:

- those fields no longer use raw HTML controls with custom classes

- [ ] Task 15. Refactor select and date inputs

File:

- `app/profile/edit/page.tsx`

Fields:

- gender
- birthdate

What to do:

- use shadcn `Select` for gender
- use the best fit for birthdate based on current setup

Why:

- this introduces more advanced form controls gradually

Done when:

- those controls visually match the rest of the form

- [ ] Task 16. Refactor preferences section

File:

- `app/profile/edit/page.tsx`

Fields:

- age min
- age max
- distance
- interested in

What to do:

- convert number inputs to `Input`
- convert interest toggles to `Checkbox`
- optionally use `Slider` later if you are comfortable

Why:

- this section has the most repeated custom field styling

Done when:

- the full form uses shared field components

- [ ] Task 17. Refactor photo upload styling

Files:

- `app/profile/edit/page.tsx`
- `components/PhotoUpload.tsx`

What to do:

- show the image using `Avatar`
- style the upload trigger using `Button`

Why:

- upload UI should match the rest of the system

Done when:

- photo area looks like part of the same design system

## Phase 6: Discovery and Matches

- [ ] Task 18. Refactor the discovery page shell and states

File:

- `app/matches/page.tsx`

What to do first:

- replace loading screen with `LoadingState`
- replace “no more profiles” with `EmptyState`
- replace back button with `Button`

Why:

- do the safe structural work before touching the swipe card

Done when:

- top-level states are standardized

- [ ] Task 19. Refactor match action buttons

File:

- `components/MatchButtons.tsx`

What to do:

- rebuild using `Button`
- use icon buttons or circular variants

Why:

- these are currently fully custom buttons

Done when:

- the component uses shadcn button primitives

- [ ] Task 20. Refactor match card

File:

- `components/MatchCard.tsx`

What to do:

- keep the image-heavy visual style
- use shadcn card structure where possible
- avoid overcomplicating it

Why:

- this is the most unique screen, so preserve the product feel

Done when:

- card structure is more reusable and easier to maintain

- [ ] Task 21. Replace match notification

File:

- `components/MatchNotification.tsx`

What to do:

- replace custom floating box with either:
  - `Dialog`
  - toast-based notification

Why:

- this is currently a one-off overlay

Done when:

- the match success UI uses a standard pattern

- [ ] Task 22. Refactor matches list page

File:

- `app/matches/list/page.tsx`

What to do:

- use `Card`, `Avatar`, `Badge`, `Button`
- use shared empty state

Why:

- this page is simpler than chat and good practice for list UIs

Done when:

- each match row uses reusable components

## Phase 7: Chat Screens

- [ ] Task 23. Refactor the chat list page

File:

- `app/chat/page.tsx`

What to do:

- use shared page shell and header
- use `Card`, `Avatar`, and `Badge`
- use shared loading and empty states

Why:

- it is a list page, so it should be easier than the live conversation screen

Done when:

- the messages page matches the new profile/matches UI style

- [ ] Task 24. Refactor chat header

File:

- `components/ChatHeader.tsx`

What to do:

- use `Avatar`
- use `Button` for back and video actions

Why:

- this is a contained component and a low-risk improvement

Done when:

- no raw custom-styled buttons remain in the header

- [ ] Task 25. Refactor message area carefully

File:

- `components/StreamChatInterface.tsx`

What to do first:

- replace composer input/button with `Input` and `Button`
- use `ScrollArea` if it integrates cleanly
- keep messaging logic untouched

Why:

- this file has business logic; do not mix UI refactor with logic changes

Done when:

- sending messages still works exactly the same

- [ ] Task 26. Refactor incoming call prompt

File:

- `components/StreamChatInterface.tsx`

What to do:

- replace the custom call popup with `Dialog`

Why:

- dialogs are exactly what shadcn is good at

Done when:

- accept and decline still work
- overlay code is simpler

- [ ] Task 27. Refactor video call loading and error states

File:

- `components/VideoCall.tsx`

What to do:

- replace hand-built error/loading blocks with shared state components or shadcn cards/buttons

Why:

- this improves consistency without changing Stream call logic

Done when:

- all non-video UI in this file matches the rest of the app

## Final Cleanup

- [ ] Task 28. Remove leftover duplicated patterns

What to look for:

- repeated gradient page wrappers
- repeated loading spinners
- repeated empty-state blocks
- repeated raw form control classes
- repeated custom white card classes

Why:

- migration is not done if duplication stays everywhere

Done when:

- most pages use shared app components and shadcn primitives

- [ ] Task 29. Final review pass

What to do:

- click through all pages
- check desktop and mobile layouts
- confirm buttons, spacing, and typography feel consistent

Why:

- the goal is one coherent product, not just “uses shadcn somewhere”

Done when:

- the UI feels unified across auth, profile, discovery, matches, and chat

## Suggested Beginner Order

If you want the safest order, do this:

1. Task 1
2. Task 3
3. Task 4
4. Task 5
5. Task 6
6. Task 7
7. Task 8
8. Task 9
9. Task 10
10. Task 12
11. Task 13
12. Task 14
13. Task 15
14. Task 16
15. Task 18
16. Task 19
17. Task 22
18. Task 23
19. Task 24
20. Task 25
21. Task 26
22. Task 27
23. Task 20
24. Task 21
25. Task 28
26. Task 29

## Good Rule While Working

If a file has UI and business logic mixed together:

- first replace layout and styling only
- do not rewrite behavior unless the behavior is broken

That rule will save you from a lot of accidental regressions.
