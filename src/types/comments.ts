import {User, UserMapper} from "./user";

export interface Comment {
    text: string,
    id: number,
    upvoted: boolean,
    downvoted: boolean,
    date: Date,
    user: User,
    upvotes: number,
    downvotes: number
}

export const CommentMapper = (data: any): Comment => {
    const date = new Date(data?.date.secs_since_epoch * 1000);

    return {
        text: data?.text,
        id: data?.id,
        upvoted: data?.upvoted,
        downvoted: data?.downvoted,
        date,
        user: UserMapper(data?.user),
        upvotes: data?.upvotes,
        downvotes: data?.downvotes
    }
}
