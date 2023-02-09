export const copyStringToClipboard = (text: string) => {
    if ((window as any).cordova) {
        return new Promise((resolve, reject) => {
            (window as any).cordova.plugins.clipboard.copy(
                text,
                resolve,
                reject
            );
        });
    } else {
        return navigator.clipboard.writeText(text);
    }
};
