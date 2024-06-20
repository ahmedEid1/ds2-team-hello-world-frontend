import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Keycloak from 'keycloak-js';
import './App.css';
import keycloakConfig from './keycloak-config';

function App() {
  const [message, setMessage] = useState('');
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const keycloakInstance = new Keycloak(keycloakConfig);

    keycloakInstance.init({ onLoad: 'check-sso' }).then((auth) => {
      setKeycloak(keycloakInstance);
      setAuthenticated(auth);
    }).catch((error) => {
      console.error('Keycloak init failed:', error);
    });
  }, []);

  const fetchMessage = () => {
    if (keycloak && authenticated) {
      keycloak.updateToken(5).then(() => {
        axios
          .get(process.env.REACT_APP_API_URL, {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          })
          .then((response) => {
            setMessage(response.data.message);
          })
          .catch((error) => {
            console.error('Error fetching the message:', error);
          });
      }).catch((error) => {
        console.error('Failed to refresh token', error);
      });
    }
  };

  const login = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  const logout = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  if (!keycloak) {
    return <div>Initializing Keycloak...</div>;
  }

  if (!authenticated) {
    return (
      <div>
        <div>Not authenticated</div>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{message}</p>
        <button onClick={fetchMessage}>Get Message</button>
        <button onClick={logout}>Logout</button>
      </header>
    </div>
  );
}


export default App;
