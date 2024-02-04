import { createClass as cls } from "../commons/lib/css/create";

export const _blockWindowStyle = cls({
    userSelect: "none",
    display: "flex",
    maxWidth: "400px",
    height: "100%",
    marginLeft: "50px",
    marginTop: "20px",
    flexWrap: "wrap",
});

export const _block = cls({
    display: "flex",
    flexDirection: "column",
    padding:"0.5rem",
    "&:hover": {
        color: "#252717",
    },
});

export const _description = cls({
    textAlign: "center",
    display: "flex",
    color: "var(--label)",
    flexDirection: "column",
    fontSize: 13,
    width: "100px",
});

export const _iconStyle = cls({
    backgroundColor:"var(--bg-dim)",
    fontSize: "30px",
    height:"55px",
    maxWidth: "100px",
    color:"var(--icon)",
    border: "0.5px solid var(--icon)",
    cursor: "pointer",
    textAlign: "center",
});
