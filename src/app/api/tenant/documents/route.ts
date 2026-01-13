import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
// Removed uuid import to avoid dependency issues
// import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        if (!type) {
            return new NextResponse("Missing document type", { status: 400 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to public/uploads (MVP only - usage S3 prop in prod)
        // Use crypto.randomUUID() which is native in recent Node.js versions
        const uniqueName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const uploadPath = join(process.cwd(), "public", "uploads", uniqueName);

        await writeFile(uploadPath, buffer);

        // Update DB
        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { tenantProfile: true }
        });

        if (!user?.tenantProfile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        const document = await prisma.document.create({
            data: {
                tenantProfileId: user.tenantProfile.id,
                type: type as any,
                storageKey: `/uploads/${uniqueName}`,
                status: "UPLOADED",
            },
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
