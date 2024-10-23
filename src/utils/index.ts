import {Shift, ShiftCounts, ShiftDataPoint, ShiftMetrics} from "@/types";

export const getStartDate = (summaryPeriod: string, shifts: Shift[]): Date => {

    if (summaryPeriod === 'all' && shifts.length > 0) {
        const dates = shifts.map(s => new Date(s.date));
        return new Date(Math.min(...dates.map(d => d.getTime())));
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(summaryPeriod));
    return startDate;
};

export const getFilteredShifts = (shifts: Shift[], summaryPeriod: string): Shift[] => {
    const currentDate = new Date();
    const startDate = getStartDate(summaryPeriod, shifts);

    return shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= startDate && shiftDate <= currentDate;
    });
};

export const countShiftTypes = (shifts: Shift[]): ShiftCounts => {
    const initialCounts: ShiftCounts = {
        'เวรเช้า': 0,
        'เวรบ่าย': 0,
        'เวรดึก': 0,
        'วันหยุด': 0,
        'วันลา': 0
    };

    return shifts.reduce((acc, shift) => {
        if (Object.prototype.hasOwnProperty.call(acc, shift.shift)) {
            acc[shift.shift]++;
        }
        return acc;
    }, initialCounts);
};

export const prepareChartData = (shiftCounts: ShiftCounts): ShiftDataPoint[] => {
    return Object.entries(shiftCounts)
        .filter(([shift]) => shift !== '') // กรองค่าว่างออก
        .map(([shift, count]) => ({
            name: shift,
            count,
            value: count // สำหรับ PieChart
        }));
};

export const calculateWorkLifeBalance = (shifts: Shift[], startDate: Date, endDate: Date): number => {
    if (shifts.length === 0) return 0;

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const workDays = shifts.filter(shift =>
        shift.shift !== 'วันหยุด' && shift.shift !== 'วันลา'
    ).length;

    return Math.round(((totalDays - workDays) / totalDays) * 100);
};

export const calculateConsecutiveWorkDays = (shifts: Shift[]): number => {
    if (shifts.length === 0) return 0;

    let maxConsecutive = 0;
    let currentConsecutive = 0;
    let previousDate: Date | null = null;

    const sortedShifts = [...shifts].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedShifts.forEach(shift => {
        const currentDate = new Date(shift.date);

        if (shift.shift !== 'วันหยุด' && shift.shift !== 'วันลา') {
            if (previousDate) {
                const diffDays = Math.ceil(
                    (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                if (diffDays === 1) {
                    currentConsecutive++;
                } else {
                    currentConsecutive = 1;
                }
            } else {
                currentConsecutive = 1;
            }
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
            previousDate = currentDate;
        } else {
            currentConsecutive = 0;
            previousDate = null;
        }
    });

    return maxConsecutive;
};

export const countAfternoonToMorning = (shifts: Shift[]): number => {
    if (shifts.length === 0) return 0;

    let count = 0;
    const sortedShifts = [...shifts].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 0; i < sortedShifts.length - 1; i++) {
        if (sortedShifts[i].shift === 'เวรบ่าย' &&
            sortedShifts[i + 1].shift === 'เวรเช้า') {
            count++;
        }
    }
    return count;
};


export const getEmpathyMessages = (metrics: ShiftMetrics, periodText: string): string[] => {
    const messages: string[] = [];

    if (metrics.afternoonToMorningCount > 0) {
        messages.push(
            `${periodText} คุณเข้าเวรบ่ายต่อเช้าไปแล้ว ${metrics.afternoonToMorningCount} ครั้ง กรุณาพักผ่อนให้เพียงพอนะคะ 😊`
        );
    }

    if (metrics.nightShiftCount > metrics.totalShifts * 0.3) {
        messages.push(
            'คุณเข้าเวรดึกค่อนข้างบ่อย อย่าลืมดูแลสุขภาพด้วยนะคะ 💪'
        );
    }

    if (metrics.consecutiveWorkDays > 7) {
        messages.push(
            `คุณทำงานติดต่อกันถึง ${metrics.consecutiveWorkDays} วัน ขอให้พักผ่อนให้เพียงพอนะคะ 😴`
        );
    }

    if (metrics.workLifeBalance < 20) {
        messages.push(
            `สมดุลชีวิตการทำงานของคุณค่อนข้างต่ำ (${metrics.workLifeBalance}%) ลองหาเวลาพักผ่อนเพิ่มขึ้นนะคะ 🏖️`
        );
    }

    if (messages.length === 0) {
        messages.push('ขอบคุณสำหรับการทำงานหนัก คุณเป็นฮีโร่ของเรา! 🦸‍♀️');
    }

    return messages;
};

export const getBadgeMessage = (metrics: ShiftMetrics, totalDays: number): string => {
    // ถ้าข้อมูลน้อยเกินไป ให้แสดงข้อความกลางๆ
    if (totalDays <= 7) {
        if (metrics.totalShifts === 0) {
            return "ยังไม่มีการบันทึกเวร";
        }
        return "เริ่มต้นบันทึกเวร";
    }

    if (totalDays <= 14) {
        return "กำลังรวบรวมข้อมูล";
    }

    // คำนวณความรุนแรงของสถานการณ์
    const issues: { severity: number; message: string }[] = [];

    // ตรวจสอบ Work-Life Balance
    if (metrics.workLifeBalance < 20) {
        issues.push({
            severity: 3,
            message: "ต้องการการพักผ่อนเร่งด่วน"
        });
    } else if (metrics.workLifeBalance < 30) {
        issues.push({
            severity: 2,
            message: "ควรเพิ่มเวลาพักผ่อน"
        });
    }

    // ตรวจสอบวันทำงานต่อเนื่อง
    if (metrics.consecutiveWorkDays > 10) {
        issues.push({
            severity: 3,
            message: "ควรหยุดพักโดยเร็ว"
        });
    } else if (metrics.consecutiveWorkDays > 7) {
        issues.push({
            severity: 2,
            message: "ทำงานต่อเนื่องนาน"
        });
    } else if (metrics.consecutiveWorkDays > 5) {
        issues.push({
            severity: 1,
            message: "ใกล้ถึงขีดจำกัดการทำงานต่อเนื่อง"
        });
    }

    // ตรวจสอบเวรบ่ายต่อเช้า
    if (metrics.afternoonToMorningCount > 2) {
        issues.push({
            severity: 3,
            message: "เวรบ่ายต่อเช้าบ่อยเกินไป"
        });
    } else if (metrics.afternoonToMorningCount > 0) {
        issues.push({
            severity: 2,
            message: "มีเวรบ่ายต่อเช้า"
        });
    }

    // ตรวจสอบเวรดึก
    if (metrics.totalShifts > 0) {  // ป้องกัน division by zero
        const nightShiftPercentage = (metrics.nightShiftCount / metrics.totalShifts) * 100;
        if (nightShiftPercentage > 40) {
            issues.push({
                severity: 3,
                message: "เวรดึกมากเกินไป"
            });
        } else if (nightShiftPercentage > 30) {
            issues.push({
                severity: 2,
                message: "เวรดึกค่อนข้างมาก"
            });
        }
    }

    // ถ้าไม่มีปัญหาใดๆ
    if (issues.length === 0) {
        if (metrics.workLifeBalance > 40) {
            return "สมดุลชีวิตดีเยี่ยม";
        }
        if (metrics.workLifeBalance > 30) {
            return "สมดุลชีวิตดี";
        }
        return "สมดุลชีวิตปกติ";
    }

    // เรียงลำดับตาม severity และเลือกข้อความที่สำคัญที่สุด
    issues.sort((a, b) => b.severity - a.severity);
    return issues[0].message;
};