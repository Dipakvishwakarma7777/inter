const Article = require("../models/KnowledgeBaseArticle");
const { success, failure } = require("../utils/response");
const list = async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    const filter = { isPublished: true };
    if (q) filter.$text = { $search: q.slice(0, 100) };
    return success(
      res,
      await Article.find(filter)
        .populate("category", "name")
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .limit(50),
    );
  } catch (e) {
    next(e);
  }
};
const get = async (req, res, next) => {
  try {
    const a = await Article.findOne({ _id: req.params.id, isPublished: true })
      .populate("category", "name")
      .populate("createdBy", "name");
    if (!a) return failure(res, "Article not found", 404);
    return success(res, a);
  } catch (e) {
    next(e);
  }
};
const create = async (req, res, next) => {
  try {
    return success(
      res,
      await Article.create({ ...req.body, createdBy: req.user.id }),
      "Article created",
      201,
    );
  } catch (e) {
    next(e);
  }
};
const update = async (req, res, next) => {
  try {
    const a = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!a) return failure(res, "Article not found", 404);
    return success(res, a, "Article updated");
  } catch (e) {
    next(e);
  }
};
const remove = async (req, res, next) => {
  try {
    const a = await Article.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true },
    );
    if (!a) return failure(res, "Article not found", 404);
    return success(res, a, "Article unpublished");
  } catch (e) {
    next(e);
  }
};
module.exports = { list, get, create, update, remove };
