import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface Shift {
    date: string;
    shift: string;
}

interface ShiftContextType {
    shifts: Shift[];
    updateShifts: (newShifts: Shift[]) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shifts, setShifts] = useState<Shift[]>([]);

    const loadShifts = useCallback(() => {
        try {
            const savedShifts = localStorage.getItem('nurseShifts');
            if (savedShifts) {
                setShifts(JSON.parse(savedShifts));
            }
        } catch (error) {
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
            setShifts(shiftsToSave);
        } catch (error) {
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

    return (
        <ShiftContext.Provider value={{ shifts, updateShifts: saveShifts }}>
    {children}
    </ShiftContext.Provider>
);
};

export const useShifts = () => {
    const context = useContext(ShiftContext);
    if (!context) {
        throw new Error('useShifts must be used within a ShiftProvider');
    }
    return context;
};