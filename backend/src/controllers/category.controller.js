const Category = require("../models/Category");
const { success, failure } = require("../utils/response");

const getCategories = async (req, res, next) => {
  try {
    return success(
      res,
      await Category.find({ isActive: true }).sort({ name: 1 }),
    );
  } catch (e) {
    next(e);
  }
};

const createCategory = async (req, res, next) => {
  try {
    return success(
      res,
      await Category.create(req.body),
      "Category created",
      201,
    );
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return failure(res, "Category not found", 404);
    return success(res, category, "Category updated");
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!category) return failure(res, "Category not found", 404);
    return success(res, category, "Category deactivated");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
