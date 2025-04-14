import {z} from 'zod';

export interface Profile {
  profileId: string,
  fruitName: string,
  gameMode: GameMode
  active: boolean
}

const ProfileResponseSchema = z.object({
  profile_id: z.string().uuid(),
  cute_name: z.string(),
  game_mode: z.enum(['ironman', 'bingo', 'stranded']).optional(),
  selected: z.boolean(),
}).passthrough()

export const ProfileArraySchema = z.array(ProfileResponseSchema)

export type GameMode = 'normal' | 'ironman' | 'bingo' | 'stranded'