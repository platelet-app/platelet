import * as React from "react";
import * as models from "../models";
import { Button, Card, TextInput } from "react-native-paper";
import { Text } from "react-native-paper/lib/typescript/src/components/Avatar/Avatar";
import CommentVisibilityChips from "./CommentVisibilityChips";
import { useSelector } from "react-redux";
import { getWhoami, tenantIdSelector } from "../redux/Selectors";
import CommentAuthor from "./CommentAuthor";
import UserAvatar from "./UserAvatar";
import { DataStore } from "aws-amplify";
import { View } from "react-native";

type NewCommentCardProps = {
    parentId: string;
};

const NewCommentCard: React.FC<NewCommentCardProps> = ({ parentId }) => {
    const [body, setBody] = React.useState("");
    const [isPosting, setIsPosting] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const [visibility, setVisibility] =
        React.useState<models.CommentVisibility>(
            models.CommentVisibility.EVERYONE
        );
    const whoami = useSelector(getWhoami);
    const tenantId = useSelector(tenantIdSelector);

    const handlePost = async () => {
        setIsPosting(true);
        try {
            const author = await DataStore.query(models.User, whoami.id);
            await DataStore.save(
                new models.Comment({
                    parentId,
                    body,
                    author,
                    tenantId,
                    visibility,
                })
            );
            setBody("");
        } catch (e) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
        } finally {
            setIsPosting(false);
        }
    };

    const handleDiscard = () => {
        setBody("");
    };

    let placeHolder = "Write a comment...";
    if (visibility === models.CommentVisibility.ME) {
        placeHolder = "Write a private note...";
    }

    return (
        <Card>
            <Card.Content>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <CommentAuthor user={whoami} />
                    <CommentVisibilityChips
                        value={visibility}
                        onChange={setVisibility}
                    />
                </View>
                <TextInput
                    value={body}
                    mode="outlined"
                    onChangeText={setBody}
                    placeholder={placeHolder}
                    multiline
                />
            </Card.Content>
            <Card.Actions>
                <Button disabled={isPosting || !!!body} onPress={handleDiscard}>
                    Discard
                </Button>
                <Button disabled={isPosting || !!!body} onPress={handlePost}>
                    Post
                </Button>
            </Card.Actions>
        </Card>
    );
};

export default NewCommentCard;
