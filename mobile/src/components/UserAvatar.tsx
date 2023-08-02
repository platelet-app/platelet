import * as React from "react";
import { Avatar } from "react-native-paper";
import { generateS3Link } from "../amplifyUtilities";
import * as models from "../models";

type UserAvatarProps = {
    user: models.User;
    size?: number;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 35 }) => {
    const nameArray = user.displayName
        ? user.displayName.split(" ")
        : ["n", "a"];
    const reducer = (accumulator: string, currentValue: string) =>
        accumulator + currentValue[0];
    const initials = nameArray.reduce(reducer, "").slice(0, 2);
    const [avatarURL, setAvatarURL] = React.useState<string | null>(null);
    const thumbnailKey = user.profilePicture?.key;

    const getThumbnail = React.useCallback(async () => {
        if (thumbnailKey) {
            try {
                const result = await generateS3Link(thumbnailKey, true);
                if (result) {
                    setAvatarURL(result);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }, [thumbnailKey]);

    React.useEffect(() => {
        getThumbnail();
    }, [getThumbnail]);
    return (
        <>
            {avatarURL && (
                <Avatar.Image size={size} source={{ uri: avatarURL }} />
            )}
            {!avatarURL && <Avatar.Text label={initials} size={size} />}
        </>
    );
};

export default UserAvatar;
