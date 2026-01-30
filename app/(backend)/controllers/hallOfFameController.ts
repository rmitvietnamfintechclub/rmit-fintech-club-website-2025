import HallOfFame from "@/app/(backend)/models/hallOfFame";

export async function getHonorees(
  semester?: string | null,
  category?: string | null,
  year?: string | null
) {
  const filter: Record<string, any> = {};

  if (category) filter.category = category;
  
  if (semester) {
    filter.semester = semester;
  } else if (year) {
    filter.semester = { $regex: `^${year}` };
  }

  const honorees = await HallOfFame.find(filter).sort({ name: 1 }).lean();
  return honorees;
}

export async function createHonoree(data: any) {
  const { name, achievement, category, photo_url, semester } = data;
  if (!name || !achievement || !category || !photo_url || !semester) {
    throw new Error("Missing required fields");
  }

  const honoree = await HallOfFame.create(data);
  return honoree;
}

export async function updateHonoree(id: string, data: any) {
  const honoree = await HallOfFame.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  return honoree;
}

export async function deleteHonoree(id: string) {
  const result = await HallOfFame.findByIdAndDelete(id).lean();
  return result;
}