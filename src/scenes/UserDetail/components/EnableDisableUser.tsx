import React from "react";
import { API } from "aws-amplify";
import * as models from "../../../models";
import { Button } from "@mui/material";
import * as mutations from "../../../graphql/mutations";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";

type EnableDisableUserProps = {
    user: models.User;
};

const EnableDisableUser: React.FC<EnableDisableUserProps> = ({ user }) => {
    const dispatch = useDispatch();
    const [isPosting, setIsPosting] = React.useState(false);
    const whoami = useSelector(getWhoami);
    const isAdmin = whoami?.roles.includes(models.Role.ADMIN);
    const errorMessage = "Sorry, something went wrong";
    const handleEnable = async () => {
        setIsPosting(true);
        try {
            await API.graphql({
                query: mutations.enableUser,
                variables: {
                    input: {
                        userId: user.id,
                    },
                },
            });
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
            console.log(error);
        } finally {
            setIsPosting(false);
        }
    };
    const handleDisable = async () => {
        setIsPosting(true);
        try {
            await API.graphql({
                query: mutations.disableUser,
                variables: {
                    input: {
                        userId: user.id,
                    },
                },
            });
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
            console.log(error);
        } finally {
            setIsPosting(false);
        }
    };
    if (!isAdmin) {
        return null;
    } else if (user.disabled === 1) {
        return (
            <Button disabled={isPosting} onClick={handleEnable} color="success">
                Enable
            </Button>
        );
    } else {
        return (
            <Button disabled={isPosting} onClick={handleDisable} color="error">
                Disable
            </Button>
        );
    }
};

export default EnableDisableUser;
