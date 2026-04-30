import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AlertVariant, CreateEditDataProps } from "../../Types";
import SocialLinkModel from "../../Types/DbModels/SocialLinkModel";
import { resolvePublicAssetUrl } from "../../Utilities/Api/publicContentMappers";
import {
  SOCIAL_PLATFORM_OPTIONS,
  presetForPlatform,
  isSelectablePlatform,
} from "../../Utilities/socialLinkPresets";

export const CreateSocialLink: React.FC<CreateEditDataProps<SocialLinkModel>> = (
  props
) => {
  const [platform, setPlatform] = useState("facebook");
  const [labelText, setLabelText] = useState("");
  const [hrefUrl, setHrefUrl] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [hrefTouched, setHrefTouched] = useState(false);
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

  const applyPlatformDefaults = (p: string, resetHref: boolean) => {
    const pr = presetForPlatform(p);
    if (resetHref || !hrefTouched) {
      setHrefUrl(pr.defaultHref);
    }
  };

  useEffect(() => {
    if (props.id) {
      ApiClient.socialLink.get(props.id).then((response) => {
        if (response.data) {
          const d = response.data;
          const p = d.platform || "facebook";
          setPlatform(p);
          setLabelText(d.text ?? "");
          setHrefUrl(d.href_url ?? presetForPlatform(p).defaultHref);
          setEnabled(Boolean(d.enabled));
          setHrefTouched(true);
          updateAlert(
            true,
            "Edit social link",
            "info",
            "Change platform to switch the icon, then set the label, link, and visibility."
          );
        } else {
          updateAlert(
            true,
            "Error",
            "danger",
            "An error occurred while loading this social link"
          );
        }
      });
    } else {
      setPlatform("facebook");
      setLabelText("");
      setEnabled(true);
      setHrefTouched(false);
      applyPlatformDefaults("facebook", true);
      updateAlert(
        true,
        "New social link",
        "info",
        "Pick a platform (icon), enter a label, adjust the link if needed, and set visibility."
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init create vs load edit
  }, [props.id]);

  const onPlatformChange = (next: string) => {
    setPlatform(next);
    if (!props.id) {
      applyPlatformDefaults(next, !hrefTouched);
    } else {
      const pr = presetForPlatform(next);
      setHrefUrl(pr.defaultHref);
      setHrefTouched(true);
    }
  };

  const previewSrc = resolvePublicAssetUrl(
    presetForPlatform(platform).img_url,
    process.env.PUBLIC_URL ?? ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLabel = labelText.trim();
    const trimmedHref = hrefUrl.trim();
    if (!trimmedLabel) {
      updateAlert(true, "Error", "warning", "Label text is required.");
      return;
    }
    if (!trimmedHref) {
      updateAlert(true, "Error", "warning", "Link URL is required.");
      return;
    }

    const pr = presetForPlatform(platform);
    const payloadBase: Omit<SocialLinkModel, "id"> = {
      href_url: trimmedHref,
      img_url: pr.img_url,
      text: trimmedLabel,
      category: pr.category,
      platform: platform as SocialLinkModel["platform"],
      enabled,
    };

    try {
      if (props.id) {
        const result = await ApiClient.socialLink.update({
          id: props.id,
          ...payloadBase,
        });
        if (result.status === 200 && result.data) {
          props.edit(result.data);
          props.close();
        } else {
          updateAlert(true, "Error", "danger", result.msg ?? "Update failed");
        }
      } else {
        const result = await ApiClient.socialLink.create(payloadBase);
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
        <Form.Group className="mb-3" controlId="socialPlatform">
          <Form.Label>Platform</Form.Label>
          <Form.Select
            value={platform || "facebook"}
            onChange={(e) => onPlatformChange(e.target.value)}
          >
            {props.id && platform && !isSelectablePlatform(platform) && (
              <option value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)} (legacy)
              </option>
            )}
            {SOCIAL_PLATFORM_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </Form.Select>
          <Form.Text muted>Icon image is chosen automatically from this list.</Form.Text>
        </Form.Group>

        <div className="mb-3">
          <Form.Label>Icon preview</Form.Label>
          <div>
            <img
              src={previewSrc}
              alt=""
              style={{ maxHeight: 72, maxWidth: 72, display: "block" }}
            />
          </div>
        </div>

        <Form.Group className="mb-3" controlId="socialText">
          <Form.Label>Label</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Follow us on Facebook"
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="socialHref">
          <Form.Label>Link URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="https://… or mailto:you@example.com"
            value={hrefUrl}
            onChange={(e) => {
              setHrefUrl(e.target.value);
              setHrefTouched(true);
            }}
          />
          <Form.Text muted>
            Defaults update when you change platform (create) or when editing you pick a new
            platform.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="socialEnabled">
          <Form.Label className="mb-1">Show on site</Form.Label>
          <Form.Check
            type="switch"
            id="social-link-enabled-switch"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            label={enabled ? "On (visible in footer and social sections)" : "Off (hidden)"}
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
