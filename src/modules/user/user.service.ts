import config from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterUserPayload } from "./user.interface";


const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, phone, image } = payload;

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



export const userService = {
    registerUserIntoDB,
    getMyProfileFromDB
};