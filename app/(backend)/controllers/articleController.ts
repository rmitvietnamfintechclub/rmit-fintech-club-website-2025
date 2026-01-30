import Article from "../models/article";
import type { Article as ArticleType } from "../types/article";

type GetArticlesResult = {
  articles: ArticleType[];
  totalPages: number;
};

export async function getArticles(
  labels: string[],
  page: number = 1,
  limit: number = 10
): Promise<GetArticlesResult> {
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};
  if (labels.length > 0) {
    query.labels = {
      $in: labels.map((label) => new RegExp(`^${label}$`, "i")),
    };
  }

  // Chạy song song 2 query cho nhanh
  const [totalArticles, articles] = await Promise.all([
    Article.countDocuments(query),
    Article.find(query)
      .select("_id title summary illustration_url labels publicationDate")
      .sort({ publicationDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalArticles / limit);

  return { articles: articles as unknown as ArticleType[], totalPages };
}

export async function getArticleById(id: string) {
  const article = await Article.findById(id).lean() as ArticleType | null;

  if (!article) return null;

  // Logic tìm bài viết liên quan
  let sidebarTitle = "Related Articles";
  let sidebarArticles = await Article.find({
    labels: { $in: article.labels },
    _id: { $ne: article._id },
  })
    .select("_id title publicationDate illustration_url")
    .sort({ publicationDate: -1 })
    .limit(2)
    .lean();

  if (sidebarArticles.length === 0) {
    sidebarTitle = "Latest Articles";
    sidebarArticles = await Article.find({
      _id: { $ne: article._id },
    })
      .select("_id title publicationDate illustration_url")
      .sort({ publicationDate: -1 })
      .limit(2)
      .lean();
  }

  return { article, sidebarTitle, sidebarArticles };
}

export async function createArticle(
  data: Omit<ArticleType, "_id" | "createdAt" | "updatedAt">
) {
  const article = await Article.create(data);
  return article;
}

export async function updateArticle(id: string, data: Partial<ArticleType>) {
  const article = await Article.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  return article;
}

export async function deleteArticle(id: string) {
  const article = await Article.findByIdAndDelete(id).lean();
  return article;
}