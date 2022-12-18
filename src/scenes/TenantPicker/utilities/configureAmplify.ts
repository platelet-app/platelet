import Amplify from "aws-amplify";

export default function configureAmplify(configData: object) {
    Amplify.configure(configData);
}
