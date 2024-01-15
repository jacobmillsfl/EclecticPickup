import React, { useEffect, useState } from "react";
import { ContentContainer } from "../../Components/Controls/ContentContainer";
import AuthManager from "../../Utilities/AuthManager";
import ShadowBox from "../../Components/Controls/ShadowBox";
import { Tab, Tabs } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AdminDataTable } from "../../Components/Admin/AdminDataTable";
import { Data, DataTable, JwtSubject } from "../../Types";
import { CreateEvent } from "./CreateEvent";
import { CreateSetting } from "./CreateSetting";
import { useNavigate } from "react-router-dom";


export const AdminComponent: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState<JwtSubject>();
  const [gigs, setGigs] = useState<Array<Data>>([]);
  const [settings, setSettings] = useState<Array<Data>>([]);

  console.log("ADMIN COMPONENT LOAD")
  useEffect(() => {
    console.log("USE EFFECT LOAD")
    const jwt = AuthManager.getAuthToken();
    if (!jwt) {
      console.log("NO JWT TOKEN");
      navigate("/login");
    }
    const jwtParts = jwt?.split(".");
    if (jwtParts && jwtParts.length === 3) {
      const decodedSubject = JSON.parse(atob(jwtParts[1]));
      setSubject(decodedSubject["sub"] as JwtSubject);
    }

    ApiClient.event.all().then((shows) => {
      if (shows.data) {
        setGigs(shows.data);
      }
    });

    ApiClient.settings.all().then((settings) => {
      if (settings.data) {
        setSettings(settings.data);
      }
    })

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



  const gigDataTable: DataTable = {
    name: "Gigs",
    items: gigs,
    add: (newItem: Data) => {
      const newItems = [...gigs, newItem];
      setGigs(newItems);
    },
    edit: (updatedItem: Data) => {
      const updatedItems = gigs.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      setGigs(updatedItems);
    },
    setItems: (updatedCollection: Array<Data>) => setGigs(updatedCollection),
    component: CreateEvent,
    deleteMethod: (id: number) => { return ApiClient.event.delete(id) },
  }

  const settingsDataTable: DataTable = {
    name: "Settings",
    items: settings,
    add: (newItem: Data) => {
      const newItems = [...settings, newItem];
      setSettings(newItems);
    },
    edit: (updatedItem: Data) => {
      const updatedItems = settings.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      setSettings(updatedItems);
    },
    setItems: (updatedCollection: Array<Data>) => setSettings(updatedCollection),
    component: CreateSetting,
    deleteMethod: (id: number) => { return ApiClient.settings.delete(id) },
  }


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
          <Tab eventKey="events" title="Gigs">
            <AdminDataTable props={gigDataTable} />
          </Tab>
          <Tab eventKey="settings" title="Settings">
            <AdminDataTable props={settingsDataTable} />
          </Tab>
          <Tab eventKey="users" title="Users" disabled>
            Tab content for Users
          </Tab>
        </Tabs>
      </ShadowBox>
    </ContentContainer>
  );
};
