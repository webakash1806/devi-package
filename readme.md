# Create-DEVI

[![npm version](https://img.shields.io/npm/v/create-devi.svg)](https://www.npmjs.com/package/create-devi)
[![npm downloads](https://img.shields.io/npm/dt/create-devi.svg)](https://www.npmjs.com/package/create-devi)
[![License](https://img.shields.io/npm/l/create-devi.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/node/v/create-devi.svg)](https://nodejs.org/)
[![Made with Vite](https://img.shields.io/badge/Made%20with-Vite-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0F172A?logo=tailwind-css&logoColor=38BDF8)](https://tailwindcss.com/)
[![ShadCN UI](https://img.shields.io/badge/UI-ShadCN_UI-blueviolet)](https://ui.shadcn.com/)

---

A powerful CLI to scaffold modern React applications with **Vite**, **Tailwind CSS**, and **ShadCN UI** — instantly.

---
## 🚀 What is Create-DEVI?

**Create-DEVI** is a lightweight and developer-friendly CLI tool that helps you **quickly spin up a modern React project** using the latest stack:

- ⚡ Vite for ultra-fast bundling
- 🎨 Tailwind CSS for styling
- 🧩 ShadCN UI components pre-configured
- 🔄 JavaScript or TypeScript support
- ✅ Path aliases with `@/` pointing to `src/`
- 🧼 Clean and minimal starting template

---
## Installation

You can use any of the following package managers to create a new project:

```bash
# Using npm
npm create devi@latest
```

```bash
# Using yarn
yarn create devi@latest
```

```bash
# Using pnpm
pnpm create devi@latest
```

```bash
# Using npx
npx create-devi@latest
```

## Usage

Once you run the installation command, the CLI will guide you through an interactive setup.

### 🧩 Prompts include:

- **Project Name**
  Enter name for your new project.

- **Language Selection**
  - JavaScript
  - TypeScript

- **Styling Option**
  - Tailwind CSS
  - Tailwind CSS + ShadCN UI
  - None

- **Router Option**
  Choose whether you want to include `react-router-dom` for routing.

Based on your selections, `create-devi` automatically sets up your project with a clean and organized structure.

Boom! You can start your Project:

```bash
cd your-project-name
npm run dev
```

## File Structure

The generated project will have the following structure:

```
your-project-name/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx
│   ├── App.tsx    # App.jsx in JavaScript mode
│   ├── index.css
│   └── main.tsx   # main.jsx in JavaScript mode
├── .gitignore
├── index.html
├── package.json
```

## Development

This is a **TypeScript** project. Here are the available scripts:

```bash
# Clone the project
git clone https://github.com/webakash1806/devi-package.git
```

```bash
# Build the project
npm run build
```

## Dependencies

### CLI Dependencies
- commander (v13.1.0) - Command-line interface
- inquirer (v12.5.0) - Interactive prompts
- chalk (v5.4.1) - Terminal styling
- child_process (v1.0.2) - Running external commands

### CLI Dev Dependencies
- typescript (v5.8.2) - TypeScript language support
- ts-node (v10.9.2) - TypeScript execution engine
- ts-node-dev (v2.0.0) - TypeScript development with auto-restart
- @types/node (v22.13.10) - TypeScript definitions for Node.js

### Generated Project Dependencies
- React
- Vite
- Tailwind CSS
- ShadCN UI
- TypeScript (optional)

## License

This project is licensed under the **MIT License**.

MIT License

Copyright (c) 2024 Akash Kumar Singh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


Created by
### Akash Kumar Singh

