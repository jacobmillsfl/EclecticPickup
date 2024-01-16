import React, { useContext, useEffect, useState } from "react";
import { ContentContainer } from "../../Components/Controls/ContentContainer";
import AuthManager from "../../Utilities/AuthManager";
import ShadowBox from "../../Components/Controls/ShadowBox";
import { Tab, Tabs } from "react-bootstrap";
import ApiClient from "../../Utilities/Api/ApiClient";
import { AdminDataTable } from "../../Components/Admin/AdminDataTable";
import { CreateEditDataProps, Data, DataTable, JwtSubject } from "../../Types";
import { CreateEvent } from "./CreateEvent";
import { CreateSetting } from "./CreateSetting";
import { useNavigate } from "react-router-dom";
import appContext from "../../Contexts/AppContext";
import { EventModel, SettingsModel, UserModel } from "../../Types/DbModels";
import { CreateUser } from "./CreateUser";
import { ICrudApi } from "../../Utilities/Api/ApiTypes";

type DataTableOptions<T extends Data> = {
  name: string;
  items: Array<T>;
  setItems: (items: Array<T>) => void;
  component: React.FC<CreateEditDataProps<T>>;
  api: ICrudApi<T>;
};

const createDataTable = <T extends Data>({
  name,
  items,
  setItems,
  component,
  api,
}: DataTableOptions<T>): DataTable<T> => {
  const add = async (newItem: T) => {
    const newItems = [...items, newItem];
    setItems(newItems);

  };

  const edit = async (updatedItem: T) => {
    const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    setItems(updatedItems);
  };

  const deleteMethod = async (id: number) => {
    return api.delete(id);
  };

  return {
    name,
    items,
    component,
    deleteMethod,
    add,
    edit,
    setItems,
  };
};

export const AdminComponent: React.FC = () => {
  const { loggedIn, gigs, settings, setGigs, setSettings } = useContext(appContext);
  const navigate = useNavigate();
  const [subject, setSubject] = useState<JwtSubject>();
  const [users, setUsers] = useState<Array<UserModel>>(new Array());

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

        console.log("API RESPONSE", response.data)
        setUsers(response.data);
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

  const gigDataTable = createDataTable<EventModel>({
    name: "Gigs",
    items: gigs,
    setItems: setGigs,
    component: CreateEvent,
    api: ApiClient.event,
  });

  const settingsDataTable = createDataTable({
    name: "Settings",
    items: settings,
    setItems: setSettings,
    component: CreateSetting,
    api: ApiClient.settings,
  });

  const usersDataTable = createDataTable({
    name: "Users",
    items: users,
    setItems: setUsers,
    component: CreateUser,
    api: ApiClient.user,
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
          <Tab eventKey="users" title="Users">
            <AdminDataTable<UserModel> {...usersDataTable} />
          </Tab>
        </Tabs>
      </ShadowBox>
    </ContentContainer>
  );
};
