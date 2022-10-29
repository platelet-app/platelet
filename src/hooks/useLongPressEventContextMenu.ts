import React from "react";

export default function useLongPressEventContextMenu(
    callback: (event?: React.MouseEvent) => void,
    cordovaVibrate: boolean = false
) {
    const targetRef = React.useRef<HTMLElement>(null);

    const handleContextMenu = React.useCallback(
        (event) => {
            event.preventDefault();
            if (window.navigator && cordovaVibrate) {
                window.navigator.vibrate(60);
            }
            callback(event);
        },
        [callback, cordovaVibrate]
    );

    React.useEffect(() => {
        const target = targetRef.current;
        if (target) {
            target.addEventListener("contextmenu", handleContextMenu);
            return () => {
                target.removeEventListener("contextmenu", handleContextMenu);
            };
        }
    }, [targetRef, handleContextMenu]);

    return targetRef;
}
