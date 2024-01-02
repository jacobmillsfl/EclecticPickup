import React, { useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ContentContainer } from "../../Components/Controls/ContentContainer"
import ShadowBox from "../../Components/Controls/ShadowBox"
import AuthManager from "../../Utilities/AuthManager";
import Alert from 'react-bootstrap/Alert';
import ApiClient from "../../Utilities/Api/ApiClient";


export const LoginComponent: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alertHeading, setAlertHeading] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const handleSubmit = async (event: any) => {
        console.log(username, password);
        event.preventDefault();
        ApiClient.auth.login(username, password).then(result => {
            console.log("Login Result", result);
            if (result.status === 200) {
                AuthManager.setAuthToken(result.message);
                window.location.href = "/admin";
            } else {
                setDisplayAlert(true);
                setAlertHeading("Error");
                setAlertMessage(result.message);
            }
        });
    }

    return (
        <ContentContainer>
            <ShadowBox mode="form">
                <Form className="input-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicUserName">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter user name" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Text className="input-form-text">
                        Need an account? <a href="/register">Register</a>
                    </Form.Text>
                    <br /><br />
                    <Button variant="primary" type="submit" className="input-form-button">
                        Submit
                    </Button>
                </Form>
                {displayAlert &&
                <Alert className="mt-5" variant="danger" dismissible onClose={() => setDisplayAlert(false)}>
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