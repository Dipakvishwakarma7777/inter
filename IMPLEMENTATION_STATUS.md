# SupportDesk Implementation Status

## Local/testing build

- Email delivery is intentionally disabled for this local/testing build. Password reset uses a temporary local reset URL.
- AI assistant is implemented with Mistral AI only.
- The AI endpoint is protected by authentication and a dedicated rate limiter.

## Mistral AI Agent

The AI assistant uses the Mistral Chat Completions API with function calling. The model acts as a read-only SupportDesk agent and can call the `search_knowledge_base` tool. The backend executes that tool against MongoDB and returns the results to Mistral so the model can produce a grounded answer.

Default local-testing model:

```env
MISTRAL_MODEL=mistral-small-latest
```

The model is configurable without code changes. Mistral documents `mistral-small-latest` as a function-calling-capable general model. The implementation limits question length, output tokens, tool results, agent steps, request timeout, and requests per 15 minutes to reduce API usage.

## Environment

```env
MISTRAL_API_KEY=
MISTRAL_MODEL=mistral-small-latest
MISTRAL_MAX_QUESTION_LENGTH=1200
MISTRAL_MAX_OUTPUT_TOKENS=500
MISTRAL_MAX_TOOL_RESULTS=5
MISTRAL_MAX_AGENT_STEPS=3
MISTRAL_TIMEOUT_MS=20000
```

Keep the API key in `backend/.env` only. Never expose it through Vite/frontend environment variables.
