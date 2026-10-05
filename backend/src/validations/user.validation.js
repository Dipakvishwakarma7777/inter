const userValidation = (body) => {
  const errors = [];
  if (body.name !== undefined && body.name.trim().length < 2)
    errors.push("Name is too short");
  if (body.phone !== undefined && body.phone.length > 30)
    errors.push("Phone is too long");
  return errors;
};

module.exports = { userValidation };
