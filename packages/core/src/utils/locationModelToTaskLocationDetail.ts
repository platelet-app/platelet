import * as models from "@platelet-app/models";
import _ from "lodash";

const taskLocationFields = [
    "name",
    "contact",
    "ward",
    "line1",
    "line2",
    "line3",
    "town",
    "county",
    "state",
    "country",
    "postcode",
    "what3words",
    "googleMapsPlaceId",
];

export const locationModelToTaskLocationDetail = (
    location?: models.Location | null
): models.TaskLocation | null =>
    location
        ? (_.pick(location, taskLocationFields) as models.TaskLocation)
        : null;
