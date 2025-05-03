#!/usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

const program = new Command();

program.version("2.1.0").action(async () => {
  console.log(chalk.green("\n🚀 Welcome to the DEVI setup for REACT\n"));

  const { projectName }: { projectName: string } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input: string) => (input ? true : "Project name cannot be empty!"),
    },
  ]);

  try {
    console.log(chalk.blue(`\n📂 Creating project: ${projectName}...`));

    const { variant }: { variant: "react" | "react-ts" } = await inquirer.prompt([
      {
        type: "list",
        name: "variant",
        message: "Choose a variant:",
        choices: [
          { name: "JavaScript", value: "react" },
          { name: "TypeScript", value: "react-ts" },
        ],
      },
    ]);

    execSync(`npm create vite@latest ${projectName} -- --template ${variant}`, { stdio: "inherit" });

    process.chdir(projectName);

    console.log(chalk.blue("📦 Installing dependencies..."));
    execSync(`npm install`, { stdio: "inherit" });

    const { styleMode }: { styleMode: "tailwind" | "tailwind + shadcn" | "none" } = await inquirer.prompt([
      {
        type: "list",
        name: "styleMode",
        message: "Choose a Style mode:",
        choices: [
          { name: "tailwind CSS", value: "tailwind" },
          { name: "tailwind CSS + ShadCN UI", value: "tailwind + shadcn" },
          { name: "None", value: "none" },
        ],
      },
    ]);

    let installReactRouterDom = false;
    if (styleMode !== "none") {
      const { router }: { router: boolean } = await inquirer.prompt([
        {
          type: "confirm",
          name: "router",
          message: "Do you want to set up React Router DOM?",
          default: false,
        },
      ]);
      installReactRouterDom = router;
    }

    if (styleMode === "tailwind") {
      console.log(chalk.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
      execSync(`npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`, { stdio: "inherit" });

      if (fs.existsSync("tsconfig.json")) {
        console.log(chalk.blue("📝 Installing TypeScript types for Node.js..."));
        execSync(`npm install --save-dev @types/node`, { stdio: "inherit" });
      }

      const viteConfig = fs.existsSync("vite.config.ts") ? "vite.config.ts" : "vite.config.js";
      console.log(chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`));

      fs.writeFileSync(
        viteConfig,
        `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`
      );

      console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
      fs.writeFileSync("src/index.css", `@import 'tailwindcss';\n`);

      console.log(chalk.yellow("🧹 Removing default styles..."));
      try {
        fs.unlinkSync("src/App.css");
      } catch (err) {
        console.log(chalk.gray("No App.css found, skipping..."));
      }

      // Create Layout and Pages structure
      const layoutDir = path.join("src", "Layout");
      const pagesDir = path.join("src", "pages");
      fs.mkdirSync(layoutDir, { recursive: true });
      fs.mkdirSync(pagesDir, { recursive: true });

      //HomeLayout File
      const homeLayoutFile = path.join(layoutDir, variant === "react-ts" ? "HomeLayout.tsx" : "HomeLayout.jsx");
      fs.writeFileSync(
        homeLayoutFile,
        variant === "react-ts"
          ? `import React from 'react';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {children}
    </div>
  );
};

export default HomeLayout;
`
          : `import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {children}
    </div>
  );
};

export default HomeLayout;
`
      );

      //Home Page File
      const homePageFile = path.join(pagesDir, variant === "react-ts" ? "Home.tsx" : "Home.jsx");
      fs.writeFileSync(
        homePageFile,
        variant === "react-ts"
          ? `import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

const Home = () => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl text-purple-500">Welcome to Your New Project</h1>
      <Button onClick={() => setShowText(true)} className="bg-blue-500 text-white px-4 py-2">
        Click Me
      </Button>
      {showText && <h2 className="text-2xl text-green-400">Welcome to Devi Support</h2>}
    </div>
  );
};

export default Home;
`
          : `import React, { useState } from 'react';

const Home = () => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl text-purple-500">Welcome to Your New Project</h1>
      <button onClick={() => setShowText(true)} className="bg-blue-500 text-white px-4 py-2">
        Click Me
      </button>
      {showText && <h2 className="text-2xl text-green-400">Welcome to Devi Support</h2>}
    </div>
  );
};

export default Home;
`
      );

      // Update App Component
      const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";
      let appContent =
        variant === "react-ts"
          ? `import React from 'react';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const App = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};

export default App;
`
          : `import React from 'react';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const App = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};

export default App;
`;
      if (installReactRouterDom) {
        console.log(chalk.blue("🔩 Installing React Router DOM..."));
        execSync(`npm install react-router-dom`, { stdio: "inherit" });
        appContent =
          variant === "react-ts"
            ? `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;

const App = () => {
  return (
    <Router>
      <HomeLayout>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          <Link to="/about" className="text-purple-500 hover:underline">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </HomeLayout>
    </Router>
  );
};

export default App;
`
            : `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;

const App = () => {
  return (
    <Router>
      <HomeLayout>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          <Link to="/about" className="text-purple-500 hover:underline">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </HomeLayout>
    </Router>
  );
};

export default App;
`;
      }
      fs.writeFileSync(appFile, appContent);

      console.log(chalk.green(`✅ Successfully set up ${projectName} with Vite, React & Tailwind!`));
    } else if (styleMode === "tailwind + shadcn") {
      console.log(chalk.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
      execSync(`npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`, { stdio: "inherit" });

      if (fs.existsSync("tsconfig.json")) {
        console.log(chalk.blue("📝 Installing TypeScript types for Node.js..."));
        execSync(`npm install --save-dev @types/node`, { stdio: "inherit" });
      }

      const viteConfig = fs.existsSync("vite.config.ts") ? "vite.config.ts" : "vite.config.js";
      console.log(chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`));

      fs.writeFileSync(
        viteConfig,
        `import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';
  import path from "path";
  
  export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
  `
      );

      const jsonConfig = fs.existsSync("tsconfig.json") ? "tsconfig.json" : "jsconfig.json";
      console.log(chalk.yellow(`\n⚙️ Configuring ${variant} with Tailwind plugin in ${jsonConfig}...`));

      const jsonConfigContent = fs.existsSync("tsconfig.json")
        ? `{
            "files": [],
            "references": [
              { "path": "./tsconfig.app.json" },
              { "path": "./tsconfig.node.json" }
            ],
            "compilerOptions": {
              "baseUrl": ".",
              "paths": { "@/*": ["./src/*"] }
            }
          }`
        : `{
            "include": ["src/**/*"],
            "compilerOptions": {
              "baseUrl": ".",
              "paths": { "@/*": ["./src/*"] }
            }
          }`;

      fs.writeFileSync(jsonConfig, jsonConfigContent);

      const appConfigFile = "tsconfig.app.json";
      if (fs.existsSync(appConfigFile)) {
        console.log(chalk.yellow(`\n⚙️ Configuring path aliases in ${appConfigFile}...`));

        try {
          let appConfigContent = fs.readFileSync(appConfigFile, "utf-8");

          appConfigContent = appConfigContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "").trim();

          let appConfig = JSON.parse(appConfigContent);

          if (!appConfig.compilerOptions) {
            appConfig.compilerOptions = {};
          }

          appConfig.compilerOptions.baseUrl = ".";
          appConfig.compilerOptions.paths = { "@/*": ["./src/*"] };

          fs.writeFileSync(appConfigFile, JSON.stringify(appConfig, null, 2));

          console.log(chalk.green(`✅ Successfully updated ${appConfigFile} with path aliases!`));
        } catch (error: any) {
          console.error(chalk.red("❌ Error updating tsconfig:", error.message));
        }
      }

      console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
      fs.writeFileSync("src/index.css", `@import 'tailwindcss';\n`);

      console.log(chalk.yellow("🧹 Removing default styles..."));
      try {
        fs.unlinkSync("src/App.css");
      } catch (err) {
        console.log(chalk.gray("No App.css found, skipping..."));
      }

      console.log(chalk.blue("🛠 Installing ShadCN UI..."));
      execSync(`npx shadcn@latest init`, { stdio: "inherit" });

      console.log(chalk.blue("📦 Installing ShadCN components..."));
      execSync(`npx shadcn@latest add button`, { stdio: "inherit" });

      // Create Layout and Pages structure
      const layoutDir = path.join("src", "Layout");
      const pagesDir = path.join("src", "pages");
      fs.mkdirSync(layoutDir, { recursive: true });
      fs.mkdirSync(pagesDir, { recursive: true });

      //HomeLayout File
      const homeLayoutFile = path.join(layoutDir, variant === "react-ts" ? "HomeLayout.tsx" : "HomeLayout.jsx");
      fs.writeFileSync(
        homeLayoutFile,
        variant === "react-ts"
          ? `import React from 'react';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {children}
    </div>
  );
};

export default HomeLayout;
`
          : `import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {children}
    </div>
  );
};

export default HomeLayout;
`
      );

      //Home Page File
      const homePageFile = path.join(pagesDir, variant === "react-ts" ? "Home.tsx" : "Home.jsx");
      fs.writeFileSync(
        homePageFile,
        variant === "react-ts"
          ? `import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

const Home = () => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl text-purple-500">Welcome to Your New Project</h1>
      <Button onClick={() => setShowText(true)} className="bg-blue-500 text-white px-4 py-2">
        Click Me
      </Button>
      {showText && <h2 className="text-2xl text-green-400">Welcome to Devi Support</h2>}
    </div>
  );
};

export default Home;
`
          : `import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

const Home = () => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl text-purple-500">Welcome to Your New Project</h1>
      <Button onClick={() => setShowText(true)} className="bg-blue-500 text-white px-4 py-2">
        Click Me
      </Button>
      {showText && <h2 className="text-2xl text-green-400">Welcome to Devi Support</h2>}
    </div>
  );
};

export default Home;
`
      );

      // Update App Component
      const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";
      let appContent =
        variant === "react-ts"
          ? `import React from 'react';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const App = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};

export default App;
`
          : `import React from 'react';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const App = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};

export default App;
`;
      if (installReactRouterDom) {
        console.log(chalk.blue("🔩 Installing React Router DOM..."));
        execSync(`npm install react-router-dom`, { stdio: "inherit" });
        appContent =
          variant === "react-ts"
            ? `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;

const App = () => {
  return (
    <Router>
      <HomeLayout>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          <Link to="/about" className="text-purple-500 hover:underline">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </HomeLayout>
    </Router>
  );
};

export default App;
`
            : `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;

const App = () => {
  return (
    <Router>
      <HomeLayout>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link>
          <Link to="/about" className="text-purple-500 hover:underline">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </HomeLayout>
    </Router>
  );
};

export default App;
`;
      }
      fs.writeFileSync(appFile, appContent);

      console.log(chalk.green(`✅ Successfully set up ${projectName} with Vite, React & Tailwind!`));
    } else {
      // Create Layout and Pages structure
      const layoutDir = path.join("src", "Layout");
      const pagesDir = path.join("src", "pages");
      fs.mkdirSync(layoutDir, { recursive: true });
      fs.mkdirSync(pagesDir, { recursive: true });

      //HomeLayout File
      const homeLayoutFile = path.join(layoutDir, variant === "react-ts" ? "HomeLayout.tsx" : "HomeLayout.jsx");
      fs.writeFileSync(
        homeLayoutFile,
        variant === "react-ts"
          ? `import React from 'react';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default HomeLayout;
`
          : `import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default HomeLayout;
`
      );

      //Home Page File
      const homePageFile = path.join(pagesDir, variant === "react-ts" ? "Home.tsx" : "Home.jsx");
      fs.writeFileSync(
        homePageFile,
        variant === "react-ts"
          ? `import React, { useState } from 'react';

const Home = () => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl">Welcome to Your New Project</h1>
      <button onClick={() => setShowText(true)}>
        Click Me
      </button>
      {showText && <h2 className="text-2xl">Welcome to Devi Support</h2>}
    </div>
  );
};

export default Home;
`
          : `import React, { useState } from 'react';

const Home = () => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl">Welcome to Your New Project</h1>
      <button onClick={() => setShowText(true)}>
        Click Me
      </button>
      {showText && <h2 className="text-2xl">Welcome to Devi Support</h2>}
    </div>
  );
};

export default Home;
`
      );

      // Update App Component
      const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";
      let appContent =
        variant === "react-ts"
          ? `import React from 'react';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const App = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};

export default App;
`
          : `import React from 'react';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const App = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};

export default App;
`;
      if (installReactRouterDom) {
        console.log(chalk.blue("🔩 Installing React Router DOM..."));
        execSync(`npm install react-router-dom`, { stdio: "inherit" });
        appContent =
          variant === "react-ts"
            ? `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const About = () => <h2 className="text-2xl">About Page</h2>;

const App = () => {
  return (
    <Router>
      <HomeLayout>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </HomeLayout>
    </Router>
  );
};

export default App;
`
            : `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const About = () => <h2 className="text-2xl">About Page</h2>;

const App = () => {
  return (
    <Router>
      <HomeLayout>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </HomeLayout>
    </Router>
  );
};

export default App;
`;
      }
      fs.writeFileSync(appFile, appContent);
      console.log(chalk.green(`✅ Successfully set up ${projectName} with React with ${variant}!`));
    }

    console.log(chalk.yellow("\n👉 Done. Now run:\n"));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm run dev\n`));
  } catch (error: any) {
    console.error(chalk.red("❌ Error setting up the project:", error.message));
  }
});

program.parse(process.argv);
