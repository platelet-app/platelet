import { Box, Grow } from "@mui/material";

const Splash = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <Grow in timeout={1000}>
                <img
                    width={400}
                    height={200}
                    alt="platelet dispatch logo"
                    src="/icon/platelet-logo.png"
                />
            </Grow>
        </Box>
    );
};

export default Splash;
