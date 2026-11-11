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

export const locationModelToLocationDetail = (
    location?: models.Location | null
): models.LocationDetail | null =>
    location
        ? (_.pick(location, taskLocationFields) as models.LocationDetail)
        : null;
