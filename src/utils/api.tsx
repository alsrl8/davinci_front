interface sendApiRequestProps {
    server: 'chat' | 'game';
    method: 'GET' | 'POST';
    endpoint: string;
    body: object | null;
    params: object | null;
}

const getServerUrl = (props: sendApiRequestProps) => {
    if (props.server === "chat") {
        return process.env.REACT_APP_CHAT_SERVER_URL
    } else if (props.server === "game") {
        return process.env.REACT_APP_GAME_SERVER_URL
    } else {
        return ""
    }
}


export const sendApiRequest = async (props: sendApiRequestProps) => {
    const serverUrl = getServerUrl(props)
    const urlScheme = process.env.REACT_APP_ENV === "production" ? "https" : "http";

    if (!serverUrl) {
        if (props.server === "chat") {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        } else if (props.server === "game") {
            throw new Error("REACT_APP_GAME_SERVER_URL environment variable is not set");
        } else {
            throw new Error("SERVER_URL environment variable is not set");
        }
    }

    let apiUrlEndpoint = `${urlScheme}://${serverUrl}/${props.endpoint}`;

    if (props.method === "POST") {
        console.log("props.body", props.body)
        const response = await fetch(apiUrlEndpoint, {
            method: props.method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(props.body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown Error');
        }

        return response.json();
    } else if (props.method === "GET") {
        if (props.params !== null) {
            apiUrlEndpoint = `${apiUrlEndpoint}?`;
            Object.entries(props.params).forEach(([key, value]) => {
                apiUrlEndpoint = `${apiUrlEndpoint}${key}=${value}`;
            })
        }
        const response = await fetch(apiUrlEndpoint, {
            method: props.method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unknown Error');
        }

        return response.json();
    }


    return null;
}