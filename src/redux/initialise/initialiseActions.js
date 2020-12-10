export const INITIALISE_APP = "INITIALISE_APP";

export function initialiseApp(token) {
    return {type: INITIALISE_APP, token }
}
