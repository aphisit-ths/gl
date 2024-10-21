import React, {useState, useEffect, useCallback} from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {toast} from "@/hooks/use-toast.ts";

interface ShiftType {
    value: string;
    label: string;
    color: string;
    icon: string;
}

interface Shift {
    date: string;
    shift: string;
}

const shiftTypes: ShiftType[] = [
    { value: 'เวรเช้า', label: 'เวรเช้า', color: 'bg-blue-200 hover:bg-blue-300', icon: '🌞' },
    { value: 'เวรบ่าย', label: 'เวรบ่าย', color: 'bg-green-200 hover:bg-green-300', icon: '🌇' },
    { value: 'เวรดึก', label: 'เวรดึก', color: 'bg-purple-200 hover:bg-purple-300', icon: '🌙' },
    { value: 'วันหยุด', label: 'วันหยุด', color: 'bg-yellow-200 hover:bg-yellow-300', icon: '🏖️' },
    { value: 'วันลา', label: 'วันลา', color: 'bg-red-200 hover:bg-red-300', icon: '📅' },
];

interface WeeklyCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    onWeekChange: (startDate: Date) => void;
    shifts: Shift[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ selectedDate, onDateSelect, onWeekChange, shifts }) => {
    const daysOfWeek = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
        const today = new Date();
        const day = today.getDay();
        return new Date(today.setDate(today.getDate() - day + (day === 0 ? -6 : 1)));
    });

    const renderWeek = (startDate: Date, isPreviousWeek = false, isNextWeek = false) => {
        return (
            <div className={`grid grid-cols-7 gap-2 transition-opacity duration-300 ${isPreviousWeek || isNextWeek ? 'opacity-50' : 'opacity-100'}`}>
                {[...Array(7)].map((_, index) => {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + index);
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    const formattedDate = date.toISOString().split('T')[0];
                    const shift = shifts.find(s => s.date === formattedDate);
                    const shiftType = shiftTypes.find(s => s.value === shift?.shift);

                    return (
                        <button
                            key={index}
                            onClick={() => onDateSelect(date)}
                            className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center relative transition-all duration-300 ${
                                isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            disabled={isPreviousWeek || isNextWeek}
                        >
                            <span className="text-sm">{date.getDate()}</span>
                            {shift && (
                                <span className="absolute top-0 right-0 text-xs" title={shiftType?.label}>
                  {shiftType?.icon}
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
                <Button onClick={handlePreviousWeek} variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold">
          {currentWeekStart.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
        </span>
                <Button onClick={handleNextWeek} variant="outline" size="icon">
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
                <Button onClick={handleToday} variant="outline">
                    กลับไปวันนี้
                </Button>
            </div>
        </div>
    );
};

const NurseShiftRecorder: React.FC = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedShift, setSelectedShift] = useState<string>('');

    const loadShifts = useCallback(() => {
        try {
            const savedShifts = localStorage.getItem('nurseShifts');
            if (savedShifts) {
                const parsedShifts = JSON.parse(savedShifts);
                setShifts(parsedShifts);
                console.log('Shifts loaded successfully:', parsedShifts);
            } else {
                console.log('No saved shifts found in local storage');
            }
        } catch (error) {
            console.error('Error loading shifts from local storage:', error);
            toast({
                title: "Error",
                description: "Failed to load saved shifts. Please try refreshing the page.",
                variant: "destructive",
            });
        }
    }, []);

    const saveShifts = useCallback((shiftsToSave: Shift[]) => {
        try {
            localStorage.setItem('nurseShifts', JSON.stringify(shiftsToSave));
            console.log('Shifts saved successfully:', shiftsToSave);
        } catch (error) {
            console.error('Error saving shifts to local storage:', error);
            toast({
                title: "Error",
                description: "Failed to save shifts. Please try again.",
                variant: "destructive",
            });
        }
    }, []);

    useEffect(() => {
        loadShifts();
    }, [loadShifts]);

    useEffect(() => {
        if (shifts.length > 0) {
            saveShifts(shifts);
        }
    }, [shifts, saveShifts]);

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
        setShifts(newShifts);
        setSelectedShift(value);
        saveShifts(newShifts);  // Save immediately after changing
    };

    const todayShift = shifts.find(s => s.date === new Date().toISOString().split('T')[0]);
    const todayShiftType = shiftTypes.find(s => s.value === todayShift?.shift);

    return (
        <div className="p-4 max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="mr-2" />
              บันทึกเวรพยาบาล
            </span>
                        {todayShiftType && (
                            <span className="text-sm">
                วันนี้: {todayShiftType.icon} {todayShiftType.label}
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
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">เลือกประเภทเวร {selectedDate.toLocaleDateString('th-TH')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {shiftTypes.map((shift) => (
                                    <button
                                        key={shift.value}
                                        onClick={() => handleShiftChange(selectedShift === shift.value ? '' : shift.value)}
                                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                                            selectedShift === shift.value ? shift.color + ' ring-2 ring-offset-2 ring-blue-500' : 'bg-gray-100'
                                        }`}
                                    >
                                        {shift.icon} {shift.label}
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