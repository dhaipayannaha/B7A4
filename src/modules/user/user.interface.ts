import { UserRole } from "../../../generated/prisma/enums";

export type RegisterUserPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    image?: string;
    role?: UserRole;
};