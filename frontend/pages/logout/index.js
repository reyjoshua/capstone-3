import React, {useContext, useEffect} from 'react';
import Router from 'next/router';
import UserContext from '../../UserContext'

export default function index() {

    const {unsetUser} = useContext(UserContext);

    useEffect(() =>{
        unsetUser();
        Router.push('/login');
        Router.reload()
    })
    return null
}