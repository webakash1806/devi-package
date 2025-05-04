export const homeLayoutJS = `import React from 'react';

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
`;
export const homePageJS = `import React, { useState } from 'react';

const Home = () => {
  const [showText, setShowText] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center space-y-6">
      <p className="text-sm text-gray-400">Trusted by 1.5M Coders</p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
       Devi - Fast &amp; Scalable Development
      </h1>
      <h2 className="text-2xl md:text-3xl font-normal text-orange-500">
        Make your development experience smooth and scalable
      </h2>
      <p className="text-gray-300 max-w-2xl">
        Devi is an open-source package that helps you set up your project quickly and efficiently.
        It is also a community-driven project, so feel free to contribute if you have any ideas or features you'd like to add.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-gray-300">
          <span>💻 Fast setup</span>
        <span>📦 Ready-to-use</span>
        <span>🔍 Scalable</span>
        <span>🤝 Community</span>
        <span>📝 Documentation</span>
      </div>
      <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors text-lg">
        Check all Live Cohorts
      </button>
    </div>
  );
};

export default Home;
`;
export const AppFileWithoutReactRouterDOMJS = `import React from 'react';
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
export const AppFileWithReactRouterDOMJS = `import React from 'react';
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
export const jsConfig = `{
            "include": ["src/**/*"],
            "compilerOptions": {
              "baseUrl": ".",
              "paths": { "@/*": ["./src/*"] }
            }
          }`;
