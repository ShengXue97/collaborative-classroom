import React, { useEffect } from "react";
// components
import PageTitle from "../../components/PageTitle/PageTitle";

import Messenger from "../../../messenger/components/Messenger/Messenger.js";

export default function Chats(props) {
  return (
    <>
      <PageTitle title="Chats" />
      <Messenger />
    </>
  );
}
