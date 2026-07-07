import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IloginUser } from "./auth.interface";
import { jwtUtilis } from "../../utilities/jwt";
import config from "../../config";










const loginUser = async (payload: IloginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    });

    if (user.status !== "ACTIVE") {
        throw new Error("You are not authorized to login!")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid credential!");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtilis.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in);

    const refreshToken = jwtUtilis.createToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in
    );

    return { accessToken, refreshToken };
}

export const AuthService = {
    loginUser,
}