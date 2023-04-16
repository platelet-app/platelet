import {
    PersistentModel,
    ProducerModelPredicate,
} from "@aws-amplify/datastore";
import * as models from "../models";

type ArchiveTypes =
    | models.Task
    | models.Comment
    | models.TaskAssignee
    | models.Deliverable
    | models.Location;

// too dumb to figure proper type
const unarchived = (m: any) => m.archived("eq", 0);

const LocalPredicates = {
    unarchived,
};

export default LocalPredicates;
