import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Transaction, TransactionType, Category } from "../../types/types";
import { categories, suggestions } from "../../data";

interface TransactionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTransaction: (
        transaction: Omit<Transaction, "id" | "date">
    ) => Promise<void>;
    editingTransaction: Transaction | null;
    onUpdateTransaction: (transaction: Transaction) => Promise<void>;
    isLoading: boolean;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
    isOpen,
    onClose,
    onAddTransaction,
    editingTransaction,
    onUpdateTransaction,
    isLoading,
}) => {
    const [type, setType] = useState<TransactionType>("expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (editingTransaction) {
            setType(editingTransaction.type);
            setAmount(editingTransaction.amount.toString());
            setDescription(editingTransaction.description);
            setCategory(editingTransaction.category);
        } else {
            setType("expense");
            setAmount("");
            setDescription("");
            setCategory("");
        }
    }, [editingTransaction, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const transactionData = {
            type,
            amount: parseFloat(amount),
            description,
            category,
        };

        if (editingTransaction) {
            await onUpdateTransaction({
                ...transactionData,
                id: editingTransaction.id,
                date: editingTransaction.date,
            });
        } else {
            await onAddTransaction(transactionData);
        }

        onClose();
    };

    const handleSuggestionClick = (suggestion: {
        amount: number;
        description: string;
        category: string;
    }) => {
        setAmount(suggestion.amount.toString());
        setDescription(suggestion.description);
        setCategory(suggestion.category);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        {editingTransaction ? "แก้ไขรายการ" : "สร้างรายการใหม่"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">ประเภท</label>
                        <div className="flex justify-around">
                            <label
                                className={`px-4 py-2 rounded-full cursor-pointer ${
                                    type === "income"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={type === "income"}
                                    onChange={() => setType("income")}
                                    className="hidden"
                                />
                                รายรับ
                            </label>
                            <label
                                className={`px-4 py-2 rounded-full cursor-pointer ${
                                    type === "expense"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={type === "expense"}
                                    onChange={() => setType("expense")}
                                    className="hidden"
                                />
                                รายจ่าย
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">จำนวนเงิน</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">รายละเอียด</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">หมวดหมู่</label>
                        <div className="grid grid-cols-4 gap-2">
                            {categories[type].map((cat: Category) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`p-2 rounded-lg flex flex-col items-center ${
                                        category === cat.id
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    <cat.icon size={24} />
                                    <span className="text-xs mt-1">
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">คำแนะนำ</label>
                        <div className="flex flex-wrap gap-2">
                            {suggestions[type].map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                                >
                                    ฿{suggestion.amount} -{" "}
                                    {suggestion.description}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded mt-4 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : null}
                        {editingTransaction ? "อัปเดต" : "เพิ่ม"}รายการ
                    </button>
                </form>
            </div>
        </div>
    );
};
