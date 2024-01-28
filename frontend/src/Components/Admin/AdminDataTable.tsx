import React, { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";

import Misc from "../../Utilities/Misc";
import { ApiResponse } from "../../Utilities/Api/ApiTypes";
import { AlertVariant, Data, DataTable } from "../../Types";

export function AdminDataTable<T extends Data>(props: DataTable<T>) {

    const [selectedIndex, setSelectedIndex] = useState<number>();
    const [selectedData, setSelectedData] = useState<T>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showComponentModal, setShowComponentModal] = useState(false);
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alertHeading, setAlertHeading] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState<AlertVariant>();

    const handleShowDeleteModal = (id: number) => {
        const selectedItem = props.items.filter((item) => item.id === id).at(0);
        if (selectedItem) {
            setShowDeleteModal(true);
            setSelectedData(selectedItem);
        }
    };

    const handleConfirmDelete = () => {
        if (selectedData) {
            props.deleteMethod(selectedData.id).then((response: ApiResponse) => {
                if (response.status === 200) {
                    setShowDeleteModal(false);
                    const remainingData = props.items.filter((item) => item.id !== selectedData.id);
                    props.setItems(remainingData);
                } else {
                    setAlertHeading("Error");
                    setAlertVariant("danger");
                    setDisplayAlert(true);
                    setAlertMessage(response.message);
                }
            });
        }
    }

    const handleShowComponentModal = (id?: number) => {
        setShowComponentModal(true);
        setSelectedIndex(id);
    }

    let dataKeys: string[] = [];

    if (props.items.length > 0) {
        dataKeys = Object.keys(props.items[0]).filter(key => key !== "id");
    }

    return (
        <div style={TableStyle}>
            <div className="row mt-4 mb-4 text-center">
                <h1>
                    Manage {props.name}
                </h1>
            </div>
            <div className="row">
                {displayAlert &&
                    <Alert className="mt-5" variant={alertVariant} dismissible onClose={() => setDisplayAlert(false)}>
                        <Alert.Heading>{alertHeading}</Alert.Heading>
                        <p>
                            {alertMessage}
                        </p>
                    </Alert>
                }
            </div>
            <div className="row mt-4 mb-4">
                <div>
                    <Button
                        variant="primary"
                        size="lg"
                        style={{ float: "right" }}
                        onClick={() => handleShowComponentModal()}
                    >
                        Create
                    </Button>
                </div>
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        {dataKeys.map((key: string) => (
                            <th key={key}>{Misc.capitalizeFirstLetter(key)}</th>
                        ))}
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {props.items.map((item, index) => (
                        <tr
                            key={index}
                        >
                            {dataKeys.map((key: string) => (
                                <td key={key}>
                                    {Misc.formatType(item[key])}
                                </td>
                            ))}

                            <td>
                                <Badge
                                    pill
                                    bg="warning"
                                    style={{ "cursor": "pointer" }}
                                    onClick={() => {
                                        handleShowComponentModal(item.id);
                                    }}
                                >
                                    <i className="fas fa-edit"></i>
                                </Badge>
                            </td>
                            <td>
                                <Badge
                                    pill
                                    bg="danger"
                                    style={{ "cursor": "pointer" }}
                                    onClick={() => {
                                        handleShowDeleteModal(item.id);
                                    }}
                                >
                                    <i className="fas fa-trash"></i>
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header className="bg-dark text-light" closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    <p>
                        Are you sure that you want to delete the following?
                    </p>
                    {selectedData && (
                        <pre style={ItemDetailsStyle}>
                            {Object.entries(selectedData).map(([key, value]) => (
                                <p key={key}>
                                    <strong>{key}:</strong> {Misc.formatType(value)}
                                </p>
                            ))}
                        </pre>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark text-light">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showComponentModal} onHide={() => setShowComponentModal(false)}>
                <Modal.Header className="bg-dark text-light" closeButton>
                    <Modal.Title>{props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    {
                        <props.component
                            id={selectedIndex}
                            close={() => setShowComponentModal(false)}
                            add={(newItem) => props.add(newItem)}
                            edit={(updatedItem) => props.edit(updatedItem)}
                        />
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
};


const TableStyle = {
    maxWidth: "1020px",
    marginLeft: "auto",
    marginRight: "auto",
};

const ItemDetailsStyle = {
    padding: "1em",
    backgroundColor: "rgb(.1,.1,.1,.1)",
}