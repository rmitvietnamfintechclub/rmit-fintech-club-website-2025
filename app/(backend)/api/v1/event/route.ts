import { addEvent } from "@/app/(backend)/controllers/event";
import connectMongoDB from "@/app/(backend)/libs/mongodb";
import { requireAdmin } from "@/app/(backend)/middleware/middleware";
import Event from "@/app/(backend)/models/event";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(req.url);
        
        const limitParam = searchParams.get('limit');
        const offsetParam = searchParams.get('offset');
        
        const limit = Math.min(Math.max(parseInt(limitParam || '10', 10), 1), 100);
        const offset = Math.max(parseInt(offsetParam || '0', 10), 0);
        
        const currDate = new Date();

        const events = await Event.find(
            { date: { $gte: currDate } },
            { name: 1, posterUrl: 1, date: 1, time: 1, mode: 1, location: 1 }
        ).sort({ date: 1 }).skip(offset).limit(limit);

        const total = await Event.countDocuments({ date: { $gte: currDate } });

        return NextResponse.json({
            status: 200,
            total,
            limit,
            offset,
            events,
        }, { 
            status: 200 
        });

    } catch (err: any) {
        console.error('Error fetching events:', err);

        return NextResponse.json({ 
            status: 500, 
            message: "Internal Server Error",
            error: err.message 
        }, { 
            status: 500
        });
    }
}


export async function POST(req: NextRequest) {
    // Require admin for POST
	const isAdmin = await requireAdmin(req);
	if (!isAdmin) {
		return NextResponse.json(
			{ status: 403, message: "Forbidden" },
			{ status: 403 },
		);
	}
    await connectMongoDB();
    const data = await req.json();
    const result = await addEvent(data);
    return result;
}