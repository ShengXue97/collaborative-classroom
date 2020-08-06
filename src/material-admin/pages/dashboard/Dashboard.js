import React, { useState } from "react";
// components
import PageTitle from "../../components/PageTitle";

import App from "../../../twilio/components/App/App.js";

export default function Dashboard(props) {

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
