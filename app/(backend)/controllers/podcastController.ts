import Podcast from "@/app/(backend)/models/podcast";
import type { Podcast as PodcastType } from "@/app/(backend)/types/podcast";

// --- Service: Lấy danh sách Podcast ---
export async function getPodcasts(
  labels: string[] = [],
  page: number = 1,
  limit: number = 5
) {
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};
  if (labels.length > 0) {
    query.labels = {
      $in: labels.map((label) => new RegExp(`^${label}$`, "i")),
    };
  }

  // Chạy song song count và find để tối ưu tốc độ
  const [totalPodcasts, podcasts] = await Promise.all([
    Podcast.countDocuments(query),
    Podcast.find(query)
      .select("_id title summary thumbnail_url labels publicationDate")
      .sort({ publicationDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(), // .lean() giúp trả về object nhẹ hơn
  ]);

  const totalPages = Math.ceil(totalPodcasts / limit);

  return { podcasts, totalPages };
}

// --- Service: Lấy chi tiết Podcast ---
export async function getPodcastById(id: string) {
  const podcast = await Podcast.findById(id).lean();

  if (!podcast) return null;

  // Ensure podcast has labels property
  const podcastWithLabels = podcast as unknown as PodcastType;

  let sidebarTitle = "Related Podcasts";
  let sidebarPodcasts = [];

  // 1. Tìm podcast liên quan (cùng label)
  sidebarPodcasts = await Podcast.find({
    labels: { $in: podcastWithLabels.labels },
    _id: { $ne: podcastWithLabels._id },
  })
    .select("_id title publicationDate thumbnail_url")
    .sort({ publicationDate: -1 })
    .limit(3)
    .lean();

  // 2. Nếu không có, lấy podcast mới nhất (Fallback)
  if (sidebarPodcasts.length === 0) {
    sidebarTitle = "Latest Podcasts";
    sidebarPodcasts = await Podcast.find({
      _id: { $ne: (podcast as { _id: any })._id },
    })
      .select("_id title publicationDate thumbnail_url")
      .sort({ publicationDate: -1 })
      .limit(3)
      .lean();
  }

  return {
    podcast,
    sidebarTitle,
    sidebarPodcasts,
  };
}

// --- Service: Tạo Podcast ---
export async function createPodcast(
  data: Omit<PodcastType, "_id" | "createdAt" | "updatedAt">
) {
  const podcast = await Podcast.create(data);
  return podcast;
}

// --- Service: Cập nhật Podcast ---
export async function updatePodcast(id: string, data: Partial<PodcastType>) {
  const podcast = await Podcast.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  return podcast;
}

// --- Service: Xóa Podcast ---
export async function deletePodcast(id: string) {
  const podcast = await Podcast.findByIdAndDelete(id).lean();
  return podcast;
}

export async function getUniqueLabels() {
  const labels = await Podcast.distinct("labels");
  return labels.sort();
}