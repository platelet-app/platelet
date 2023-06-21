import React from "react";
import { Box, Typography } from "@mui/material";

interface TenantCardProps {
    name: string;
    onClick: () => void;
}

export const TenantCard: React.FC<TenantCardProps> = ({
    name,
    onClick,
}: TenantCardProps) => {
    return (
        <Box
            sx={{
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                },
                borderRadius: 1,
                width: "100%",
                maxWidth: 500,
            }}
            onClick={onClick}
        >
            <Typography variant="h6">{name}</Typography>
        </Box>
    );
};
