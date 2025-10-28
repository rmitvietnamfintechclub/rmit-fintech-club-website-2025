import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Article from "../models/article";
import connectMongoDB from "../libs/mongodb";
import type { Article as ArticleType } from "../types/article";

/**
 * Function: Get all articles with optional filtering and pagination.
 * This single function handles fetching all articles and filtering by labels.
 */
export async function getArticles(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const labels = searchParams.getAll("labels");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Default limit to 10
  const skip = (page - 1) * limit;

  // Validate pagination parameters
  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { message: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  try {
    await connectMongoDB();

    // Build query - this handles cases where `labels` is empty or present
    const query: any = {};
    if (labels.length > 0) {
      // Use $in for efficient matching of multiple labels (case-insensitive)
      query.labels = {
        $in: labels.map((label) => new RegExp(`^${label}$`, "i")),
      };
    }

    // Perform queries to get total count and the paginated articles
    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / limit);

    const articles = await Article.find(query)
      .select("_id title summary illustration_url labels publicationDate")
      .sort({ publicationDate: -1 })
      .skip(skip)
      .limit(limit);

    // Always return a consistent data structure
    return NextResponse.json(
      {
        articles,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Cannot fetch articles" },
      { status: 500 }
    );
  }
}

/**
 * Function: Get a single article by its ID and a list of suggested articles.
 * The suggested list will be related articles if any are found;
 * otherwise, it will fall back to the latest articles.
 */
export async function getArticleById(id: string) {
  try {
    await connectMongoDB();
    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    let sidebarTitle = "Related Articles";
    let sidebarArticles = [];

    // 1. Attempt to find related articles based on labels
    sidebarArticles = await Article.find({
      labels: { $in: article.labels }, // Match articles with any of the same labels
      _id: { $ne: article._id }, // Exclude the main article itself
    })
      .select("_id title publicationDate illustration_url")
      .sort({ publicationDate: -1 })
      .limit(2);

    // 2. If no related articles were found, fetch the latest articles as a fallback
    if (sidebarArticles.length === 0) {
      sidebarTitle = "Latest Articles";
      sidebarArticles = await Article.find({
        _id: { $ne: article._id }, // Still exclude the current article
      })
        .select("_id title publicationDate illustration_url")
        .sort({ publicationDate: -1 })
        .limit(2);
    }

    // 3. Return a consistent data structure for the frontend
    return NextResponse.json(
      {
        article,
        sidebarTitle,
        sidebarArticles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return NextResponse.json(
      { error: "Cannot fetch article" },
      { status: 500 }
    );
  }
}

/**
 * Function: Create a new article.
 */
export async function createArticle(
  data: Omit<ArticleType, "_id" | "createdAt" | "updatedAt">
) {
  try {
    await connectMongoDB();
    const article = await Article.create(data);
    return NextResponse.json(
      { message: "Article created successfully", article },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Cannot create article" },
      { status: 500 }
    );
  }
}

/**
 * Function: Update an existing article by its ID.
 */
export async function updateArticle(id: string, data: Partial<ArticleType>) {
  try {
    await connectMongoDB();
    const article = await Article.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Article updated successfully", article },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "Cannot update article" },
      { status: 500 }
    );
  }
}

/**
 * Function: Delete an article by its ID.
 */
export async function deleteArticle(id: string) {
  try {
    await connectMongoDB();
    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "Cannot delete article" },
      { status: 500 }
    );
  }
}
