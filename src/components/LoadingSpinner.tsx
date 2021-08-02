import {usePromiseTracker} from "react-promise-tracker";
import React from "react";
import {GridLoader} from "react-spinners";
import {Typography} from "@material-ui/core";

export const LoadingSpinner = () => {
    const { promiseInProgress } = usePromiseTracker();

    return promiseInProgress ? <div className={"loading"}>
        <div className={"absolute-center margin-v-md"}>
            <div>
                <Typography variant={"h4"} align={"center"}>
                    Cinema
                </Typography>
            </div>

            <GridLoader color={"#892cdc"} />
        </div>
    </div> : null
}
