import React from "react";
import { Button } from "@mui/material";
import { API } from "aws-amplify";
import { queries } from "@platelet-app/graphql";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";
import { User } from "@platelet-app/types";

type TakeOutUserDataProps = {
    user: User;
};

const TakeOutUserData: React.FC<TakeOutUserDataProps> = ({ user }) => {
    const [isPosting, setIsPosting] = React.useState(false);
    const dispatch = useDispatch();

    const handleTakeOutData = async () => {
        try {
            setIsPosting(true);
            const variables = { userId: user.id };
            await API.graphql({
                query: queries.userTakeOutData,
                variables,
            });
            dispatch(displayInfoNotification("Request successful."));
        } catch {
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Button
            variant="outlined"
            disabled={isPosting}
            onClick={handleTakeOutData}
        >
            Take out data
        </Button>
    );
};

export default TakeOutUserData;
