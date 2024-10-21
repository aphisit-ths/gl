import { Transaction } from "../types/types";

export interface TransactionAdapter {
    getTransactions(): Promise<Transaction[]>;
    addTransaction(
        transaction: Omit<Transaction, "id" | "date">
    ): Promise<Transaction>;
    updateTransaction(transaction: Transaction): Promise<Transaction>;
    deleteTransaction(id: string): Promise<void>;
}

class MockTransactionAdapter implements TransactionAdapter {
    private transactions: Transaction[] = [
        {
            id: "1",
            type: "income",
            amount: 5000,
            description: "เงินเดือน",
            category: "salary",
            date: "2023-09-01T00:00:00.000Z",
        },
        {
            id: "2",
            type: "expense",
            amount: 300,
            description: "ค่าอาหาร",
            category: "food",
            date: "2023-09-02T00:00:00.000Z",
        },
        {
            id: "3",
            type: "expense",
            amount: 1500,
            description: "ค่าเช่า",
            category: "rent",
            date: "2023-09-03T00:00:00.000Z",
        },
    ];

    async getTransactions(): Promise<Transaction[]> {
        return Promise.resolve([...this.transactions]);
    }

    async addTransaction(
        transaction: Omit<Transaction, "id" | "date">
    ): Promise<Transaction> {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now().toString(),
            date: new Date().toISOString(),
        };
        this.transactions.push(newTransaction);
        return Promise.resolve(newTransaction);
    }

    async updateTransaction(
        updatedTransaction: Transaction
    ): Promise<Transaction> {
        const index = this.transactions.findIndex(
            (t) => t.id === updatedTransaction.id
        );
        if (index !== -1) {
            this.transactions[index] = updatedTransaction;
            return Promise.resolve(updatedTransaction);
        }
        throw new Error("Transaction not found");
    }

    async deleteTransaction(id: string): Promise<void> {
        const index = this.transactions.findIndex((t) => t.id === id);
        if (index !== -1) {
            this.transactions.splice(index, 1);
            return Promise.resolve();
        }
        throw new Error("Transaction not found");
    }
}

export const transactionAdapter: TransactionAdapter =
    new MockTransactionAdapter();
