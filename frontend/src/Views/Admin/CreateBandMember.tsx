import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";
import BandMemberModel from "../../Types/DbModels/BandMemberModel";

/** Strip to stored DB form: basename for API uploads, unchanged for legacy paths. */
function toStoredImgUrl(displayUrl: string): string {
  if (!displayUrl) {
    return "";
  }
  const marker = "/files/";
  const idx = displayUrl.indexOf(marker);
  if (idx !== -1) {
    return displayUrl.slice(idx + marker.length).split("?")[0];
  }
  if (displayUrl.startsWith("http://") || displayUrl.startsWith("https://")) {
    try {
      const u = new URL(displayUrl);
      const p = u.pathname.indexOf("/files/");
      if (p !== -1) {
        return u.pathname.slice(p + marker.length).split("/").filter(Boolean).join("/");
      }
    } catch {
      /* ignore */
    }
  }
  return displayUrl;
}

export const CreateBandMember: React.FC<CreateEditDataProps<BandMemberModel>> = (
  props
) => {
  const [memberId, setMemberId] = useState<number | undefined>(props.id);
  const [name, setName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertHeading, setAlertHeading] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState<AlertVariant>();

  const updateAlert = (
    display: boolean,
    heading: string,
    variant: AlertVariant,
    message: string
  ) => {
    setDisplayAlert(display);
    setAlertHeading(heading);
    setAlertVariant(variant);
    setAlertMessage(message);
  };

  useEffect(() => {
    if (props.id) {
      ApiClient.bandMember.get(props.id).then((response) => {
        if (response.data) {
          setMemberId(response.data.id);
          setName(response.data.name);
          setImgUrl(response.data.img_url);
          setText(response.data.text);
          setFile(null);
          updateAlert(
            true,
            "Edit band member",
            "info",
            "Update name, role text, or choose a new photo to replace the current one."
          );
        } else {
          updateAlert(
            true,
            "Error",
            "danger",
            "An error occurred while loading this band member"
          );
        }
      });
    } else {
      setMemberId(undefined);
      setName("");
      setImgUrl("");
      setText("");
      setFile(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- reset create form vs load edit
  }, [props.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) {
      updateAlert(true, "Error", "warning", "Name and role / description are required.");
      return;
    }

    if (!memberId) {
      if (!file) {
        updateAlert(true, "Error", "warning", "Choose a photo to upload.");
        return;
      }
      const upload = await ApiClient.file.upload(file);
      if (upload.status !== 200) {
        updateAlert(true, "Error", "danger", upload.msg ?? "Upload failed");
        return;
      }
      const payload: Omit<BandMemberModel, "id"> = {
        name: trimmedName,
        img_url: file.name,
        text: trimmedText,
      };
      const result = await ApiClient.bandMember.create(payload);
      if (result.status === 200 && result.data) {
        props.add(result.data);
        props.close();
      } else {
        updateAlert(true, "Error", "danger", result.msg ?? "Create failed");
      }
      return;
    }

    let imgForApi: string;
    if (file) {
      const upload = await ApiClient.file.upload(file);
      if (upload.status !== 200) {
        updateAlert(true, "Error", "danger", upload.msg ?? "Upload failed");
        return;
      }
      imgForApi = file.name;
    } else {
      imgForApi = toStoredImgUrl(imgUrl);
      if (!imgForApi) {
        updateAlert(true, "Error", "warning", "Photo is missing; upload a new image.");
        return;
      }
    }

    const edited: BandMemberModel = {
      id: memberId,
      name: trimmedName,
      img_url: imgForApi,
      text: trimmedText,
    };
    const result = await ApiClient.bandMember.update(edited);
    if (result.status === 200 && result.data) {
      props.edit(result.data);
      props.close();
    } else {
      updateAlert(true, "Error", "danger", result.msg ?? "Update failed");
    }
  };

  return (
    <>
      {displayAlert && (
        <Alert
          className="mt-5"
          variant={alertVariant}
          dismissible
          onClose={() => setDisplayAlert(false)}
        >
          <Alert.Heading>{alertHeading}</Alert.Heading>
          <p>{alertMessage}</p>
        </Alert>
      )}
      <Form className="input-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="memberName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="memberPhoto">
          <Form.Label>{memberId ? "Photo (upload to replace)" : "Photo"}</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Form.Text className="text-muted">
            Images are stored on the server like band pictures. Use a clear headshot if possible.
          </Form.Text>
        </Form.Group>
        {imgUrl !== "" && (
          <>
            <Form.Label className="d-block">Current photo</Form.Label>
            <Image
              src={imgUrl}
              alt={name || "Band member"}
              className="mx-auto d-block mb-3"
              style={{ maxHeight: "280px" }}
              thumbnail
            />
          </>
        )}
        <Form.Group className="mb-3" controlId="memberText">
          <Form.Label>Role / description</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="danger"
          type="button"
          size="lg"
          className="input-form-button mt-5"
          onClick={props.close}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          type="submit"
          size="lg"
          className="input-form-button mt-5"
          style={{ float: "right" }}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};
