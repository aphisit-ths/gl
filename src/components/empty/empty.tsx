import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export const EmptyState: React.FC = () => {
    return (
        <Card className="bg-gray-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ไม่พบข้อมูลเวร
                </h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                    กรุณาเพิ่มข้อมูลเวรในปฏิทินเพื่อดูสรุปข้อมูล
                </p>
            </CardContent>
        </Card>
    );
};