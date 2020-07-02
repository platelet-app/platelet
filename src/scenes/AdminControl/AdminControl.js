import React, {useEffect, useState} from "react";
import {setMenuIndex} from "../../redux/Actions";
import {useDispatch} from "react-redux";
import * as io from 'socket.io-client'

import Button from "@material-ui/core/Button";
import {PaddedPaper} from "../../styles/common";
import {getLogin} from "../../utilities"


export function AdminControl(props) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setMenuIndex(6));
//        socket.on('subscribed_response', function(msg) {
//            console.log("Received:" + msg.object_uuid);
//            console.log(msg.data)
//            console.log(msg.tab_id)
//        })
    }, []);
    return (
        <PaddedPaper>
            <Button onClick={() => {
                const data = "7d6a8fca-385c-4c64-a1b0-9a60cb5fe749"
                //socket.emit('subscribe', data);
            }}>aaaa</Button>

        </PaddedPaper>
    )
}
