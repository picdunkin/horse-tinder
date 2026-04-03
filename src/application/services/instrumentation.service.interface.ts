export interface InstrumentationService {
  track(eventName: string, payload?: Record<string, unknown>): Promise<void>;
}
