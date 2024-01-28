import React, { useContext, useEffect, useState } from "react";
import { ContentContainer } from "../../Components/Controls/ContentContainer";
import AuthManager from "../../Utilities/AuthManager";
import ShadowBox from "../../Components/Controls/ShadowBox";
import { Tab, Tabs } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AdminDataTable } from "../../Components/Admin/AdminDataTable";
import { JwtSubject } from "../../Types";
import { CreateEvent } from "./CreateEvent";
import { CreateSetting } from "./CreateSetting";
import { useNavigate } from "react-router-dom";
import appContext from "../../Contexts/AppContext";
import { EventModel, SettingsModel, UserModel } from "../../Types/DbModels";
import { CreateUser } from "./CreateUser";
import DataTableFactory from "../../Utilities/DataTableHelper";
import BandImageModel from "../../Types/DbModels/BandImageModel";
import { CreateBandImage } from "./CreateBandImage";

export const AdminComponent: React.FC = () => {
  const { loggedIn, gigs, settings, setGigs, setSettings } = useContext(appContext);
  const navigate = useNavigate();
  const [subject, setSubject] = useState<JwtSubject>();
  const [users, setUsers] = useState<Array<UserModel>>(new Array());
  const [bandPictures, setBandPictures] = useState<Array<BandImageModel>>(new Array());

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }

    const jwt = AuthManager.getAuthToken();
    const jwtParts = jwt?.split(".");
    if (jwtParts && jwtParts.length === 3) {
      const decodedSubject = JSON.parse(atob(jwtParts[1]));
      setSubject(decodedSubject["sub"] as JwtSubject);
    }

    ApiClient.user.all().then((response) => {
      if (response.data) {
        setUsers(response.data);
      }
    })

    ApiClient.bandImage.all().then(response => {
      if (response.data) {
        setBandPictures(response.data);
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

  const gigDataTable = DataTableFactory.createDataTable<EventModel>({
    name: "Gigs",
    items: gigs,
    setItems: setGigs,
    component: CreateEvent,
    api: ApiClient.event,
  });

  const settingsDataTable = DataTableFactory.createDataTable<SettingsModel>({
    name: "Settings",
    items: settings,
    setItems: setSettings,
    component: CreateSetting,
    api: ApiClient.settings,
  });

  const usersDataTable = DataTableFactory.createDataTable<UserModel>({
    name: "Users",
    items: users,
    setItems: setUsers,
    component: CreateUser,
    api: ApiClient.user,
  });

  const bandPicsDataTable = DataTableFactory.createDataTable<BandImageModel>({
    name: "Band Pictures",
    items: bandPictures,
    setItems: setBandPictures,
    component: CreateBandImage,
    api: ApiClient.bandImage,
  });

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
            <AdminDataTable<EventModel> {...gigDataTable} />
          </Tab>
          <Tab eventKey="settings" title="Settings">
            <AdminDataTable<SettingsModel> {...settingsDataTable} />
          </Tab>
          <Tab eventKey="members" title="Band">
            <AdminDataTable<BandImageModel> {...bandPicsDataTable} />
          </Tab>
          <Tab eventKey="pictures" title="Pictures">
            <AdminDataTable<BandImageModel> {...bandPicsDataTable} />
          </Tab>
          <Tab eventKey="videos" title="Videos">
            <AdminDataTable<BandImageModel> {...bandPicsDataTable} />
          </Tab>
          <Tab eventKey="socials" title="Socials">
            <AdminDataTable<BandImageModel> {...bandPicsDataTable} />
          </Tab>
          <Tab eventKey="users" title="Users">
            <AdminDataTable<UserModel> {...usersDataTable} />
          </Tab>
        </Tabs>
      </ShadowBox>
    </ContentContainer>
  );
};
