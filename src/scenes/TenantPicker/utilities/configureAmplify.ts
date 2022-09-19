import Amplify from "aws-amplify";

export default function configureAmplify(configData: string) {
    const config = JSON.parse(configData);
    Amplify.configure(config);
}
