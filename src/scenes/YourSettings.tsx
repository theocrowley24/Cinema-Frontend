import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Container,
    Dialog,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import {updateChannel} from "../api";
import {toast} from "react-toastify";
import ReactCrop, {Crop} from "react-image-crop";
import {getCroppedImg} from "../helpers/CropImage";
import {AuthContext} from "../App";
import {UserType} from "../types/user";

export const YourSettings = () => {
    const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);
    const [bio, setBio] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);

    const {user} = useContext(AuthContext);

    useEffect(() => {
        setBio(user?.bio || "");
        setSubscriptionsEnabled(Boolean(user?.subscriptionsEnabled));
        setDisplayName(user?.displayName || "");
    }, [user]);

    // TODO: implement - need api endpoint to be implemented
    const deleteAccount = () => {
        setConfirmDelete(false);
    }

    // TODO: implement - need api endpoint to be implemented
    const attemptUpdate = async () => {
        let avatarCropped: Blob | null = null;

        if (avatarImageElement) {
            avatarCropped = await getCroppedImg(avatarImageElement, avatarCrop, "avatar");
        }

        let coverCropped: Blob | null = null;

        if (coverImageElement) {
            coverCropped = await getCroppedImg(coverImageElement, coverCrop, "cover");
        }

        updateChannel({
            avatar: avatarCropped || undefined,
            cover: coverCropped || undefined,
            bio: bio,
            disableSubscriptions: subscriptionsEnabled,
            currentPassword: currentPassword === "" ? undefined : currentPassword,
            newPassword: newPassword === "" ? undefined : newPassword,
            displayName: displayName
        }).then(response => {
            toast("Success", {type: "success"});
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    const handleAvatarOnChange = (e: any) => {
        const files = e.target.files;

        if (!files) {
            return;
        }

        if (files.length > 0) {
            setAvatar(files[0]);
        }
    }

    const handleCoverOnChange = (e: any) => {
        const files = e.target.files;

        if (!files) {
            return;
        }

        if (files.length > 0) {
            setCover(files[0]);
        }
    }

    const [avatarCrop, setAvatarCrop] = useState<Crop>({aspect: 1});
    const [coverCrop, setCoverCrop] = useState<Crop>({aspect: 4.5});

    const [avatarImageElement, setAvatarImageElement] = useState<HTMLImageElement | null>(null);
    const [coverImageElement, setCoverImageElement] = useState<HTMLImageElement | null>(null);

    return <Container className={"padding-md"}>
        <Card>
            <CardHeader title={"Your Settings"}/>
            <CardContent>
                <Grid container spacing={5}>
                    {user?.userType === UserType.CHANNEL && <Grid item xs={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={subscriptionsEnabled}
                                onChange={e => setSubscriptionsEnabled(e.target.checked)}
                                color={"primary"}
                            />}
                            label={"Disable subscriptions"}
                        />
                    </Grid>}

                    <Grid item xs={12} className={"margin-md"}>
                        <Typography variant={"body2"}>
                            Avatar
                        </Typography>

                        <input type={"file"} onChange={handleAvatarOnChange}/>

                        <div>
                            {avatar && <ReactCrop
                                src={URL.createObjectURL(avatar)}
                                crop={avatarCrop}
                                onChange={newCrop => setAvatarCrop(newCrop)}
                                circularCrop={true}
                                onImageLoaded={el => setAvatarImageElement(el)}
                            />}
                        </div>
                    </Grid>


                    <Grid item xs={12} className={"margin-md"}>
                        <Typography variant={"body2"}>
                            Cover
                        </Typography>

                        <input type={"file"} onChange={handleCoverOnChange}/>

                        <div>
                            {cover && <ReactCrop
                                src={URL.createObjectURL(cover)}
                                crop={coverCrop}
                                onChange={newCrop => setCoverCrop(newCrop)}
                                onImageLoaded={el => setCoverImageElement(el)}
                            />}
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant={"filled"}
                            type={"text"}
                            label={"Display name"}
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant={"filled"}
                            type={"text"}
                            multiline
                            rows={5}
                            rowsMax={10}
                            label={"Bio"}
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant={"filled"}
                            type={"password"}
                            label={"Current password"}
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant={"filled"}
                            type={"password"}
                            label={"New password"}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>

                        <div className={"flex-row justify-start margin-h-md"}>
                            <div>
                                <Button disableElevation color={"primary"} variant={"contained"}
                                        onClick={attemptUpdate}>Save</Button>
                            </div>

                            <div>
                                <Button disableElevation color={"secondary"} variant={"outlined"}
                                        onClick={() => setConfirmDelete(true)}>DELETE ACCOUNT</Button>
                            </div>

                            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                                <DialogTitle>Are you sure you want to delete your account?</DialogTitle>

                                <Button disableElevation onClick={() => setConfirmDelete(false)}>Cancel</Button>
                                <Button color={"secondary"} variant={"contained"}
                                        onClick={deleteAccount}>Confirm</Button>
                            </Dialog>
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </Container>
}
