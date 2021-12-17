import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as io from "socket.io-client";

import Button from "@mui/material/Button";
import { PaddedPaper } from "../../styles/common";
import { getLogin } from "../../utilities";
import { createLoadingSelector } from "../../redux/LoadingSelectors";
import { ServerSettings } from "./Components/ServerSettings";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";

export function AdminControl(props) {
    const isFetching = useSelector((state) => loadingSelector(state));
    return (
        <PaddedPaper>
            {isFetching ? (
                <FormSkeleton />
            ) : (
                <ServerSettings serverSettings={serverSettings} />
            )}
        </PaddedPaper>
    );
}
