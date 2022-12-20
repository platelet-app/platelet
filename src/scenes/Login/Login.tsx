import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import SignInHeader from "./components/SignInHeader";
import "./login.css";
import saveAmplifyConfig from "../../utilities/saveAmplifyConfig";

type LoginProps = {
    children: React.ReactElement;
    teamName?: string;
};

const formFields = {
    signIn: {
        username: {
            placeholder: "Enter your email",
        },
    },
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
        const tenantId = localStorage.getItem("tenantId");
        if (tenantId) {
            saveAmplifyConfig(tenantId);
        }
    }, []);

    return (
        <Authenticator formFields={formFields} components={components}>
            {children}
        </Authenticator>
    );
};

export default Login;
