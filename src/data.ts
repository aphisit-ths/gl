import {
    Briefcase,
    Gift,
    Banknote,
    TrendingUp,
    Coffee,
    ShoppingCart,
    Home,
    Car,
    Utensils,
    Wifi,
    Book,
    Heart,
} from "lucide-react";
import { Categories, Suggestions } from "./types/types";

export const categories: Categories = {
    income: [
        { id: "salary", name: "เงินเดือน", icon: Briefcase },
        { id: "bonus", name: "โบนัส", icon: Gift },
        { id: "investment", name: "การลงทุน", icon: TrendingUp },
        { id: "other_income", name: "รายรับอื่นๆ", icon: Banknote },
    ],
    expense: [
        { id: "food", name: "อาหาร", icon: Utensils },
        { id: "transport", name: "การเดินทาง", icon: Car },
        { id: "utilities", name: "บิลต่างๆ", icon: Wifi },
        { id: "rent", name: "ค่าเช่า", icon: Home },
        { id: "entertainment", name: "ความบันเทิง", icon: Coffee },
        { id: "shopping", name: "ช้อปปิ้ง", icon: ShoppingCart },
        { id: "education", name: "การศึกษา", icon: Book },
        { id: "healthcare", name: "สุขภาพ", icon: Heart },
        { id: "other_expense", name: "รายจ่ายอื่นๆ", icon: Banknote },
    ],
};

export const suggestions: Suggestions = {
    income: [
        { amount: 30000, description: "เงินเดือน", category: "salary" },
        { amount: 5000, description: "โบนัส", category: "bonus" },
        { amount: 1000, description: "เงินปันผล", category: "investment" },
    ],
    expense: [
        { amount: 200, description: "อาหารกลางวัน", category: "food" },
        { amount: 500, description: "ค่าน้ำมัน", category: "transport" },
        { amount: 5000, description: "ค่าเช่าบ้าน", category: "rent" },
        { amount: 1000, description: "ค่าไฟฟ้า", category: "utilities" },
        { amount: 500, description: "ดูหนัง", category: "entertainment" },
    ],
};
