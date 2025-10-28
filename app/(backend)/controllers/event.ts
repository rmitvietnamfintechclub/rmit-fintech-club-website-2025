import { NextResponse } from "next/server";
import Event from "../models/event";
import mongoose from "mongoose";

// Add new event
export async function addEvent(data: any) {
    try {
        const event = new Event(data);
        await event.save();
        return NextResponse.json(event, { status: 201 });
    } catch(err: any) {
        return NextResponse.json(err, { status: err.status });
    } 
}

// Update existing event by id
export async function updateEvent(id: string, data: any) {
    if (!data) {
        return NextResponse.json(
            { message: "No data provided" },
            { status: 400 }
        );
    }

    try {
        const updated = await Event.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!updated) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { event: updated },
            { status: 200 }
        );
    } catch(err: any) {
        return NextResponse.json(err, { status: err.status });
    }
}

// Delete existing event by id
export async function deleteEvent(id: string) {
    try {
        const deleted = await Event.findByIdAndDelete(id);
        if(!deleted) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { event: deleted },
            { status: 200 }
        );
    } catch(err: any) {
        return NextResponse.json(err, { status: err.status });
    }
}