




export const COLORS = {
    morning: '#3b82f6',   // Blue
    afternoon: '#f97316', // Orange
    night: '#9333ea',     // Purple
    dayOff: '#383838',
    leave: '#383838'
};

export const shiftTypes = [
    { value: 'เวรเช้า', label: 'เวรเช้า', color: COLORS.morning, emoji: '🌞' },
    { value: 'เวรบ่าย', label: 'เวรบ่าย', color: COLORS.afternoon, emoji: '🌇' },
    { value: 'เวรดึก', label: 'เวรดึก', color: COLORS.night, emoji: '🌙' },
    { value: 'วันหยุด', label: 'วันหยุด', color: COLORS.dayOff, emoji: '🏖️' },
    { value: 'วันลา', label: 'วันลา', color: COLORS.leave, emoji: '📅' }
];

export interface Shift {
    date: string;
    shift: string;
}

export const FILTER_OPTIONS = [
    { value: '7', label: '7 วันที่ผ่านมา' },
    { value: '30', label: '30 วันที่ผ่านมา' },
    { value: '90', label: '90 วันที่ผ่านมา' },
    { value: '365', label: '1 ปีที่ผ่านมา' },
    { value: 'all', label: 'ทั้งหมด' }
];

export interface ShiftDataPoint {
    name: string;
    count: number;
    value?: number;  // สำหรับ PieChart
}

export interface ShiftMetrics {
    workLifeBalance: number;
    consecutiveWorkDays: number;
    afternoonToMorningCount: number;
    totalShifts: number;
    nightShiftCount: number;
}

export interface ShiftCounts {
    [key: string]: number;
}