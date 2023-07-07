import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import SignInHeader from "./components/SignInHeader";
import "./login.css";

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
    return (
        <Authenticator loginMechanisms={["email"]} components={components}>
            {children}
        </Authenticator>
    );
};

export default Login;
