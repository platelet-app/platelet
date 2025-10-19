/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { request, errorCheck } = require("/opt/appSyncRequest");
const {
    createTask,
    createLocation,
    createDeliverable,
} = require("/opt/graphql/mutations");

const listScheduledTasks = /* GraphQL */ `
    query ListScheduledTasks(
        $filter: ModelScheduledTaskFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listScheduledTasks(
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                tenantId
                cronExpression
                pickUpSchedule {
                    relation
                    timePrimary
                    timeSecondary
                }
                dropOffSchedule {
                    relation
                    timePrimary
                    timeSecondary
                }
                pickUpLocation {
                    id
                    listed
                    tenantId
                    name
                    contact {
                        name
                        telephoneNumber
                        mobileNumber
                        emailAddress
                        ward
                        line1
                        line2
                        line3
                        town
                        county
                        state
                        country
                        postcode
                        what3words
                    }
                    ward
                    line1
                    line2
                    line3
                    town
                    county
                    state
                    country
                    postcode
                    what3words
                }
                dropOffLocation {
                    id
                    listed
                    tenantId
                    name
                    contact {
                        name
                        telephoneNumber
                        mobileNumber
                        emailAddress
                        ward
                        line1
                        line2
                        line3
                        town
                        county
                        state
                        country
                        postcode
                        what3words
                    }
                    ward
                    line1
                    line2
                    line3
                    town
                    county
                    state
                    country
                    postcode
                    what3words
                }
                establishmentLocation {
                    id
                    listed
                    name
                    tenantId
                }
                deliverables {
                    items {
                        _deleted
                        count
                        deliverableTypeDeliverablesId
                        unit
                    }
                }
                requesterContact {
                    name
                    telephoneNumber
                    mobileNumber
                    emailAddress
                    ward
                    line1
                    line2
                    line3
                    town
                    county
                    state
                    country
                    postcode
                    what3words
                }
                priority
                disabled
            }
            nextToken
            startedAt
        }
    }
`;

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const getScheduledTasks = async () => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            nextToken,
        };
        const response = await request(
            { query: listScheduledTasks, variables },
            GRAPHQL_ENDPOINT
        );
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.listScheduledTasks) {
            items.push(...body?.data?.listScheduledTasks?.items);
            nextToken = body?.data?.listScheduledTasks?.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

const createUnlistedLocation = async (location) => {
    const variables = {
        input: {
            name: location.name,
            contact: location.contact,
            ward: location.ward,
            line1: location.line1,
            line2: location.line2,
            line3: location.line3,
            town: location.town,
            county: location.county,
            state: location.state,
            country: location.country,
            postcode: location.postcode,
            what3words: location.what3words,
            tenantId: location.tenantId,
            listed: 0,
            archived: 0,
        },
    };
    const response = await request(
        { query: createLocation, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    console.log("Created unlisted location", body?.data?.createLocation);
    return body?.data?.createLocation?.id;
};

const createSchedule = (schedule) => {
    if (!schedule) return null;
    const { relation, timePrimary, timeSecondary } = schedule;
    let timePrimaryResult = null;
    let timeSecondaryResult = null;
    let timePrimaryDate = new Date(timePrimary);
    if (timePrimary) {
        // we need timePrimary to start with today's date
        // but use the hours and minutes saved on the server
        const datePrimary = new Date();
        datePrimary.setUTCHours(timePrimaryDate.getUTCHours());
        datePrimary.setUTCMinutes(timePrimaryDate.getUTCMinutes());
        timePrimaryResult = datePrimary.toISOString();
    }
    if (timeSecondary) {
        // work out the difference between timeSecondary and timePrimary
        const timeSecondaryDate = new Date(timeSecondary);
        const difference =
            timeSecondaryDate.getTime() - timePrimaryDate.getTime();
        // add the difference to the new timePrimary that has today's date
        // then if the timeSecondary is the next day, it'll be accounted for
        const dateSecondaryUnixTime =
            new Date(timePrimaryResult).getTime() + difference;
        timeSecondaryResult = new Date(dateSecondaryUnixTime).toISOString();
    }
    return {
        relation,
        timePrimary: timePrimaryResult,
        timeSecondary: timeSecondaryResult,
    };
};

const createNewTask = async (scheduledTask) => {
    const {
        priority,
        pickUpLocation,
        dropOffLocation,
        establishmentLocation,
        requesterContact,
        deliverables,
        tenantId,
        pickUpSchedule,
        dropOffSchedule,
    } = scheduledTask;
    let pickUpLocationId = null;
    let dropOffLocationId = null;
    let establishmentLocationId = null;
    if (pickUpLocation?.listed === 1) {
        pickUpLocationId = pickUpLocation.id;
    } else if (pickUpLocation) {
        console.log("PICK UP LOCATION", dropOffLocation);
        pickUpLocationId = await createUnlistedLocation(pickUpLocation);
    }
    if (dropOffLocation?.listed === 1) {
        dropOffLocationId = dropOffLocation.id;
    } else if (dropOffLocation) {
        console.log("DROP OFF LOCATION", dropOffLocation);
        dropOffLocationId = await createUnlistedLocation(dropOffLocation);
    }
    if (establishmentLocation?.listed === 1) {
        console.log("ESTABLISHMENT LOCATION", dropOffLocation);
        establishmentLocationId = establishmentLocation.id;
    } else if (establishmentLocation) {
        establishmentLocationId = await createUnlistedLocation(
            establishmentLocation
        );
    }

    const currentDate = new Date();
    const dateCreated = currentDate.toISOString().split("T")[0];

    const pickUpScheduleResult = createSchedule(pickUpSchedule);
    const dropOffScheduleResult = createSchedule(dropOffSchedule);
    console.log("PICK UP SCHEDULE", pickUpScheduleResult);
    console.log("DROP OFF SCHEDULE", dropOffScheduleResult);

    const variables = {
        input: {
            priority,
            tenantId,
            requesterContact,
            pickUpLocationId,
            dropOffLocationId,
            establishmentLocationId,
            dateCreated,
            pickUpSchedule: pickUpScheduleResult,
            dropOffSchedule: dropOffScheduleResult,
            status: "PENDING",
            archived: 0,
        },
    };
    const response = await request(
        { query: createTask, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    const taskId = body?.data?.createTask?.id;

    const deliverableItems = deliverables.items;
    const filterDeleted = deliverableItems.filter(
        (deliverable) => !deliverable._deleted
    );
    if (filterDeleted.length > 0) {
        await Promise.all(
            filterDeleted.map(async (deliverable) => {
                const variables = {
                    input: {
                        taskDeliverablesId: taskId,
                        tenantId,
                        count: deliverable.count,
                        deliverableTypeDeliverablesId:
                            deliverable.deliverableTypeDeliverablesId,
                        archived: 0,
                        unit: deliverable.unit,
                    },
                };
                const deliverableResult = await request(
                    { query: createDeliverable, variables },
                    GRAPHQL_ENDPOINT
                );
                const body = await deliverableResult.json();
                errorCheck(body);
                console.log(
                    "Created deliverable",
                    body?.data?.createDeliverable
                );
            })
        );
    }
    console.log("Created task", body?.data?.createTask);
    return body?.data?.createTask;
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const scheduledTasks = await getScheduledTasks();
    const filtered = scheduledTasks.filter(
        (scheduledTask) =>
            scheduledTask.disabled !== 1 && !scheduledTask._deleted
    );
    console.log(`SCHEDULED TASKS: ${JSON.stringify(filtered)}`);
    const tasks = await Promise.all(
        filtered.map((scheduledTask) => createNewTask(scheduledTask))
    );
    console.log(`TASKS: ${JSON.stringify(tasks)}`);
    return tasks;
};
