import React, { useState, useEffect, useRef } from 'react';
import CenteredContainer from './CenteredContainer';
import { Button, Jumbotron, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext';

export default function AddressScreen() {
    const history = useHistory();
    const [servicii, setServicii] = useState([]);
    const [jsonData, setJsonData] = useState(null);

    const { situation } = useGlobal();

    const judetRef = useRef();

    useEffect(() => {
        fetch('./data/servicii.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            setServicii(result);
        });

        fetch('./data/AddressScreenData.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            setJsonData(result);
        });
    }, []);

    function revealMap(id) {
        history.push(`/informatii-harta/${id}`);
    }

    if (!jsonData) {
        return <div>Loading...</div>;
    }

    return (
        <CenteredContainer>
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1>{jsonData.jumbotron.title}</h1>
                <p>
                    {
                        situation === 1 
                            ? jsonData.jumbotron.content 
                            : (situation === 2 || situation === 3) 
                                ? jsonData.jumbotron.content2
                                : null
                    }
                </p>
                <p>
                    <Form.Group>
                        <Form.Control as="select" ref={judetRef}>
                            {(servicii && servicii.length) && servicii.map((s, i) => {
                                return <option value={s.id} key={i}>{s.name}</option>;
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Button 
                        className="w-100 mb-1"
                        onClick={() => revealMap(judetRef.current.value)}
                    >
                        {jsonData.jumbotron.buttonText}
                    </Button>
                </p>
            </Jumbotron>
        </CenteredContainer>
    );
};
