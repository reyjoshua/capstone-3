import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {Form, Button} from 'react-bootstrap';
import localStorage from 'localStorage'
import AppHelper from '../../../app-helper';
import Swal from 'sweetalert2';
import Router from 'next/router';
let accessToken = localStorage.getItem("token");
let userId = localStorage.getItem("id");

export default function index() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [isActive, setIsActive] = useState(false);

    function registerUser(e) {
        e.preventDefault();
        const options = {
            headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
            method: 'PUT',
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                password: password1
            })
          }
          fetch (`${AppHelper.API_URL}/users/editProfile/${userId}`, options)
          .then(AppHelper.toJSON)
          .then(data=>{
            if(data) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'You had successfully edited your profile!',
                showConfirmButton: false,
                timer: 1500
              })
              Router.push('../profile')
            }
            console.log(data);  
          })
        setFirstName('')
        setLastName('')
        setPassword1('');
        setPassword2('');
    }

    useEffect(() => {
        
        if((password1 !== "" && password2 !== "")&& (password1 === password2)) {
            setIsActive(true);
        }else {
            setIsActive(false);
        }
    }, [password1, password2])

    return(
    <React.Fragment>
        <Head>
            <title>Edit Profile</title>
        </Head>
        <Form onSubmit={(e) => registerUser(e)}>
            <Form.Group controlId="userFirst">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="userLast">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="password1">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="password2">
                <Form.Label>Verify Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Verify Password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                />
            </Form.Group>
            {isActive ?
                <Button variant="primary" type="submit" id="submitBtn">Submit</Button>
                :
                <Button variant="danger" type="submit" id="submitBtn" disabled>Submit</Button>
            } 
        </Form>
    </React.Fragment>
    )
}
