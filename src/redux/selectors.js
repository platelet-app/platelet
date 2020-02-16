import _ from 'lodash';
export const createLoadingSelector = (actions) => (state) => {
    console.log("LOADING SELECTOR")
    console.log(actions)
    console.log(state)
    // returns true only when all actions is not loading
    console.log(_.get(state, 'loadingReducer').length)
    if (Object.entries(_.get(state, 'loadingReducer')).length === 0) {
        return true
    }
    return _(actions)
        .some((action) => _.get(state, `loadingReducer.${action}`));
};