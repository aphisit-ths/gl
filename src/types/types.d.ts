import { LucideIcon } from "lucide-react";

export type TransactionType = "income" | "expense";

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
}

export interface Category {
    id: string;
    name: string;
    icon: LucideIcon;
}

export interface Categories {
    income: Category[];
    expense: Category[];
}

export interface Suggestion {
    amount: number;
    description: string;
    category: string;
}

export interface Suggestions {
    income: Suggestion[];
    expense: Suggestion[];
}
