import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";
import { BandVideoModel } from "../../Types/DbModels";
import Misc from "../../Utilities/Misc";

export const CreateBandVideo: React.FC<CreateEditDataProps<BandVideoModel>> = (props) => {
    const [bandVideoId, setBandVideoId] = useState<number | undefined>(props.id);
    const [file, setFile] = useState<File | null>(null);
    const [src, setSrc] = useState("");
    const [description, setDescription] = useState("");
    const [youtube, setYoutube] = useState(true);
    const [validUrl, setValidUrl] = useState(true);
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alertHeading, setAlertHeading] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState<AlertVariant>();


    const updateAlert = (display: boolean, heading: string, variant: AlertVariant, message: string) => {
        setDisplayAlert(display);
        setAlertHeading(heading);
        setAlertVariant(variant);
        setAlertMessage(message);
    }

    // OnLoad Effect
    useEffect(() => {
        if (props.id) {
            ApiClient.bandVideo.get(props.id).then((response) => {
                if (response.data) {
                    setBandVideoId(response.data.id);
                    setSrc(response.data.src);
                    setDescription(response.data.description);
                    setYoutube(response.data.youtube);
                    updateAlert(true, "Edit Band Picture", "info", "Edit and save to update this Band Video");
                } else {
                    updateAlert(true, "Error", "danger", "An error occurred while loading this Band Video");
                }
            });
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    }

    const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSrc = e.target.value;
        setSrc(newSrc);
        // Display warning if invalid
        const isValid = Misc.isValidUrl(newSrc);
        setValidUrl(isValid);
    };

    const handleBlur = () => {
        if (src !== "") {
            const isValid = Misc.isValidUrl(src);
            setValidUrl(isValid);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Reset validity on backspace or delete
        if (e.key === 'Backspace' || e.key === 'Delete') {
            setValidUrl(true);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (bandVideoId && description !== "") {

        } else if (description !== "" && (file !== null || youtube)) {

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
                <Form.Group className="mb-3" controlId="formBasicYoutube">
                    <Form.Check
                        type="switch"
                        label="YouTube"
                        checked={youtube}
                        onChange={() => {
                            setYoutube(!youtube);
                            setSrc("");
                            setValidUrl(true);
                            setDescription("");
                        }}
                    />
                </Form.Group>
                {youtube &&
                    <Form.Group className="mb-3" controlId="formBasicUrlSource" hidden={props.id !== undefined}>
                        <Form.Label>YouTube URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={src}
                            onChange={handleSrcChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            isInvalid={!validUrl}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid URL.
                        </Form.Control.Feedback>
                    </Form.Group>
                }
                {!youtube &&
                    <Form.Group className="mb-3" controlId="formBasicUrlSource" hidden={props.id !== undefined}>
                        <Form.Label>File</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                }
                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" as="textarea" rows={2} placeholder="Value" value={description} onChange={e => setDescription(e.target.value)} />
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
