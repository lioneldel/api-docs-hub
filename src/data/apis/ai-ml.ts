import { ApiEntry } from '../../types/api';

export const aiMlApis: ApiEntry[] = [
  {
    id: 'openai',
    name: 'OpenAI API',
    description: 'Leading frontier AI models including GPT-4o, GPT-4o-mini, o1, o3-mini reasoning models, DALL-E 3, Whisper audio transcription, and text embeddings.',
    shortDescription: 'GPT-4o, o1 reasoning models, Embeddings, TTS, and Whisper APIs.',
    category: 'ai-ml',
    tags: ['ai-ml', 'llm', 'gpt-4o', 'reasoning', 'embeddings', 'vision', 'audio', 'dall-e'],
    website: 'https://openai.com',
    docsUrl: 'https://platform.openai.com/docs',
    apiReferenceUrl: 'https://platform.openai.com/docs/api-reference',
    baseUrl: 'https://api.openai.com/v1',
    authMethod: 'bearer-token',
    authSetupGuide: 'Generate secret key on platform.openai.com -> API keys. Include in header: Authorization: Bearer <OPENAI_API_KEY>.',
    pricing: 'pay-as-you-go',
    pricingDetails: 'GPT-4o: $2.50 / 1M input, $10.00 / 1M output tokens. GPT-4o-mini: $0.15 / 1M input.',
    sdks: [
      { language: 'Node/TypeScript', package: 'openai', installCommand: 'npm install openai' },
      { language: 'Python', package: 'openai', installCommand: 'pip install openai' }
    ],
    quickstart: `import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Explain quantum computing in one sentence.' }],
});
console.log(completion.choices[0].message.content);`,
    endpoints: [
      {
        method: 'POST',
        path: '/chat/completions',
        summary: 'Create Chat Completion',
        description: 'Generates model response given a chat conversation history and tool definitions.',
        parameters: [
          { name: 'model', type: 'string', required: true, description: 'Model ID (e.g. gpt-4o, o3-mini)' },
          { name: 'messages', type: 'array', required: true, description: 'Array of message objects' }
        ]
      },
      {
        method: 'POST',
        path: '/embeddings',
        summary: 'Create Embeddings',
        description: 'Generates high-dimensional vector representations of text.'
      },
      {
        method: 'POST',
        path: '/audio/transcriptions',
        summary: 'Create Transcription (Whisper)',
        description: 'Transcribes audio into input language text.'
      }
    ],
    useCases: ['Conversational assistants & copilots', 'Structured JSON extraction', 'Vector search embeddings', 'Audio voice transcription'],
    alternatives: ['anthropic', 'google-gemini', 'mistral', 'groq'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude Messages API',
    description: 'State-of-the-art language and reasoning models including Claude 3.7 Sonnet (with hybrid extended thinking), Claude 3.5 Haiku, and Claude 3 Opus with industry-leading coding and instruction-following.',
    shortDescription: 'Claude 3.7 Sonnet & Haiku with hybrid thinking, vision, and tool use.',
    category: 'ai-ml',
    tags: ['ai-ml', 'llm', 'claude', 'sonnet', 'haiku', 'extended-thinking', 'coding', 'vision'],
    website: 'https://anthropic.com',
    docsUrl: 'https://docs.anthropic.com',
    apiReferenceUrl: 'https://docs.anthropic.com/en/api/getting-started',
    baseUrl: 'https://api.anthropic.com/v1',
    authMethod: 'api-key',
    authSetupGuide: 'Supply "x-api-key: <ANTHROPIC_API_KEY>" and "anthropic-version: 2023-06-01" in headers.',
    pricing: 'pay-as-you-go',
    pricingDetails: 'Claude 3.7 Sonnet: $3.00 / 1M input, $15.00 / 1M output. Prompt caching discounts available.',
    sdks: [
      { language: 'Node/TypeScript', package: '@anthropic-ai/sdk', installCommand: 'npm install @anthropic-ai/sdk' },
      { language: 'Python', package: 'anthropic', installCommand: 'pip install anthropic' }
    ],
    quickstart: `import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const message = await anthropic.messages.create({
  model: 'claude-3-7-sonnet-20250219',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Draft an architectural spec for a distributed cache.' }],
});
console.log(message.content);`,
    endpoints: [
      {
        method: 'POST',
        path: '/messages',
        summary: 'Create Message',
        description: 'Send a structured conversation to Claude and receive a streaming or non-streaming response.',
        parameters: [
          { name: 'model', type: 'string', required: true, description: 'e.g. claude-3-7-sonnet-20250219' },
          { name: 'messages', type: 'array', required: true, description: 'User and assistant turns' },
          { name: 'max_tokens', type: 'integer', required: true, description: 'Maximum tokens to generate' }
        ]
      },
      {
        method: 'POST',
        path: '/messages/batches',
        summary: 'Create Message Batch',
        description: 'Submit asynchronous batches with 50% cost discount.'
      }
    ],
    useCases: ['Autonomous coding agents', 'Deep document analysis with large context', 'Complex multi-step tool calling'],
    alternatives: ['openai', 'google-gemini', 'mistral'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini API',
    description: 'Multimodal AI with up to 2 million token context windows. Supports native video, audio, code, and text understanding with Gemini 2.0 Flash, Gemini 1.5 Pro, and Imagen 3.',
    shortDescription: 'Multimodal 2M context window LLMs with native audio/video support.',
    category: 'ai-ml',
    tags: ['ai-ml', 'llm', 'gemini', 'multimodal', 'long-context', 'video-processing', 'google'],
    website: 'https://ai.google.dev',
    docsUrl: 'https://ai.google.dev/docs',
    apiReferenceUrl: 'https://ai.google.dev/api',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    authMethod: 'api-key',
    authSetupGuide: 'Get API key from Google AI Studio. Pass as query parameter ?key=<API_KEY> or x-goog-api-key header.',
    pricing: 'freemium',
    pricingDetails: 'Generous free tier (up to 15 RPM). Paid tier starts at $0.075 / 1M tokens for Gemini Flash.',
    sdks: [
      { language: 'Node.js', package: '@google/genai', installCommand: 'npm install @google/genai' },
      { language: 'Python', package: 'google-genai', installCommand: 'pip install google-genai' }
    ],
    quickstart: `import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: 'Summarize 100 pages of text in 3 bullet points.',
});
console.log(response.text);`,
    endpoints: [
      {
        method: 'POST',
        path: '/models/{model}:generateContent',
        summary: 'Generate Content',
        description: 'Processes multimodal inputs (text, image, audio, video) and generates responses.'
      },
      {
        method: 'POST',
        path: '/models/{model}:embedContent',
        summary: 'Embed Content',
        description: 'Generates text embeddings for vector retrieval.'
      }
    ],
    useCases: ['Analyzing 1-hour video recordings', 'Large codebase comprehension in single context', 'High-throughput cost-effective workflows'],
    alternatives: ['openai', 'anthropic', 'cohere'],
    lastUpdated: '2026-02-25'
  },
  {
    id: 'groq',
    name: 'Groq LPU Inference API',
    description: 'Ultra-fast AI inference platform powered by custom LPU (Language Processing Unit) silicon, serving open-weights models (Llama 3.3 70B, DeepSeek R1, Whisper) at 500+ tokens/sec.',
    shortDescription: 'Sub-second, 500+ tokens/sec inference for open-source AI models.',
    category: 'ai-ml',
    tags: ['ai-ml', 'lpu', 'fast-inference', 'llama3', 'deepseek', 'low-latency', 'real-time'],
    website: 'https://groq.com',
    docsUrl: 'https://console.groq.com/docs/quickstart',
    apiReferenceUrl: 'https://console.groq.com/docs/api-reference',
    baseUrl: 'https://api.groq.com/openai/v1',
    authMethod: 'bearer-token',
    authSetupGuide: 'Create API key at console.groq.com and pass as Authorization: Bearer <GROQ_API_KEY>. Fully OpenAI-compatible.',
    pricing: 'pay-as-you-go',
    pricingDetails: 'Extremely affordable: $0.59 / 1M tokens for Llama 3.3 70B; Free tier available with rate limits.',
    sdks: [
      { language: 'Node.js', package: 'groq-sdk', installCommand: 'npm install groq-sdk' },
      { language: 'Python', package: 'groq', installCommand: 'pip install groq' }
    ],
    quickstart: `import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatCompletion = await groq.chat.completions.create({
  messages: [{ role: 'user', content: 'What is speed of light?' }],
  model: 'llama-3.3-70b-versatile',
});
console.log(chatCompletion.choices[0]?.message?.content);`,
    endpoints: [
      {
        method: 'POST',
        path: '/chat/completions',
        summary: 'Create Chat Completion',
        description: 'OpenAI-compatible chat completion endpoint running at 500+ tokens per second.'
      }
    ],
    useCases: ['Voice conversation bots requiring <300ms latency', 'Live UI autocomplete', 'Real-time coding helpers'],
    alternatives: ['together-ai', 'mistral', 'openai'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Voice AI API',
    description: 'Lifelike text-to-speech, voice cloning, audio isolation, real-time Conversational Voice AI, and sound effect generation across 29+ languages.',
    shortDescription: 'Human-quality text-to-speech, voice cloning, and Conversational Voice Agents.',
    category: 'ai-ml',
    tags: ['ai-ml', 'voice', 'text-to-speech', 'voice-cloning', 'conversational-ai', 'audio'],
    website: 'https://elevenlabs.io',
    docsUrl: 'https://elevenlabs.io/docs',
    apiReferenceUrl: 'https://elevenlabs.io/docs/api-reference',
    baseUrl: 'https://api.elevenlabs.io/v1',
    authMethod: 'api-key',
    authSetupGuide: 'Supply xi-api-key: <YOUR_API_KEY> in headers.',
    pricing: 'freemium',
    pricingDetails: 'Free tier includes 10,000 characters/month. Starter plan starts at $5/month.',
    sdks: [
      { language: 'Node/TypeScript', package: 'elevenlabs', installCommand: 'npm install elevenlabs' },
      { language: 'Python', package: 'elevenlabs', installCommand: 'pip install elevenlabs' }
    ],
    quickstart: `import { ElevenLabsClient } from 'elevenlabs';
const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const audio = await client.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
  text: 'Hello! Antigravity is ready to assist you today.',
  model_id: 'eleven_multilingual_v2',
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/text-to-speech/{voice_id}',
        summary: 'Convert Text to Speech',
        description: 'Converts text into natural, emotion-rich audio bytes.'
      },
      {
        method: 'GET',
        path: '/voices',
        summary: 'Get Voices',
        description: 'List all available default and custom cloned voices.'
      }
    ],
    useCases: ['Voice interactive phone agents', 'Audiobook & podcast narration', 'Video voiceovers and dubbing'],
    alternatives: ['deepgram', 'openai', 'playht'],
    lastUpdated: '2026-02-18'
  }
];
