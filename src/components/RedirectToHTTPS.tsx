import {useEffect} from 'react';

const RedirectToHTTPS = () => {
    useEffect(() => {
        if (process.env.REACT_APP_ENV === "production" && window.location.protocol === 'http:') {
            window.location.href = `https://${window.location.host}${window.location.pathname}${window.location.search}`;
        }
    }, []);

    return null;
};

export default RedirectToHTTPS;