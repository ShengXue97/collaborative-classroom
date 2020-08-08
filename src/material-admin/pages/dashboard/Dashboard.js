import React, { useEffect } from "react";
// components
import PageTitle from "../../components/PageTitle";

import App from "../../../twilio/components/App/App.js";
import socket from "../../../websocket";

export default function Dashboard(props) {
  useEffect(() => {
    const user = localStorage.getItem("user");
    socket.emit("init", { user }, error => {});
  }, []);

  const mustReload = localStorage.getItem("mustReload");
  if (mustReload != null && mustReload == 1) {
    localStorage.setItem("mustReload", 0);
    window.location.reload(false);
  }

  return (
    <>
      <PageTitle title="Dashboard" button="Room List" />
      <App userName={window.username} />
    </>
  );
}
