# Clean Architecture Migration Plan

This document describes how to bring `horse-tinder` in line with the clean-architecture approach.

## Target Architecture

```text
app/                          # Frameworks & Drivers
  actions.ts                  # app-level server actions
  (auth)/actions.ts           # route-group server actions
  _components/                # app-only components
  (routes, pages, layouts, client components)

src/
  application/                # Use cases + contracts
    repositories/
    services/
    use-cases/
      auth/
      dating/
      messaging/

  entities/                   # Domain models and domain errors
    models/
    errors/

  infrastructure/             # Concrete implementations
    repositories/
    services/

  interface-adapters/         # Controllers
    controllers/
      auth/
      dating/
      messaging/

di/
  container.ts
  modules/
  types.ts

tests/
  unit/
    application/
    interface-adapters/
    entities/
```

## Layer Responsibilities

### 1. Entities

Own the domain language and rules. This layer must not import from Next.js, Supabase, Stream, or React. Only zod schema models.

Initial entity models to introduce:

- `User`
- `DatingProfile`
- `DatingPreference`
- `Like`
- `Match`

Initial domain errors to introduce:

- `NotAuthenticatedError`
- `MatchRequiredError`
- `ProfileNotFoundError`
- `InvalidLikeError`

These entities represent the business core of a Tinder clone. They should still make sense even if Supabase, Stream, or Next.js are replaced.

### 2. Application

Own use cases and contracts. This is where business operations are defined.

Initial repository interfaces:

- `DatingProfileRepository`
- `LikeRepository`
- `MatchRepository`

Initial service interfaces:

- `AuthenticationService`
- `MediaStorageService`
- `RealtimeMessagingService`
- `VideoCallService`
- `TransactionManagerService`
- `CrashReporterService`
- `InstrumentationService`

Initial use cases:

- `SignIn`
- `SignUp`
- `SignOut`
- `ConfirmEmail`
- `GetMyDatingProfile`
- `UpdateMyDatingProfile`
- `UploadProfilePhoto`
- `GetDiscoveryFeed`
- `LikeOnProfile`
- `GetMyMatches`
- `CanMessageMatch`
- `CreateOrGetMatchConversation`
- `GetMessagingTokenForCurrentUser`
- `CreateMatchVideoCall`
- `GetVideoCallTokenForCurrentUser`

### 3. Interface Adapters

Own request validation, auth checks at the entry boundary, orchestration, and mapping response DTOs for the UI.

Controllers should:

- accept plain input DTOs
- invoke one or more use cases
- map domain errors to UI-safe results
- return view models that `app/` can consume directly

They should not:

- execute raw Supabase queries
- instantiate Stream clients
- contain JSX or Next-specific APIs

### 4. Infrastructure

Own all SDK calls and external integration details.

Initial repository implementations:

- Supabase dating profile repository
- Supabase swipe repository
- Supabase match repository

Initial service implementations:

- Supabase authentication service
- Supabase storage service
- Stream messaging service
- Stream video-call service
- monitoring and instrumentation services

This layer is where `lib/supabase/client.ts` and `lib/supabase/server.ts` logic should move, likely split into server/browser/session-specific adapters.

### 5. Frameworks & Drivers

`app/`, React components, context providers, and server functions stay here.

This layer should only:

- render UI
- trigger server functions/controllers
- manage local component state
- translate route params and form state into controller input

This layer should not:

- define domain models
- encode business rules
- call Supabase or Stream directly
- build SQL-like query logic

## Proposed Bounded Contexts

Instead of one generic `src/` folder with flat files, structure the migration around product capabilities:

1. `auth`
   - session lookup
   - sign-in/sign-up/sign-out orchestration
   - email confirmation callback handling
   - auth success and error states after email activation

2. `dating`
   - profile retrieval
   - profile editing
   - avatar upload
   - preference management

3. `messaging`
   - matched-user conversation access
   - conversation provisioning for an existing match
   - messaging token generation
   - video call access for an existing match
   - video call session provisioning
   - video token generation

## Concrete Refactor Map

### Move domain types out of pages

Current problem:

- `app/profile/page.tsx` exports types used by `app/chat/[userId]/page.tsx`, `app/matches/page.tsx`, `app/matches/list/page.tsx`, `components/MatchCard.tsx`, and `components/StreamChatInterface.tsx`.

Plan:

- create `src/entities/models/dating-profile.ts`
- create `src/entities/models/dating-preference.ts`
- move `UserProfile` and `UserPreferences` there, renamed to domain-appropriate types such as `DatingProfile` and `DatingPreference`
- replace all imports from `@/app/profile/page` with entity imports

This should be the first refactor because it removes the clearest layer violation with low risk.

### Replace `lib/actions/*` with entrypoints that delegate inward

Current files:

- `lib/actions/profile.ts`
- `lib/actions/matches.ts`
- `lib/actions/stream.ts`

Plan:

- stop treating `lib/actions` as the application layer
- create Next-specific server-function entrypoints matching the reference style:
  - `app/actions.ts` for app-level actions
  - route-group `actions.ts` files where needed, for example `app/(auth)/actions.ts`
- each server function should do little more than:
  - receive input
  - resolve dependencies from `di/`
  - call a controller
  - return a serializable result

The business logic currently inside these files should be split into:

- repository/service implementations in `src/infrastructure`
- use cases in `src/application/use-cases`
- controller orchestration in `src/interface-adapters/controllers`

For auth specifically, add a dedicated callback route instead of redirecting email-confirmation links to `/`.

Flow:

- email link lands on `app/(auth)/callback/page.tsx`
- callback page invokes a thin auth action from `app/(auth)/actions.ts`
- auth controller resolves confirmation and session completion
- UI shows success or error feedback
- then redirects to the appropriate destination such as onboarding, profile, or discover

### Introduce repository and service contracts

Current problem:

- use-flow logic is tied directly to Supabase table access and Stream SDK calls.

Plan:

- define repository interfaces in `src/application/repositories`
- define service interfaces in `src/application/services`
- make use cases depend on those contracts only
- implement those contracts in `src/infrastructure`

Examples:

- `GetDiscoveryFeed` should depend on `AuthenticationService`, `DatingProfileRepository`, `LikeRepository`, and `MatchRepository`
- `LikeOnProfile` should depend on `AuthenticationService`, `LikeRepository`, and `MatchRepository`
- `CreateOrGetMatchConversation` should depend on `AuthenticationService`, `MatchRepository`, and `RealtimeMessagingService`

### Add DI composition

Current problem:

- dependencies are instantiated ad hoc inside server functions and components.

Plan:

- add `di/container.ts`
- add modules such as `di/modules/authentication.module.ts`, `di/modules/dating.module.ts`, `di/modules/messaging.module.ts`, and `di/modules/monitoring.module.ts`
- add `di/types.ts` for container tokens/types
- wire controllers to concrete repositories/services there

This does not need a heavy DI library. Factory functions are enough.

### Pull auth state behind a boundary

Current problem:

- `contexts/auth-context.tsx` depends directly on Supabase browser APIs.

Plan:

- decide whether client-side auth state is truly needed everywhere
- prefer server-side session retrieval for page data where possible
- keep the React context in `app/` as framework code
- hide Supabase session mechanics behind an authentication service

This avoids React components becoming a second application layer.

### Separate view models from entities

Current problem:

- pages and components assume raw database-shaped data is the same as domain data and UI data.

Plan:

- keep entities focused on domain meaning
- introduce DTOs/view models in controllers when UI needs formatting-specific fields
- avoid passing database rows directly into components

Examples:

- discovery cards can receive `DiscoveryCardViewModel`
- matches list can receive `MatchListItemViewModel`
- chat list can receive `ConversationListItemViewModel`
- profile page can receive `DatingProfileViewModel`

### Enforce dependency rules in linting

Add architectural guardrails so the codebase cannot drift back.

Plan:

- install and configure `eslint-plugin-boundaries` or use `no-restricted-imports` as a lighter fallback
- define allowed import directions:
  - `app -> interface-adapters | entities`
  - `interface-adapters -> application | entities`
  - `application -> entities`
  - `infrastructure -> application | entities`
  - `entities -> nothing outside entities`

Also explicitly forbid imports like:

- `components/* -> lib/supabase/*`
- `components/* -> infrastructure/*`
- `application/* -> next/*`
- `application/* -> @supabase/*`
- `application/* -> stream-chat`

### Add tests by layer

Plan:

- unit test entities and use cases first
- integration test infrastructure adapters with mocked SDK boundaries
- keep page/component tests minimal and focused on rendering and interaction

Priority test targets:

1. discovery feed excludes self and already-swiped profiles
2. discovery feed respects dating preferences
3. swipe-right to mutual-match transition
4. only matched users can message or start a call
5. profile update validation

## Recommended Migration Order

Do this incrementally so the app stays working throughout.

### Phase 1: Foundation

- create `src/`, `di/`, and `tests/unit/` using the same layout as the reference repo
- move shared domain types from page files into `src/entities/models`
- add domain errors under `src/entities/errors`
- add lint rules for obvious forbidden imports

Exit criteria:

- no page exports domain types
- components no longer import types from `app/*`

### Phase 2: Dating vertical slice

- migrate dating flow first because it is smaller than messaging
- implement:
  - `DatingProfileRepository`
  - `GetMyDatingProfile`
  - `UpdateMyDatingProfile`
  - `UploadProfilePhoto`
  - dating controllers
- replace `lib/actions/profile.ts` with thin entrypoints

Exit criteria:

- profile pages depend on controllers or `app/actions.ts` entrypoints only
- Supabase profile queries exist only in infrastructure files

### Phase 3: Discovery and match vertical slice

- extract discovery, swipe, and match repositories/use cases
- isolate matchmaking rules from Supabase response shapes
- centralize discovery filtering and mutual-like matching rules

Exit criteria:

- `app/matches/page.tsx` and `app/matches/list/page.tsx` use controller outputs
- `LikeOnProfile` is unit-testable without Next.js or Supabase

### Phase 4: Messaging vertical slice

- extract Stream concerns behind service contracts
- move "matched users only" messaging and calling rules into use cases
- keep Stream SDK initialization in infrastructure only
- keep real-time UI concerns in components

Exit criteria:

- `components/StreamChatInterface.tsx` no longer imports server actions directly
- conversation/call setup live behind controllers and service contracts, with `Match` as the domain gate

### Phase 5: Auth cleanup

- refactor sign-in/sign-up flows into auth controllers/use cases
- revisit whether `/auth` and `/login` should coexist
- unify auth entrypoints and session handling
- add dedicated email-confirmation callback and success/error handling

Exit criteria:

- auth flow has one coherent entry boundary
- session lookup rules are not duplicated across UI files
- email activation does not silently dump the user on `/`

### Phase 6: Hardening

- expand lint boundaries
- add unit and integration tests
- document architecture in `README.md`
- remove obsolete `lib/actions/*` and `lib/helpers/*` leftovers if superseded

Exit criteria:

- architectural boundaries are enforced automatically
- critical use cases have tests
- framework-facing files are thin

## File and Folder End State

```text
app/
  actions.ts
  (auth)/
    actions.ts
    callback/page.tsx
    confirm/page.tsx
    error/page.tsx
    sign-in/page.tsx
    sign-up/page.tsx
  _components/
    providers/
       auth-provider.tsx
       theme-provider.tsx
    ui/
    user-menu.tsx
  global-error.tsx
  layout.tsx
  page.tsx
  discover/page.tsx
  matches/page.tsx
  chat/[userId]/page.tsx
  profile/page.tsx
  profile/edit/page.tsx

src/
  application/
    repositories/dating-profile.repository.interface.ts
    repositories/swipe.repository.interface.ts
    repositories/match.repository.interface.ts
    services/authentication.service.interface.ts
    services/media-storage.service.interface.ts
    services/realtime-messaging.service.interface.ts
    services/video-call.service.interface.ts
    services/crash-reporter.service.interface.ts
    services/instrumentation.service.interface.ts
    services/transaction-manager.service.interface.ts
    use-cases/auth/sign-in.use-case.ts
    use-cases/auth/sign-up.use-case.ts
    use-cases/auth/sign-out.use-case.ts
    use-cases/auth/confirm-email.use-case.ts
    use-cases/dating/get-my-dating-profile.ts
    use-cases/dating/update-my-dating-profile.ts
    use-cases/dating/upload-profile-photo.ts
    use-cases/dating/get-discovery-feed.ts
    use-cases/dating/swipe-on-profile.ts
    use-cases/dating/get-my-matches.ts
    use-cases/messaging/create-or-get-match-conversation.ts
    use-cases/messaging/get-messaging-token-for-current-user.ts
    use-cases/messaging/create-match-video-call.ts
    use-cases/messaging/get-video-call-token-for-current-user.ts

  entities/
    errors/auth.ts
    errors/common.ts
    errors/dating.ts
    models/user.ts
    models/dating-profile.ts
    models/dating-preference.ts
    models/swipe.ts
    models/match.ts
    models/session.ts

  interface-adapters/
    controllers/auth/sign-in.controller.ts
    controllers/auth/sign-up.controller.ts
    controllers/auth/sign-out.controller.ts
    controllers/auth/confirm-email.controller.ts
    controllers/dating/get-my-dating-profile-controller.ts
    controllers/dating/update-my-dating-profile-controller.ts
    controllers/dating/upload-profile-photo-controller.ts
    controllers/dating/get-discovery-feed-controller.ts
    controllers/dating/swipe-on-profile-controller.ts
    controllers/dating/get-my-matches-controller.ts
    controllers/messaging/create-or-get-match-conversation-controller.ts
    controllers/messaging/get-messaging-token-for-current-user-controller.ts
    controllers/messaging/create-match-video-call-controller.ts
    controllers/messaging/get-video-call-token-for-current-user-controller.ts

  infrastructure/
    repositories/dating-profile.repository.ts
    repositories/dating-profile.repository.mock.ts
    repositories/swipe.repository.ts
    repositories/swipe.repository.mock.ts
    repositories/match.repository.ts
    repositories/match.repository.mock.ts
    services/authentication.service.ts
    services/authentication.service.mock.ts
    services/media-storage.service.ts
    services/media-storage.service.mock.ts
    services/realtime-messaging.service.ts
    services/realtime-messaging.service.mock.ts
    services/video-call.service.ts
    services/video-call.service.mock.ts
    services/crash-reporter.service.ts
    services/crash-reporter.service.mock.ts
    services/instrumentation.service.ts
    services/instrumentation.service.mock.ts
    services/transaction-manager.service.ts
    services/transaction-manager.service.mock.ts

di/
  container.ts
  modules/authentication.module.ts
  modules/dating.module.ts
  modules/messaging.module.ts
  modules/monitoring.module.ts
  types.ts
```

## Rules To Treat As Non-Negotiable

To say the project adheres fully to clean architecture, these rules must hold:

1. `app/` never owns domain types or business logic.
2. `application/` never imports from React, Next.js, Supabase, or Stream.
3. `infrastructure/` implements repository and service contracts but is never imported directly by pages/components.
4. controllers are the only entrypoints from the framework layer into the application layer.
5. entities and use cases are unit-testable without framework bootstrapping.
6. lint rules enforce dependency direction.

## Decisions

1. We use thin server Actions

2. Browser auth state
  Browser Client
  Server Client
  Middleware Client

3. Shared UI models
   dedicated View Models / DTOs for each page/feature.

4. Stream ownership
   - Stream conversation/call metadata remains provider-owned

5. Validation strategy
   - ZOD.

## Definition of Done

The migration is complete when:

- all business behavior for discovery, swiping, matching, profile management, and match-gated messaging is represented as use cases
- all external integrations are hidden behind repository and service contracts
- `app/` and React components only depend on controllers, action entrypoints, DTOs, and entities
- no component or page imports from `lib/actions/*`, `lib/supabase/*`, or SDK packages for business flows
- architecture rules are lint-enforced
- critical use cases have unit tests
