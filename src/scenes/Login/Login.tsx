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
    const hubListener = React.useRef<null | (() => void)>(null);
    const dispatch = useDispatch();
    const isInit = React.useRef(false);
    const isCleared = React.useRef(false);
    const [clearingData, setClearingData] = React.useState(false);

    const initFunction = React.useCallback(async () => {
        if (isInit.current || clearingData) return;
        const user = await Auth.currentAuthenticatedUser().catch(() => null);
        if (user) {
            dispatch(initialiseApp());
            isInit.current = true;
        } else {
            if (!isCleared.current) {
                setClearingData(true);
                console.log("Clearing DataStore");
                await DataStore.stop();
                await DataStore.clear();
                setClearingData(false);
                isCleared.current = true;
            }
            hubListener.current = Hub.listen("auth", async (hubData) => {
                if (hubData.payload.event === "signIn") {
                    console.log("Initialising app");
                    dispatch(initialiseApp());
                    isInit.current = true;
                    if (hubListener.current)
                        Hub.remove("auth", hubListener.current);
                }
            });
        }
    }, [dispatch, clearingData]);

    React.useEffect(() => {
        initFunction();
        return () => {
            if (hubListener.current) Hub.remove("auth", hubListener.current);
        };
    }, [initFunction]);

    let content: React.ReactNode = <Splash />;
    if (whoamiIsSet && !clearingData) content = children;

    return (
        <Authenticator loginMechanisms={["email"]} components={components}>
            {content}
        </Authenticator>
    );
};

export default Login;
