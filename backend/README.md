# SupportDesk Backend

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set MongoDB and JWT values.

3. For the AI assistant, create a Mistral API key and set:

```env
MISTRAL_API_KEY=your_key
MISTRAL_MODEL=mistral-small-latest
```

The API key must stay on the backend. Do not put it in the React/Vite environment.

## Mistral AI agent

The `/api/ai/answer` endpoint uses a Mistral chat-completions agent loop with function calling. The model can call the read-only `search_knowledge_base` tool, the backend executes that MongoDB query, and the tool result is returned to Mistral for the final grounded answer.

The implementation deliberately uses the REST API instead of requiring a Mistral SDK, keeping the local project dependency footprint small. The model, output token cap, tool-result count, timeout, and maximum agent steps are configurable through `.env`.

No email provider is required for this local-testing project.
