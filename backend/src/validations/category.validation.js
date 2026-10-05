const categoryValidation = (body) => {
  const errors = [];
  if (!body.name?.trim() || body.name.trim().length > 100)
    errors.push("Category name is required and must be <= 100 characters");
  if (body.description && body.description.length > 500)
    errors.push("Description is too long");
  return errors;
};
module.exports = { categoryValidation };
