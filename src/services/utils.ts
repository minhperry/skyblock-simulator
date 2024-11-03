import {isPlatformBrowser, isPlatformServer} from "@angular/common";

export class Utils {
    public static doIfBrowser(platformId: Object, callbackFn: () => void): void {
        if (isPlatformBrowser(platformId)) callbackFn();
    }

    public static doIfServer(platformId: Object, callbackFn: () => void): void {
        if (isPlatformServer(platformId)) callbackFn();
    }
}
