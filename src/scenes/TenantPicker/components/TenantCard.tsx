import React from "react";
import { Paper, Typography } from "@mui/material";

interface TenantCardProps {
    name: string;
    onClick: () => void;
}

export const TenantCard: React.FC<TenantCardProps> = ({
    name,
    onClick,
}: TenantCardProps) => {
    return (
        <Paper
            sx={{
                cursor: "pointer",
                padding: 2,
                maxWidth: 600,
            }}
            onClick={onClick}
        >
            <Typography variant="h6">{name}</Typography>
        </Paper>
    );
};
