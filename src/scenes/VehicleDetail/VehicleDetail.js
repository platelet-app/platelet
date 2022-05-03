import React, { useEffect, useState } from "react";
import VehicleProfile from "./components/VehicleProfile";
import { decodeUUID } from "../../utilities";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@mui/material/Typography";
import { PaddedPaper } from "../../styles/common";
import CommentsSection from "../Comments/CommentsSection";
import UserCard from "../../components/UserCard";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import * as models from "../../models/index";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { DataStore } from "aws-amplify";
import { protectedFields } from "../../apiConsts";
import Skeleton from "@mui/material/Skeleton";
import { Divider, Stack } from "@mui/material";

const initialVehicleState = {
    name: "",
    manufacturer: "",
    model: "",
    dateOfManufacture: null,
    dateOfRegistration: null,
};

export default function VehicleDetail(props) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [notFound, setNotFound] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [vehicle, setVehicle] = useState(initialVehicleState);
    const vehicleUUID = decodeUUID(props.match.params.vehicle_uuid_b62);
    const assignedUser = false;

    async function newVehicleProfile() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const vehicle = await DataStore.query(
                    models.Vehicle,
                    vehicleUUID
                );
                setIsFetching(false);
                if (vehicle) setVehicle(vehicle);
                else setNotFound(true);
            } catch (error) {
                setIsFetching(false);
                dispatch(
                    displayErrorNotification(
                        `Failed to get vehicle: ${error.message}`
                    )
                );
                console.log("Request failed", error);
            }
        }
    }
    useEffect(
        () => newVehicleProfile(),
        [props.location.key, dataStoreReadyStatus]
    );

    function onAssignUser(user) {
        return;
    }


  async function onUpdate(value) {
      setIsPosting(true);
      try {
          const existingVehicle = await DataStore.query(
              models.Vehicle,
              vehicle.id
          );
          await DataStore.save(
              models.Vehicle.copyOf(existingVehicle, (updated) => {
                  for (const [key, newValue] of Object.entries(value)) {
                      if (!protectedFields.includes(key))
                          updated[key] = newValue;
                  }
              })
          );
          setIsPosting(false);
      } catch (error) {
          console.log("Update request failed", error);
          dispatch(displayErrorNotification(error.message));
          setIsPosting(false);
      }
  }



    if (isFetching) {
        return (
            <React.Fragment>
                <PaddedPaper maxWidth={700}>
                    <Stack direction={"column"} spacing={3}>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"top"}
                        >
                            <Skeleton variant="text" width={300} height={50} />
                        </Stack>
                        <Divider />
                        <Stack
                            direction={"column"}
                            justifyContent={"space-between"}
                            alignItems={"top"}
                            maxWidth={700}
                        >
                          <Skeleton variant="text" maxWidth={700} height={50}/>
                          <Skeleton variant="text" maxWidth={700} height={50}/>
                          <Skeleton variant="text" maxWidth={700} height={50}/>
                        </Stack>
                    </Stack>
                </PaddedPaper>
                <Stack height={50}></Stack>
                <PaddedPaper maxWidth={300}>
                    <Skeleton variant="text" MaxWidth={700} height={50} />
                </PaddedPaper>
                <Stack height={50}></Stack>
                <PaddedPaper maxWidth={850}>
                    <Stack direction={"row"} spacing={3}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={200} height={50} />
                    </Stack>
                    <Stack direction={"column"} spacing={3}>
                        <Skeleton variant="text" MaxWidth={700} height={50} />
                    </Stack>
                </PaddedPaper>
            </React.Fragment>
        );
    } else if (notFound) {
        return <NotFound>Vehicle {vehicleUUID} could not be found.</NotFound>;
    } else {
        return (
            <Stack spacing={3} direction={"column"}>
                <PaddedPaper maxWidth={700}>
                    <VehicleProfile
                        vehicle={vehicle}
                        onUpdate={onUpdate}
                    />
                </PaddedPaper>
                <PaddedPaper width={"400px"}>
                    <Stack
                        direction={"column"}
                        spacing={3}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                    >
                        <Typography variant={"h5"}>Assignee</Typography>
                        {assignedUser ? (
                            <UserCard user={assignedUser} />
                        ) : (
                            <Typography>No assignee.</Typography>
                        )}
                    </Stack>
                </PaddedPaper>
                <CommentsSection parentId={vehicleUUID} />
            </Stack>
        );
    }
}
