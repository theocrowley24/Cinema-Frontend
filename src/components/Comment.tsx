import React, {useContext, useEffect, useState} from "react";
import {Comment} from "../types/comments";
import {Avatar, Button, Divider, IconButton, TextField, Typography} from "@material-ui/core";
import {Close, Edit, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined} from "@material-ui/icons";
import {deleteComment, editComment, toggleCommentUpvote} from "../api";
import {toast} from "react-toastify";
import {AuthContext} from "../App";

export const CommentItem = ({comment}: { comment: Comment }) => {
    const {user} = useContext(AuthContext);

    const [upvotes, setUpvotes] = useState(comment.upvotes);
    const [downvotes, setDownvotes] = useState(comment.downvotes);

    const attemptDeleteComment = () => {
        deleteComment({comment: comment.id}).then(response => {
            toast("Comment deleted", {type: "success"});
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    const [edit, setEdit] = useState(false);
    const [newText, setNewText] = useState(comment.text);

    const attemptEditComment = () => {
        editComment({text: newText, comment: comment.id}).then(() => {
            toast("Comment edited", {type: "success"});
            setEdit(false);
            comment.text = newText;
            setNewText("");
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    useEffect(() => {
        let initialState = "NONE";
        if (comment.upvoted) {
            initialState = "UP";
        } else if (comment.downvoted) {
            initialState = "DOWN";
        }

        setUpvoteState(initialState);
    }, [comment]);

    const [upvoteState, setUpvoteState] = useState("NONE");

    const attemptToggleUpvote = () => {
        toggleCommentUpvote({upvoteType: "UP", comment: comment.id}).then(() => {
            toast("Upvoted", {type: "success"});

            if (upvoteState === "UP") {
                setUpvoteState("NONE");
                setUpvotes(Math.max(upvotes - 1, 0));
            } else {
                setUpvoteState("UP");
                setUpvotes(upvotes + 1);
                setDownvotes(Math.max(downvotes - 1, 0));
            }
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    const attemptToggleDownvote = () => {
        toggleCommentUpvote({upvoteType: "DOWN", comment: comment.id}).then(() => {
            toast("Downvoted", {type: "success"});

            if (upvoteState === "DOWN") {
                setUpvoteState("NONE");
                setDownvotes(Math.max(downvotes - 1, 0));
            } else {
                setUpvoteState("DOWN");
                setDownvotes(downvotes + 1);
                setUpvotes(Math.max(upvotes - 1, 0));
            }
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    return <div className={"comment padding-md margin-md"}>
        <div className={"flex-row justify-start margin-md"}>
            <Avatar
                src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${comment.user.avatarFilename}`}
            >
                {!comment.user.avatarFilename && comment.user.username[0].toUpperCase()}
            </Avatar>
            <Typography variant={"subtitle1"}>{comment.user.displayName || comment.user.username}</Typography>

            <div className={"flex-row"}>
                <Typography variant={"body2"}>
                    {comment.date.toTimeString() + " " + comment.date.toDateString()}
                </Typography>
            </div>
        </div>

        {!edit && <div className={"flex-row margin-md"}>
            <Typography variant={"body2"}>
                {comment.text}
            </Typography>

            {user?.id === comment.user.id && <div className={"flex-row"}>
                <IconButton onClick={() => setEdit(true)}>
                    <Edit/>
                </IconButton>

                <IconButton onClick={attemptDeleteComment}>
                    <Close/>
                </IconButton>
            </div>}
        </div>}

        {edit && <div className={"flex-row margin-md"}>
            <TextField variant={"outlined"} fullWidth multiline rowsMax={5} value={newText}
                       onChange={e => setNewText(e.target.value)}/>

            <div className={"flex-row"}>
                <Button
                    color={"primary"}
                    variant={"contained"}
                    disabled={!newText}
                    onClick={attemptEditComment}
                    disableElevation
                >
                    Save
                </Button>
                <Button disableElevation onClick={() => setEdit(false)}>
                    Cancel
                </Button>
            </div>
        </div>}

        <div className={"flex-row justify-start margin-h-md"}>
            <div className={"margin-h-sm"}>
                <IconButton onClick={attemptToggleUpvote}>
                    {upvoteState === "UP" ? <ThumbUp color={"primary"}/> : <ThumbUpOutlined/>}
                </IconButton>

                <span>{comment.upvotes}</span>

                <IconButton onClick={attemptToggleDownvote}>
                    {upvoteState === "DOWN" ? <ThumbDown color={"primary"}/> : <ThumbDownOutlined/>}
                </IconButton>

                <span>{comment.downvotes}</span>
            </div>
        </div>

        <Divider style={{width: "100%", marginTop: "15px"}}/>
    </div>
}
