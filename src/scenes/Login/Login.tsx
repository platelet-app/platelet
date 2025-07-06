import { Authenticator } from "@aws-amplify/ui-react";
import { Auth, DataStore, Hub } from "aws-amplify";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialiseApp } from "../../redux/initialise/initialiseActions";
import { getWhoami } from "../../redux/Selectors";
import Splash from "../TenantPicker/Splash";
import SignInHeader from "./components/SignInHeader";
import "./login.css";

type LoginProps = {
    children: React.ReactNode;
    teamName?: string;
};

const components = {
    SignIn: {
        Header() {
            return <SignInHeader />;
        },
    },
};

const Login: React.FC<LoginProps> = ({ children }) => {
    const whoami = useSelector(getWhoami);
    const whoamiIsSet = !!whoami?.id;
    const dispatch = useDispatch();
    const isInit = React.useRef(false);
    const [clearingData, setClearingData] = React.useState(true);

    const initFunction = React.useCallback(async () => {
        if (isInit.current || clearingData) return;
        const user = await Auth.currentAuthenticatedUser().catch(() => null);
        if (user) {
            dispatch(initialiseApp());
            isInit.current = true;
            setClearingData(false);
        }
    }, [dispatch, clearingData]);

    React.useEffect(() => {
        initFunction();
    }, [initFunction]);

    const clearFunction = React.useCallback(async () => {
        if (!clearingData) return;
        const user = await Auth.currentAuthenticatedUser().catch(() => null);
        if (!user) {
            console.log("Clearing DataStore");
            await DataStore.stop();
            await DataStore.clear();
            setClearingData(false);
        } else {
            setClearingData(false);
        }
    }, [clearingData]);

    React.useEffect(() => {
        clearFunction();
    }, [clearFunction]);

    React.useEffect(() => {
        const hubListener = (hubData: any) => {
            if (hubData.payload.event === "signIn") {
                console.log("Initialising app");
                dispatch(initialiseApp());
                isInit.current = true;
                setClearingData(false);
            }
        };
        Hub.listen("auth", hubListener);
        return () => {
            Hub.remove("auth", hubListener);
        };
    }, [dispatch]);

    let content: React.ReactNode = <Splash />;
    if (whoamiIsSet) content = children;

    return (
        <Authenticator loginMechanisms={["email"]} components={components}>
            {content}
        </Authenticator>
    );
};

export default Login;
