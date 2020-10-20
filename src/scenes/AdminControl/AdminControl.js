import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import * as io from 'socket.io-client'

import Button from "@material-ui/core/Button";
import {PaddedPaper} from "../../styles/common";
import {getLogin} from "../../utilities"


export function AdminControl(props) {
    const dispatch = useDispatch();
    return (
        <PaddedPaper>
            <Button onClick={() => {
                const data = "7d6a8fca-385c-4c64-a1b0-9a60cb5fe749"
                //socket.emit('subscribe', data);
            }}>aaaa</Button>

        </PaddedPaper>
    )
}
