const { getDashboard } = require("../services/dashboard.service");
const { success } = require("../utils/response");

const dashboard = async (req, res, next) => {
  try {
    return success(res, await getDashboard(req.user));
  } catch (e) {
    next(e);
  }
};

module.exports = { dashboard };
