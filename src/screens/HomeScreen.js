import React, { useState, useRef, createRef, useEffect } from 'react';
// import useDynamicRefs from 'use-dynamic-refs';
import CenteredContainer from './CenteredContainer';
import { Button, Jumbotron, Modal, Form, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useGlobal } from '../contexts/GlobalContext'

export default function HomeScreen() {
    const history = useHistory();
    const [jsonData, setJsonData] = useState(null)
    const [errorMessages, setErrorMessages] = useState(null);

    const [error, setError] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [showSecondaryTable, setShowSecondaryTable] = useState('hidden');

    const { situation, setSituation } = useGlobal();

    const refs = useRef({});

    useEffect(() => {
        fetch('./data/HomeScreenData.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(result) {
            return result.json()
        }).then(function(result) {
            setJsonData(result);

            for (let c of result.modal.content.criteria) {
                refs.current[c.ref] = createRef();
                if (c.children)
                    for (let c2 of c.children)
                        refs.current[c2.ref] = createRef();
            }
        });

        fetch('./data/errors.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(result) {
            return result.json();
        }).then(function(result) {
            setErrorMessages(result);
        });
    }, []);

    if (!jsonData || !errorMessages) {
        return <div>Loading...</div>;
    }

    function toggleSecondaryTable() {
        setShowSecondaryTable(showSecondaryTable === 'hidden' ? 'visible' : 'hidden');
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Clear all errors
        setError('');

        console.log(refs);

        // Check if reportMajor or reportMajor is set
        if (refs.current['reportMajorRef'].current.checked) {
            setSituation(2);
            history.push('/informatii-adrese');
            return;
        }
        // Check if reportMinor or reportMajor is set
        if (refs.current['reportMinorRef'].current.checked) {
            setSituation(3);
            history.push('/informatii-adrese');
            return;
        }

        // Check if ultimate is set
        if (!refs.current['ultimateRef'].current.checked) {
            setError(errorMessages.screens.home.no_ultimate);
        }

        // Check to see if any of the conditions is met
        else {
            let condition = false;

            for (let c of jsonData.modal.content.criteria[0].children)
                if (refs.current[c.ref].current.checked) {
                    condition = true;
                    break;
                }

            if (!condition) {
                setError(errorMessages.screens.home.no_authority);
            } else {
                setSituation(1);
                history.push('/informatii-adrese');
            }
        }

        setDisableSubmit(true);

        setTimeout(() => {
            setDisableSubmit(false);
        }, 5000);
    }

    return (
        <CenteredContainer>
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1>{jsonData.jumbotron.title}</h1>
                <p>{jsonData.jumbotron.content}</p>
                <p>
                    <Button onClick={() => setModalShow(true)}>
                        {jsonData.jumbotron.buttonText}
                    </Button>
                </p>
            </Jumbotron>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                style={{ textAlign: 'center' }}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{jsonData.modal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Form.Check 
                                            type="checkbox" 
                                            id={jsonData.modal.content.criteria[0].id} 
                                            ref={refs.current[jsonData.modal.content.criteria[0].ref]} 
                                            onClick={() => toggleSecondaryTable()}/>
                                    </td>
                                    <td><strong>{jsonData.modal.content.criteria[0].text}</strong></td>
                                </tr>
                                <tr>
                                    <td><Form.Check 
                                        type="checkbox" 
                                        id={jsonData.modal.content.criteria[1].id} 
                                        ref={refs.current[jsonData.modal.content.criteria[1].ref]} />
                                    </td>
                                    <td><strong>{jsonData.modal.content.criteria[1].text}</strong></td>
                                </tr>
                                <tr>
                                    <td><Form.Check 
                                        type="checkbox" 
                                        id={jsonData.modal.content.criteria[2].id} 
                                        ref={refs.current[jsonData.modal.content.criteria[2].ref]} />
                                    </td>
                                    <td><strong>{jsonData.modal.content.criteria[2].text}</strong></td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table style={{ visibility: showSecondaryTable }}>
                            <tbody>
                                <tr>
                                    <td colSpan={2}>
                                        <strong>
                                            {jsonData.modal.content.criteria[0].subcategory_text}
                                        </strong>
                                    </td>
                                </tr>
                                {jsonData.modal.content.criteria[0].children.map((c, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    id={c.id}
                                                    ref={refs.current[c.ref]}/>
                                            </td>
                                            <td>{c.text}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                        
                        <Button 
                            className="w-100 mt-2" 
                            type="submit" 
                            disabled={disableSubmit}>
                                {jsonData.modal.buttonText}
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {error && <div>{error}</div>}
                </Modal.Footer>
            </Modal>
        </CenteredContainer>
    );
};
