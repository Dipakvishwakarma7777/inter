const ticketValidation = (body) => {
  const errors = [];
  if (
    body.title !== undefined &&
    (!body.title?.trim() || body.title.trim().length > 200)
  )
    errors.push("Title is required and must be <= 200 characters");
  if (
    body.description !== undefined &&
    (!body.description?.trim() || body.description.trim().length > 20000)
  )
    errors.push("Description is required and must be <= 20000 characters");
  if (
    body.priority &&
    !["low", "medium", "high", "urgent"].includes(body.priority)
  )
    errors.push("Invalid priority");
  if (
    body.status &&
    !["open", "in-progress", "resolved", "closed"].includes(body.status)
  )
    errors.push("Invalid status");
  return errors;
};
module.exports = { ticketValidation };
