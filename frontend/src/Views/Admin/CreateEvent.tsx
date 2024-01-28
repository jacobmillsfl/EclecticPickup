import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ContentContainer } from "../../Components/Controls/ContentContainer"
import ShadowBox from "../../Components/Controls/ShadowBox"
import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";
import { EventModel } from "../../Types/DbModels";

interface IAlertUpdate {
    (display: boolean, heading: string, variant: AlertVariant, message: string) : void
}

export const CreateEvent: React.FC<CreateEditDataProps<EventModel>> = (props) => {
    const [eventId, setEventId] = useState<number | undefined>(props.id);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [venue, setVenue] = useState("");
    const [address, setAddress] = useState("");
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alertHeading, setAlertHeading] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState<AlertVariant>();

    const updateAlert: IAlertUpdate = (display: boolean, heading: string, variant: AlertVariant, message: string) => {
        setDisplayAlert(display);
        setAlertHeading(heading);
        setAlertVariant(variant);
        setAlertMessage(message);
    }

    // OnLoad Effect
    useEffect(() => {
        if (props.id) {
            ApiClient.event.get(props.id).then((response) => {
                if (response.data) {
                    console.log(response)
                    setEventId(response.data.id);
                    setDate(response.data.date.toISOString().split('T')[0]);
                    setTime(response.data.time);
                    setVenue(response.data.venue);
                    setAddress(response.data.address);
                    updateAlert(true, "Edit Gig", "info", "Edit and save to update this Gig");
                } else {
                    updateAlert(true, "Error", "danger", "An error occurred while loading this event");
                }
            });
        }
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (date !== "" && time !== "" && venue !== "" && address !== "") {
            if (eventId) {
                const editedEvent = {
                    id: eventId,
                    date: new Date(`${date} 00:00:00`),
                    time: time,
                    venue: venue,
                    address: address,
                }
                ApiClient.event.update(editedEvent).then(result => {
                    if (result.status === 200) {
                        props.edit(editedEvent)
                        props.close();
                    } else {
                        updateAlert(true, "Error", "danger", result.message);
                    }
                })
            } else {
                const newEvent = {
                    date: new Date(`${date}`),
                    time: time,
                    venue: venue,
                    address: address,
                }
                ApiClient.event.create(newEvent).then(result => {
                    if (result.status === 200 && result.data) {
                        const newEvent = { ...result.data }
                        props.add(newEvent)
                        props.close();
                    } else {
                        updateAlert(true, "Error", "danger", result.message);
                    }
                })
            }
        } else {
            updateAlert(true, "Error", "warning", "All fields are required");
        }
    }

    return (
        <>
            {displayAlert &&
                <Alert className="mt-5" variant={alertVariant} dismissible onClose={() => setDisplayAlert(false)}>
                    <Alert.Heading>{alertHeading}</Alert.Heading>
                    <p>
                        {alertMessage}
                    </p>
                </Alert>
            }
            <Form className="input-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" placeholder="MM/DD/YYYY" value={date} onChange={e => setDate(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicTime">
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="text" placeholder="6-8pm" value={time} onChange={e => setTime(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicVenue">
                    <Form.Label>Venue</Form.Label>
                    <Form.Control type="text" placeholder="Venue Name" value={venue} onChange={e => setVenue(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="123 Main St" value={address} onChange={e => setAddress(e.target.value)} />
                </Form.Group>
                <Button variant="danger" type="button" size="lg" className="input-form-button mt-5" onClick={props.close}>
                    Cancel
                </Button>
                <Button variant="success" type="submit" size="lg" className="input-form-button mt-5" style={{ "float": "right" }}>
                    Submit
                </Button>
            </Form>
        </>
    )
}