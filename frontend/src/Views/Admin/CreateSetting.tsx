import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ContentContainer } from "../../Components/Controls/ContentContainer"
import ShadowBox from "../../Components/Controls/ShadowBox"
import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";

export const CreateSetting: React.FC<CreateEditDataProps> = (props) => {
    const [settingId, setSettingId] = useState<number | undefined>(props.id);
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
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
            ApiClient.settings.get(props.id).then((response) => {
                if (response.data) {
                    setSettingId(response.data.id);
                    setName(response.data.name);
                    setValue(response.data.value);
                    updateAlert(true, "Edit Setting", "info", "Edit and save to update this Setting");
                } else {
                    updateAlert(true, "Error", "danger", "An error occurred while loading this setting");
                }
            });
        }
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (name !== "" && value !== "") {
            if (settingId) {
                const editedSetting = {
                    id: settingId,
                    name: name,
                    value: value
                }
                ApiClient.settings.update(editedSetting).then(result => {
                    if (result.status === 200) {
                        props.edit(editedSetting);
                        props.close();
                    } else {
                        updateAlert(true, "Error", "danger", result.message);
                    }
                })
            } else {
                const newSetting = {
                    name: name,
                    value: value
                }
                ApiClient.settings.create(newSetting).then(result => {
                    if (result.status === 200 && result.data) {
                        const setting = {
                            id: result.data.id,
                            name: result.data.name,
                            value: result.data.value
                        }
                        props.add(setting)
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
        <ContentContainer>
            <ShadowBox mode="form">
                {displayAlert &&
                    <Alert className="mt-5" variant={alertVariant} dismissible onClose={() => setDisplayAlert(false)}>
                        <Alert.Heading>{alertHeading}</Alert.Heading>
                        <p>
                            {alertMessage}
                        </p>
                    </Alert>
                }
                <Form className="input-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicValue">
                        <Form.Label>Value</Form.Label>
                        <Form.Control type="text" as="textarea" rows={8} placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
                    </Form.Group>
                    <Button variant="danger" type="button" size="lg" className="input-form-button mt-5" onClick={props.close}>
                        Cancel
                    </Button>
                    <Button variant="success" type="submit" size="lg" className="input-form-button mt-5" style={{"float":"right"}}>
                        Submit
                    </Button>
                </Form>
            </ShadowBox>
        </ContentContainer>
    )
}