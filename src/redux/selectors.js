import _ from 'lodash';
export const createErrorMessageSelector = actions => (state) => {
    const errors = actions.map(action => state.error[action]);
    if (errors && errors[0]) {
        return errors[0];
    }
    return '';
};
export const createLoadingSelector = actions => state => {
    console.log(state)
    if (Object.entries(_.get(state, 'loadingReducer')).length === 0) {
        return true;
    }
    let found = false;
    for (let value of actions) {
        console.log(value)
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
