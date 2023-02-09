import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import SignInHeader from "./components/SignInHeader";
import "./login.css";
//import saveAmplifyConfig from "../../utilities/saveAmplifyConfig";

type LoginProps = {
    children: React.ReactElement;
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
    // TODO: re-enable this function when tenants are set up
    /*React.useEffect(() => {
        const tenantId = localStorage.getItem("tenantId");
        if (tenantId) {
            saveAmplifyConfig(tenantId);
        }
    }, []);*/

    return (
        <Authenticator loginMechanisms={["email"]} components={components}>
            {children}
        </Authenticator>
    );
};

export default Login;
