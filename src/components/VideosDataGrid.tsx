import React, {useContext, useEffect, useState} from "react";
import {DataGrid, GridCellParams, GridColDef, GridRowsProp} from "@material-ui/data-grid";
import {Video, VideoMapper} from "../types/videos";
import {getVideos, updateVideo} from "../api";
import {Button, Dialog, DialogContent, DialogTitle, IconButton, TextField} from "@material-ui/core";
import {Edit} from "@material-ui/icons";
import {toast} from "react-toastify";
import {AuthContext} from "../App";

export const VideosDataGrid = () => {
    const [rows, setRows] = useState<GridRowsProp>([]);

    const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
    const [updating, setUpdating] = useState(false);

    const {user} = useContext(AuthContext);

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 150},
        {field: 'title', headerName: 'Title', width: 200},
        {field: 'plays', headerName: 'Views', width: 125},
        {field: 'upvotes', headerName: 'Upvotes', width: 125},
        {field: 'downvotes', headerName: 'Downvotes', width: 125},
        {field: 'uploadDate', headerName: 'Upload Date', width: 250},
        {
            field: 'edit',
            headerName: 'Edit',
            renderCell: (params: GridCellParams) => <IconButton onClick={() => setVideoToEdit(params.row as Video)}>
                <Edit/>
            </IconButton>
        }
    ];

    const attemptVideoUpdate = () => {
        if (!videoToEdit) return;

        setUpdating(true);
        updateVideo({...videoToEdit, video: videoToEdit.id}).then(() => {
            setUpdating(false);
            toast("Video updated", {type: 'success'});
            setVideoToEdit(null);
        }).catch(error => {
            toast(error.message, {type: "error"});
            setUpdating(false);
        });
    }

    useEffect(() => {
        if (!user) return;

        let mounted = true;

        // TODO: get logged in user id
        getVideos({user: user.id}).then((response) => {
            return response.json();
        }).then((data) => {
            if (mounted) {
                setRows(data.map((d: any) => VideoMapper(d)));
            }
        }).catch(error => console.log(error));

        return () => {
            mounted = false;
        }
    }, [user]);

    return <div style={{height: 600, width: '100%'}}>
        <Dialog
            open={Boolean(videoToEdit)}
            onClose={() => setVideoToEdit(null)}
        >
            <DialogTitle>Editing '{videoToEdit?.title}'</DialogTitle>
            <DialogContent>
                <div className={"margin-v-md"}>
                    <div>
                        <TextField
                            label={"Title"}
                            value={videoToEdit?.title}
                            onChange={e => {
                                if (videoToEdit) {
                                    setVideoToEdit({...videoToEdit, title: e.target.value});
                                }
                            }}
                            variant={"filled"}
                            fullWidth
                        />
                    </div>

                    <div>
                        <TextField
                            label={"Description"}
                            value={videoToEdit?.description}
                            onChange={e => {
                                if (videoToEdit) {
                                    setVideoToEdit({...videoToEdit, description: e.target.value});
                                }
                            }}
                            variant={"filled"}
                            rowsMax={5}
                            fullWidth
                        />
                    </div>

                    <div className={"margin-h-sm flex-row justify-start"}>
                        <div>
                            <Button
                                color={"secondary"}
                                variant={"outlined"}
                                onClick={attemptVideoUpdate}
                                disabled={updating}
                            >
                                Save
                            </Button>
                        </div>

                        <div>
                            <Button
                                onClick={() => setVideoToEdit(null)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <DataGrid rows={rows} columns={columns}/>
    </div>
}
