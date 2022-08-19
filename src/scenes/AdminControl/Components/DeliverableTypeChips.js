import { DataStore } from "aws-amplify";
import { Box, Chip, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as models from "../../../models";
import { useDispatch, useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../../../redux/Selectors";
import { convertListDataToObject } from "../../../utilities";
import { getDeliverableIconByEnum } from "../../../utilities";
import AdminEditDeliverableType from "./AdminEditDeliverableType";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";

export function DeliverableTypeChips() {
    const [state, setState] = useState([]);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [verifyEdit, setVerifyEdit] = useState(true);
    const updateValues = useRef({});
    const observer = useRef({ unsubscribe: () => {} });

    const deliverableTypeModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).DeliverableType;

    const dispatch = useDispatch();

    async function getDeliverableChips() {
        const deliverables = await DataStore.query(models.DeliverableType);
        setState(convertListDataToObject(deliverables));
        observer.current.unsubscribe();
        observer.current = DataStore.observe(models.DeliverableType).subscribe(
            (update) => {
                if (update.opType === "INSERT") {
                    setState((prevState) => ({
                        ...prevState,
                        [update.element.id]: update.element,
                    }));
                } else if (update.opType === "UPDATE") {
                    setState((prevState) => ({
                        ...prevState,
                        [update.element.id]: {
                            ...prevState[update.element.id],
                            ...update.element,
                        },
                    }));
                } else if (update.opType === "DELETE") {
                    setState((prevState) => {
                        const { [update.element.id]: value, ...rest } =
                            prevState;
                        return rest;
                    });
                }
            }
        );
    }
    useEffect(() => getDeliverableChips(), [deliverableTypeModelSynced]);

    useEffect(() => () => observer.current.unsubscribe(), []);

    const onChangeEditItem = (values) => {
        updateValues.current = values;
        if (values.label.length === 0) setVerifyEdit(false);
        else setVerifyEdit(true);
    };

    const onConfirmEditItem = async () => {
        try {
            const existing = await DataStore.query(
                models.DeliverableType,
                itemToEdit.id
            );
            await DataStore.save(
                models.DeliverableType.copyOf(existing, (upd) => {
                    upd.label = updateValues.current.label;
                    upd.icon = updateValues.current.icon;
                    upd.defaultUnit = updateValues.current.defaultUnit;
                    upd.tags = updateValues.current.tags;
                })
            );
        } catch (error) {
            console.log("error updating deliverable type:", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
        setItemToEdit(null);
    };

    return (
        <Box sx={{ maxWidth: 1280 }}>
            <Grid container spacing={1} direction="row">
                {Object.entries(state).map(([key, value]) => (
                    <Grid key={key} item>
                        <Chip
                            avatar={
                                <Box>
                                    {getDeliverableIconByEnum(value.icon, 3)}
                                </Box>
                            }
                            label={value.label}
                            onClick={() => {
                                setItemToEdit(value);
                                updateValues.current = { ...value };
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
            <ConfirmationDialog
                open={itemToEdit !== null}
                onCancel={() => setItemToEdit(null)}
                disabled={!verifyEdit}
                onConfirmation={onConfirmEditItem}
            >
                <AdminEditDeliverableType
                    deliverableType={itemToEdit}
                    key={itemToEdit ? itemToEdit.id : null}
                    onChange={onChangeEditItem}
                />
            </ConfirmationDialog>
        </Box>
    );
}
