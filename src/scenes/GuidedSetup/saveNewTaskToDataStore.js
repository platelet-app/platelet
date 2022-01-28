import { tasksStatus } from "../../apiConsts";
import { DataStore } from "aws-amplify";
import * as models from "../../models";

export async function saveNewTaskToDataStore(data) {
    await DataStore.save(new models.Task({ ...data, status: tasksStatus.new }));
}
