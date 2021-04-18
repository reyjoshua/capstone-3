import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

export default function Course({course}) {

    const { name, description, price, start_date, end_date } = course;
    const [count, setCount] = useState(0);
    const [seats, setSeats] = useState(10);
    const [isOpen, setIsOpen] = useState(true);

    function enroll() {
        setCount(count + 1);
        console.log('Enrollees: ' + count);
        setSeats(seats - 1);
        console.log('Seats: ' + seats);
        
    }

    useEffect(() => {
        if(seats === 0){
            setIsOpen(false);
        }
    }, [seats])

    return (
        <Card>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>Description:</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle>Price:</Card.Subtitle>
                <Card.Text>PhP {price}</Card.Text>
                <Card.Subtitle>Start Date:</Card.Subtitle>
                <Card.Text>{start_date}</Card.Text>
                <Card.Subtitle>End Date:</Card.Subtitle>
                <Card.Text>{end_date}</Card.Text>
                <Card.Text>Enrollees: {count}</Card.Text>
                <Card.Text>Seats: {seats}</Card.Text>
                { isOpen ? 
                        <Button variant="primary" onClick={enroll}>Enroll</Button>
                    : 
                        <Button variant="danger" disabled>Not Available</Button>
                }
            </Card.Body>
        </Card>
    )
}

Course.propTypes = {
    course: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
    })
}

