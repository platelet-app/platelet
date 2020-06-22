import React, {useEffect} from "react";
import {setMenuIndex} from "../../redux/Actions";
import {useDispatch} from "react-redux";

export function AdminControl(props) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setMenuIndex(6));
    }, []);
    return (
        <>TODO</>
    )
}
