import _ from 'lodash';
export const createErrorMessageSelector = (actions) => (state) => {
    // returns the first error messages for actions
    // * We assume when any request fails on a page that
    //   requires multiple API calls, we shows the first error
    return _(actions)
        .map((action) => _.get(state, `api.error.${action}`))
        .compact()
        .first() || '';
};
export const createLoadingSelector = actions => state => {
    if (Object.entries(_.get(state, 'loadingReducer')).length === 0) {
        return true;
    }
    let found = false;
    for (let value of actions) {
        if (value in state.loadingReducer) {
            found = true;
            break;
        }
    }
    if (found)
        return actions.some(action => state.loadingReducer[action]);
    else
        return true
};

export const createPostingSelector = actions => state => {
    return actions.some(action => state.postingReducer[action]);
};

export const createNotFoundSelector = actions => state => {
    return actions.some(action => state.notFoundReducer[action]);
};

export const createContextMenuSnackSelector = uuid => state => {
    // This is redundant but kept in case I decide I need it after all
    return state.taskContextMenuSnack.uuid === uuid ? state.taskContextMenuSnack : undefined;
    const filt = state.taskContextMenuSnack.filter(snack => snack.uuid === uuid)
    if (filt.length === 1){
        const index = state.taskContextMenuSnack.indexOf(filt[0]);
        const result = state.taskContextMenuSnack.slice(index, 1)[0]
        console.log(result)
        return result;
    } else {
        return undefined;
    }
};

export const getCurrentSessionSelector = (state) => state.currentSession.session;
