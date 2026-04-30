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
import appContext from "../../Contexts/AppContext";
import {
  BandMemberModel,
  BandVideoModel,
  EventModel,
  SettingsModel,
  SocialLinkModel,
  UserModel,
} from "../../Types/DbModels";
import { CreateUser } from "./CreateUser";
import DataTableFactory from "../../Utilities/DataTableHelper";
import BandImageModel from "../../Types/DbModels/BandImageModel";
import { CreateBandImage } from "./CreateBandImage";
import { CreateBandVideo } from "./CreateBandVideo";
import { CreateSocialLink } from "./CreateSocialLink";
import { CreateBandMember } from "./CreateBandMember";
import { SOCIAL_PLATFORM_SORT_ORDER } from "../../Utilities/socialLinkPresets";

function sortSocialLinksForAdmin(links: SocialLinkModel[]): SocialLinkModel[] {
  const order = new Map<string, number>(
    SOCIAL_PLATFORM_SORT_ORDER.map((p, i) => [p, i])
  );
  return [...links].sort((a, b) => {
    const ai = a.platform != null ? order.get(a.platform) ?? 100 : 100;
    const bi = b.platform != null ? order.get(b.platform) ?? 100 : 100;
    return ai - bi || a.id - b.id;
  });
}

export const AdminComponent: React.FC = () => {
  const { gigs, settings, setGigs, setSettings } = useContext(appContext);
  const [subject, setSubject] = useState<JwtSubject>();
  const [users, setUsers] = useState<Array<UserModel>>(new Array());
  const [bandPictures, setBandPictures] = useState<Array<BandImageModel>>(new Array());
  const [bandVideos, setBandVideos] = useState<Array<BandVideoModel>>(new Array());
  const [socialLinks, setSocialLinks] = useState<Array<SocialLinkModel>>(new Array());
  const [bandMembers, setBandMembers] = useState<Array<BandMemberModel>>(new Array());

  useEffect(() => {
    const jwt = AuthManager.getAuthToken();
    const jwtParts = jwt?.split(".");
    if (jwtParts && jwtParts.length === 3) {
      const payload = JSON.parse(atob(jwtParts[1]));
      // New API tokens: sub is string user id; username/scope/active are top-level claims.
      // Legacy tokens: sub was a nested object.
      const rawSub = payload.sub;
      if (typeof rawSub === "object" && rawSub !== null) {
        setSubject(rawSub as JwtSubject);
      } else {
        setSubject({
          id: Number(rawSub),
          username: String(payload.username ?? ""),
          scope: String(payload.scope ?? ""),
          active: Boolean(payload.active),
        });
      }
    }

    ApiClient.user.all().then((response) => {
      if (response.data) {
        setUsers(response.data);
      }
    })

    ApiClient.bandImage.all().then((response) => {
      if (response.data) {
        setBandPictures(response.data);
      }
    });

    ApiClient.bandVideo.all().then((response) => {
      if (response.data) {
        setBandVideos(response.data);
      }
    });

    ApiClient.socialLink.all().then((response) => {
      if (response.data) {
        setSocialLinks(sortSocialLinksForAdmin(response.data));
      }
    });

    ApiClient.bandMember.all().then((response) => {
      if (response.data) {
        setBandMembers(response.data);
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

  const bandVidsDataTable = DataTableFactory.createDataTable<BandVideoModel>({
    name: "Band Videos",
    items: bandVideos,
    setItems: setBandVideos,
    component: CreateBandVideo,
    api: ApiClient.bandVideo,
  });

  const bandMembersDataTable = DataTableFactory.createDataTable<BandMemberModel>({
    name: "Band members",
    items: bandMembers,
    setItems: setBandMembers,
    component: CreateBandMember,
    api: ApiClient.bandMember,
  });

  const socialLinksDataTable = DataTableFactory.createDataTable<SocialLinkModel>({
    name: "Social links",
    items: socialLinks,
    setItems: setSocialLinks,
    component: CreateSocialLink,
    api: ApiClient.socialLink,
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
          {/* <Tab eventKey="members" title="Band">
            <AdminDataTable<BandImageModel> {...bandPicsDataTable} />
          </Tab> */}
          <Tab eventKey="pictures" title="Pictures">
            <AdminDataTable<BandImageModel> {...bandPicsDataTable} />
          </Tab>
          <Tab eventKey="videos" title="Videos">
            <AdminDataTable<BandVideoModel> {...bandVidsDataTable} />
          </Tab>
          <Tab eventKey="socials" title="Socials">
            <AdminDataTable<SocialLinkModel> {...socialLinksDataTable} />
          </Tab>
          <Tab eventKey="members" title="Band members">
            <AdminDataTable<BandMemberModel> {...bandMembersDataTable} />
          </Tab>
          <Tab eventKey="users" title="Users">
            <AdminDataTable<UserModel> {...usersDataTable} />
          </Tab>
        </Tabs>
      </ShadowBox>
    </ContentContainer>
  );
};
