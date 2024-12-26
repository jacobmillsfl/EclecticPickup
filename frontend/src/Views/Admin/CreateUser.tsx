import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ContentContainer } from "../../Components/Controls/ContentContainer"
import ShadowBox from "../../Components/Controls/ShadowBox"
import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";
import { UserModel } from "../../Types/DbModels";

type UserScope = "admin" | "moderator" | "user" | ""

export const CreateUser: React.FC<CreateEditDataProps<UserModel>> = (props) => {
    const [userId, setUserId] = useState<number | undefined>(props.id);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [active, setActive] = useState(false);
    const [scope, setScope] = useState<UserScope>("");
    const [about, setAbout] = useState("");


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
            ApiClient.user.get(props.id).then((response) => {
                if (response.data) {
                    setUserId(response.data.id);
                    setUsername(response.data.username);
                    setEmail(response.data.email);
                    setActive(response.data.active);
                    setScope(response.data.scope as UserScope);
                    setAbout(response.data.about);
                    updateAlert(true, "Edit User", "info", "Edit and save to update this User");
                } else {
                    updateAlert(true, "Error", "danger", "An error occurred while loading this User");
                }
            });
        }
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (username !== "" && password !== "" && confirmPassword !== "" && email !== "") {
            if (userId) {
                const updatedUser: UserModel = {
                    username: username,
                    password: password,
                    id: userId,
                    email: email,
                    active: active,
                    scope: scope,
                    about: about,
                }
                ApiClient.user.update(updatedUser).then(result => {
                    setDisplayAlert(true);
                    setAlertMessage(result.msg);
                    if (result.status === 200) {
                        setAlertHeading("Success");
                        setAlertVariant("success");
                        props.edit(updatedUser);
                    } else {
                        setAlertHeading("Error");
                        setAlertVariant("danger");
                    }
                })
            } else {
                if (password === confirmPassword) {
                    const newUser: Omit<UserModel, "id"> = {
                        username: username,
                        password: password,
                        email: email,
                        active: active,
                        scope: scope,
                        about: about,
                    }
                    ApiClient.auth.registerUser(newUser).then(result => {
                        setDisplayAlert(true);
                        setAlertMessage(result.msg);
                        if (result.status === 200 && result.data) {
                            setAlertHeading("Success");
                            setAlertVariant("success");
                            props.add(result.data);
                            props.close();
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
                <Form.Group className="mb-3" controlId="formBasicActive">
                    <Form.Check
                        type="switch"
                        label="Active"
                        checked={active}
                        onChange={() => setActive(!active)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUserName">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter user name" value={username} onChange={e => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicScope">
                    <Form.Label>User Scope</Form.Label>
                    <Form.Control
                        as="select"
                        value={scope}
                        onChange={(e) => setScope(e.target.value as UserScope)}
                    >
                        <option value=""></option>
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin" disabled>Admin</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAbout">
                    <Form.Label>About</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="User details"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
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