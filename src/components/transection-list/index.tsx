import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Transaction } from "../../types/types";

interface TransactionListProps {
    transactions: Transaction[];
    onEditTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = React.memo(
    ({ transactions, onEditTransaction, onDeleteTransaction }) => {
        const [activeMenu, setActiveMenu] = useState<string | null>(null);

        const toggleMenu = (id: string) => {
            setActiveMenu(activeMenu === id ? null : id);
        };

        return (
            <div className="bg-blue-50 rounded-2xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">
                    รายการล่าสุด
                </h2>
                <ul className="space-y-3">
                    {transactions.map((transaction) => (
                        <li
                            key={transaction.id}
                            className="relative bg-white rounded-xl p-4 flex items-center justify-between"
                        >
                            <div className="flex flex-col flex-grow mr-4">
                                <span className="font-medium text-gray-800">
                                    {transaction.description}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {transaction.category}
                                </span>
                            </div>
                            <span
                                className={`font-bold ${
                                    transaction.type === "income"
                                        ? "text-green-500"
                                        : "text-red-400"
                                }`}
                            >
                                {transaction.type === "income" ? "+" : "-"} ฿
                                {transaction.amount.toFixed(2)}
                            </span>
                            <div className="relative ml-4">
                                <button
                                    onClick={() => toggleMenu(transaction.id)}
                                    className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center focus:outline-none"
                                >
                                    <MoreVertical
                                        size={18}
                                        className="text-blue-500"
                                    />
                                </button>
                                {activeMenu === transaction.id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-10">
                                        <button
                                            onClick={() => {
                                                onEditTransaction(transaction);
                                                toggleMenu(transaction.id);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center"
                                        >
                                            <Edit2 size={16} className="mr-2" />
                                            <span>แก้ไข</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDeleteTransaction(
                                                    transaction.id
                                                );
                                                toggleMenu(transaction.id);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center text-red-500"
                                        >
                                            <Trash2
                                                size={16}
                                                className="mr-2"
                                            />
                                            <span>ลบ</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
);
