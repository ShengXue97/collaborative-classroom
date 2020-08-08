import React, { useState, useRef } from "react";
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
  var [badgeContent, setBadgeContent] = useState(null);
  var [messagesNo, setMessagesNo] = useState([0]);

  const smallMessages = useRef([]);

  // global
  var layoutState = useLayoutState();

  const toggleModal = () => {
    setModal(!modal);
  };

  const updateBadgeContent = badgeContent => {
    setBadgeContent(badgeContent);
  };

  const updateSmallMessages = newSmallMessages => {
    smallMessages.current = newSmallMessages;
  };

  const addSmallMessage = smallMessage => {
    smallMessages.current.push(smallMessage);
    console.log(smallMessages.current);
  };

  const removeSmallMessage = smallMessagesNew => {
    smallMessages.current = smallMessagesNew;
  };

  const updateSmallMessagesFiltered = recipent => {
    var newSmallMessages = [];

    smallMessages.current.map((element, index) => {
      console.log(element.name, recipent);
      if (element.name != recipent) {
        newSmallMessages.push(element);
      }
    });

    smallMessages.current = newSmallMessages;
    messagesNo[0] = smallMessages.current.length;
    setBadgeContent(smallMessages.current.length);
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
          messagesNo={messagesNo}
          badgeContent={badgeContent}
          updateBadgeContent={updateBadgeContent}
          addSmallMessage={addSmallMessage}
          removeSmallMessage={removeSmallMessage}
          updateSmallMessages={updateSmallMessages}
          smallMessages={smallMessages}
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
            <Route
              path="/app/chats"
              render={props => (
                <Chats
                  {...props}
                  updateSmallMessagesFiltered={updateSmallMessagesFiltered}
                />
              )}
            />
          </Switch>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
