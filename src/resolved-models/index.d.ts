import * as models from "../models";

type Modify<T, R> = Omit<T, keyof R> & R;

export type ResolvedTaskAssignee = Modify<
    models.TaskAssignee,
    {
        assignee: models.User;
    }
>;

export type ResolvedTask = Modify<
    models.Task,
    {
        //createdBy?: models.User;
        pickUpLocation?: models.Location;
        dropOffLocation?: models.Location;
        establishmentLocation?: models.Location;
    }
>;

export type ResolvedDeliverable = Modify<
    models.Deliverable,
    {
        deliverableType?: models.DeliverableType;
    }
>;

export type ResolvedComment = Modify<
    models.Comment,
    {
        author?: models.User;
    }
>;
