import { makeStyles } from "@material-ui/styles";

export default makeStyles(() => ({
  avatar: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    textTransform: "uppercase",
  },
  text: {
    color: "white",
  },
}));
