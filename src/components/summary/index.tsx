import React from "react";

interface SummaryProps {
    dailyTotal: number;
    weeklyTotal: number;
}

export const Summary: React.FC<SummaryProps> = React.memo(
    ({ dailyTotal, weeklyTotal }) => (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between">
            <div className="text-center">
                <div className="text-sm text-gray-600">วันนี้</div>
                <div className="text-xl font-bold text-blue-500">
                    ฿{dailyTotal}
                </div>
            </div>
            <div className="text-center">
                <div className="text-sm text-gray-600">สัปดาห์นี้</div>
                <div className="text-xl font-bold text-blue-500">
                    ฿{weeklyTotal}
                </div>
            </div>
        </div>
    )
);
