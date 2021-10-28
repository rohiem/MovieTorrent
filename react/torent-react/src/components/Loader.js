import React from "react";
import { Spinner } from "react-bootstrap";
function Loader() {
  return (
    <div>
      <Spinner
        animation="border"
        variant="primary"
        style={{
          height: "100px",
          width: "100px",
          display: "block",
          margin: "auto",
        }}
      />
    </div>
  );
}

export default Loader;
