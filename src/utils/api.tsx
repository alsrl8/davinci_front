interface sendApiRequestProps {
    server: 'chat' | 'game';
    method: 'GET' | 'POST';
    endpoint: string;
    body: object | null;
    params: object | null;
}

interface sendWebSocketRequestProps {
    server: 'chat' | 'game';
    endpoint: string;
    params: object | null;
    onOpen: (() => void) | null;
    onClose: (() => void) | null;
    onmessage: ((event: MessageEvent<any>) => void) | null;
    onerror: ((event: Event) => void) | null;
    prevSocket: WebSocket | null;
    setPrevSocket: (value: React.SetStateAction<WebSocket | null>) => void
}

const getServerUrl = (props: sendApiRequestProps | sendWebSocketRequestProps) => {
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

export const sendWebSocketRequest = async (props: sendWebSocketRequestProps) => {
    if (props.prevSocket !== null) {
        props.prevSocket.close();
        props.setPrevSocket(null);
    }

    const serverUrl = getServerUrl(props);
    const urlScheme = process.env.REACT_APP_ENV === "production" ? "wss" : "ws";
    if (!serverUrl) {
        if (props.server === "chat") {
            throw new Error("REACT_APP_CHAT_SERVER_URL environment variable is not set");
        } else if (props.server === "game") {
            throw new Error("REACT_APP_GAME_SERVER_URL environment variable is not set");
        } else {
            throw new Error("SERVER_URL environment variable is not set");
        }
    }

    const wsUrl = `${urlScheme}://${serverUrl}/${props.endpoint}`
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
        if (props.onOpen !== null) {
            props.onOpen();
        }
    }

    newSocket.onclose = () => {
        if (props.onClose !== null) {
            props.onClose();
        }
    }

    newSocket.onmessage = (event) => {
        if (props.onmessage !== null) {
            props.onmessage(event);
        }
    }

    newSocket.onerror = (error) => {
        if (props.onerror !== null) {
            props.onerror(error);
        }
    }

    return newSocket;
}