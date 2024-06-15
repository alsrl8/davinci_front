import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDKWMtFObQhRPvt6cL2Idt7OPJ4rVn7SEE",
    authDomain: "davinci-song.firebaseapp.com",
    projectId: "davinci-song",
    storageBucket: "davinci-song.appspot.com",
    messagingSenderId: "873760423545",
    appId: "1:873760423545:web:ff9430763f4ece4afa1ea8",
    measurementId: "G-K04KQW38VE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
