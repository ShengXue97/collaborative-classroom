import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Fab,
  Link,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  MailOutline as MailIcon,
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Search as SearchIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import { Badge, Typography, Button } from "../Wrappers/Wrappers";
import Notification from "../Chats/Notification";
import UserAvatar from "../UserAvatar/UserAvatar";
import moment from "moment";
// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { useUserDispatch, signOutOwn } from "../../context/UserContext";

import { useGoogleLogout } from "react-google-login";

import socket from "../../../websocket";

import NewConversation from "../../../messenger/components/NewConversation/NewConversation";

const clientId =
  "1095052158563-iteoskptpn9e4hemaf2br65nk3jibldl.apps.googleusercontent.comm";

const notifications = [
  { id: 0, color: "warning", message: "Check out this awesome ticket" },
  {
    id: 1,
    color: "success",
    type: "info",
    message: "What is the best way to get ...",
  },
  {
    id: 2,
    color: "secondary",
    type: "notification",
    message: "This is just a simple notification",
  },
  {
    id: 3,
    color: "primary",
    type: "e-commerce",
    message: "12 new orders has arrived today",
  },
];

export default function Header(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useUserDispatch();

  // local
  var [mailMenu, setMailMenu] = useState(null);
  var [notificationsMenu, setNotificationsMenu] = useState(null);
  var [isNotificationsUnread, setIsNotificationsUnread] = useState(true);
  var [profileMenu, setProfileMenu] = useState(null);
  var [isSearchOpen, setSearchOpen] = useState(false);

  var messageCountRef = useRef(0);

  const userName = localStorage.getItem("user");

  useEffect(() => {
    getConversations();
    socket.on("newMessage", message => {
      const userName = localStorage.getItem("user");
      if (message.author == userName || message.recipent != userName) {
        return;
      }
      //IMPORTANT: State is not kept inside here(socket.on), only Ref.
      const dateObject = new Date(JSON.parse(message.timestamp));
      const adjustedDateObject = new Date(
        dateObject.toLocaleString("en-US", {
          timeZone: "Asia/Singapore",
        }),
      );

      const friendlyTimestamp = moment(adjustedDateObject)
        .startOf("hour")
        .fromNow();

      const newMessage = {
        internalCount: messageCountRef.current,
        id: message.id,
        variant: "primary",
        name: message.author,
        message: message.message,
        time: friendlyTimestamp,
        internalTime: message.timestamp,
      };
      messageCountRef.current = messageCountRef.current + 1;

      props.addSmallMessage(newMessage);

      if (props.messagesNo.length == 0) {
        props.messagesNo.push(1);
      } else {
        props.messagesNo[0] = props.messagesNo[0] + 1;
      }

      props.updateBadgeContent(props.messagesNo[0]);
    });
  }, []);

  const setAsRead = (author, message, timestamp) => {
    const recipent = localStorage.getItem("user");
    //Tell server that I read all of these
    fetch(
      "https://collaborative-classroom-server.herokuapp.com/setasreadsingle?author=" +
        author +
        "&recipent=" +
        recipent +
        "&message=" +
        message +
        "&timestamp=" +
        timestamp,
      {
        method: "GET",
      },
    ).catch(error => {
      alert("Error occured!");
      console.log(error);
    });
  };

  const getConversations = avatars => {
    var newMessages = {};

    const user = localStorage.getItem("user");
    const minTimestamp = 0;
    var count = 0;

    fetch(
      "https://collaborative-classroom-server.herokuapp.com/singlechat?recipent=" +
        user +
        "&minTimestamp=" +
        minTimestamp,
      {
        method: "GET",
      },
    )
      .then(response => {
        return response.text();
      })
      .then(data => {
        const dataParsed = JSON.parse(data);
        const newMessages = [];

        dataParsed.map((element, index) => {
          if (element.recipent == user && element.isunread == 1) {
            const dateObject = new Date(JSON.parse(element.timestamp));
            const adjustedDateObject = new Date(
              dateObject.toLocaleString("en-US", {
                timeZone: "Asia/Singapore",
              }),
            );

            const friendlyTimestamp = moment(adjustedDateObject)
              .startOf("hour")
              .fromNow();

            const newMessage = {
              internalCount: messageCountRef.current,
              id: element.id,
              variant: "primary",
              name: element.author,
              message: element.message,
              time: friendlyTimestamp,
              internalTime: element.timestamp,
            };
            newMessages.push(newMessage);

            messageCountRef.current = messageCountRef.current + 1;
            props.messagesNo[0] = props.messagesNo[0] + 1;
            props.updateBadgeContent(props.messagesNo[0]);
          }
        });
        props.updateSmallMessages(newMessages);
      });
  };

  const removeMessage = internalCount => {
    var newMessages = [];
    props.smallMessages.current.map((element, index) => {
      console.log(element.internalCount, internalCount);
      if (element.internalCount != internalCount) {
        newMessages.push(element);
      }
    });
    props.messagesNo[0] = props.messagesNo[0] - 1;
    props.updateBadgeContent(props.messagesNo[0]);

    props.removeSmallMessage(newMessages);
  };

  const onLogoutSuccess = res => {
    console.log("Logged out Success");
    localStorage.setItem("google_logged_in", 0);
    signOutOwn(userDispatch, props.history);
  };

  const onFailure = () => {
    signOutOwn(userDispatch, props.history);
    console.log("Handle failure cases");
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  let content = null;
  const google_var = localStorage.getItem("google_logged_in");
  var google_logged_in = false;
  if (google_var != null && google_var == 1) {
    google_logged_in = true;
  }

  content = google_logged_in ? (
    <Typography
      className={classes.profileMenuLink}
      color="secondary"
      onClick={signOut}
    >
      Sign Out
    </Typography>
  ) : (
    <Typography
      className={classes.profileMenuLink}
      color="primary"
      onClick={() => {
        signOutOwn(userDispatch, props.history);
      }}
    >
      Sign Out
    </Typography>
  );

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse,
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          Collaborative Classroom
        </Typography>
        <div className={classes.grow} />
        <div
          className={classNames(classes.search, {
            [classes.searchFocused]: isSearchOpen,
          })}
        >
          <div
            className={classNames(classes.searchIcon, {
              [classes.searchIconOpened]: isSearchOpen,
            })}
            onClick={() => setSearchOpen(!isSearchOpen)}
          >
            <SearchIcon classes={{ root: classes.headerIcon }} />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="mail-menu"
          onClick={e => {
            setNotificationsMenu(e.currentTarget);
            setIsNotificationsUnread(false);
          }}
          className={classes.headerMenuButton}
        >
          <Badge
            badgeContent={isNotificationsUnread ? notifications.length : null}
            color="warning"
          >
            <NotificationsIcon classes={{ root: classes.headerIcon }} />
          </Badge>
        </IconButton>
        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="mail-menu"
          onClick={e => {
            setMailMenu(e.currentTarget);
          }}
          className={classes.headerMenuButton}
        >
          <Badge badgeContent={props.badgeContent} color="secondary">
            <MailIcon classes={{ root: classes.headerIcon }} />
          </Badge>
        </IconButton>
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={e => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
        <Menu
          id="mail-menu"
          open={Boolean(mailMenu)}
          anchorEl={mailMenu}
          onClose={() => {
            setMailMenu(null);
          }}
          MenuListProps={{ className: classes.headerMenuList }}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium">
              New Messages
            </Typography>
            <Typography
              className={classes.profileMenuLink}
              component="a"
              color="secondary"
            >
              {props.smallMessages.current.length} New Messages
            </Typography>
          </div>
          {props.smallMessages.current.map(message => (
            <MenuItem
              onClick={() => {
                props.toggleModal();
                props.updateRecipentBox(message.name);
                props.updateMessageBox("");
                console.log(
                  message.name,
                  message.message,
                  message.internalTime,
                );
                setAsRead(message.name, message.message, message.internalTime);
                removeMessage(message.internalCount);
              }}
              key={message.id}
              className={classes.messageNotification}
            >
              <div className={classes.messageNotificationSide}>
                <UserAvatar color={message.variant} name={message.name} />
                <Typography size="sm" color="text" colorBrightness="secondary">
                  {message.time}
                </Typography>
              </div>
              <div
                className={classNames(
                  classes.messageNotificationSide,
                  classes.messageNotificationBodySide,
                )}
              >
                <Typography weight="medium" gutterBottom>
                  {message.name}
                </Typography>
                <Typography color="text" colorBrightness="secondary">
                  {message.message}
                </Typography>
              </div>
            </MenuItem>
          ))}
          <NewConversation
            recipentBox={props.recipentBox}
            updateRecipentBox={props.updateRecipentBox}
            messageBox={props.messageBox}
            toggleModal={props.toggleModal}
            updateMessageBox={props.updateMessageBox}
            modal={props.modal}
          />
        </Menu>
        <Menu
          id="notifications-menu"
          open={Boolean(notificationsMenu)}
          anchorEl={notificationsMenu}
          onClose={() => setNotificationsMenu(null)}
          className={classes.headerMenu}
          disableAutoFocusItem
        >
          {notifications.map(notification => (
            <MenuItem
              key={notification.id}
              onClick={() => setNotificationsMenu(null)}
              className={classes.headerMenuItem}
            >
              <Notification {...notification} typographyVariant="inherit" />
            </MenuItem>
          ))}
        </Menu>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium">
              {userName}
            </Typography>
          </div>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} /> Profile
          </MenuItem>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} /> Tasks
          </MenuItem>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} /> Messages
          </MenuItem>
          <div className={classes.profileMenuUser}>{content}</div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
