import RefreshIcon from "@mui/icons-material/Refresh";
import * as actions from "../../redux/awsHubListener/awsHubListenerActions";
import { DataStore } from "aws-amplify";
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";

type ResyncDataStoreButtonProps = {
    onClick: () => void;
};

const ResyncDataStoreButton: React.FC<ResyncDataStoreButtonProps> = ({
    onClick,
}) => {
    const dispatch = useDispatch();

    const onClickRefresh = async () => {
        onClick();
        await DataStore.stop();
        dispatch(actions.resetModelSynced());
        await DataStore.start();
    };
    return (
        <IconButton aria-label="refresh resync data" onClick={onClickRefresh}>
            <RefreshIcon />
        </IconButton>
    );
};

export default ResyncDataStoreButton;
