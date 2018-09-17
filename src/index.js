import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import App from './App';
import './index.css';

firebase.initializeApp({
  apiKey: "AIzaSyBLOFeEunlfLTMEZGtWapdK4G_EEVgzTR0",
  authDomain: "lumshare-a795e.firebaseapp.com",
  databaseURL: "https://lumshare-a795e.firebaseio.com",
  projectId: "lumshare-a795e",
  storageBucket: "lumshare-a795e.appspot.com",
  messagingSenderId: "1034415726839"
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
