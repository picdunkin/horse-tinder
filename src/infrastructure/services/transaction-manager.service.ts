import type { TransactionManagerService } from "@/src/application/services/transaction-manager.service.interface";

export class InlineTransactionManagerService implements TransactionManagerService {
  async run<T>(operation: () => Promise<T>) {
    return operation();
  }
}
