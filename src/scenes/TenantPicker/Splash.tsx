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
                <img width={256} height={256} src="/icon/hires.png" />
            </Grow>
        </Box>
    );
};

export default Splash;
