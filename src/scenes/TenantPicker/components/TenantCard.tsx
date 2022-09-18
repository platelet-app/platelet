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
        <Paper onClick={onClick} sx={{ padding: 1 }}>
            <Typography variant="h6">{name}</Typography>
        </Paper>
    );
};
