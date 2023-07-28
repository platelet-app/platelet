import * as React from "react";
import { Chip, Avatar } from "react-native-paper";
import * as models from "../models";
import { generateS3Link } from "../amplifyUtilities";

type UserChipProps = {
    user: models.User;
    showResponsibility?: boolean;
};

const UserChip: React.FC<UserChipProps> = ({
    user,
    showResponsibility = false,
}) => {
    let { profilePicture, displayName, riderResponsibility } = user;
    const [thumbnail, setThumbnail] = React.useState<string | null>(null);
    const [label, setLabel] = React.useState(displayName);

    const getThumbnail = React.useCallback(
        async (profilePictureKey: string) => {
            if (profilePictureKey) {
                try {
                    const result = await generateS3Link(profilePictureKey);
                    if (result) {
                        setThumbnail(result);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        },
        []
    );

    React.useEffect(() => {
        if (profilePicture && profilePicture.key) {
            getThumbnail(profilePicture.key);
        }
    }, [user, getThumbnail, profilePicture]);

    const setText = React.useCallback(async () => {
        try {
            if (showResponsibility && riderResponsibility) {
                setLabel(`${displayName} (${riderResponsibility})`);
            } else {
                setLabel(displayName);
            }
        } catch (error) {
            console.log(error);
            setLabel(displayName);
        }
    }, [showResponsibility, displayName, riderResponsibility]);

    React.useEffect(() => {
        setText();
    }, [showResponsibility, user, setText]);

    let avatar = null;
    if (thumbnail) {
        avatar = <Avatar.Image size={24} source={{ uri: thumbnail }} />;
    }

    return <Chip avatar={avatar}>{label}</Chip>;
};

export default UserChip;
