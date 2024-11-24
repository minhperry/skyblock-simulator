export enum Color {
    RED = '#f55',
    GREEN = '#5f5',
    WHITE = '#fff',
    BLUE = '#55f',
    YELLOW = '#ff5',
    AQUA = '#5ff',
    DARK_RED = '#a00'
}

export const ColorCodes: Record<string, string> = {
    '%BLACK%': '§0',
    '%DBLUE%': '§1',
    '%DGREEN%': '§2',
    '%CYAN%': '§3',
    '%DRED%': '§4',
    '%DPURPLE%': '§5',
    '%GOLD%': '§6',
    '%GRAY%': '§7',
    '%DGRAY%': '§8',
    '%BLUE%': '§9',
    '%GREEN%': '§a',
    '%AQUA%': '§b',
    '%RED%': '§c',
    '%PURPLE%': '§d',
    '%YELLOW%': '§e',
    '%WHITE%': '§f',
}

export function colorize(str: string): string {
    for (const [key, value] of Object.entries(ColorCodes)) {
        str = str.replace(new RegExp(key, 'g'), value);
    }
    return str;
}