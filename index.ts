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
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md py-4 px-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-500">ChaiCode</h1>
          <nav>
            <ul className="flex space-x-6 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Cohorts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Udemy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </nav>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors">
            Login
          </button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black/50 backdrop-blur-md py-6 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} ChaiCode. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
`
          : `import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md py-4 px-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-500">ChaiCode</h1>
          <nav>
            <ul className="flex space-x-6 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Cohorts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Udemy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </nav>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors">
            Login
          </button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black/50 backdrop-blur-md py-6 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} ChaiCode. All rights reserved.
        </div>
      </footer>
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
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center space-y-6">
      <p className="text-sm text-gray-400">Trusted by 1.5M Coders</p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        Consistency and Community
      </h1>
      <h2 className="text-2xl md:text-3xl font-normal text-orange-500">
        An unmatched Learning Experience for coding courses.
      </h2>
      <p className="text-gray-300 max-w-2xl">
        Content is everywhere, but we provide a learning experience that is unmatched - bounties,
        peer learning, code reviews, virtual hostel, alumni network, doubt sessions, and group projects.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-gray-300">
        <span>🧑‍🤝‍🧑 Peer learning</span>
        <span>✅ Code reviews</span>
        <span>🏠 Virtual hostel</span>
        <span>❓ Doubt sessions</span>
        <span>💰 Bounties</span>
      </div>
      <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors text-lg">
        Check all Live Cohorts
      </button>
    </div>
  );
};

export default Home;
`
          : `import React, { useState } from 'react';

const Home = () => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center space-y-6">
      <p className="text-sm text-gray-400">Trusted by 1.5M Coders</p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        Consistency and Community
      </h1>
      <h2 className="text-2xl md:text-3xl font-normal text-orange-500">
        An unmatched Learning Experience for coding courses.
      </h2>
      <p className="text-gray-300 max-w-2xl">
        Content is everywhere, but we provide a learning experience that is unmatched - bounties,
        peer learning, code reviews, virtual hostel, alumni network, doubt sessions, and group projects.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-gray-300">
        <span>🧑‍🤝‍🧑 Peer learning</span>
        <span>✅ Code reviews</span>
        <span>🏠 Virtual hostel</span>
        <span>❓ Doubt sessions</span>
        <span>💰 Bounties</span>
      </div>
      <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors text-lg">
        Check all Live Cohorts
      </button>
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
import { Button } from "@/components/ui/button"

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md py-4 px-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-500">Devi/webakash1806</h1>
          <nav>
            <ul className="flex space-x-6 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </nav>
          <Button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-all duration-300">
            Login
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black/50 backdrop-blur-md py-6 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Devi. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
`
          : `import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md py-4 px-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-500">Devi/webakash1806</h1>
          <nav>
            <ul className="flex space-x-6 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </nav>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors">
            Login
          </button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black/50 backdrop-blur-md py-6 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Devi. All rights reserved.
        </div>
      </footer>
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
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center space-y-6">
      <p className="text-sm text-gray-400">Trusted by 1.5M Coders</p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        Consistency and Community
      </h1>
      <h2 className="text-2xl md:text-3xl font-normal text-orange-500">
        An unmatched Learning Experience for coding courses.
      </h2>
      <p className="text-gray-300 max-w-2xl">
       DEVI helps you to create fully fledged file structure with pre-defined code to make your development easier and save your time.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-gray-300">
        <span>🧑‍🤝‍🧑 Peer learning</span>
        <span>✅ Code reviews</span>
        <span>🏠 Virtual hostel</span>
        <span>❓ Doubt sessions</span>
        <span>💰 Bounties</span>
      </div>
      <Button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-all duration-300 text-lg">
        Check all Live Cohorts
      </Button>
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
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center space-y-6">
      <p className="text-sm text-gray-400">Trusted by 1.5M Coders</p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        Consistency and Community
      </h1>
      <h2 className="text-2xl md:text-3xl font-normal text-orange-500">
        An unmatched Learning Experience for coding courses.
      </h2>
      <p className="text-gray-300 max-w-2xl">
        DEVI helps you to create fully fledged file structure with pre-defined code to make your development easier and save your time.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-gray-300">
        <span>🧑‍🤝‍🧑 Peer learning</span>
        <span>✅ Code reviews</span>
        <span>🏠 Virtual hostel</span>
        <span>❓ Doubt sessions</span>
        <span>💰 Bounties</span>
      </div>
      <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-all duration-300 text-lg">
        Check all Live Cohorts
      </button>
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
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm run dev\n`));
  } catch (error: any) {
    console.error(chalk.red("❌ Error setting up the project:", error.message));
  }
});

program.parse(process.argv);
