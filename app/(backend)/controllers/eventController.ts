import Event from "@/app/(backend)/models/event";
import type { IEvent } from "@/app/(backend)/types/event";

export async function getAllEvents(
  page: number = 1,
  limit: number = 10,
  status?: string,
  mode?: string,
) {
  const skip = (page - 1) * limit;
  const now = new Date();

  let query: any = {};

  if (status === "open") {
    query.registrationLink = { $exists: true, $ne: "" };
    query.$or = [
      { registrationDeadline: { $gte: now } },
      { registrationDeadline: null },
      { registrationDeadline: { $exists: false } },
    ];
  } else if (status === "closed") {
    query.registrationLink = { $exists: true, $ne: "" };
    query.registrationDeadline = { $lt: now };
  } else if (status === "no_reg") {
    query.$or = [
      { registrationLink: { $exists: false } },
      { registrationLink: "" },
      { registrationLink: null },
    ];
  }

  if (mode) {
    query.mode = mode;
  }

  const events = await Event.find(query)
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const count = await Event.countDocuments(query);

  return {
    events: events as unknown as IEvent[],
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
}

export async function getUpcomingEvents(limit: number = 6) {
  const currDate = new Date();
  currDate.setHours(0, 0, 0, 0);

  const query = { date: { $gte: currDate } };

  const events = await Event.find(query).sort({ date: 1 }).limit(limit).lean();

  return {
    events: events as unknown as IEvent[],
    count: events.length,
  };
}

export async function getEventById(id: string) {
  const event = await Event.findById(id).lean();

  if (!event) return null;

  const otherEvents = await Event.find({ _id: { $ne: id } })
    .select("name posterUrl date startTime mode location")
    .sort({ date: 1 })
    .limit(3)
    .lean();

  return {
    event: event as unknown as IEvent,
    otherEvents: otherEvents as unknown as IEvent[],
  };
}

export async function createEvent(
  data: Omit<IEvent, "_id" | "created_at" | "updated_at">,
) {
  const event = new Event(data);
  await event.save();
  return event;
}

export async function updateEvent(id: string, updateData: Partial<IEvent>) {
  const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  return updatedEvent;
}

export async function deleteEvent(id: string) {
  const deletedEvent = await Event.findByIdAndDelete(id).lean();
  return deletedEvent;
}
