import React from 'react';
import NurseShiftRecorder from "@/pages/NurseShiftRecorder.tsx";
import ShiftSummary from "@/pages/ShiftSummary";
import { ShiftProvider } from '@/context/ShiftContext';

const Home: React.FC = () => {
    return (
        <ShiftProvider>
            <div className="min-h-screen bg-gray-50 overflow-x-hidden">
                <div className="max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="w-full flex justify-center">
                            <NurseShiftRecorder />
                        </div>
                        <div className="w-full">
                            <ShiftSummary />
                        </div>
                    </div>
                </div>
            </div>
        </ShiftProvider>
    );
};

export default Home;