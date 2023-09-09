import { styled } from "../../styles";



export const Form = styled("form", {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  div: {
    flexBasis: "50%",
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    resize: "none",
    padding: "10px",
    boxSizing: "border-box",
    border: "1px solid $gray300",
    borderRadius: "5px"
  }
})