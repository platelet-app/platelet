import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";

type AddToListButtonProps = {
    onClick?: () => void;
    label: string;
    link?: string;
};

type LinkWrapperProps = {
    children: React.ReactNode;
    link: string | undefined;
};

const LinkWrapper: React.FC<LinkWrapperProps> = ({ children, link }) => {
    if (link) {
        return (
            <Link
                style={{ textDecoration: "inherit", color: "inherit" }}
                to={link}
            >
                {children}
            </Link>
        );
    } else {
        return <>{children}</>;
    }
};

const AddToListButton: React.FC<AddToListButtonProps> = ({
    onClick,
    label,
    link,
}) => {
    return (
        <LinkWrapper link={link}>
            <Stack alignItems="center" direction="row">
                <Typography
                    onClick={onClick}
                    sx={{ cursor: "pointer" }}
                    variant="h5"
                >
                    {label}
                </Typography>
                <IconButton aria-label={label} onClick={onClick}>
                    <AddCircleOutline fontSize="large" />
                </IconButton>
            </Stack>
        </LinkWrapper>
    );
};

export default AddToListButton;
