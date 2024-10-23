import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Local imports
import { COLORS, shiftTypes, FILTER_OPTIONS } from '@/types';
import {
    getFilteredShifts,
    calculateWorkLifeBalance,
    calculateConsecutiveWorkDays,
    countAfternoonToMorning,
    countShiftTypes,
    prepareChartData,
    getEmpathyMessages,
    getBadgeMessage,
    getStartDate
} from '@/utils';
import type { Shift, ShiftMetrics, ShiftDataPoint } from '@/types';
import {useShifts} from "@/context/ShiftContext.tsx";
import {EmptyState} from "@/components/empty/empty.tsx";

export const ShiftSummary: React.FC = () => {
    const { shifts } = useShifts();
    const [isLoading, setIsLoading] = useState(true);
    const [summaryPeriod, setSummaryPeriod] = useState('30');
    const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
    console.log(filteredShifts)
    const [chartData, setChartData] = useState<ShiftDataPoint[]>([]);
    const [metrics, setMetrics] = useState<ShiftMetrics>({
        workLifeBalance: 0,
        consecutiveWorkDays: 0,
        afternoonToMorningCount: 0,
        totalShifts: 0,
        nightShiftCount: 0
    });
    const [empathyMessages, setEmpathyMessages] = useState<string[]>([]);

    // Set loading to false once shifts are loaded
    useEffect(() => {
        if (shifts) {
            setIsLoading(false);
        }
    }, [shifts]);

    // Process data when period or shifts change
    useEffect(() => {
        if (isLoading) return;

        const currentDate = new Date();
        const startDate = getStartDate(summaryPeriod, shifts);
        const filtered = getFilteredShifts(shifts, summaryPeriod);
        const shiftCounts = countShiftTypes(filtered);
        const data = prepareChartData(shiftCounts);

        const workLifeBalance = calculateWorkLifeBalance(filtered, startDate, currentDate);
        const consecutiveWorkDays = calculateConsecutiveWorkDays(filtered);
        const afternoonToMorningCount = countAfternoonToMorning(filtered);

        const newMetrics: ShiftMetrics = {
            workLifeBalance,
            consecutiveWorkDays,
            afternoonToMorningCount,
            totalShifts: filtered.length,
            nightShiftCount: shiftCounts['เวรดึก'] || 0
        };

        const periodText = summaryPeriod === 'all'
            ? 'ตลอดระยะเวลา'
            : `ใน${FILTER_OPTIONS.find(option => option.value === summaryPeriod)?.label}`;

        setFilteredShifts(filtered);
        setChartData(data);
        setMetrics(newMetrics);
        setEmpathyMessages(getEmpathyMessages(newMetrics, periodText));

    }, [summaryPeriod, shifts, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (!shifts.length) {
        return <EmptyState />;
    }
    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <Card className="mb-8 shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center text-xl sm:text-2xl font-bold px-2">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                            สรุปข้อมูลเวรพยาบาล
                        </span>
                        {metrics && (
                            <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-4 py-1">
                                {getBadgeMessage(metrics, shifts.length)}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Period Selector */}
                    <div className="flex justify-between items-center px-2">
                        <Select value={summaryPeriod} onValueChange={setSummaryPeriod}>
                            <SelectTrigger className="w-[180px] sm:w-[200px]">
                                <SelectValue placeholder="เลือกช่วงเวลา"/>
                            </SelectTrigger>
                            <SelectContent>
                                {FILTER_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Shift Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {shiftTypes.slice(0, 3).map(shiftType => {
                            const shiftData = chartData.find(item => item.name === shiftType.value);
                            return (
                                <Card
                                    key={shiftType.value}
                                    style={{backgroundColor: shiftType.color}}
                                    className="transform transition-all duration-200 hover:scale-105 shadow-md"
                                >
                                    <CardContent className="flex items-center justify-between p-4 sm:p-6">
                                        <div className="text-white">
                                            <p className="text-2xl sm:text-3xl font-bold mb-1">
                                                {shiftData?.count || 0}
                                            </p>
                                            <p className="text-base sm:text-lg">{shiftType.label}</p>
                                        </div>
                                        <span className="text-4xl sm:text-5xl">{shiftType.emoji}</span>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>


                    {/* Messages and Work-Life Balance */}
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-md">
                        <CardContent className="p-4 sm:p-6">
                            <div className="space-y-3">
                                {empathyMessages.map((message, index) => (
                                    <div
                                        key={index}
                                        className="p-3 bg-white bg-opacity-50 rounded-lg shadow-sm"
                                    >
                                        <p className="text-sm sm:text-base text-gray-800">{message}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm sm:text-base font-medium">สมดุลชีวิตการทำงาน</p>
                                    <p className="text-xs sm:text-sm font-medium">{metrics.workLifeBalance}%</p>
                                </div>
                                <Progress value={metrics.workLifeBalance} className="h-2 w-full"/>
                                <p className="text-xs sm:text-sm text-gray-600 text-right">ยิ่งสูงยิ่งดี</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">จำนวนเวรแต่ละประเภท</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 sm:p-4">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" fontSize={12}/>
                                        <YAxis fontSize={12}/>
                                        <Tooltip/>
                                        <Bar
                                            dataKey="count"
                                            fill={COLORS.morning}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Pie Chart */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">สัดส่วนประเภทเวร</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 sm:p-4">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.map((_entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={shiftTypes[index % shiftTypes.length].color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip/>
                                        <Legend/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Consecutive Work Days */}
                        <Card className="shadow-md md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg">วันทำงานติดต่อกันสูงสุด</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8">
                                <div className="flex items-center justify-center">
                                    <div className="text-center">
                                        <p
                                            className="text-5xl sm:text-7xl font-bold mb-2 sm:mb-4"
                                            style={{color: COLORS.afternoon}}
                                        >
                                            {metrics.consecutiveWorkDays}
                                        </p>
                                        <p className="text-lg sm:text-xl text-gray-600">วัน</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ShiftSummary;