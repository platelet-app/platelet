import React, {useEffect} from 'react'
import {setMenuIndex} from "../redux/Actions";
import {useDispatch} from "react-redux";

export default function Home(props) {
    const dispatch = useDispatch();
    useEffect(() => {dispatch(setMenuIndex(1))}, []);
    return (
        <div style={{textAlign: "left"}}>
        </div>
    )
}