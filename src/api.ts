import {UserType} from "./types/user";

export const login = async (username: string, password: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });

    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error('Wrong username or password');
    }
}

export const signupChannel = async (body: {
    username: string,
    email: string,
    password: string,
}) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...body, user_type: UserType.CHANNEL})
    });

    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error);
    }
}

export const hasActiveToken = async (channelUserId: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/tokens/has`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({channel_id: channelUserId})
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const getUser = async (userId: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token")
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const transferToken = async (channelUserId: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/tokens/transfer`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({channel_user_id: channelUserId})
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Couldn't transfer token");
    }
}

export const getMySubscriptions = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/tokens/active`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token")
        },
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Couldn't get subscriptions");
    }
}

export const toggleCommentUpvote = async (args: { upvoteType: string, comment: number }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/upvote/toggle-comment`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({upvote_type: args.upvoteType, comment: args.comment})
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Couldn't toggle upvote");
    }
}

export const toggleVideoUpvote = async (args: { upvoteType: string, video: number }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/upvote/toggle-video`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({upvote_type: args.upvoteType, video: args.video})
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Couldn't toggle upvote");
    }
}

export const getVideo = async (videoId: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/video/${videoId}`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token")
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const getComments = async (videoId: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${videoId}`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token")
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Couldn't fetch comments");
    }
}

export const createComment = async (args: { text: string, video: number }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Couldn't create comment");
    }
}

export const editComment = async (args: { text: string, comment: number }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/edit`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Couldn't create comment");
    }
}

export const deleteComment = async (args: { comment: number }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/delete`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Couldn't create comment");
    }
}

export const getVideos = (options: {
    title?: string,
    tag?: number,
    user?: number,
    upvoted?: boolean,
    subscriptions?: boolean,
    recommended?: boolean,
    recently_watched?: boolean
}) => {
    return fetch(`${process.env.REACT_APP_API_URL}/video/`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
    });
}

export const signupSubscriber = (email: string, username: string, password: string, paymentMethodId: string) => {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            username,
            password,
            payment_method_id: paymentMethodId,
            user_type: UserType.SUBSCRIBER
        })
    });
}

export const getMyTokens = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/tokens/`, {
        method: "get",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token")
        }
    });
}


export const postIncrementPlay = async (videoId: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/video/increment-play`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({video: videoId})
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const getTransactionHistory = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/tokens/transaction-history`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const getBalance = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/tokens/balance`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const generateWithdrawal = async (args: { amount: number }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/tokens/generate-withdrawal`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();

        throw new Error(error);
    }
}

export const updateChannel = async (args: {
    displayName?: string,
    disableSubscriptions?: boolean,
    bio?: string,
    avatar?: Blob,
    cover?: Blob,
    currentPassword?: string,
    newPassword?: string
}) => {
    const formData = new FormData();

    if (args.avatar) {
        formData.append("avatar", args.avatar);
    }

    if (args.cover) {
        formData.append("cover", args.cover);
    }

    formData.append("data", new Blob([JSON.stringify({
        display_name: args.displayName,
        disable_subscriptions: args.disableSubscriptions,
        bio: args.bio,
        current_password: args.currentPassword,
        new_password: args.newPassword
    })], {
        type: "application/json"
    }));

    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/update-channel`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
        },
        body: formData
    });

    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();

        throw new Error(error);
    }
}

export const getAvailableTags = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/video/tags`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const getPopularTags = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/video/popular-tags`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const getTopChannels = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/top-channels`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const getUsers = async (args: { name?: string }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const updateVideo = async (args: { title?: string, description?: string, video: number }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/video/update`, {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}

export const getAccountLink = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/tokens/account-link`, {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("cinema_token"),
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}
