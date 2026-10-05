export const validateLogin = (values) => {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateTicket = (values) => {
  const errors = {};

  if (!values.title?.trim()) {
    errors.title = "Title is required";
  } else if (values.title.trim().length > 200) {
    errors.title = "Title must be 200 characters or fewer";
  }

  if (!values.description?.trim()) {
    errors.description = "Description is required";
  } else if (values.description.trim().length > 20000) {
    errors.description = "Description must be 20,000 characters or fewer";
  }

  return errors;
};

export const validateRegister = (values) => {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (values.password.length > 128) {
    errors.password = "Password must be 128 characters or fewer";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
