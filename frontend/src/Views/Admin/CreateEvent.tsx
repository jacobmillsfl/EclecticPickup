import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ContentContainer } from "../../Components/Controls/ContentContainer"
import ShadowBox from "../../Components/Controls/ShadowBox"
import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";

type AlertVariant = "success" | "danger" | "info";

export const CreateEvent: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [eventId, setEventId] = useState<number | null>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [venue, setVenue] = useState("");
    const [address, setAddress] = useState("");
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alertHeading, setAlertHeading] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState<AlertVariant>();


    // OnLoad Effect
    useEffect( ()=> {
        const eventIdParam = searchParams.get("eid");
        if (eventIdParam) {
            const parsedEventId = Number.parseInt(eventIdParam);
            if (parsedEventId) {
                ApiClient.event.getEvent(parsedEventId).then( (response) => {
                    if (response.data) {
                        console.log(response)
                        setEventId(response.data.id);
                        setDate(response.data.date.toISOString().split('T')[0]);
                        setTime(response.data.time);
                        setVenue(response.data.venue);
                        setAddress(response.data.address);
                        setDisplayAlert(true);
                        setAlertHeading("Edit Gig");
                        setAlertVariant("info");
                        setAlertMessage("Edit and save to update this Gig");
                    } else {
                        setDisplayAlert(true);
                        setAlertHeading("Error");
                        setAlertVariant("danger");
                        setAlertMessage("An error occurred while loading this event");
                    }
                });
            }
        }
    }, []);


    const handleSubmit = async (event: any) => {
        console.log(date, time, venue, address);
        event.preventDefault();
        if (eventId) {
            ApiClient.event.editEvent(eventId, date, time, venue, address).then( result => {
                setDisplayAlert(true);
                setAlertMessage(result.message);
                console.log(result)
                if (result.status === 200) {
                    setAlertHeading("Success");
                    setAlertVariant("success");

                    window.location.href = "/admin";
                } else {
                    setAlertHeading("Error");
                    setAlertVariant("danger");
                }
            })
        } else {
            ApiClient.event.createEvent(date, time, venue, address).then( result => {
                setDisplayAlert(true);
                setAlertMessage(result.message);
                console.log(result)
                if (result.status === 200) {
                    setAlertHeading("Success");
                    setAlertVariant("success");

                    window.location.href = "/admin";
                } else {
                    setAlertHeading("Error");
                    setAlertVariant("danger");
                }
            })
        }
    }

    return (
        <ContentContainer>
            <ShadowBox mode="form">
                <Form className="input-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" placeholder="MM/DD/YYYY" value={date} onChange={e => setDate(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicTime">
                        <Form.Label>Time</Form.Label>
                        <Form.Control type="text" placeholder="6-8pm"  value={time} onChange={e => setTime(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicVenue">
                        <Form.Label>Venue</Form.Label>
                        <Form.Control type="text" placeholder="Horsey Saloon" value={venue} onChange={e => setVenue(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="123 St, Fort Collins CO" value={address} onChange={e => setAddress(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Text className="input-form-text">
                        Don't need to create an event? <a href="/admin">Go back</a>
                    </Form.Text>
                    <br /><br />
                    <Button variant="primary" type="submit" className="input-form-button">
                        Submit
                    </Button>
                </Form>
                {displayAlert &&
                <Alert className="mt-5" variant={alertVariant} dismissible onClose={() => setDisplayAlert(false)}>
                    <Alert.Heading>{alertHeading}</Alert.Heading>
                    <p>
                        {alertMessage}
                    </p>
                </Alert>
            }
            </ShadowBox>
        </ContentContainer>
    )
}