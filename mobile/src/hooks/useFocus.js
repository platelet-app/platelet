import { useRef, useCallback } from "react";

const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = useCallback(() => {
        htmlElRef.current && htmlElRef.current.focus();
    }, []);

    return [htmlElRef, setFocus];
};

export default useFocus;
