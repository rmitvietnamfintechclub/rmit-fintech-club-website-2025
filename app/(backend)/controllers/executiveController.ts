import ExecutiveMember from "@/app/(backend)/models/executiveMember";

// Get all executive members with optional generation filtering
export async function getExecutiveMembers(generation?: string) {
  try {
    let filter: any = {};

    if (generation) {
      const genNum = parseInt(generation, 10);
      if (isNaN(genNum) || genNum < 1) {
        return { status: 400, message: "Invalid generation parameter" };
      }
      filter.generation = genNum;
    }
    // If no generation, do NOT set filter.generation

    const members = await ExecutiveMember.find(filter);
    return { status: 200, members };
  } catch (error) {
    return { status: 500, message: "Error fetching executive members" };
  }
}

// Get a single executive member by ID
export async function getExecutiveMemberById(id: string) {
  try {
    const member = await ExecutiveMember.findById(id);
    if (!member) {
      return { status: 404, message: "Executive member not found" };
    }
    return { status: 200, member };
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
}

// Add a new executive member
export async function addExecutiveMember(data: any) {
  try {
    if (!Number.isInteger(data.generation) || data.generation < 1) {
      return { status: 400, message: "Generation must be a positive integer" };
    }
    const member = new ExecutiveMember(data);
    await member.save();
    return { status: 201, member };
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
}

// Update an executive member by ID
export async function updateExecutiveMember(id: string, data: any) {
  try {
    if (data.generation !== undefined && (!Number.isInteger(data.generation) || data.generation < 1)) {
      return { status: 400, message: "Generation must be a positive integer" };
    }
    const updated = await ExecutiveMember.findOneAndUpdate(
      { _id: id },
      data,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return { status: 404, message: "Executive member not found" };
    }
    return { status: 200, member: updated };
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
}

// Delete an executive member by ID
export async function deleteExecutiveMember(id: string) {
  try {
    const deleted = await ExecutiveMember.findByIdAndDelete(id);
    if (!deleted) {
      return { status: 404, message: "Executive member not found" };
    }
    return { status: 200, message: "Executive member deleted" };
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
} 