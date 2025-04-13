import {z} from 'zod';

export const PlayerSchema = z.object({
  uuid: z.string().uuid('Invalid UUID'),
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