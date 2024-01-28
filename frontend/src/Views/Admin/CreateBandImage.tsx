import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";
import { BandImageModel } from "../../Types/DbModels";

export const CreateBandImage: React.FC<CreateEditDataProps<BandImageModel>> = (props) => {
    const [bandImageId, setBandImageId] = useState<number | undefined>(props.id);
    const [file, setFile] = useState<File | null>(null);
    const [filename, setFilename] = useState("");
    const [caption, setCaption] = useState("");
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
            ApiClient.bandImage.get(props.id).then((response) => {
                if (response.data) {
                    setBandImageId(response.data.id);
                    setFilename(response.data.filename);
                    setCaption(response.data.caption);
                    updateAlert(true, "Edit Band Picture", "info", "Edit and save to update this Band Picture");
                } else {
                    updateAlert(true, "Error", "danger", "An error occurred while loading this Band Picture");
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (bandImageId && caption !== "") {
            const updatedBandImage = {
                id: bandImageId,
                caption: caption
            }
            ApiClient.bandImage.update(updatedBandImage).then(result => {
                if (result.status === 200) {
                    props.edit({...updatedBandImage, filename: filename })
                    props.close();
                } else {
                    updateAlert(true, "Error", "danger", result.message);
                }
            })
        } else if (file !== null && caption !== "") {
            ApiClient.file.upload(file).then(response => {
                if (response.status === 200) {
                    const newBandImage = {
                        filename: file.name,
                        caption: caption
                    }
                    ApiClient.bandImage.create(newBandImage).then(result => {
                        if (result.status === 200 && result.data) {
                            const bandImage = {
                                id: result.data.id,
                                filename: result.data.filename,
                                caption: result.data.caption
                            }
                            props.add(bandImage)
                            props.close();
                        } else {
                            updateAlert(true, "Error", "danger", result.message);
                        }
                    })
                } else {
                    updateAlert(true, "Error", "danger", response.message);
                }
            })
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
                <Form.Group className="mb-3" controlId="formBasicUrlSource" hidden={props.id !== undefined}>
                    <Form.Label>File</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                    <Form.Text className="text-center text-danger">WARNING: For best results please use an image with a 16∶9 aspect ratio</Form.Text>
                </Form.Group>
                {filename !== "" &&
                    <>
                        <Image src={`${process.env.REACT_APP_API_URL}/files/${filename}`} className="mx-auto d-block" style={{ "maxHeight": "300px" }} thumbnail />
                        <br /><br />
                    </>
                }
                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Caption</Form.Label>
                    <Form.Control type="text" as="textarea" rows={2} placeholder="Value" value={caption} onChange={e => setCaption(e.target.value)} />
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
