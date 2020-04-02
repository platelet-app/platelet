import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector} from "../redux/selectors";
import FormSkeleton from "../loadingComponents/FormSkeleton";
import UserProfile from "../components/UserProfile"
import {setMenuIndex} from "../redux/Actions";

export default function MyUserProfile() {
    const loadingSelector = createLoadingSelector(['GET_WHOAMI']);
    const isFetching = useSelector(state => loadingSelector(state));
    const whoami = useSelector(state => state.whoami);
    const dispatch = useDispatch();
    useEffect(() => {dispatch(setMenuIndex(0));}, []);
    if (isFetching) {
        return (
            <FormSkeleton/>
        )
    } else {

        return (
            <UserProfile user={whoami}/>
        )
    }
}
