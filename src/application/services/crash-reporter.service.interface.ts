export interface CrashReporterService {
  capture(error: unknown, context?: Record<string, unknown>): Promise<void>;
}
