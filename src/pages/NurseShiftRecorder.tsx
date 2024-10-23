import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeeklyCalendar from "@/components/weekly-calendar/weekly-calendar";
import { shiftTypes } from "@/types";
import { useShifts } from '@/context/ShiftContext';

const NurseShiftRecorder: React.FC = () => {
    const { shifts, updateShifts } = useShifts();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedShift, setSelectedShift] = useState<string>('');

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().split('T')[0];
        const shift = shifts.find(s => s.date === formattedDate);
        setSelectedShift(shift?.shift || '');
    };

    const handleWeekChange = (newWeekStart: Date) => {
        console.log("สัปดาห์เปลี่ยนเป็น:", newWeekStart);
    };

    const handleShiftChange = (value: string) => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const newShifts = shifts.filter(s => s.date !== formattedDate);
        if (value) {
            newShifts.push({ date: formattedDate, shift: value });
        }
        updateShifts(newShifts);
        setSelectedShift(value);
    };

    const todayShift = shifts.find(s => s.date === new Date().toISOString().split('T')[0]);
    const todayShiftType = shiftTypes.find(s => s.value === todayShift?.shift);

    return (
        <div className="p-4 max-w-md mx-auto bg-gray-50">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-xl">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            บันทึกเวรพยาบาล
                        </span>
                        {todayShiftType && (
                            <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                                วันนี้: {todayShiftType.emoji} {todayShiftType.label}
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <WeeklyCalendar
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        onWeekChange={handleWeekChange}
                        shifts={shifts}
                    />
                    {selectedDate && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-3 text-gray-700">
                                เลือกประเภทเวร {selectedDate.toLocaleDateString('th-TH')}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {shiftTypes.map((shift) => (
                                    <button
                                        key={shift.value}
                                        onClick={() => handleShiftChange(selectedShift === shift.value ? '' : shift.value)}
                                        className="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
                                        style={{
                                            backgroundColor: selectedShift === shift.value ? shift.color : '#f3f4f6',
                                            color: selectedShift === shift.value ? 'white' : 'black',
                                        }}
                                    >
                                        <span>{shift.emoji}</span>
                                        <span>{shift.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default NurseShiftRecorder;