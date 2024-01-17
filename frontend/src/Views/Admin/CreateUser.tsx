import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ContentContainer } from "../../Components/Controls/ContentContainer"
import ShadowBox from "../../Components/Controls/ShadowBox"
import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";
import { UserModel } from "../../Types/DbModels";

export const CreateUser: React.FC<CreateEditDataProps<UserModel>> = (props) => {
    const [userId, setUserId] = useState<number | undefined>(props.id);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
            // ApiClient.user.get(props.id).then((response) => {
            //     if (response.data) {
            //         userId(response.data.id);
            //         setName(response.data.name);
            //         setValue(response.data.value);
            //         updateAlert(true, "Edit Setting", "info", "Edit and save to update this Setting");
            //     } else {
            //         updateAlert(true, "Error", "danger", "An error occurred while loading this setting");
            //     }
            // });
        }
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (username !== "" && password !== "" && confirmPassword !== "" && email !== "") {
            if (userId) {
                // TODO: edit existing user
            } else {
                if (password === confirmPassword) {
                    ApiClient.auth.registerUser(username, email, password).then(result => {
                        setDisplayAlert(true);
                        setAlertMessage(result.message);
                        if (result.status === 200) {
                            setAlertHeading("Success");
                            setAlertVariant("success");
                        } else {
                            setAlertHeading("Error");
                            setAlertVariant("danger");
                        }
                    })
                }
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
                    <Form.Group className="mb-3" controlId="formBasicUserName">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter user name" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="danger" type="button" size="lg" className="input-form-button mt-5" onClick={props.close}>
                        Cancel
                    </Button>
                    <Button variant="success" type="submit" size="lg" className="input-form-button mt-5" style={{ "float": "right" }}>
                        Submit
                    </Button>
                </Form>
            </ShadowBox>
        </ContentContainer>
    )
}