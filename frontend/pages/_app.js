import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import NaviBar from '../components/NaviBar';
import {UserProvider} from '../UserContext';
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({
    email: null,
    isAdmin: null,
    token: null
  });

  const unsetUser = () => {
    localStorage.clear();
      setUser({
        email: null,
        isAdmin: null,
        token: null
    });
  }

  useEffect (() => {
    setUser({
      email: localStorage.getItem('email'),
      isAdmin: localStorage.getItem('isAdmin') === 'true',
      token: localStorage.getItem('token')
    })
  },[])
  return (
    <React.Fragment>
      <UserProvider value={{user, setUser, unsetUser}}>
        <NaviBar />
          <Container className="my-5">
            <Component {...pageProps} />
          </Container>
      </UserProvider>
    </React.Fragment>
  )
}

export default MyApp
