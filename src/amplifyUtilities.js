import { Storage } from "aws-amplify";

export async function generateS3Link(key) {
    const imgKey = key.split("/").reverse()[0];
    const imgVisibility = key.split("/")[0];
    console.log(process.env.REACT_APP_POPULATE_FAKE_DATA);

    try {
        const result = await Storage.get(imgKey, {
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
        console.log("generateS3Link");
        return `https://${process.env.REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_NAME}.s3.${process.env.REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_REGION}.amazonaws.com/${key}`;
    }
    return "";
}
