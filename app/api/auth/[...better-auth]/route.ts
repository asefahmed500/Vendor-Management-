import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import connectDB from "@/lib/db/connect";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

export const GET = async (request: NextRequest) => {
    await connectDB();
    return handler.GET(request);
};

export const POST = async (request: NextRequest) => {
    await connectDB();
    return handler.POST(request);
};
