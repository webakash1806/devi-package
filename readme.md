# Create-DEVI

**Version: 3.6.1**

A CLI tool to quickly scaffold React projects with a powerful setup including Vite, Tailwind CSS, and ShadCN UI.

## Description

Create-DEVI is a command-line interface tool that helps you set up a new React project with a modern tech stack. It provides a streamlined way to create a new React application with either JavaScript or TypeScript, pre-configured with Tailwind CSS, ShadCN UI, and proper path aliases.

Key features:
- Choice between JavaScript and TypeScript
- Automatic Vite configuration with Tailwind CSS
- Path alias setup (@/ points to src/)
- ShadCN UI integration with base components
- Clean starting template

## Installation

You can use any of the following package managers to create a new project:

```bash
# Using npm
npm create devi@latest

# Using yarn
yarn create devi@latest

# Using pnpm
pnpm create devi@latest

# Using npx
npx create-devi@latest
```

## Usage

After running one of the installation commands above, follow the interactive prompts:

```bash
create-devi
```

The CLI will guide you through:
1. Entering a project name
2. Choosing between JavaScript and TypeScript
3. Automatically setting up the project with:
   - Vite
   - React
   - Tailwind CSS
   - ShadCN UI
   - Path aliases

After the setup completes, you can start your development server:

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
# Build the project
npm run build

# ## Dependencies

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
---

Created by Akash Kumar Singh

