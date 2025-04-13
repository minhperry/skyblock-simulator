import {z} from 'zod';

export const PlayerSchema = z.object({
  uuid: z.string().regex(/^[0-9a-fA-F]{32}$/,
    'UUID must be a 32 character hex string',
  ),
  username: z.string()
    .min(1, 'Username must be at least 1 character long')
    .max(16, 'Username must be at most 16 characters long')
})

export interface Player {
  uuid: string,
  username: string,
}

export interface PlayerResponse {
  id: string,
  name: string,
}

export interface FailedPlayerResponse {
  path: string,
  errorMessage: string,
}