import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";
import { BandVideoModel } from "../../Types/DbModels";
import Misc from "../../Utilities/Misc";

export const CreateBandVideo: React.FC<CreateEditDataProps<BandVideoModel>> = (props) => {
    const [bandVideoId, setBandVideoId] = useState<number | undefined>(props.id);
    const [src, setSrc] = useState("");
    const [description, setDescription] = useState("");
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
    };

    useEffect(() => {
        if (props.id) {
            ApiClient.bandVideo.get(props.id).then((response) => {
                if (response.data) {
                    setBandVideoId(response.data.id);
                    setSrc(response.data.src);
                    setDescription(response.data.description);
                    updateAlert(true, "Edit band video", "info", "Update the YouTube URL and description, then save.");
                } else {
                    updateAlert(true, "Error", "danger", "An error occurred while loading this band video");
                }
            });
        }
    }, [props.id]);

    const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSrc = e.target.value;
        setSrc(newSrc);
        if (newSrc === "") {
            setValidUrl(true);
            return;
        }
        setValidUrl(Misc.isValidUrl(newSrc) && Misc.isYouTubeUrl(newSrc));
    };

    const handleBlur = () => {
        if (src.trim() !== "") {
            setValidUrl(Misc.isValidUrl(src) && Misc.isYouTubeUrl(src));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedSrc = src.trim();
        const trimmedDesc = description.trim();

        if (!trimmedSrc || !trimmedDesc) {
            updateAlert(true, "Error", "warning", "YouTube URL and description are required.");
            return;
        }
        if (!Misc.isValidUrl(trimmedSrc) || !Misc.isYouTubeUrl(trimmedSrc)) {
            updateAlert(true, "Error", "danger", "Enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=… or https://youtu.be/…).");
            return;
        }

        const payload: Omit<BandVideoModel, "id"> = {
            src: trimmedSrc,
            description: trimmedDesc,
            youtube: true,
        };

        try {
            if (bandVideoId) {
                const result = await ApiClient.bandVideo.update({
                    id: bandVideoId,
                    ...payload,
                });
                if (result.status === 200) {
                    const row =
                        result.data ??
                        ({ id: bandVideoId, ...payload } as BandVideoModel);
                    props.edit(row);
                    props.close();
                } else {
                    updateAlert(true, "Error", "danger", result.msg ?? "Update failed");
                }
            } else {
                const result = await ApiClient.bandVideo.create(payload);
                if (result.status === 200 && result.data) {
                    props.add(result.data);
                    props.close();
                } else {
                    updateAlert(true, "Error", "danger", result.msg ?? "Create failed");
                }
            }
        } catch {
            updateAlert(true, "Error", "danger", "Request failed");
        }
    };

    return (
        <>
            {displayAlert && (
                <Alert className="mt-5" variant={alertVariant} dismissible onClose={() => setDisplayAlert(false)}>
                    <Alert.Heading>{alertHeading}</Alert.Heading>
                    <p>{alertMessage}</p>
                </Alert>
            )}
            <Form className="input-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="bandVideoYoutubeUrl">
                    <Form.Label>YouTube URL</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
                        value={src}
                        onChange={handleSrcChange}
                        onBlur={handleBlur}
                        isInvalid={!validUrl && src !== ""}
                    />
                    <Form.Control.Feedback type="invalid">Use a full YouTube watch or youtu.be link.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="bandVideoDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        as="textarea"
                        rows={2}
                        placeholder="Short caption for the carousel"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Button variant="danger" type="button" size="lg" className="input-form-button mt-5" onClick={props.close}>
                    Cancel
                </Button>
                <Button variant="success" type="submit" size="lg" className="input-form-button mt-5" style={{ float: "right" }}>
                    Submit
                </Button>
            </Form>
        </>
    );
};
