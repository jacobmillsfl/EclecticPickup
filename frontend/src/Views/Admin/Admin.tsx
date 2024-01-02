import React, { useEffect, useState } from "react";
import { ContentContainer } from "../../Components/Controls/ContentContainer";
import AuthManager from "../../Utilities/AuthManager";
import ShadowBox from "../../Components/Controls/ShadowBox";
import { Tab, Tabs } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AdminEventTable } from "../../Components/Admin/AdminEventTable";
import { Gig, JwtSubject } from "../../Types";

export const AdminComponent: React.FC = () => {
  const [subject, setSubject] = useState<JwtSubject>();
  const [gigs, setGigs] = useState<Array<Gig>>(new Array<Gig>());

  useEffect(() => {
    const jwt = AuthManager.getAuthToken();
    const jwtParts = jwt?.split(".");
    if (jwtParts && jwtParts.length == 3) {
      const decodedSubject = JSON.parse(atob(jwtParts[1]));
      console.log(decodedSubject["sub"]);
      setSubject(decodedSubject["sub"] as JwtSubject);
    }

    ApiClient.event.getAllEvents().then((shows) => {
      if (shows.data) {
        setGigs(shows.data);
      }      
    });

  }, []);

  const getProfile = () => {
    return (
      <div>
        {subject && (
          <div>
            <p>User ID: {subject.id}</p>
            <p>Username: {subject.username}</p>
            <p>Scope: {subject.scope}</p>
            <p>Active: {subject.active.toString()}</p>
          </div>
        )}
      </div>
    );
  };


  return (
    <ContentContainer>
      <ShadowBox mode="wide">
        <Tabs
          defaultActiveKey="profile"
          id="justify-tab-example"
          className="mb-3"
          justify
        >
          <Tab eventKey="profile" title="Profile">
            {getProfile()}
          </Tab>
          <Tab eventKey="events" title="Events">
            <AdminEventTable props={gigs} />
          </Tab>
          <Tab eventKey="users" title="Users" disabled>
            Tab content for Users
          </Tab>
        </Tabs>
      </ShadowBox>
    </ContentContainer>
  );
};

const FrameStyle = {
  maxWidth: "80vw",
  textAlign: "center" as const,
  margin: "auto",
};
