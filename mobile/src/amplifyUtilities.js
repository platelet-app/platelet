import { Storage } from "aws-amplify";

export async function generateS3Link(key, thumbnail = false) {
    const imgKey = key.split("/").reverse()[0];
    const imgExtension = imgKey.split(".")[1];
    const imgName = imgKey.split(".")[0];
    const finalKey = thumbnail
        ? `${imgName}-128-128.${imgExtension}`
        : `${imgName}-300-300.${imgExtension}`;
    const imgVisibility = key.split("/")[0];

    try {
        const result = await Storage.get(finalKey, {
            level: imgVisibility,
        });
        return result;
    } catch (err) {
        if (
            !process.env.REACT_APP_DEMO_MODE === "true" &&
            !process.env.REACT_APP_POPULATE_FAKE_DATA === "true"
        ) {
            console.log(err);
        }
    }
    if (
        process.env.REACT_APP_DEMO_MODE === "true" ||
        process.env.REACT_APP_POPULATE_FAKE_DATA === "true"
    ) {
        return `https://${process.env.REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_NAME}.s3.${process.env.REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_REGION}.amazonaws.com/${key}`;
    }
    return "";
}
