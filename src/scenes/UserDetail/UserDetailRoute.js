import React from "react";
import { decodeUUID } from "../../utilities";

import UserDetail from "./components/UserDetail";

export default function UserDetailRoute(props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    return <UserDetail userId={userUUID} />;
}
