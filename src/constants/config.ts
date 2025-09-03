const ENV_CONFIG = {
  local: {
    BACKEND_API_URL: 'http://localhost:5555',
  },
  development: {
    BACKEND_API_URL: 'https://meatbags-api-1.onrender.com',
  },
  production: {
    BACKEND_API_URL: 'https://www.salonssmart.uk',
  },
} as const;

type Environment = keyof typeof ENV_CONFIG;

const currentEnv =
  (process.env.NEXT_PUBLIC_APP_ENVIRONMENT as Environment) || 'development';

export const config = ENV_CONFIG[currentEnv];
