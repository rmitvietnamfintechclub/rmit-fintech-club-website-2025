import { deleteEvent, updateEvent } from "@/app/(backend)/controllers/event";
import connectMongoDB from "@/app/(backend)/libs/mongodb";
import { requireAdmin } from "@/app/(backend)/middleware/middleware";
import Event from "@/app/(backend)/models/event";
import mongoose from "mongoose";
import { type NextRequest, NextResponse } from "next/server";

export async function GET (
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        //Validate ID format before querying
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Invalid event ID' },
                { status: 400 }
            )
        }

        await connectMongoDB();
        const event = await Event.findById(id);

        if(!event) {
            return NextResponse.json(
                { message: 'Event not found' },
                { status: 404 }
            )
        }

        //Sanitize optional fields to avoid undefined
        const sanitizedEvent = {
            _id: event._id,
            name: event.name,
            description: event.description,
            posterUrl: event.posterUrl || null,
            date: event.date,
            time: event.time,
            mode: event.mode,
            location: event.location,
            agenda: Array.isArray(event.agenda) ? event.agenda.map((a: any) => ({
                time: a.time,
                description: a.description,
            })) : [],
            speakers: Array.isArray(event.speakers) ? event.speakers.map((s: any) => ({
                name: s.name || null,
                photoUrl: s.photoUrl || null,
                bio: s.bio || null,
            })) : [],
            partners: Array.isArray(event.partners) ? event.partners : [],
            registrationDeadline: event.registrationDeadline,
            created_at: event.created_at,
            updated_at: event.updated_at,
        }

        return NextResponse.json(sanitizedEvent, { status: event.status });
    } catch(err: any) {
        console.error("Error fetching event:", err);
        return NextResponse.json(err, { status: err.status });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    // Require admin for PUT
	const isAdmin = await requireAdmin(req);
	if (!isAdmin) {
		return NextResponse.json(
			{ status: 403, message: "Forbidden" },
			{ status: 403 },
		);
	}
    await connectMongoDB();
    const id = params.id;
    const data = await req.json();
    const result = await updateEvent(id, data);
    return result;
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    // Require admin for DELETE
	const isAdmin = await requireAdmin(req);
	if (!isAdmin) {
		return NextResponse.json(
			{ status: 403, message: "Forbidden" },
			{ status: 403 },
		);
	}
    await connectMongoDB();
    const id = params.id;
    const result = await deleteEvent(id);
    return result;
}
