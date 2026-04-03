export interface TransactionManagerService {
  run<T>(operation: () => Promise<T>): Promise<T>;
}
