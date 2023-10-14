import * as React from "react";
import * as models from "../../models";
import { Button, Card, TextInput } from "react-native-paper";
import CommentVisibilityChips from "./CommentVisibilityChips";
import { useSelector } from "react-redux";
import { getWhoami, tenantIdSelector } from "../../redux/Selectors";
import CommentAuthor from "./CommentAuthor";
import { DataStore } from "aws-amplify";
import { View } from "react-native";
import GenericErrorSnack from "../../snacks/GenericErrorSnack";

type NewCommentCardProps = {
    parentId: string;
};

const NewCommentCard: React.FC<NewCommentCardProps> = ({ parentId }) => {
    const [body, setBody] = React.useState("");
    const [isPosting, setIsPosting] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const [resetTextInput, setResetTextInput] = React.useState(false);
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
            setResetTextInput(!resetTextInput);
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
        setResetTextInput(!resetTextInput);
    };

    let placeHolder = "Write a comment...";
    if (visibility === models.CommentVisibility.ME) {
        placeHolder = "Write a private note...";
    }

    return (
        <>
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
                        key={
                            resetTextInput
                                ? "comment-text-input-first"
                                : "comment-text-input-second"
                        }
                        defaultValue=""
                        mode="outlined"
                        onChangeText={setBody}
                        placeholder={placeHolder}
                        multiline
                    />
                </Card.Content>
                <Card.Actions>
                    <Button
                        disabled={isPosting || !!!body}
                        onPress={handleDiscard}
                    >
                        Discard
                    </Button>
                    <Button
                        disabled={isPosting || !!!body}
                        onPress={handlePost}
                    >
                        Post
                    </Button>
                </Card.Actions>
            </Card>
            <GenericErrorSnack
                visible={!!error}
                onDismiss={() => setError(null)}
            />
        </>
    );
};

export default NewCommentCard;
