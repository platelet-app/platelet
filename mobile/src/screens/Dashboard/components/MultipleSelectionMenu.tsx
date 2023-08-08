import { useDispatch, useSelector } from "react-redux";
import * as React from "react";
import { IconButton, Menu, Text } from "react-native-paper";
import {
    getWhoami,
    selectedItemsSelector,
    tenantIdSelector,
} from "../../../redux/Selectors";
import { BackHandler, View } from "react-native";
import { clearItems } from "../../../redux/selectionMode/selectionModeActions";
import * as models from "../../../models";
import TaskActionsConfirmationDialog from "../../Task/components/TaskActionsConfirmationDialog";
import generateMultipleTaskTimeModels from "../utilities/generateMultipleTaskTimeModels";
import { DataStore } from "aws-amplify";
import generateMultipleTaskComments from "../utilities/generateMultipleTaskComments";
import { useFocusEffect } from "@react-navigation/native";

type MultipleSelectionMenuProps = {
    tabIndex: number;
    style?: React.CSSProperties;
};

enum actions {
    markPickedUp,
    markDelivered,
    markRiderHome,
    markCancelled,
    markRejected,
}

const getKey = (action: actions | null) => {
    switch (action) {
        case actions.markPickedUp:
            return "timePickedUp";
        case actions.markDelivered:
            return "timeDroppedOff";
        case actions.markRiderHome:
            return "timeRiderHome";
        case actions.markCancelled:
            return "timeCancelled";
        case actions.markRejected:
            return "timeRejected";
        default:
            return null;
    }
};

const getNameKey = (action: actions | null) => {
    switch (action) {
        case actions.markPickedUp:
            return "timePickedUpSenderName";
        case actions.markDelivered:
            return "timeDroppedOffRecipientName";
        default:
            return null;
    }
};

const MultipleSelectionMenu: React.FC<MultipleSelectionMenuProps> = ({
    tabIndex,
    style = {},
}) => {
    const [visible, setVisible] = React.useState(false);
    const [selectedAction, setSelectedAction] = React.useState<actions | null>(
        null
    );
    const [reasonBody, setReasonBody] = React.useState("");
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const selectedItems = useSelector(selectedItemsSelector)[tabIndex];
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const tenantId = useSelector(tenantIdSelector);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (selectedItems && Object.keys(selectedItems).length > 0) {
                    dispatch(clearItems(tabIndex));
                    return true;
                } else {
                    return false;
                }
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => subscription.remove();
        }, [dispatch, selectedItems, tabIndex])
    );

    const handleBackButton = () => {
        dispatch(clearItems(tabIndex));
    };

    function checkButtonDisabled(action: actions) {
        if (!selectedItems) return true;
        const values: models.Task[] = Object.values(selectedItems);
        if (
            values.some((item) => {
                return [
                    models.TaskStatus.COMPLETED,
                    models.TaskStatus.CANCELLED,
                    models.TaskStatus.ABANDONED,
                    models.TaskStatus.REJECTED,
                ].some((ts) => item.status === ts);
            })
        ) {
            return true;
        }
        if (action === actions.markPickedUp) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== models.TaskStatus.ACTIVE;
                })
            );
        }
        if (action === actions.markDelivered) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== models.TaskStatus.PICKED_UP;
                })
            );
        }
        if (action === actions.markRiderHome) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== models.TaskStatus.DROPPED_OFF;
                })
            );
        }
        if ([actions.markCancelled, actions.markRejected].includes(action)) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status === models.TaskStatus.DROPPED_OFF;
                })
            );
        }
    }

    const handleConfirm = async (values: any) => {
        if (selectedAction === null) return;

        const items = selectedItems
            ? (Object.values(selectedItems) as models.Task[])
            : [];

        const generatedModels = await generateMultipleTaskTimeModels(
            items,
            values
        );
        let generatedCommentModels: models.Comment[] = [];
        if (reasonBody) {
            const author = await DataStore.query(models.User, whoami.id);
            if (author && tenantId) {
                generatedCommentModels = await generateMultipleTaskComments(
                    items,
                    reasonBody,
                    author,
                    tenantId
                );
            }
        }

        await Promise.all(
            generatedModels.map((model) => DataStore.save(model))
        );
        await Promise.all(
            generatedCommentModels.map((model) => DataStore.save(model))
        );
        setSelectedAction(null);
        dispatch(clearItems(tabIndex));
    };

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 50,
                ...style,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <IconButton icon="arrow-left" onPress={handleBackButton} />
                <Text variant="titleLarge">
                    {selectedItems && Object.values(selectedItems).length}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <IconButton
                    icon="package-up"
                    aria-label="Mark selected picked up"
                    onPress={() => {
                        setSelectedAction(actions.markPickedUp);
                    }}
                    disabled={checkButtonDisabled(actions.markPickedUp)}
                />
                <IconButton
                    icon="package-down"
                    aria-label="Mark selected delivered"
                    onPress={() => {
                        setSelectedAction(actions.markDelivered);
                    }}
                    disabled={checkButtonDisabled(actions.markDelivered)}
                />
                <IconButton
                    icon="home"
                    aria-label="Mark selected rider home"
                    onPress={() => {
                        setSelectedAction(actions.markRiderHome);
                    }}
                    disabled={checkButtonDisabled(actions.markRiderHome)}
                />
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <IconButton
                            aria-label="More options"
                            icon="dots-vertical"
                            onPress={openMenu}
                        />
                    }
                >
                    <Menu.Item
                        aria-label="Mark selected cancelled"
                        onPress={() => {
                            setVisible(false);
                            setSelectedAction(actions.markCancelled);
                        }}
                        title="Cancelled"
                    />
                    <Menu.Item
                        aria-label="Mark selected rejected"
                        onPress={() => {
                            setVisible(false);
                            setSelectedAction(actions.markRejected);
                        }}
                        title="Rejected"
                    />
                </Menu>
            </View>
            <TaskActionsConfirmationDialog
                key={selectedAction || "task-actions-confirmation-dialog"}
                nullify={false}
                taskKey={getKey(selectedAction)}
                nameKey={getNameKey(selectedAction)}
                open={selectedAction !== null}
                onClose={() => setSelectedAction(null)}
                onConfirm={handleConfirm}
                needsReason={[actions.markRejected, actions.markCancelled].some(
                    (a) => a === selectedAction
                )}
                reasonBody={reasonBody}
                onChangeReasonBody={setReasonBody}
            />
        </View>
    );
};

export default MultipleSelectionMenu;
