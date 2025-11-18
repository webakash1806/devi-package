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

export const homePageTS = `import React from 'react';

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'gradient';
type ButtonSize = 'default' | 'sm' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'default', size = 'default', className = '', children, ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants: Record<ButtonVariant, string> = {
      default: 'bg-white text-black hover:bg-gray-100',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700',
      ghost: 'hover:bg-gray-800/50 text-white',
      gradient:
        'bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95',
    };

    const sizes: Record<ButtonSize, string> = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-10 px-5 text-sm',
      lg: 'h-12 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        className={[baseStyles, variants[variant], sizes[size], className].join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

interface IconProps {
  className?: string;
  size?: number;
}

const ArrowRight: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Menu: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const X: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-white">Logo</div>

          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a
              href="#getting-started"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Getting started
            </a>
            <a
              href="#components"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Components
            </a>
            <a
              href="#documentation"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Documentation
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button type="button" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button type="button" variant="default" size="sm">
              Sign Up
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50">
          <div className="px-6 py-4 flex flex-col gap-4">
            <a
              href="#getting-started"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Getting started
            </a>
            <a
              href="#components"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Components
            </a>
            <a
              href="#documentation"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800/50">
              <Button type="button" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button type="button" variant="default" size="sm">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Navigation.displayName = 'Navigation';

const Hero = React.memo(() => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start px-6 py-20 md:py-24">
      <aside className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm max-w-full">
        <span className="text-xs text-center whitespace-nowrap text-gray-400">
          New version of template is out!
        </span>
        <a
          href="#new-version"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-all active:scale-95 whitespace-nowrap"
          aria-label="Read more about the new version"
        >
          Read more
          <ArrowRight size={12} />
        </a>
      </aside>
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl px-6 leading-tight mb-6"
        style={{
          background:
            'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.05em',
        }}
      >
        Devi: Developer-first <br />
        React starter kit
      </h1>
      <p className="text-sm md:text-base text-center max-w-2xl px-6 mb-10 text-gray-400">
        Devi is a CLI that scaffolds modern React apps with Vite, Tailwind CSS, and ShadCN UI,
        so you can focus on shipping features instead of wiring up boilerplate.
      </p>
      <div className="flex items-center gap-4 relative z-10 mb-16">
        <Button
          type="button"
          variant="gradient"
          size="lg"
          className="rounded-lg flex items-center justify-center"
          aria-label="Contribute on GitHub"
        >
          Contribute on GitHub
        </Button>
      </div>
      <div className="w-full max-w-5xl relative pb-20">
        <div
          className="absolute left-1/2 w-[90%] pointer-events-none z-0"
          style={{ top: '-23%', transform: 'translateX(-50%)' }}
          aria-hidden="true"
        >
          <img
            src="https://i.postimg.cc/Ss6yShGy/glows.png"
            alt=""
            className="w-full h-auto"
            loading="eager"
          />
        </div>

        <div className="relative z-10">
          <img
            src="https://i.postimg.cc/SKcdVTr1/Dashboard2.png"
            alt="Dashboard preview showing analytics and metrics interface"
            className="w-full h-auto rounded-lg shadow-2xl"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
    </main>
  );
};

export default Home;
`

export const homePageNoTailwindTS = `import React, { useState } from 'react';
import './home.css';

const Home: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="home-root">
      <header className="home-nav">
        <div className="home-nav-inner">
          <div className="home-logo">Logo</div>

          <nav className="home-nav-links">
            <a href="#getting-started">Getting started</a>
            <a href="#components">Components</a>
            <a href="#documentation">Documentation</a>
          </nav>

          <div className="home-nav-actions">
            <button type="button" className="home-btn home-btn-ghost">
              Sign in
            </button>
            <button type="button" className="home-btn home-btn-primary">
              Sign Up
            </button>
          </div>

          <button
            type="button"
            className="home-nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </div>

        {menuOpen && (
          <div className="home-nav-mobile">
            <a href="#getting-started" onClick={() => setMenuOpen(false)}>
              Getting started
            </a>
            <a href="#components" onClick={() => setMenuOpen(false)}>
              Components
            </a>
            <a href="#documentation" onClick={() => setMenuOpen(false)}>
              Documentation
            </a>
            <div className="home-nav-mobile-actions">
              <button type="button" className="home-btn home-btn-ghost">
                Sign in
              </button>
              <button type="button" className="home-btn home-btn-primary">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="home-hero" id="getting-started">
        <div className="home-badge">
          <span>New version of template is out!</span>
          <a href="#new-version">
            Read more
            <span className="home-badge-arrow">→</span>
          </a>
        </div>

        <h1 className="home-hero-title">
          Devi: Developer-first <br /> React starter kit
        </h1>

        <p className="home-hero-subtitle">
          Devi is a CLI that scaffolds modern React apps with Vite, Tailwind CSS, and ShadCN UI,
          so you can focus on shipping features instead of wiring up boilerplate.
        </p>

        <div className="home-hero-cta">
          <button
            type="button"
            className="home-btn home-btn-gradient"
            aria-label="Contribute on GitHub"
          >
            Contribute on GitHub
          </button>
        </div>

        <div className="home-hero-media">
          <div className="home-hero-glow" aria-hidden="true">
            <img
              src="https://i.postimg.cc/Ss6yShGy/glows.png"
              alt=""
              loading="eager"
            />
          </div>

          <div className="home-hero-image">
            <img
              src="https://i.postimg.cc/SKcdVTr1/Dashboard2.png"
              alt="Dashboard preview showing analytics and metrics interface"
              loading="eager"
            />
          </div>
        </div>
      </section>
    </main>
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