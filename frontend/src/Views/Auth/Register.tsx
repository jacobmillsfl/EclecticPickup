import React, { FormEventHandler, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ContentContainer } from "../../Components/Controls/ContentContainer"
import ShadowBox from "../../Components/Controls/ShadowBox"
import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";

type AlertVariant = "success" | "danger";

export const RegisterComponent: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alertHeading, setAlertHeading] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState<AlertVariant>();

    const  handleSubmit = async (event: any) => {
        console.log(username, email, password, confirmPassword);
        event.preventDefault();

    }

    return (
        <ContentContainer>
            <ShadowBox mode="form">
                <Form className="input-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicUserName">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter user name" value={username} onChange={e => setUsername(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email"  value={email} onChange={e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Text className="input-form-text">
                        Already have an account? <a href="/login">Login</a>
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