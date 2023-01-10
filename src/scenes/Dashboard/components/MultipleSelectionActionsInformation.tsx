import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    Grid,
    Button,
    Paper,
    Link,
} from "@mui/material";
import TaskCard from "./TaskCardsColoured";
import { useTheme } from "@mui/material/styles";
import {
    actions,
    dotActions,
} from "../components/MultipleSelectionActionsMenu";
import * as models from "../../../models";

function humanReadableAction(action: actions | dotActions) {
    if (action === actions.markPickedUp) {
        return "picked up";
    } else if (action === actions.markDelivered) {
        return "delivered";
    } else if (action === actions.markRiderHome) {
        return "rider home";
    } else if (action === dotActions.markCancelled) {
        return "cancelled";
    } else if (action === dotActions.markRejected) {
        return "rejected";
    }
    return action;
}

type MultipleSelectionActionsInformationProps = {
    selectedItems: models.Task[];
    action: actions | dotActions | null;
};

const MultipleSelectionActionsInformation: React.FC<MultipleSelectionActionsInformationProps> =
    ({ selectedItems, action }) => {
        const [message, setMessage] = useState<React.ReactElement | string>("");
        const [dialogOpen, setDialogOpen] = useState(false);
        const theme = useTheme();
        const isMd = useMediaQuery(theme.breakpoints.down("md"));
        const generateLink = React.useCallback((selectedItems) => {
            const items = Object.values(selectedItems);
            const plural = items.length > 1 ? "items" : "item";
            return (
                <Link
                    sx={{
                        cursor: "pointer",
                    }}
                    onClick={() => setDialogOpen(true)}
                >
                    {items.length} {plural}
                </Link>
            );
        }, []);
        const generateMessage = React.useCallback(
            (action, selectedItems) => {
                const items = Object.values(selectedItems);
                if (items.length === 0) {
                    setMessage("No items selected");
                    return;
                }
                if (action === actions.assignUser) {
                    setMessage(
                        <Typography variant="h6">
                            Assign users to {generateLink(selectedItems)}
                        </Typography>
                    );
                } else if (action === dotActions.duplicate) {
                    setMessage(
                        <Typography variant="h6">
                            Duplicate {generateLink(selectedItems)}
                        </Typography>
                    );
                } else {
                    setMessage(
                        <Typography variant="h6">
                            Updating {generateLink(selectedItems)} as{" "}
                            {humanReadableAction(action)}
                        </Typography>
                    );
                }
            },
            [generateLink]
        );
        useEffect(
            () => generateMessage(action, selectedItems),
            [selectedItems, action, generateMessage]
        );
        const itemLength = Object.values(selectedItems).length;
        return (
            <>
                <Dialog
                    open={dialogOpen}
                    fullWidth={!isMd}
                    fullScreen={isMd}
                    maxWidth={itemLength > 4 ? "md" : "sm"}
                    onClose={() => setDialogOpen(false)}
                >
                    <DialogContent>
                        <Paper sx={{ padding: isMd ? 0 : 1 }}>
                            <Grid
                                sx={{ width: "100%", flexGrow: 1 }}
                                container
                                justifyContent="flex-start"
                                direction="row"
                                spacing={1}
                            >
                                {Object.values(selectedItems).map((item) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={itemLength > 4 ? 6 : 12}
                                        md={itemLength > 4 ? 6 : 12}
                                        key={item.id}
                                        sx={{
                                            marginBottom: 0.5,
                                            minWidth: 300,
                                            maxWidth: 410,
                                            width: "100%",
                                        }}
                                    >
                                        <TaskCard
                                            priority={item.priority as string}
                                            pickUpLocation={item.pickUpLocation}
                                            dropOffLocation={
                                                item.dropOffLocation
                                            }
                                            riderResponsibility={
                                                item.riderResponsibility
                                            }
                                            timeOfCall={item.timeOfCall}
                                            status={item.status}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDialogOpen(false);
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {message}
            </>
        );
    };

export default MultipleSelectionActionsInformation;
