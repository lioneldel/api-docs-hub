# 🌐 API Docs Hub & MCP Server

> A smart **API Documentation Directory** and **Model Context Protocol (MCP) Server** that enables LLMs (Claude, ChatGPT, Cursor, Antigravity) to fetch targeted documentation, discover endpoints, and recommend the exact API stack required for any software task with expected outcomes.

---

## ✨ Features

- 🔍 **Smart Search Web Directory**: Fuzzy search across 100+ production APIs with typo tolerance, category filters, and live quickstart code copying.
- 🤖 **AI Task Recommender**: Describe any project (e.g., *"Build an AI SaaS with subscription payments, email verification, and vector search"*) and receive:
  - Required API stack (Essential vs. Recommended)
  - Architectural blueprint & reasoning for each API
  - Expected architectural outcome
- ⚡ **Model Context Protocol (MCP) Server**:
  - `search_apis`: Search API directory by capability or keyword.
  - `get_api_docs`: Fetch targeted, accurate docs, base URLs, auth setup, and quickstarts for an API.
  - `recommend_apis`: State to the prompter which APIs are needed for a task and the expected outcome.
  - `get_api_endpoints`: Inspect endpoint paths, parameters, and example responses.
  - `compare_apis`: Generate side-by-side comparison tables.
- 🚀 **Dual Transport Modes**: Local `stdio` transport for IDEs & LLM desktop clients, plus an HTTP server for web clients and remote hosting.

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Web Application
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run the MCP Server (Local Stdio Mode)
```bash
npm run mcp:dev
```

### 4. Run the HTTP Server Mode
```bash
npm run mcp:http
```
Listens on `http://localhost:3001` with CORS enabled.

---

## 🔌 Connecting to Claude Desktop / Cursor / Antigravity

Add the following to your `claude_desktop_config.json` or `.mcp.json`:

```json
{
  "mcpServers": {
    "api-docs-hub": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/Users/lioneliqi/Desktop/api-docs-hub/mcp-server/index.ts"
      ]
    }
  }
}
```

---

## 🛠️ MCP Tools Overview

### 1. `recommend_apis`
**Description**: Analyzes a task and tells the prompter which APIs will be required and what the expected outcome is.
```json
{
  "task": "I want to build a real estate platform with user logins, map search, and Stripe subscriptions"
}
```

### 2. `get_api_docs`
**Description**: Fetches targeted documentation for an API.
```json
{
  "apiId": "stripe",
  "section": "all"
}
```

### 3. `search_apis`
**Description**: Searches the directory by keyword or category.
```json
{
  "query": "vector embeddings",
  "category": "ai-ml",
  "limit": 5
}
```

### 4. `get_api_endpoints`
**Description**: Lists endpoint specifications with parameters.
```json
{
  "apiId": "resend"
}
```

### 5. `compare_apis`
**Description**: Compares 2 or more APIs side by side.
```json
{
  "apiIds": ["stripe", "paddle", "razorpay"]
}
```

---

## 🗂️ Project Structure
```
api-docs-hub/
├── src/
│   ├── components/       # SearchBar, ApiCard, Modals, Navbar, CategoryFilter
│   ├── data/
│   │   ├── apis/         # 10 modular category files (payments, auth, ai-ml, etc.)
│   │   ├── registry.ts   # Central API aggregator
│   │   ├── categories.ts # Category definitions
│   │   └── search-index.ts # Fuse.js search & Task Recommender engine
│   ├── types/            # TypeScript schemas (ApiEntry, ApiEndpoint, etc.)
│   ├── App.tsx           # Main application view
│   ├── index.css         # Tailwind & glassmorphism theme
│   └── main.tsx          # React mounting
├── mcp-server/
│   ├── index.ts          # Stdio MCP Server (for LLMs)
│   └── http-server.ts    # HTTP MCP Server
└── package.json
```

---

## 📄 License
MIT
