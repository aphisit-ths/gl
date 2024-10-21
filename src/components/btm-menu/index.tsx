import React from "react";
import { PlusCircle, Home, BarChart2 } from "lucide-react";

interface BottomMenuProps {
    onAddTransaction: () => void;
    onOpenReport: () => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({
    onAddTransaction,
    onOpenReport,
}) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center p-4 shadow-md">
        <button className="text-gray-600 flex flex-col items-center">
            <Home size={24} />
            <span className="text-xs mt-1">หน้าหลัก</span>
        </button>
        <button
            onClick={onAddTransaction}
            className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center -mt-8"
        >
            <PlusCircle size={32} />
        </button>
        <button
            onClick={onOpenReport}
            className="text-gray-600 flex flex-col items-center"
        >
            <BarChart2 size={24} />
            <span className="text-xs mt-1">รายงาน</span>
        </button>
    </div>
);
