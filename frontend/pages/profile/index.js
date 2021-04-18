import React, {useState} from 'react'
import {
    Button,
    Card,
    CardBody,
    CardImg,
    CardTitle,
    CardText,
  } from 'reactstrap';
import Head from 'next/head';
import AppHelper from '../../app-helper';
import localStorage from 'localStorage';



function index() {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [email, setEmail] = useState('');

    let accessToken = localStorage.getItem("token");
    const userData = fetch(`${AppHelper.API_URL}/users/details`, {
		method: 'GET',
        headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
	})
	.then(res => res.json())
	.then(data => {
    localStorage.setItem('id', data._id)
    setFirst(data)
    setLast(data)
    setEmail(data)
    })
    
    return (
        
      <Card className="col-6 profile">
        <Head>
            <title>Profile</title>
        </Head>
        <CardBody>
          <CardTitle className="text-center">PROFILE</CardTitle>
          <CardText>
            First Name: {first.firstName}
          </CardText>
          <CardText>
            Last Name: {last.lastName}
          </CardText>
          <CardText>
            Email: {email.email}
          </CardText>
          <Button color="dark" href="./profile/editProfile">
            EDIT PROFILE
          </Button>
        </CardBody>
      </Card>
    
    )
}

export default index
