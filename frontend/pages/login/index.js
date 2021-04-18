import React, { useState, useEffect, useContext } from 'react';
import Router from 'next/router'; 
import Head from 'next/head';
import View from '../../components/View';
import AppHelper from '../../app-helper';
import { GoogleLogin } from 'react-google-login';
import Swal from 'sweetalert2';
import { Form, Button, Row, Col } from 'react-bootstrap';
import UserContext from '../../UserContext';
import usersData from '../../data/users';
import localStorage from 'localStorage';

export default function index() {
    return (
        <View title={'Login'}>
            <Row className="justify-content-center">
                <Col xs md="6">
                    <h3>Login</h3>
                    <LoginForm/>
                </Col>
            </Row>
        </View>
    )
}

const LoginForm = () => {
    
    const {user, setUser} = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [willRedirect, setWillRedirect] = useState(false);

    function authenticate(e) {
        e.preventDefault();
        
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
        fetch(`${AppHelper.API_URL}/users/login`, options)
        .then(AppHelper.toJSON)
        .then(data => {
            if(typeof data.accessToken !== 'undefined'){
                localStorage.setItem('token', data.accessToken)
                //console.log(localStorage.getItem('token'))
                //Router.push('/budgetTracker')
                retrieveUserDetails(data.accessToken);
            } else {
                if (data.error === 'does-not-exist'){
                    Swal.fire('Authentication Failed', 'User does not exist', 'error')
                } else if (data.error === 'incorrect-password') {
                    Swal.fire('Authentication Failed', 'Password is incorrect', 'error')
                } else if (data.error === 'login-type-error'){
                    Swal.fire('Login Type Error', 'You may have registered through a different login procedure, try the alternative login procedures.', 'error')
                }
            }
        })
    }

    useEffect(() => {

        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    function authenticateGoogleToken(response){
        console.log(response);
        console.log("testing3")
        //details of request to the end point
        const payload = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tokenId: response.tokenId})
        }
        fetch(`${AppHelper.API_URL}/users/verify-google-id-token`, payload)
        .then(AppHelper.toJSON)
        .then(data => {
            console.log(data.accessToken)
            console.log("testing")
            if (typeof data.accessToken !== 'undefined'){
                console.log("testing")
                localStorage.setItem('token', data.accessToken)
                console.log(localStorage.getItem('token'))
                Router.push('/budgetTracker')
            } else {
                if(data.error == 'google-auth-error'){
                    Swal.fire(
                        'Google Auth Error',
                        'Google authentication procedure failed',
                        'error'
                    )
                } else if (data.error === 'login-type-error'){
                    Swal.fire('Login Type Error', 'You may have registered through a different login procedure', 'error')
                }
            }
        })
    }

    /* function failed(response){
        console.log(response)
    } */

    function retrieveUserDetails(accessToken){
        const options = {
            headers: {Authorization: `Bearer ${accessToken}`}
        }
        fetch (`${AppHelper.API_URL}/users/details`, options)
        .then(AppHelper.toJSON)
        .then(data=>{
            console.log(data);
            setUser({id: data._id, isAdmin: data.isAdmin, token: data.accessToken})
            console.log(user);
            Router.push('/budgetTracker')
        })
    }
    return (
        <React.Fragment>
            <Head>
                <title>Authentication</title>
            </Head>
            <Form onSubmit={(e) => authenticate(e)}>
                <Form.Group controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                    
                {isActive ? 
                    <React.Fragment>
                    <Button variant="primary" type="submit" id="submitBtn" className= "my-3 w-100 text-center d-flex justify-content-center">
                        Submit
                    </Button>
                    <GoogleLogin
                    //ClinetId = Oauthclient id from cloud google developer platform 
                        clientId="734331487004-nvsm4j4j4h7jo321c9v233a3hc146rfm.apps.googleusercontent.com"
                        buttonText="Login"
                        //onSuccess = it runs a function w/c returns a google user object which provides access to all of the google user method and details
                        onSuccess={authenticateGoogleToken}
                        onFailure={authenticateGoogleToken}
                        // You can modify this as {failed}
                        //determines cookie policy for the origin of the google login requests
                        cookiePolicy={'single_host_origin'}
                        className= "my-3 w-100 text-center d-flex justify-content-center"
                    />
                    </React.Fragment>
                    : 
                    <React.Fragment>
                        <Button variant="danger" type="submit" id="submitBtn" disabled className= "my-3 w-100 text-center d-flex justify-content-center">
                            Submit
                        </Button>

                        <GoogleLogin
                        //ClientId = OAuthclient id from cloud google developer platform 
                            clientId="734331487004-nvsm4j4j4h7jo321c9v233a3hc146rfm.apps.googleusercontent.com"
                            buttonText="Login"
                            //onSuccess = it runs a function w/c returns a google user object which provides access to all of the google user method and details
                            onSuccess={authenticateGoogleToken}
                            onFailure={authenticateGoogleToken} //you can modify this part as {failed}
                            //determines cookie policy for the origin of the google login requests
                            cookiePolicy={'single_host_origin'}
                            className= "my-3 w-100 text-center d-flex justify-content-center"
                        />
                    </React.Fragment> 
                }
            </Form>
        </React.Fragment>
    )
}

