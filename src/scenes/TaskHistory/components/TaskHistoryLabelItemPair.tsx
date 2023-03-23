import { Stack, Typography } from "@mui/material";

type LabelItemPairProps = {
    label?: string;
    children: React.ReactNode;
};

const LabelItemPair: React.FC<LabelItemPairProps> = ({ label, children }) => {
    const actualLabel = label ? `${label}:` : "";
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Typography>{actualLabel}</Typography>
            {children}
        </Stack>
    );
};

export default LabelItemPair;
