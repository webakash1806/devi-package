export const envExample = `# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_KEY=your_api_key_here

# App Configuration
VITE_APP_NAME=My App
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
`;

export const envValidationTS = `import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_API_KEY: z.string().min(1),
  VITE_APP_NAME: z.string().default('My App'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_ENABLE_ANALYTICS: z.string().transform((val) => val === 'true').default('false'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables. Please check your .env file.');
  }
};

export const env = parseEnv();
`;

export const envValidationJS = `import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_API_KEY: z.string().min(1),
  VITE_APP_NAME: z.string().default('My App'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_ENABLE_ANALYTICS: z.string().transform((val) => val === 'true').default('false'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables. Please check your .env file.');
  }
};

export const env = parseEnv();
`;

export const gitignoreEnvAddition = `
# Environment Variables
.env
.env.local
.env.*.local
`;
