export enum UserType {
    SUBSCRIBER = "SUBSCRIBER",
    CHANNEL = "CHANNEL"
}

export interface User {
    id: number,
    username: string,
    userType: UserType,
    avatarFilename?: string,
    coverFilename?: string,
    subscriptionsEnabled: boolean,
    displayName?: string,
    bio?: string,
    subscribers: number,
    channelOnboarded: boolean
}


export const UserMapper = (data: any): User => {
    return {
        id: data?.id,
        username: data?.username,
        userType: data?.user_type,
        avatarFilename: data?.avatar_filename,
        bio: data?.bio,
        coverFilename: data?.cover_filename,
        displayName: data?.display_name,
        subscriptionsEnabled: data?.subscriptions_enabled,
        subscribers: data?.subscribers,
        channelOnboarded: data?.channel_onboarded
    }
}

export interface Token {
    id: number,
    userId: number,
    used: boolean,
    dateGranted: Date,
    dateUsed: Date | null
}

export const TokenMapper = (data: any): Token => {
    const date_granted_date = new Date(data?.date_granted.secs_since_epoch * 1000);
    const date_used_date = data?.date_used ? new Date(data?.date_used.secs_since_epoch * 1000) : null;

    return {
        id: data?.id,
        userId: data?.user_id,
        used: data?.used,
        dateGranted: date_granted_date,
        dateUsed: date_used_date
    }
}

export interface Subscription {
    id: number,
    tokenId: number,
    channelUserId: number,
    user: User,
    expires: Date
}

export const SubscriptionMapper = (data: any) => {
    const date = new Date(data?.expires.secs_since_epoch * 1000);

    return {
        id: data?.id,
        tokenId: data?.token_id,
        channelUserId: data?.channel_user_id,
        user: UserMapper(data?.user),
        expires: date
    }
}
