import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { Table, Button, Modal } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faPhoneAlt, faFax, faAt } from '@fortawesome/free-solid-svg-icons';

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import MediaAudio from '../components/MediaAudio';
import { useGlobal } from '../contexts/GlobalContext';

let DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapScreen() {
    const { id } = useParams();
    const [serviciu, setServiciu] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const history = useHistory();
    const { situation } = useGlobal();

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/data/servicii.json`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            setServiciu(result.find(s => +s.id === +id));
        });
    }, [id]);

    if (!serviciu) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <MapContainer 
                center={[serviciu.address.lat, serviciu.address.lng]} 
                zoom={17} 
                scrollWheelZoom={false} 
                style={{ height: '60vh', width: '60vw', marginLeft: '20vw', marginTop: '3vh' }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[serviciu.address.lat, serviciu.address.lng]}>
                    <Popup>
                        {serviciu.name} <br /> {serviciu.address.full}
                    </Popup>
                </Marker>
            </MapContainer>

            <Table responsive style={{ 
                width: '46vw', 
                textAlign: 'center', 
                marginTop: '1vh', 
                marginLeft: '27vw' 
            }}>
                <tbody>
                    {situation === 1 &&
                        <tr>
                            <td style={{ textAlign: 'center' }} colSpan={3}>
                                <MediaAudio source={`${process.env.PUBLIC_URL}/media/mesaj.mp3`} />
                            </td>
                        </tr>
                    }
                    <tr>
                        <td style={{ textAlign: 'left' }}><FontAwesomeIcon icon={faMapMarkedAlt} /> Adresa</td>
                        <td colSpan={2}>{serviciu.address.full}</td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: 'left' }}><FontAwesomeIcon icon={faPhoneAlt} /> Telefon</td>
                        <td colSpan={2}>{serviciu.phones.map((p, i) => {
                            return <><a href={`tel:+4${p.split(' (')[0]}`} key={i}>{p}</a><br /></>;
                        })}</td>
                    </tr>
                    {serviciu.faxes && <tr>
                        <td style={{ textAlign: 'left' }}><FontAwesomeIcon icon={faFax} /> Fax</td>
                        <td colSpan={2}>{serviciu.faxes.map((f, i) => {
                            return <><a href={`tel:+4${f}`} key={i}>{f}</a><br /></>;
                        })}</td>
                    </tr>}
                    <tr>
                        <td style={{ textAlign: 'left' }}><FontAwesomeIcon icon={faAt} /> Email</td>
                        <td style={{ textAlign: 'right' }}><a href={`mailto:${serviciu.email}`}>{serviciu.email}</a></td>
                        <td style={{ width: 'auto', textAlign: 'right' }}><Button onClick={() => setModalShow(true)}>Model Email</Button></td>
                    </tr>
                </tbody>
            </Table>
            <Button 
                style={{ width: '40vw', marginLeft: '30vw', marginTop: '2vh', marginBottom: '1vh' }} 
                onClick={() => history.push('/informatii-adrese')}>
                    Inapoi la selectarea judetului
            </Button>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ce trebuie sa contina email-ul dumneavoastra?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center' }} className="mb-5 mt-1">In momentul in care hotararea pronuntata de Instanta de judecata a ramas definitiva trebuie sa trimiteti un mail Serviciului de Probatiune investit cu supravegherea cazului dumneavoastra. Acest mail trebuie sa contina urmatoarele:</div>
                    <Table className="mb-2">
                        <tr>
                            <td><strong>Subiect:</strong></td>
                            <td>{situation === 1 ? 'Luare în evidență' : `Contact întocmire referat ${<strong style={{ color: 'red' }}>Numele dumneavoastră</strong>}`}</td>
                        </tr>
                        <tr>
                            <td><strong>Mesaj:</strong></td>
                            <td>Pot fi contactat la numărul de telefon <strong style={{ color: 'red' }}>Număr telefon personal</strong> sau la numărul <strong style={{ color: 'red' }}>Număr telefon persoană apropiată (membru familie) care să răspundă</strong>. Locuiesc efectiv la următoarea adresă: <strong style={{ color: 'red' }}>Adresa la care locuiți efectiv</strong></td>
                        </tr>
                    </Table>

                    <div style={{ fontStyle: 'italic' }} className="mb-5">Inlocuiti sectiunile marcate cu rosu cu datele care se potrivesc cazului dumneavoastra.</div>

                    <div className="mb-5">Mail-ul dumneavoastra trebuie, de asemenea, sa contina o copie de pe un act de identitate valid. Actele de identitate valide acceptate de Serviciul de Probatiune sunt (in aceasta ordine): <span style={{ fontWeight: 900, color: 'rgba(0, 0, 0, 1)'}}>Carte Identitate (C.I.)</span>, <span style={{ fontWeight: 900, color: 'rgba(0, 0, 0, .8)'}}>Carte Identitate Provizorie (C.I.P.)</span>, <span style={{ fontWeight: 900, color: 'rgba(0, 0, 0, .6)'}}>Certificat Nastere</span>, <span style={{ fontWeight: 900, color: 'rgba(0, 0, 0, .4)'}}>Pasaport</span></div>
                    
                    <div className="mb-5" style={{ textAlign: 'center' }}>Va reamintim ca adresa la care ne puteti trimite mail-ul este: <a href={`mailto:${serviciu.email}`}>{serviciu.email}</a></div>

                    <Table>
                        <tr>
                            <td style={{ fontWeight: 'bold', color: 'red' }}>ATENTIE!</td>
                            <td>Dupa trimiterea mail-ului asteptati sa fiti contactat telefonic de catre un consilier de probatiune, intrucat, in momentul trimiterii mail-ului, sunteti deja luat in evidenta. Nu este nevoie sa reveniti cu mail-uri ulterioare.</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold', color: 'red' }}>ATENTIE!</td>
                            <td>In cazul in care apar modificari cu privire la datele dumneavoastra (schimbarea adresei la care locuiti efectiv, schimbarea domiciliului, eliberarea unui nou act de identitate asemenea celui a carui copie ati atasat-o in mail-ul principal) reveniti cu un mail in care sa faceti cunoscute aceste modificari.</td>
                        </tr>
                    </Table>
                </Modal.Body>
            </Modal>
        </>
    );
};
