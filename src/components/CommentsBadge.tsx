import { styled } from "@mui/styles";
import MessageIcon from "@mui/icons-material/Message";
import { Box } from "@mui/material";
import Badge, { BadgeProps } from "@mui/material/Badge";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
        right: -6,
        top: 9,
        padding: "0 4px",
        width: 20,
        height: 20,
        background: "rgba(255, 255, 255, 0.0)",
        // @ts-ignore
        color: theme.palette.text.primary,
    },
}));

type CommentsBadgeProps = {
    count: number;
    iconSize?: number;
};

const CommentsBadge: React.FC<CommentsBadgeProps> = ({
    count,
    iconSize = 20,
}) => {
    console.log(count);
    if (count > 0) {
        return (
            <Box>
                <StyledBadge badgeContent={count} color="secondary">
                    <MessageIcon sx={{ width: iconSize, height: iconSize }} />
                </StyledBadge>
            </Box>
        );
    } else {
        return <div></div>;
    }
};

export default CommentsBadge;
