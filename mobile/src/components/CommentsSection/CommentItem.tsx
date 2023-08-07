import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import * as models from "../../models";
import { useColorScheme, View } from "react-native";
import { Card, IconButton, Menu, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { ResolvedComment } from "../../hooks/useComments";
import { getWhoami } from "../../redux/Selectors";
import CommentAuthor from "./CommentAuthor";

export enum CommentItemMenuAction {
    EDIT,
    DELETE,
}

type CommentItemProps = {
    comment: ResolvedComment;
    showAuthor?: boolean;
    setAction: (action: CommentItemMenuAction) => void;
};

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    showAuthor,
    setAction,
}) => {
    const { author, body, createdAt, visibility } = comment;
    const whoami = useSelector(getWhoami);
    const isSelf = whoami?.id === author?.id;
    const editCount = comment._version ? comment._version - 1 : 0;
    const colorScheme = useColorScheme();
    const alignSelf = isSelf ? "flex-end" : "flex-start";
    const isPrivate = visibility === models.CommentVisibility.ME;
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View>
            {author && showAuthor && (
                <CommentAuthor isSelf={isSelf} user={author} />
            )}
            <Card
                style={{
                    maxWidth: "90%",
                    alignSelf,
                }}
                mode={isPrivate ? "contained" : "elevated"}
            >
                <Card.Content>
                    <Text style={{ marginRight: 18 }}>{body}</Text>
                    {isSelf && (
                        <View
                            style={{ position: "absolute", right: 0, top: 0 }}
                        >
                            <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={
                                    <IconButton
                                        size={18}
                                        style={{ margin: 0 }}
                                        icon="dots-vertical"
                                        onPress={openMenu}
                                    />
                                }
                            >
                                <Menu.Item
                                    onPress={() => {
                                        setVisible(false);
                                        setAction(CommentItemMenuAction.EDIT);
                                    }}
                                    title="Edit"
                                />
                                <Menu.Item
                                    onPress={() => {
                                        setVisible(false);
                                        setAction(CommentItemMenuAction.DELETE);
                                    }}
                                    title="Delete"
                                />
                            </Menu>
                        </View>
                    )}
                </Card.Content>
                <View
                    style={{
                        alignSelf,
                        flexDirection: "row",
                        alignItems: "center",
                        margin: 8,
                    }}
                >
                    {createdAt && (
                        <Text
                            style={{
                                fontSize: 12,
                                fontStyle: "italic",
                                opacity: 0.3,
                                marginRight: 4,
                            }}
                        >
                            {moment(createdAt).calendar()}
                        </Text>
                    )}
                    {editCount > 0 && (
                        <MaterialIcons
                            name="edit"
                            color={
                                colorScheme === "dark" ? "#bebebe" : "#bfbdc2"
                            }
                        />
                    )}
                    {isPrivate && (
                        <MaterialIcons
                            name="lock"
                            color={
                                colorScheme === "dark" ? "#ff8787" : "#940000"
                            }
                        />
                    )}
                </View>
            </Card>
        </View>
    );
};

export default CommentItem;
