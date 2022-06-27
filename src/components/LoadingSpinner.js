import { CircularProgress, Fade, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";

function LoadingSpinner({ progress, tooltip, size, delay, error, ...props }) {
    const [loadingColor, setLoadingColor] = useState(null);
    const [completed, setCompleted] = useState(true);
    const [fade, setFade] = useState(false);
    const delayTimer = useRef(null);
    const timeOut = useRef(null);

    useEffect(() => {
        if (!error && Math.round(progress) === 100) {
            setLoadingColor("lightgreen");
            setTimeout(() => {
                setCompleted(true);
                setLoadingColor(null);
            }, 2000);

            return;
        } else if (timeOut.current) {
            clearTimeout(timeOut.current);
        }
        if (!error && progress !== null) {
            setCompleted(false);
            setLoadingColor("orange");
        } else if (error) {
            setCompleted(false);
            setLoadingColor("red");
        }
    }, [progress, error]);

    useEffect(() => {
        if (!error) {
            setLoadingColor(null);
        }
    }, [error]);

    useEffect(() => {
        if (error) return;
        if (delay === 0) {
            setFade(true);
            return;
        }
        if (loadingColor === "orange") {
            delayTimer.current = setTimeout(() => setFade(true), delay);
        } else {
            clearTimeout(delayTimer.current);
        }
    }, [loadingColor, delay, error]);

    useEffect(() => {
        if (error) return;
        if (delay === 0) return;
        if (Math.round(progress) === 100 && fade) {
            clearTimeout(delayTimer.current);
        }
    }, [progress, fade, delay, error]);

    useEffect(() => {
        if (error) return;
        if (delay === 0) return;
        if (completed) setFade(false);
    }, [completed, delay, error]);

    if (completed) {
        return null;
    } else {
        return (
            <Box sx={props.sx}>
                <Fade
                    data-testId="progressive-loading-spinner"
                    in={error || fade}
                    unmountOnExit
                >
                    <Tooltip title={tooltip}>
                        <Box sx={{ display: "grid" }}>
                            <CircularProgress
                                size={size}
                                variant="determinate"
                                value={progress}
                                sx={{
                                    zIndex: 2,
                                    gridColumn: 1,
                                    gridRow: 1,
                                    color: loadingColor,
                                }}
                            />
                            {Math.round(progress) !== 100 && (
                                <CircularProgress
                                    size={size}
                                    sx={{
                                        gridColumn: 1,
                                        gridRow: 1,
                                        opacity: 0.5,
                                        zIndex: 1,
                                    }}
                                />
                            )}
                        </Box>
                    </Tooltip>
                </Fade>
            </Box>
        );
    }
}

LoadingSpinner.propTypes = {
    progress: PropTypes.number.isRequired,
    tooltip: PropTypes.string,
    size: PropTypes.number,
    delay: PropTypes.number,
    sx: PropTypes.object,
};

LoadingSpinner.defaultProps = {
    tooltip: "",
    size: 40,
    delay: 0,
    sx: {},
};

export default LoadingSpinner;
