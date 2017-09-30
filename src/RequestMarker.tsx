import * as React from "react";
import { CityRequest } from "./request311";

const RequestMarker = ({ request }: { request: CityRequest }) => (
  <div>
    <div style={{ marginBottom: ".5rem" }}>
      {request.agency} - {request.agency_name}
      <div>
        <small style={{ color: "#666" }}>{request.status}</small>
      </div>
    </div>
    <div>{request.descriptor}</div>
    <div>{request.resolution_description}</div>
  </div>
);

export default RequestMarker;
