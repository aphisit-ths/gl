import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {shiftTypes} from "@/types";

interface WeeklyCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    onWeekChange: (startDate: Date) => void;
    shifts: Array<{ date: string; shift: string; }>;
}



export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
                                                                  selectedDate,
                                                                  onDateSelect,
                                                                  onWeekChange,
                                                                  shifts
                                                              }) => {
    const daysOfWeek = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
        const today = new Date();
        const day = today.getDay();
        return new Date(today.setDate(today.getDate() - day + (day === 0 ? -6 : 1)));
    });

    const getShiftColor = (shift?: string) => {
        const shiftType = shiftTypes.find(s => s.value === shift);
        return shiftType?.color || '';
    };

    // Function to determine text color based on background color
    const getTextColor = (backgroundColor: string) => {
        // Convert hex to RGB
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    };

    const renderWeek = (startDate: Date, isPreviousWeek = false, isNextWeek = false) => {
        return (
            <div className={`grid grid-cols-7 gap-2 transition-opacity duration-300 ${
                isPreviousWeek || isNextWeek ? 'opacity-50' : 'opacity-100'
            }`}>
                {[...Array(7)].map((_, index) => {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + index);
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    const formattedDate = date.toISOString().split('T')[0];
                    const shift = shifts.find(s => s.date === formattedDate);
                    const shiftType = shiftTypes.find(s => s.value === shift?.shift);
                    const bgColor = shift ? getShiftColor(shift.shift) : isSelected ? '#e5e7eb' : '#f3f4f6';
                    const textColor = bgColor && bgColor !== '#f3f4f6' ? getTextColor(bgColor) : '#000000';

                    return (
                        <button
                            key={index}
                            onClick={() => !isPreviousWeek && !isNextWeek && onDateSelect(date)}
                            disabled={isPreviousWeek || isNextWeek}
                            style={{
                                backgroundColor: bgColor,
                                color: textColor,
                            }}
                            className={`
                                w-12 h-12 rounded-lg flex flex-col items-center justify-center 
                                relative transition-all duration-300 hover:opacity-80
                                ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                                ${isPreviousWeek || isNextWeek ? 'cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <span className="text-sm font-medium">{date.getDate()}</span>
                            {shift && (
                                <span
                                    className="absolute top-0 right-0 text-xs"
                                    title={shiftType?.label}
                                >
                                    {shiftType?.emoji}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    };

    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const handlePreviousWeek = () => {
        setCurrentWeekStart(previousWeekStart);
        onWeekChange(previousWeekStart);
    };

    const handleNextWeek = () => {
        setCurrentWeekStart(nextWeekStart);
        onWeekChange(nextWeekStart);
    };

    const handleToday = () => {
        const today = new Date();
        const day = today.getDay();
        const newWeekStart = new Date(today.setDate(today.getDate() - day + (day === 0 ? -6 : 1)));
        setCurrentWeekStart(newWeekStart);
        onWeekChange(newWeekStart);
        onDateSelect(today);
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <Button
                    onClick={handlePreviousWeek}
                    variant="outline"
                    size="icon"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold">
                    {currentWeekStart.toLocaleDateString('th-TH', {
                        month: 'long',
                        year: 'numeric'
                    })}
                </span>
                <Button
                    onClick={handleNextWeek}
                    variant="outline"
                    size="icon"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
                {daysOfWeek.map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>
            <div className="space-y-4">
                {renderWeek(previousWeekStart, true)}
                {renderWeek(currentWeekStart)}
                {renderWeek(nextWeekStart, false, true)}
            </div>
            <div className="mt-4 flex justify-center">
                <Button
                    onClick={handleToday}
                    variant="outline"
                >
                    กลับไปวันนี้
                </Button>
            </div>
        </div>
    );
};

export default WeeklyCalendar;