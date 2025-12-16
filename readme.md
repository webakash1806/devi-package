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
- 🎨 Tailwind CSS v4 for styling
- 🧩 ShadCN UI components pre-configured
- 🔄 JavaScript or TypeScript support
- ✅ Path aliases with `@/` pointing to `src/`
- 🧼 Clean and minimal starting template
- 🛡️ Optional code quality tools (Prettier, ESLint, Husky)
- 🔐 Optional environment variable setup with validation
- 🧪 Optional testing infrastructure (Vitest + React Testing Library)
- 🔧 Optional Git initialization with initial commit
- 🚫 404 page with Lottie animations
- ⚠️ Error boundary for production safety

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

---

## Usage

### Interactive Mode (Default)

Once you run the installation command, the CLI will guide you through an interactive setup:

```bash
npm create devi@latest
```

You'll be prompted for:
- **Project Name**: Enter name for your new project
- **Language**: TypeScript or JavaScript
- **Styling**: Tailwind CSS, Tailwind + ShadCN UI, or None
- **Router**: Include React Router DOM (Yes/No)
- **Code Quality**: Setup Prettier, ESLint, Husky (Yes/No)
- **Environment**: Setup .env with validation (Yes/No)
- **UI Components**: Install basic ShadCN components (Yes/No, if ShadCN selected)
- **Testing**: Setup Vitest and React Testing Library (Yes/No)
- **Git**: Initialize Git repository with initial commit (Yes/No)

---

## CLI Flags & Options

### Quick Reference

```bash
create-devi [options]

Options:
  -v, --version                    Display version number
  -h, --help                       Display help information
  -t, --template <name>            Use a predefined template
  --no-install                     Skip dependency installation
  -pm, --package-manager <pm>      Choose package manager (npm|yarn|pnpm)
  --dry-run                        Show what would be created without creating
  --verbose                        Enable verbose logging
  --debug                          Enable debug logging
```

### Template Presets

Use predefined templates to skip interactive prompts:

| Template | Description |
|----------|-------------|
| `typescript-full` | TypeScript with all features enabled |
| `typescript-minimal` | TypeScript with Tailwind CSS only |
| `javascript-full` | JavaScript with all features enabled |
| `javascript-minimal` | JavaScript with Tailwind CSS only |
| `basic-ts` | TypeScript without any styling |
| `basic-js` | JavaScript without any styling |

**Examples:**

```bash
# Create with TypeScript and all features
npm create devi@latest -- --template typescript-full

# Create minimal TypeScript project
npm create devi@latest -- --template typescript-minimal

# Create with JavaScript and all features
npm create devi@latest -- --template javascript-full
```

### Package Manager Selection

Choose your preferred package manager:

```bash
# Use yarn
npm create devi@latest -- --package-manager yarn

# Use pnpm
npm create devi@latest -- --package-manager pnpm

# Default is npm (no flag needed)
npm create devi@latest
```

### Skip Installation

Create project files without installing dependencies:

```bash
npm create devi@latest -- --no-install
```

This is useful for:
- Reviewing project structure first
- Manual dependency management
- CI/CD pipelines

### Dry Run Mode

Preview what will be created without actually creating anything:

```bash
npm create devi@latest -- --dry-run
```

This displays:
- All configuration choices
- Commands that would run
- Files that would be generated

### Verbose & Debug Modes

Enable detailed logging for troubleshooting:

```bash
# Verbose mode - detailed progress
npm create devi@latest -- --verbose

# Debug mode - maximum detail
npm create devi@latest -- --debug
```

### Combined Flags

Combine multiple flags for powerful workflows:

```bash
# Template + Package Manager + Verbose
npm create devi@latest -- --template typescript-full --package-manager pnpm --verbose

# Template + No Install + Dry Run
npm create devi@latest -- --template javascript-minimal --no-install --dry-run

# Full control example
npm create devi@latest -- -t typescript-full -pm yarn --verbose
```

---

## File Structure

The generated project will have the following structure:

```
your-project-name/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/               # ShadCN UI components (if enabled)
│   │   ├── ErrorBoundary.tsx # Error boundary component
│   │   └── NotFound.tsx      # 404 page (if router enabled)
│   ├── Layout/
│   │   └── HomeLayout.tsx    # Main layout component
│   ├── pages/
│   │   ├── Home.tsx          # Home page component
│   │   └── home.css          # CSS (if no Tailwind)
│   ├── config/
│   │   └── env.ts            # Environment validation (if enabled)
│   ├── assets/
│   │   └── 404-animation.json # Lottie animation (if router enabled)
│   ├── App.tsx               # App.jsx in JavaScript mode
│   ├── index.css
│   └── main.tsx              # main.jsx in JavaScript mode
├── .vscode/
│   └── settings.json         # VS Code settings (if code quality enabled)
├── .env.example              # If env setup enabled
├── .gitignore
├── .prettierrc               # If code quality enabled
├── .lintstagedrc             # If code quality enabled
├── index.html
├── package.json
├── tsconfig.json / jsconfig.json
└── vite.config.ts
```

---

## Development

This is a **TypeScript** project. Here are the available scripts:

```bash
# Clone the project
git clone https://github.com/webakash1806/devi-package.git
cd devi-package
```

```bash
# Install dependencies
npm install
```

```bash
# Build the project
npm run build
```

```bash
# Test locally
npm run start
```

---

## Dependencies

### CLI Dependencies
- **commander** (v13.1.0) - Command-line interface framework
- **inquirer** (v12.5.0) - Interactive prompts
- **chalk** (v5.4.1) - Terminal styling

### CLI Dev Dependencies
- **typescript** (v5.8.2) - TypeScript language support
- **ts-node** (v10.9.2) - TypeScript execution engine
- **ts-node-dev** (v2.0.0) - Development with auto-restart
- **@types/node** (v22.13.10) - TypeScript definitions for Node.js

### Generated Project Dependencies
- React
- Vite
- Tailwind CSS (optional)
- ShadCN UI (optional)
- React Router DOM (optional)
- Zod (for env validation, optional)
- Prettier, ESLint, Husky (optional)
- Lottie React (optional)

---

## Features Deep Dive

### 🎨 Styling Options

#### Tailwind CSS
- Latest Tailwind v4 with Vite plugin
- Configured `@import 'tailwindcss'` in index.css
- Clean, utility-first approach

#### ShadCN UI
- Pre-configured with path aliases
- Button component included by default
- Optional additional components (Accordion, Input, Select, Textarea)
- Full TypeScript support

#### None (Vanilla CSS)
- Custom CSS variables and theming
- Responsive navigation
- Dark mode styling
- Modern CSS best practices

### 🛣️ Routing

When you enable React Router DOM:
- Configured `BrowserRouter` in App.tsx/jsx
- Pre-built layouts and pages structure
- Custom 404 page with Lottie animation
- Ready for multiple routes

### 🛡️ Code Quality Tools

When enabled, includes:
- **Prettier**: Code formatting with config
- **ESLint**: Linting with recommended rules
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files only
- **VS Code settings**: Automatic formatting on save

### 🔐 Environment Variables

When enabled, includes:
- `.env.example` template file
- Zod schema for type-safe validation
- Auto-configured `.gitignore` for `.env`
- Import validation with `import { env } from '@/config/env'`

### ⚠️ Error Handling

Automatically includes:
- **Error Boundary**: Catches React errors in production
- **Styled Error Pages**: Consistent with your theme
- **404 Page**: Beautiful not-found page with Lottie animation
- **Graceful Degradation**: Prevents app crashes

### 🧪 Testing Infrastructure

When enabled, includes:
- **Vitest**: Fast unit test runner with hot module reload
- **React Testing Library**: Test React components the way users interact with them
- **jsdom**: DOM simulation for testing
- **@vitest/ui**: Optional visual test runner interface
- **Pre-configured**: `vitest.config.ts/js` and test setup ready
- **Example Test**: Sample test file to get started
- **NPM Scripts**: `npm test`, `npm run test:ui`, `npm run test:run`

### 🔧 Git Initialization

When enabled, automatically:
- **Initializes Git**: Runs `git init` in your project
- **Creates .gitattributes**: Ensures consistent line endings across platforms
- **Initial Commit**: Creates first commit with meaningful message
- **Ready to Push**: Start version control from day one

---

## Troubleshooting

### Project Name Validation

Project names must:
- Not be empty
- Only contain letters, numbers, dashes, underscores, @ and /
- Not start with `.` or `_`
- Not be an existing directory name

### Package Manager Issues

If you encounter issues with a specific package manager:

```bash
# Try with explicit package manager
npm create devi@latest -- --package-manager npm

# Or use dry-run first
npm create devi@latest -- --dry-run
```

### Installation Fails

If dependency installation fails:

```bash
# Create project without installing
npm create devi@latest -- --no-install

# Then manually install in the project
cd your-project
npm install
```

### Verbose Logging

For debugging:

```bash
# See detailed logs
npm create devi@latest -- --verbose

# See maximum detail
npm create devi@latest -- --debug
```

---

## License

This project is licensed under the **MIT License**.

Copyright (c) 2024 Akash Kumar Singh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Created by **Akash Kumar Singh**

- GitHub: [@webakash1806](https://github.com/webakash1806)
- NPM: [create-devi](https://www.npmjs.com/package/create-devi)
