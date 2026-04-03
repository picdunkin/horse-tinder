import { NoopCrashReporterService } from "@/src/infrastructure/services/crash-reporter.service";
import { NoopInstrumentationService } from "@/src/infrastructure/services/instrumentation.service";
import { InlineTransactionManagerService } from "@/src/infrastructure/services/transaction-manager.service";

export function createMonitoringModule() {
  return {
    crashReporterService: new NoopCrashReporterService(),
    instrumentationService: new NoopInstrumentationService(),
    transactionManagerService: new InlineTransactionManagerService(),
  };
}
