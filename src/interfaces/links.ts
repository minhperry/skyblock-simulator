export interface Links {
    name: string;
    url: string;
    logo: string;
    hidden: boolean;
}
  
export interface Groups {
    codes: Links[];
    network: Links[];
    media: Links[];
    games: Links[];
    contacts: Links[];
}