import type { CrashReporterService } from "@/src/application/services/crash-reporter.service.interface";

export class NoopCrashReporterService implements CrashReporterService {
  async capture(error: unknown, context?: Record<string, unknown>) {
    console.error("Captured error", error, context);
  }
}
