import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import SignInHeader from "./components/SignInHeader";
import "./login.css";
import saveAmplifyConfig from "../../utilities/saveAmplifyConfig";

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
    React.useEffect(() => {
        if (process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT) {
            const tenantId = localStorage.getItem("tenantId");
            if (tenantId) {
                saveAmplifyConfig(tenantId);
            }
        }
    }, []);

    return (
        <Authenticator loginMechanisms={["email"]} components={components}>
            {children}
        </Authenticator>
    );
};

export default Login;
