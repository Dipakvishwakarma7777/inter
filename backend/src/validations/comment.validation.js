const commentValidation = (body) => {
  const errors = [];
  if (!body.message?.trim()) errors.push("Comment message is required");
  return errors;
};

module.exports = { commentValidation };
