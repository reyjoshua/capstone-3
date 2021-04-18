import {Jumbotron} from 'react-bootstrap';
import Link from 'next/link';


export default function Banner({data}){
    console.log(data);
    const {title, content, destination, label} = data;
    return(
        <Jumbotron>
            <h1>{title}</h1>
            <p>{content}</p>
            <Link href={destination}>
                <a>
                    {label}
                </a>
            </Link>
        </Jumbotron>
    )
}