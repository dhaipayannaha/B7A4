import config from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterUserPayload } from "./user.interface";
import { UserRole, UserStatus } from "@prisma/client"


const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, phone, image, role } = payload;

    if (role && role !== UserRole.CUSTOMER && role !== UserRole.PROVIDER) {
        throw new Error("Only CUSTOMER or PROVIDER roles are allowed during registration");
    }

    // Check existing user
    const isUserExist = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExist) {
        throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds)
    );

    // Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            image,
            ...(role && { role }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
};

const getMyProfileFromDB = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        omit: {
            password: true
        }
    });
    return user;
}



const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        omit: {
            password: true
        }
    });
    return users;
}

const updateUserFromDB = async (id: string, status: UserStatus) => {
    const user = await prisma.user.update({
        where: { id },
        data: { status },
        omit: {
            password: true
        }
    });
    return user;
}

export const userService = {
    registerUserIntoDB,
    getMyProfileFromDB,
    getAllUsersFromDB,
    updateUserFromDB
};
