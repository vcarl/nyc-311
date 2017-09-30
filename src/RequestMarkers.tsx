import * as React from "react";
import { CityRequest } from "./request311";
import { Marker, Popup } from "react-leaflet";
import { Bounds } from "./MapBounds";
import RequestMarker from "./RequestMarker";

interface Props {
  bounds: Bounds;
  requests: CityRequest[];
}

function filterByBounds(bounds: Bounds) {
  return function compareRequests(request: CityRequest) {
    const lng = Number(request.location.coordinates[0]);
    const lat = Number(request.location.coordinates[1]);

    return (
      lng > bounds.southWest.lng &&
      lng < bounds.northEast.lng &&
      lat > bounds.southWest.lat &&
      lat < bounds.northEast.lat
    );
  };
}

export default class ComplaintMap extends React.Component<Props, {}> {
  render() {
    return (
      <div>
        {this.props.requests
          .filter(filterByBounds(this.props.bounds))
          .map(request => {
            const coordinates = {
              lng: Number(request.location.coordinates[0]),
              lat: Number(request.location.coordinates[1])
            };
            return (
              <Marker key={request.unique_key} position={coordinates}>
                <Popup>
                  <RequestMarker request={request} />
                </Popup>
              </Marker>
            );
          })}
      </div>
    );
  }
}
