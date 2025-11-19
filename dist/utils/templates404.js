// Lottie animation JSON
export const lottie404Animation = `{"v":"5.1.9","fr":12,"ip":0,"op":20,"w":620,"h":250,"nm":"Comp 1","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"planet","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"n":"0p833_0p833_0p167_0p167","t":0,"s":[310,136,0],"e":[310,125,0],"to":[0,-1.83333337306976,0],"ti":[0,0,0]},{"i":{"x":0.833,"y":0.833},"o":{"x":0.167,"y":0.167},"n":"0p833_0p833_0p167_0p167","t":10,"s":[310,125,0],"e":[310,136,0],"to":[0,0,0],"ti":[0,-1.83333337306976,0]},{"t":20}],"ix":2,"x":"var $bm_rt;\\n$bm_rt = loopOut();"},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[85,85,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.672,-0.219],[0.74,2.278],[-0.812,1.1],[-0.553,-1.699],[-2.658,0.861],[-0.642,0.871]],"o":[[-2.658,0.861],[-0.412,-1.272],[-1.511,1.187],[0.737,2.278],[1.174,-0.383],[-0.513,0.403]],"v":[[69.093,-31.816],[62.942,-34.381],[63.663,-38.096],[61.976,-33.361],[68.125,-30.796],[70.879,-32.766]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.172549024224,0.070588238537,0.282352954149,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":15,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":60,"st":0,"bm":0}],"markers":[]}`;
// TypeScript version with Tailwind
export const notFound404TS = `import React from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import animationData from '../assets/404-animation.json';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <Lottie 
            animationData={animationData} 
            loop={true}
            className="w-full max-w-xl mx-auto"
          />
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have drifted into space. 
          Let's get you back on track.
        </p>
        
        <Link 
          to="/" 
          className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
`;
// JavaScript version with Tailwind
export const notFound404JS = `import React from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import animationData from '../assets/404-animation.json';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <Lottie 
            animationData={animationData} 
            loop={true}
            className="w-full max-w-xl mx-auto"
          />
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have drifted into space. 
          Let's get you back on track.
        </p>
        
        <Link 
          to="/" 
          className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
`;
// TypeScript version without Tailwind
export const notFound404NoTailwindTS = `import React from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import animationData from '../assets/404-animation.json';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-animation">
          <Lottie 
            animationData={animationData} 
            loop={true}
          />
        </div>
        
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          Oops! The page you're looking for seems to have drifted into space. 
          Let's get you back on track.
        </p>
        
        <Link to="/" className="not-found-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
`;
// JavaScript version without Tailwind
export const notFound404NoTailwindJS = `import React from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import animationData from '../assets/404-animation.json';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-animation">
          <Lottie 
            animationData={animationData} 
            loop={true}
          />
        </div>
        
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          Oops! The page you're looking for seems to have drifted into space. 
          Let's get you back on track.
        </p>
        
        <Link to="/" className="not-found-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
`;
// CSS for non-Tailwind version
export const notFound404CSS = `.not-found-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f172a, #1e293b);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.not-found-content {
  max-width: 42rem;
  width: 100%;
  text-align: center;
}

.not-found-animation {
  margin-bottom: 2rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.not-found-title {
  font-size: 3.75rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
}

.not-found-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.not-found-text {
  color: #9ca3af;
  margin-bottom: 2rem;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}

.not-found-button {
  display: inline-block;
  background-color: #ffffff;
  color: #0f172a;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}

.not-found-button:hover {
  background-color: #f3f4f6;
}
`;
