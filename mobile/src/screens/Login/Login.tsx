import { useColorScheme } from "react-native";
import * as React from "react";
import {
    Authenticator,
    defaultDarkModeOverride,
    ThemeProvider,
} from "@aws-amplify/ui-react-native";
import LoginHeader from "./LoginHeader";

type LoginProps = {
    children: React.ReactNode;
    onChangeTeam?: () => void;
};

const Login: React.FC<LoginProps> = ({ children, onChangeTeam }) => {
    const colorMode = useColorScheme();
    const HeaderWithProps = React.useCallback(
        () => <LoginHeader onChangeTeam={onChangeTeam} />,
        [onChangeTeam]
    );
    return (
        <ThemeProvider
            theme={{
                overrides: [defaultDarkModeOverride],
            }}
            colorMode={colorMode}
        >
            <Authenticator.Provider>
                <Authenticator
                    components={{
                        SignIn: (props) => (
                            <Authenticator.SignIn
                                {...props}
                                Header={HeaderWithProps}
                            />
                        ),
                    }}
                    loginMechanisms={["email"]}
                >
                    {children}
                </Authenticator>
            </Authenticator.Provider>
        </ThemeProvider>
    );
};

export default Login;
