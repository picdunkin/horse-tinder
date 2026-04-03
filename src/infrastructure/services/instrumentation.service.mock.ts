import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";

export class MockInstrumentationService implements InstrumentationService {
  readonly events: Array<{ eventName: string; payload?: Record<string, unknown> }> = [];

  async track(eventName: string, payload?: Record<string, unknown>) {
    this.events.push({ eventName, payload });
  }
}
