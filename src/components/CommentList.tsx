import React, {useContext, useEffect, useState} from "react";
import {Comment} from "../types/comments";
import {CommentItem} from "./Comment";
import {Avatar, Button, MenuItem, Select, TextField} from "@material-ui/core";
import {AuthContext} from "../App";
import {createComment} from "../api";
import {toast} from "react-toastify";
import {Video} from "../types/videos";

export const CommentList = ({comments, onAdd, video}: { comments: Comment[], onAdd: () => void, video: Video }) => {
    const {user} = useContext(AuthContext)

    const [commentText, setCommentText] = useState("");
    const [sortedComments, setSortedComments] = useState<Comment[]>(comments);

    const [sortBy, setSortBy] = useState("DATE");

    useEffect(() => {
        sortComments(sortBy);
    }, [comments]);

    const sortComments = (_sortBy: string) => {
        setSortBy(_sortBy);

        const sorted = comments.sort((a, b) => {
            if (_sortBy === "DATE") {
                return b.date.getTime() - a.date.getTime();
            } else if (_sortBy === "UPVOTED") {
                return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
            } else {
                return (b.downvotes - b.upvotes) - (a.downvotes - a.upvotes);
            }
        });

        setSortedComments(sorted);
    }

    const attemptCreateComment = () => {
        createComment({text: commentText, video: video.id}).then(() => {
            toast("Comment added", {type: "success"});
            onAdd();
            setCommentText("");
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    const cancelCreateComment = () => {
        setCommentText("");
    }

    return <div className={"padding-md"}>
        <div className={"flex-row margin-md"}>
            <Select value={sortBy} onChange={e => sortComments(e.target.value as string)}>
                <MenuItem value={"DATE"}>
                    Date
                </MenuItem>
                <MenuItem value={"UPVOTED"}>
                    Most upvoted
                </MenuItem>
                <MenuItem value={"DOWNVOTED"}>
                    Most downvoted
                </MenuItem>
            </Select>
        </div>

        <div className={"flex-row margin-md"}>
            <div className={"flex-row justify-start full-width margin-h-md"}>
                <Avatar
                    src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${user?.avatarFilename}`}
                >
                    {!user?.avatarFilename && video.user.username[0].toUpperCase()}
                </Avatar>
                <TextField
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    multiline
                    rowsMax={3}
                    variant={"outlined"}
                    placeholder={"Write a comment..."}
                    style={{width: "80%"}}
                />
            </div>

            <div className={"flex-row justify-end margin-h-sm"}>
                <div>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={attemptCreateComment}
                        disabled={!commentText}
                        disableElevation
                    >
                        Add
                    </Button>
                </div>

                <div>
                    <Button disableElevation onClick={cancelCreateComment}>Cancel</Button>
                </div>
            </div>
        </div>

        {sortedComments.map((c, i) => <CommentItem key={i} comment={c}/>)}
    </div>
}
