import { Authenticator } from "@aws-amplify/ui-react";
import { Box } from "@mui/material";
import React from "react";
import SignInHeader from "./components/SignInHeader";
import "./login.css";
import saveAmplifyConfig from "./saveAmplifyConfig";

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
        saveAmplifyConfig();
    }, []);

    return (
        <Box
            sx={{
                height: "100vh",
                margin: "auto",
            }}
        >
            <Authenticator formFields={formFields} components={components}>
                {children}
            </Authenticator>
        </Box>
    );
};

export default Login;
