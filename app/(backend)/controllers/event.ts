import Event from "@/app/(backend)/models/event";
import mongoose from "mongoose";

// --- Service: Lấy danh sách Event (Pagination & Filter) ---
export async function getEvents(limit: number = 10, offset: number = 0) {
    const currDate = new Date();
    
    // Logic query: Lấy event từ hiện tại trở đi
    const query = { date: { $gte: currDate } };

    const [events, total] = await Promise.all([
        Event.find(query, { 
            name: 1, posterUrl: 1, date: 1, time: 1, mode: 1, location: 1 
        })
        .sort({ date: 1 })
        .skip(offset)
        .limit(limit)
        .lean(),
        Event.countDocuments(query)
    ]);

    return { events, total, limit, offset };
}

// --- Service: Lấy chi tiết Event (Sanitize Data) ---
export async function getEventById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid event ID");
    }

    const event = await Event.findById(id).lean() as any;

    if (!event) return null;

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
        created_at: event.created_at || new Date(), // Fallback nếu thiếu
        updated_at: event.updated_at || new Date(),
    };

    return sanitizedEvent;
}

// --- Service: Thêm Event ---
export async function addEvent(data: any) {
    const event = await Event.create(data);
    return event;
}

// --- Service: Update Event ---
export async function updateEvent(id: string, data: any) {
    if (!data) throw new Error("No data provided");

    const updated = await Event.findByIdAndUpdate(id, data, { new: true }).lean();
    return updated;
}

// --- Service: Delete Event ---
export async function deleteEvent(id: string) {
    const deleted = await Event.findByIdAndDelete(id).lean();
    return deleted;
}