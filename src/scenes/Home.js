import React, {useEffect} from 'react'
import {setMenuIndex} from "../redux/Actions";
import {useDispatch, useSelector} from "react-redux";
import SessionList from "./SessionList";
import UsersTasks from "./SessionDetail/UsersTasks";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";

export default function Home(props) {
    const dispatch = useDispatch();
    useEffect(() => {dispatch(setMenuIndex(1))}, []);
    const whoami = useSelector(state => state.whoami.user);
    if (whoami.roles.includes("coordinator")) {
        return (
            <SessionList/>
        )
    } else if (whoami.roles.includes("rider")) {
        return (
            <UsersTasks/>
        )
    } else if (whoami.roles.includes("admin")) {
        // TODO: Admin page
        return (
            <></>
        )
    } else {
        return (
            <CardsGridSkeleton/>
        )
    }



}