const { success, failure } = require("../utils/response");
const { answerWithMistralAgent } = require("../services/mistral-agent.service");

const answer = async (req, res, next) => {
  try {
    const question = String(req.body.question || "").trim();
    if (!question) return failure(res, "Question is required", 422);

    const result = await answerWithMistralAgent(question);
    return success(res, result);
  } catch (error) {
    if (error.statusCode === 429) {
      return failure(
        res,
        "Mistral API rate limit reached. Please wait a moment and try again.",
        429,
      );
    }

    if (error.statusCode === 503) {
      return failure(
        res,
        "Mistral AI is not configured. Add MISTRAL_API_KEY to backend/.env.",
        503,
      );
    }

    if (error.statusCode === 504) {
      return failure(
        res,
        "Mistral AI request timed out. Please try again.",
        504,
      );
    }

    next(error);
  }
};

module.exports = { answer };
