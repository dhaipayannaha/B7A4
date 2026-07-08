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
    categoryName: string;
}

export interface IGearQuery {
    searchTerm?: string;   // searches title, brand, model
    category?: string;     // filter by category name e.g. "cycling", "camping"
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: GearCondition;
    status?: GearStatus;
}