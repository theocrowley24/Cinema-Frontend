export const getFeaturedChannel = async () => {
    const response = await fetch(`${process.env.REACT_APP_CMS_URL}/featured-channel`, {
        method: "get"
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Something went wrong');
    }
}
