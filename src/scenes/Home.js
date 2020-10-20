import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import SessionList from "./SessionList";
import UsersTasks from "./Dashboard/UsersTasks";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";
import Dashboard from "./Dashboard/Dashboard";

export default function Home(props) {
    const dispatch = useDispatch();
    const whoami = useSelector(state => state.whoami.user);
    if (whoami.roles.includes("coordinator")) {
        return (
            <Dashboard/>
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
