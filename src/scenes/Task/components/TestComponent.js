import { DataStore } from "aws-amplify";
import React from "react";
import * as models from "../../../models";

export default function TestComponent() {
    async function getLocations() {
        const locations = await DataStore.query(models.Location, (l) =>
            l.listed("eq", 1)
        );
        console.log(locations);
        const task = await DataStore.query(models.Task, null);
        console.log(task);
    }

    React.useEffect(() => getLocations(), []);
    return <></>;
}
