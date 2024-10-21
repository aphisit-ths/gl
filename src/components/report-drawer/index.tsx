import React, { useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { th } from "date-fns/locale";
import { Transaction } from "../../types/types";

interface ReportDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
}

export const ReportDrawer: React.FC<ReportDrawerProps> = React.memo(
    ({ isOpen, onClose, transactions }) => {
        const [reportType, setReportType] = useState("7");

        const prepareChartData = useCallback(
            (days: number) => {
                const today = new Date();
                const startDate = subDays(today, days);

                const filteredTransactions = transactions.filter(
                    (t) => new Date(t.date) >= startDate
                );

                const data = Array.from({ length: days }, (_, i) => {
                    const date = subDays(today, days - 1 - i);
                    const dayTransactions = filteredTransactions.filter(
                        (t) =>
                            format(new Date(t.date), "yyyy-MM-dd") ===
                            format(date, "yyyy-MM-dd")
                    );
                    const income = dayTransactions
                        .filter((t) => t.type === "income")
                        .reduce((sum, t) => sum + t.amount, 0);
                    const expense = dayTransactions
                        .filter((t) => t.type === "expense")
                        .reduce((sum, t) => sum + t.amount, 0);
                    return {
                        date: format(date, "d MMM", { locale: th }),
                        รายรับ: income,
                        รายจ่าย: expense,
                    };
                });

                return data;
            },
            [transactions]
        );

        const chartData = useMemo(
            () => prepareChartData(parseInt(reportType)),
            [prepareChartData, reportType]
        );

        if (!isOpen) return null;

        return (
            <div className="fixed inset-x-0 bottom-0 bg-white h-4/5 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">รายงาน</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="mb-4">
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="7">7 วัน</option>
                        <option value="15">15 วัน</option>
                        <option value="30">30 วัน</option>
                    </select>
                </div>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="รายรับ" fill="#4CAF50" />
                            <Bar dataKey="รายจ่าย" fill="#F44336" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
);
