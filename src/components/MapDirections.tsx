import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Map, useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import {
    Box,
    IconButton,
    useMediaQuery,
    ClickAwayListener,
} from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import MapDirectionsDetails from "./MapDirectionsDetails";

type MapDirectionsProps = {
    origin: string;
    destination: string;
};

const MapDirections: React.FC<MapDirectionsProps> = ({
    origin,
    destination,
}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const pad = !isSm && isExpanded ? "5%" : 0;

    const onLoaded = React.useCallback(() => {
        setIsFetching(false);
    }, [setIsFetching]);

    return (
        <ClickAwayListener
            onClickAway={(e) => {
                if (!isExpanded) return;
                setIsExpanded(false);
            }}
        >
            <Box
                onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Escape" && isExpanded) {
                        setIsExpanded(false);
                    }
                }}
                sx={{
                    position: isExpanded ? "fixed" : "relative",
                    top: pad,
                    left: pad,
                    right: pad,
                    bottom: pad,
                    zIndex: 9999999,
                }}
            >
                <Box
                    sx={{
                        display: isFetching ? "none" : "block",
                        position: "relative",
                        borderRadius: isSm ? undefined : "1em",
                        width: isSm ? "100%" : isExpanded ? "100%" : 400,
                        height: isExpanded ? "100%" : 400,
                    }}
                >
                    <Map
                        style={{
                            borderRadius: isSm ? undefined : "1em",
                            width: isSm ? "100%" : isExpanded ? "100%" : 400,
                            height: isExpanded ? "100%" : 400,
                            overflow: "hidden",
                        }}
                        key={`${origin}-${destination}-${isExpanded}`}
                        defaultCenter={{ lat: 51.4545, lng: -2.5879 }}
                        defaultZoom={9}
                        gestureHandling={isExpanded ? "greedy" : "none"}
                        fullscreenControl={false}
                        disableDefaultUI={!isExpanded}
                    >
                        <Directions
                            origin={origin}
                            destination={destination}
                            showDetails={isExpanded}
                            onLoaded={onLoaded}
                        />
                    </Map>
                    <IconButton
                        sx={{
                            background: "rgba(255, 255, 255, 0.9)",
                            margin: 2,
                            position: "absolute",
                            top: 4,
                            right: 4,
                            zIndex: 90,
                            color: theme.palette.common.black,
                            "&:hover": {
                                background: theme.palette.primary.main,
                                color: theme.palette.common.white,
                            },
                        }}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <CloseFullscreenIcon />
                        ) : (
                            <OpenInFullIcon />
                        )}
                    </IconButton>
                </Box>
            </Box>
        </ClickAwayListener>
    );
};

type DirectionsProps = {
    origin: string;
    destination: string;
    showDetails?: boolean;
    onLoaded?: () => void;
};

const Directions: React.FC<DirectionsProps> = ({
    origin,
    destination,
    showDetails,
    onLoaded,
}) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] =
        useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] =
        useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    // Initialize directions service and renderer
    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    // Use directions service
    const getDirections = React.useCallback(async () => {
        if (!directionsService || !directionsRenderer) return;
        if (!origin || !destination) {
            if (onLoaded) onLoaded();
            return;
        }

        const response = await directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
        });
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        if (onLoaded) onLoaded();
    }, [directionsService, directionsRenderer, origin, destination, onLoaded]);

    useEffect(() => {
        getDirections();
        return () => {
            if (directionsRenderer) directionsRenderer.setMap(null);
        };
    }, [getDirections, directionsRenderer, onLoaded]);

    // Update direction route
    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg || !showDetails) return null;

    return (
        <MapDirectionsDetails
            leg={leg}
            routes={routes}
            selected={selected}
            routeIndex={routeIndex}
            onSelectRouteIndex={setRouteIndex}
        />
    );
};

export default MapDirections;
