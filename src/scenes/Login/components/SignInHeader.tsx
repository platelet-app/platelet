import { Button, Stack, Typography } from "@mui/material";
import { DataStore } from "aws-amplify";

const handleChangeTeam = async () => {
    try {
        localStorage.clear();
        await DataStore.clear();
        window.location.reload();
    } catch (error) {
        console.log("Could not reset team:", error);
    }
};

const SignInHeader: React.FC = () => {
    const tenantName = localStorage.getItem("tenantName");
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            paddingLeft={4}
            paddingRight={4}
            paddingTop={2}
        >
            <Typography sx={{ color: "black" }}>
                {tenantName?.toUpperCase()}
            </Typography>
            {process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT &&
                // amplify doesn't allow unset env vars for individual branches
                process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT !==
                    "undefined" && (
                    <Button
                        aria-label="Change team"
                        onClick={handleChangeTeam}
                        variant="contained"
                    >
                        Change Team
                    </Button>
                )}
        </Stack>
    );
};

export default SignInHeader;
