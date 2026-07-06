

import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utilities/catchAsync";
import { jwtUtilis } from "../utilities/jwt";
import { prisma } from "../lib/prisma";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: Role;
            }
        }
    }
}







export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken
            :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization?.split(' ')[1]
                :
                req.headers.authorization;

        if (!token) {
            throw new Error("You are not login . please login")
        }


        const verifiedToken = jwtUtilis.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.message as string);
        }

        const { email, name, id, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Unauthorized")
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        if (user.activeStatus === "BLOCKED") {
            throw new Error("User is blocked")
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        next();


    })
}