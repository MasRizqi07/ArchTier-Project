import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../db/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || 'mock_github_id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock_github_secret',
      enabled: Boolean(process.env.GITHUB_CLIENT_ID),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock_google_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_google_secret',
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID),
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || 'archtier-dev-secret-32-chars-long-minimum',
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
});
