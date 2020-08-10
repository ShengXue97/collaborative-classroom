import { string } from "prop-types";
import React from "react";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();
var crypto = require("crypto");

function isValidEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function containsInvalidSymbols(stringList) {
  var isValid = true;
  for (var i = 0; i < stringList.length; i++) {
    var s = stringList[i];
    if (s.includes("&") || s.includes("=") || s.includes("?")) {
      isValid = false;
    }
  }
  return isValid;
}

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  registerUser,
  loginUser,
  signOutOwn,
};

// ###########################################################

function registerUser(
  dispatch,
  login,
  password,
  name,
  history,
  setIsLoading,
  setError,
) {
  setError(false);
  setIsLoading(true);
  var modules = ' {"m": [] }';
  if (!!name && !!login && !!password) {
    if (!isValidEmail(login)) {
      alert("Please enter a valid email address.");
      dispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setIsLoading(false);
    } else if (!containsInvalidSymbols([name, login])) {
      alert("Invalid symbols.");
      dispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setIsLoading(false);
    } else if (login.includes("@gmail.com")) {
      alert(
        "Please log in directly using the google sign in. The account is not created.",
      );
      dispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setIsLoading(false);
    } else {
      fetch(
        "http://localhost:5000/register?name=" +
          name +
          "&login=" +
          login +
          "&password=" +
          crypto
            .createHash("sha256")
            .update(password)
            .digest("hex")
            .toString() +
          "&modules=" +
          modules,
        {
          method: "GET",
        },
      )
        .then(response => {
          return response.text();
        })
        .then(data => {
          if (data == "Account Exists") {
            alert("Account: '" + login + "' already exists.");
            dispatch({ type: "LOGIN_FAILURE" });
            setError(true);
            setIsLoading(false);
          } else {
            localStorage.setItem("user", login);
            localStorage.setItem("modules", modules);
            setTimeout(() => {
              localStorage.setItem("id_token", 1);
              setError(null);
              setIsLoading(false);
              dispatch({ type: "LOGIN_SUCCESS" });

              window.username = login;
              history.push("/app/dashboard");
            }, 2000);
          }
        })
        .catch(error => {
          alert("Error occured!");
          console.log(error);
        });
    }
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}
function loginUser(
  dispatch,
  login,
  password,
  room,
  history,
  setIsLoading,
  setError,
  isGoogle,
) {
  setError(false);
  setIsLoading(true);
  if (!!room) {
    localStorage.setItem("room", room);
  }

  if (isGoogle) {
    localStorage.setItem("user", login);
    setTimeout(() => {
      localStorage.setItem("id_token", 1);
      setError(null);
      setIsLoading(false);
      dispatch({ type: "LOGIN_SUCCESS" });

      window.username = login;
      history.push("/app/dashboard");
    }, 2000);
  } else if (!isValidEmail(login)) {
    alert("Please enter a valid email address.");
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  } else if (!containsInvalidSymbols([login])) {
    alert("Invalid symbols.");
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  } else if (!!login && !!password) {
    fetch(
      "http://localhost:5000/login?login=" +
        login +
        "&password=" +
        crypto
          .createHash("sha256")
          .update(password)
          .digest("hex")
          .toString(),
      {
        method: "GET",
      },
    )
      .then(response => {
        return response.text();
      })
      .then(data => {
        if (data == "No Such User") {
          alert("No such user: '" + login + "'.");
          dispatch({ type: "LOGIN_FAILURE" });
          setError(true);
          setIsLoading(false);
        } else if (data == "Wrong Password") {
          alert("Wrong password for user: '" + login + "'.");
          dispatch({ type: "LOGIN_FAILURE" });
          setError(true);
          setIsLoading(false);
        } else {
          localStorage.setItem("user", login);

          setTimeout(() => {
            localStorage.setItem("id_token", 1);
            setError(null);
            setIsLoading(false);
            dispatch({ type: "LOGIN_SUCCESS" });
            window.username = login;
            history.push("/app/dashboard");
          }, 2000);
        }
      })
      .catch(error => {
        alert("Error occured!");
        console.log(error);
      });
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOutOwn(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
