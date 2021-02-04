import React, { useState, useRef } from 'react';
import CenteredContainer from './CenteredContainer';
import { Button, Jumbotron, Modal, Form, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default function HomeScreen() {
    const history = useHistory();
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState('');
    const [showSecondaryTable, setShowSecondaryTable] = useState('hidden');
    const [disableSubmit, setDisableSubmit] = useState(false);
    
    const definitivaRef = useRef();
    const cond1Ref = useRef();
    const cond2Ref = useRef();
    const cond3Ref = useRef();
    const cond4Ref = useRef();
    const cond5Ref = useRef();
    const cond6Ref = useRef();
    const cond7Ref = useRef();

    function handleSubmit(e) {
        e.preventDefault();

        // Clear all errors
        setError('');

        // Check if definitiva is set
        if (!definitivaRef.current.checked) {
            setError('Ne pare rau, dar, atat timp cat o hotarare definitiva nu a fost pronuntata de catre Instanta de judecata, nu va puteti adresa Serviciului de Probatiune. Hotararea pe care o aveti in momentul actual poate suferi schimbari de-a lungul etapelor pe care procesul le mai are de parcurs. Reveniti in momentul in care o hotarare definitiva este pronuntata (doar daca in acea hotarare definitiva Serviciul de Probatiune mai este mentionat). Va dorim o zi buna!');
        }

        // Check to see if any of the conditions is met
        else {
            let condition = false;

            for (let c of [cond1Ref, cond2Ref, cond3Ref, cond4Ref, cond5Ref, cond6Ref, cond7Ref])
                if (c.current.checked) {
                    condition = true;
                    break;
                }

            if (!condition) {
                setError('Ne pare rau, dar, desi aveti o hotarare definitiva pronuntata de catre o Instanta de judecata, se pare ca aceasta nu contine niciun punct care sa presupuna implicarea Serviciului de Probatiune in cazul dumneavoastra.');
            } else {
                history.push('/informatii-adrese');
            }
        }

        setDisableSubmit(true);
    }

    return (
        <CenteredContainer>
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1>Serviciul de Probatiune</h1>
                <p>
                    Bun venit! Inainte de toate haideti sa verificam daca indepliniti criteriile pentru a folosi aceasta aplicatie. Apasand pe butonul de mai jos veti raspunde cu "da" sau "nu" (printr-o bifa) unor intrebari preliminare.
                </p>
                <p>
                    <Button onClick={() => setModalShow(true)}>Sa ne cunoastem!</Button>
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
                    <Modal.Title>Intrebari preliminare</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Table>
                            <tr>
                                <td><Form.Check type="checkbox" id={1} ref={definitivaRef} onClick={() => setShowSecondaryTable(showSecondaryTable === 'hidden' ? 'visible' : 'hidden')} /></td>
                                <td><strong>A fost dispusa o condamnare definitiva in dosarul dumneavoastra?</strong></td>
                            </tr>
                        </Table>
                        <Table style={{ visibility: showSecondaryTable }}>
                            <tr>
                                <td colSpan={2}><strong>In hotararea definitiva a fost dispusa una dintre urmatoarele masuri?</strong></td>
                            </tr>
                            <tr>
                                <td><Form.Check type="checkbox" id={2} ref={cond1Ref} /></td>
                                <td>Amanarea aplicarii pedepsei</td>
                            </tr>
                            <tr>
                                <td><Form.Check type="checkbox" id={3} ref={cond2Ref} /></td>
                                <td>Suspendarea pedepsei sub supraveghere</td>
                            </tr>
                            <tr>
                                <td><Form.Check type="checkbox" id={4} ref={cond3Ref} /></td>
                                <td>Amenda penala transformata in <abbr title="Munca in Folosul Comunitatii" style={{ fontWeight: 'bold' }}>MFC</abbr></td>
                            </tr>
                            <tr>
                                <td><Form.Check type="checkbox" id={5} ref={cond4Ref} /></td>
                                <td>Eliberare conditionata cu un rest de pedeapsa mai mare de 2 ani</td>
                            </tr>
                            <tr>
                                <td><Form.Check type="checkbox" id={6} ref={cond5Ref} /></td>
                                <td>Procuratura a dispus <abbr title="Munca in Folosul Comunitatii" style={{ fontWeight: 'bold' }}>MFC</abbr> si s-a mentionat supravegherea de catre <abbr title="Serviciul de Probatiune" style={{ fontWeight: 'bold' }}>SP</abbr></td>
                            </tr>
                            <tr>
                                <td><Form.Check type="checkbox" id={7} ref={cond6Ref} /></td>
                                <td>Masuri educative minori</td>
                            </tr>
                            <tr>
                                <td><Form.Check type="checkbox" id={8} ref={cond7Ref} /></td>
                                <td>Referat de evaluare inculpat</td>
                            </tr>
                        </Table>
                        
                        <Button className="w-100 mt-2" type="submit" disabled={disableSubmit}>Finalizati</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {error && <div>{error}</div>}
                </Modal.Footer>
            </Modal>
        </CenteredContainer>
    );
};
