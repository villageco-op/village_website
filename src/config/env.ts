import { z } from 'zod';

const optionalUrl = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.string().url().optional(),
);

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STAGING_SECRET_KEY: z.string().optional(),
  NEXTAUTH_URL: optionalUrl,
});

export const env = schema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_STAGING_SECRET_KEY: process.env.NEXT_PUBLIC_STAGING_SECRET_KEY,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
});
