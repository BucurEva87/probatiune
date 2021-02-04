import React, { useState, useEffect, useRef } from 'react';
import CenteredContainer from './CenteredContainer';
import { Button, Jumbotron, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default function AddressScreen() {
    const [servicii, setServicii] = useState([]);
    const history = useHistory();

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
    }, []);

    function revealMap(id) {
        history.push(`/informatii-harta/${id}`);
    }

    return (
        <CenteredContainer>
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1>Unde locuiti efectiv?</h1>
                <p>
                    Va rugam sa selectati din lista de mai jos judetul in care locuiti. Daca in actul de identitate figureaza un domiciliu, dar, in fapt, locuiti la o alta adresa, va rugam sa selectati judetul care corespunde adresei la care locuiti efectiv.
                </p>
                <p>
                    <Form.Group>
                        <Form.Control as="select" ref={judetRef}>
                            {(servicii && servicii.length) && servicii.map((s, i) => {
                                return <option value={s.id} key={i}>{s.name.split('Probatiune ')[1]}</option>;
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Button 
                        className="w-100 mb-1"
                        onClick={() => revealMap(judetRef.current.value)}
                    >
                        Continuati catre informatiile despre Serviciul de Probatiune
                    </Button>
                </p>
            </Jumbotron>
        </CenteredContainer>
    );
};
