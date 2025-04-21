import { Auth } from "aws-amplify";
import React from "react";

const useIsPaidSubscription = () => {
    const [isPaid, setIsPaid] = React.useState(false);
    const getData = React.useCallback(async () => {
        const user = await Auth.currentSession();
        const accessToken = user.getAccessToken();
        const groups = accessToken.payload["cognito:groups"];
        console.log("GROUPS", groups);
        if (groups) setIsPaid(groups.includes("PAID"));
        else setIsPaid(false);
    }, []);
    React.useEffect(() => {
        getData();
    }, [getData]);
    return isPaid;
};

export default useIsPaidSubscription;
