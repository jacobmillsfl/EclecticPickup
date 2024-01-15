import { useState } from "react";
import ShadowBox from "../Controls/ShadowBox";

export const MailChimpComponent: React.FC = () => {
  const [formText, setFormText] = useState("");
  const [formEmail, setFormEmail] = useState("");

  return (
    <ShadowBox mode="wide">
      <h2
        style={{
          textAlign: "center",
        }}
      >
        Eclectic Pickup Mailing List
      </h2>
      <div
        className="row"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
          color: "black",
        }}
      >
        <div id="mc_embed_shell">
          <div id="mc_embed_signup">
            <form
              action="https://jesterjay.us7.list-manage.com/subscribe/post?u=b502469e7948b1c03ab920c6c&amp;id=694d4baf18&amp;f_id=008ed3e4f0"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
            >
              <div id="mc_embed_signup_scroll">
                <div className="indicates-required">
                  <span className="asterisk">*</span> indicates required
                </div>
                <div className="mc-field-group">
                  <label htmlFor="mce-EMAIL">
                    Email Address <span className="asterisk">*</span>
                  </label>
                  <input
                    type="email"
                    name="EMAIL"
                    className="required email"
                    id="mce-EMAIL"
                    required={true}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                  <span
                    id="mce-EMAIL-HELPERTEXT"
                    className="helper_text"
                  ></span>
                </div>
                <div id="mce-responses" className="clear foot">
                  <div
                    className="response"
                    id="mce-error-response"
                    style={{ display: "none" }}
                  ></div>
                  <div
                    className="response"
                    id="mce-success-response"
                    style={{ display: "none" }}
                  ></div>
                </div>
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-5000px" }}
                >
                  <input
                    type="text"
                    name="b_b502469e7948b1c03ab920c6c_694d4baf18"
                    tabIndex={-1}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                  />
                </div>
                <div className="optionalParent">
                  <div className="clear foot">
                    <input
                      type="submit"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="button"
                      value="Subscribe"
                      readOnly={true}
                    />
                    <p style={{ margin: "0px auto" }}>
                      <a
                        href="http://eepurl.com/iklYhf"
                        title="Mailchimp - email marketing made easy and fun"
                      >
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: "transparent",
                            borderRadius: "4px",
                          }}
                        >
                          <img
                            className="refferal_badge"
                            src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg"
                            alt="Intuit Mailchimp"
                            style={{
                              width: "220px",
                              height: "40px",
                              display: "flex",
                              padding: "2px 0px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          />
                        </span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <script
            type="text/javascript"
            src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"
          ></script>
        </div>
      </div>
    </ShadowBox>
  );
};
