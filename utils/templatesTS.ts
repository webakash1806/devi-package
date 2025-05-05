export const homeLayoutTS = `import React from 'react';

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

export const homePageTS = `import React, { useState, useEffect } from 'react';

const Home = () => {
 
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center text-center bg-black rounded-xl shadow-xl mt-12">
      <span className="bg-gray-800 px-2 py-1 text-xs  mb-4 rounded-full text-gray-300 font-medium flex items-center gap-2 transition-all duration-300 shadow-md border border-gray-700">
        🧑‍💻 <span className=" tracking-wide">Trusted by 1.5M+ Developers</span>
      </span>

    <h1 className="text-3xl mb-2 md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 leading-snug tracking-tight">
  Devi: The Future of <br />
  Scalable Web Development
</h1>

      <h2 className="text-lg mb-3 font-semibold text-orange-400">
        Build Modern Web Apps Faster and Smarter
      </h2>

      <p className="text-gray-300 max-w-2xl text-sm text-base md:text-md leading-relaxed">
        Devi is an open-source development platform designed for speed, scalability, and flexibility. Whether you're building MVPs, enterprise-grade systems, or hobby projects, Devi helps you launch faster with production-ready tools.
      </p>

      <div className="flex flex-wrap justify-center gap-2 my-6">
        <span className="bg-gray-800 text-xs px-2 py- rounded-full text-gray-300 font-medium flex items-center gap-2 transition-all duration-300 shadow-md border border-gray-700">
          ⚡️ <span className="text-xs">Instant Setup</span>
        </span>
        <span className="bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-300 font-medium flex items-center gap-2 transition-all duration-300 shadow-md border border-gray-700">
          ✅ <span className="text-xs">Developer-Ready</span>
        </span>
        <span className="bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-300 font-medium flex items-center gap-2 transition-all duration-300 shadow-md border border-gray-700">
          🚀 <span className="text-xs">Built to Scale</span>
        </span>
        <span className="bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-300 font-medium flex items-center gap-2 transition-all duration-300 shadow-md border border-gray-700">
          📖 <span className="">Extensive Docs</span>
        </span>
      </div>

      <a href="https://github.com/webakash1806" className="bg-orange-500 mt-5 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all duration-300 text-sm font-semibold shadow-md hover:scale-105 hover:shadow-lg flex items-center gap-2">
       <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 30 30"
  className="text-white"
  fill="currentColor"
>
  <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.451,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
</svg>

        Contribute to Devi
      </a>
    </div>
  );
};

export default Home;
`

export const AppFileWithoutReactRouterDOMTS = `import React from 'react';
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

export const AppFileWithReactRouterDOMTS = `import React from 'react';
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

export const tsConfig = `{
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