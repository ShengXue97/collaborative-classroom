import React, { useEffect } from "react";
import { useTheme } from "@material-ui/styles";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers/Wrappers.js";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function UserAvatar({ color = "primary", ...props }) {
  var classes = useStyles();
  var theme = useTheme();
  var alphabetColors = [
    "#AA0DFE",
    "#3283FE",
    "#85660D",
    "#782AB6",
    "#565656",
    "#1C8356",
    "#16FF32",
    "#F7E1A0",
    "#E2E2E2",
    "#1CBE4F",
    "#C4451C",
    "#DEA0FD",
    "#FE00FA",
    "#325A9B",
    "#FEAF16",
    "#F8A19F",
    "#90AD1C",
    "#F6222E",
    "#1CFFCE",
    "#2ED9FF",
    "#B10DA1",
    "#C075A6",
    "#FC1CBF",
    "#B00068",
    "#FBE426",
    "#FA0087",
  ];

  var letters = props.name
    .split(" ")
    .map(word => word[0])
    .join("");

  return (
    <OverlayTrigger
      key={"bottom"}
      placement={"bottom"}
      overlay={<Tooltip id={`tooltip-${"bottom"}`}>{props.name}</Tooltip>}
    >
      <div
        className={classes.avatar}
        style={{
          border: "3px solid white",
          backgroundColor: alphabetColors[letters.charCodeAt(0) - 97],
        }}
      >
        <Typography className={classes.text}>{letters}</Typography>
      </div>
    </OverlayTrigger>
  );
}
