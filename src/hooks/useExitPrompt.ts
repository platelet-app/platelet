import { useEffect } from "react";

const initBeforeUnLoad = (showExitPrompt: boolean) => {
    window.onbeforeunload = (event: any) => {
        if (showExitPrompt) {
            const e = event || window.event;
            e.preventDefault();
            if (e) {
                e.returnValue = "";
            }
            return "";
        }
    };
};

export default function useExitPrompt(showExitPrompt: boolean) {
    window.onload = function () {
        initBeforeUnLoad(showExitPrompt);
    };

    useEffect(() => {
        initBeforeUnLoad(showExitPrompt);
    }, [showExitPrompt]);
}
