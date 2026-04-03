import { createAuthenticationModule } from "@/di/modules/authentication.module";
import { createDatingModule } from "@/di/modules/dating.module";
import { createMessagingModule } from "@/di/modules/messaging.module";
import { createMonitoringModule } from "@/di/modules/monitoring.module";
import type { AppContainer } from "@/di/types";
import { SupabaseDatingProfileRepository } from "@/src/infrastructure/repositories/dating-profile.repository";
import { SupabaseMatchRepository } from "@/src/infrastructure/repositories/match.repository";
import { SupabaseSwipeRepository } from "@/src/infrastructure/repositories/swipe.repository";
import { SupabaseAuthenticationService } from "@/src/infrastructure/services/authentication.service";
import { SupabaseMediaStorageService } from "@/src/infrastructure/services/media-storage.service";
import { StreamRealtimeMessagingService } from "@/src/infrastructure/services/realtime-messaging.service";
import { createSupabaseServerClient } from "@/src/infrastructure/services/supabase-server-client";
import { StreamVideoCallService } from "@/src/infrastructure/services/video-call.service";

export async function createContainer(): Promise<AppContainer> {
  const supabase = await createSupabaseServerClient();

  const monitoring = createMonitoringModule();
  const services = {
    authenticationService: new SupabaseAuthenticationService(supabase),
    mediaStorageService: new SupabaseMediaStorageService(supabase),
    realtimeMessagingService: new StreamRealtimeMessagingService(),
    videoCallService: new StreamVideoCallService(),
    crashReporterService: monitoring.crashReporterService,
    instrumentationService: monitoring.instrumentationService,
    transactionManagerService: monitoring.transactionManagerService,
  };

  const repositories = {
    datingProfileRepository: new SupabaseDatingProfileRepository(supabase),
    swipeRepository: new SupabaseSwipeRepository(supabase),
    matchRepository: new SupabaseMatchRepository(supabase),
  };

  return {
    services,
    repositories,
    controllers: {
      auth: createAuthenticationModule(services, repositories),
      dating: createDatingModule(services, repositories),
      messaging: createMessagingModule(services, repositories),
    },
  };
}
