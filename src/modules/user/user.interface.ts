import { UserRole } from "@prisma/client"

export type RegisterUserPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    image?: string;
    role?: UserRole;
};
