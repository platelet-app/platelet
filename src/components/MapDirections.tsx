import React, { useEffect, useState } from "react";

import { Map, useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

type MapDirectionsProps = {
    origin: string;
    destination: string;
};

const MapDirections: React.FC<MapDirectionsProps> = ({
    origin,
    destination,
}) => (
    <Map
        style={{
            borderRadius: "1em",
            width: 400,
            height: 400,
            overflow: "hidden",
        }}
        key={`${origin}-${destination}`}
        defaultCenter={{ lat: 51.4545, lng: -2.5879 }}
        defaultZoom={9}
        gestureHandling={"greedy"}
        fullscreenControl={false}
        disableDefaultUI
    >
        <Directions origin={origin} destination={destination} />
    </Map>
);

const Directions: React.FC<MapDirectionsProps> = ({ origin, destination }) => {
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
        if (
            !directionsService ||
            !directionsRenderer ||
            !(origin && destination)
        )
            return;
        const response = await directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
        });
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
    }, [directionsService, directionsRenderer, origin, destination]);

    useEffect(() => {
        getDirections();
        return () => {
            if (directionsRenderer) directionsRenderer.setMap(null);
        };
    }, [getDirections, directionsRenderer]);

    // Update direction route
    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return <div className="directions" />;
    /*
            <h2>{selected.summary}</h2>
            <p>
                {leg.start_address.split(",")[0]} to{" "}
                {leg.end_address.split(",")[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>

            <h2>Other Routes</h2>
            <ul>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                        <button onClick={() => setRouteIndex(index)}>
                            {route.summary}
                        </button>
                    </li>
                ))}
            </ul>
     */
};

export default MapDirections;
