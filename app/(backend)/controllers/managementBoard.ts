import { NextResponse } from "next/server";
import ManagementBoard from "../models/managementBoard";
import connectMongoDB from "../libs/mongodb";

// Add new management board members
export async function addManagementBoard(data: any) {
	try {
		if (!Number.isInteger(data.generation) || data.generation < 1) {
			return {
				status: 400,
				message: "Generation must be a positive integer",
			};
		}
		const member = new ManagementBoard(data);
		await member.save();
		return { status: 201, member };
	} catch (error: any) {
		return { status: 400, message: error.message };
	}
}

// Update existing management board members by id
export async function updateManagementBoard(id: string, data: any) {
	if (!data) {
		return { status: 400, message: "No data provided" };
	}

	try {
		const updated = await ManagementBoard.findByIdAndUpdate(id, data, {
			new: true,
		});
		if (!updated) {
			return { status: 404, message: "Member not found" };
		}
		return { status: 200, member: updated };
	} catch (err: any) {
		return { status: 500, message: "Update failed" };
	}
}

// Delete existing management board members by id
export async function deleteManagementBoard(id: string) {
	try {
		const deleted = await ManagementBoard.findByIdAndDelete(id);
		if (!deleted) {
			return { status: 404, message: "Member not found" };
		}
		return { status: 200, message: "Member deleted" };
	} catch (err: any) {
		return { status: 500, message: "Delete failed" };
	}
}
