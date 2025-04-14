export interface Profile {
  profileId: string,
  fruitName: string,
  gameMode: GameMode
  active: boolean
}

type GameMode = 'normal' | 'ironman' | 'bingo' | 'stranded'