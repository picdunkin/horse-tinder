import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";

export class NoopInstrumentationService implements InstrumentationService {
  async track() {}
}
