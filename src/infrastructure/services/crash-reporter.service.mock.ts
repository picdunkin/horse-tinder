import type { CrashReporterService } from "@/src/application/services/crash-reporter.service.interface";

export class MockCrashReporterService implements CrashReporterService {
  readonly captured: Array<{ error: unknown; context?: Record<string, unknown> }> = [];

  async capture(error: unknown, context?: Record<string, unknown>) {
    this.captured.push({ error, context });
  }
}
