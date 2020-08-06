import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import Themes from "./material-admin/themes";
import App from "./material-admin/components/App";
import * as serviceWorker from "./serviceWorker";
import { LayoutProvider } from "./material-admin/context/LayoutContext";
import { UserProvider } from "./material-admin/context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/mdb-free.scss";

ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
      <ThemeProvider theme={Themes.default}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </UserProvider>
  </LayoutProvider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
