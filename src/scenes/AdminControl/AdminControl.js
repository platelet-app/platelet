import React from "react";

import AdminAddUser from "./Components/AdminAddUser";
import AdminAddVehicle from "./Components/AdminAddVehicle";
import AdminAddLocation from "./Components/AdminAddLocation";
import AdminAddDeliverableType from "./Components/AdminAddDeliverableType";
import AdminAddRiderResponsibility from "./Components/AdminAddRiderResponsibility";
import { Stack } from "@mui/material";
import { RiderResponsibilityChips } from "./Components/RiderResponsibilityChips";
import { DeliverableTypeChips } from "./Components/DeliverableTypeChips";

export function AdminControl() {
    return (
        <Stack spacing={2}>
            <AdminAddDeliverableType />
            <DeliverableTypeChips />
            <AdminAddRiderResponsibility />
            <RiderResponsibilityChips />
            <AdminAddUser />
            <AdminAddVehicle />
            <AdminAddLocation />
        </Stack>
    );
}
