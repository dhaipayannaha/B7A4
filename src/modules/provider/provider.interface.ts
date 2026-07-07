import { GearCondition, GearStatus } from "../../../generated/prisma/client";

export interface IGearItem {
    title: string;
    description: string;
    brand?: string;
    model?: string;
    dailyRate: number;
    quantity: number;
    availableQuantity: number;
    images: string[];
    condition?: GearCondition;
    status?: GearStatus;
    categoryId: string;
}