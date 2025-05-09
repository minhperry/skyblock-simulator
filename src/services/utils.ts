import {isPlatformBrowser, isPlatformServer} from "@angular/common";

export class Utils {
    public static doIfBrowser(platformId: object, callbackFn: () => void): void {
        if (isPlatformBrowser(platformId)) callbackFn();
    }

    public static doIfServer(platformId: object, callbackFn: () => void): void {
        if (isPlatformServer(platformId)) callbackFn();
    }
}


export type NullableTimeout = ReturnType<typeof setTimeout> | null;
export type NullableInterval = ReturnType<typeof setInterval> | null;