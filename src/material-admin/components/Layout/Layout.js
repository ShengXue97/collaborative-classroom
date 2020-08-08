import React, { useState } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Chats from "../../pages/chats/Chats.js";

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();
  var [modal, setModal] = useState(false);
  var [messageBox, setMessageBox] = useState("");
  var [recipentBox, setRecipentBox] = useState("");
  // global
  var layoutState = useLayoutState();

  const toggleModal = () => {
    setModal(!modal);
  };

  const updateMessageBox = message => {
    setMessageBox(message);
  };

  const updateRecipentBox = recipent => {
    setRecipentBox(recipent);
  };

  return (
    <div className={classes.root}>
      <>
        <Header
          updateRecipentBox={updateRecipentBox}
          recipentBox={recipentBox}
          toggleModal={toggleModal}
          updateMessageBox={updateMessageBox}
          messageBox={messageBox}
          modal={modal}
          history={props.history}
        />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/chats" component={Chats} />
          </Switch>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
