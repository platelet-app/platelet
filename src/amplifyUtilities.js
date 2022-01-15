import { Storage } from "aws-amplify";

export async function generateS3Link(key) {
    const imgKey = key.split("/").reverse()[0];
    const imgVisibility = key.split("/")[0];

    const result = await Storage.get(imgKey, {
        level: imgVisibility,
    });
    return result;
}
