import {User, UserMapper} from "./user";

export interface VideoTag {
    id: number,
    name: string
}

export const VideoTagMapper = (data: any): VideoTag => {
    return {
        id: data?.id,
        name: data?.name
    }
}

export interface Video {
    id: number,
    fileName: string,
    user: User,
    title: string,
    description?: string,
    uploadDate: Date,
    upvoted: boolean,
    downvoted: boolean,
    upvotes: number,
    downvotes: number,
    plays: number,
    tags: VideoTag[]
}

export const VideoMapper = (data: any): Video => {
    const date = new Date(data?.upload_date.secs_since_epoch * 1000);

    return {
        id: data?.id,
        fileName: data?.file_name,
        user: UserMapper(data?.user),
        title: data?.title,
        description: data?.description,
        uploadDate: date,
        upvoted: data?.upvoted,
        downvoted: data?.downvoted,
        upvotes: data?.upvotes,
        downvotes: data?.downvotes,
        plays: data?.plays,
        tags: data?.tags.map((d: any) => VideoTagMapper(d))
    }
}
