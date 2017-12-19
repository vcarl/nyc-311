import * as React from "react";
import { Marker, Popup, Map, TileLayer } from "react-leaflet";
import RequestMarker from "./RequestMarker";
import { CityRequest } from "./request311";
import MapBounds, { Bounds } from "react-leaflet-bounds";
import "./RequestMap.css";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const position = { lat: 40.710934, lng: -73.965134 };

interface Props {
  requests: string[];
  lookup: { [key: string]: CityRequest };
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

export default class RequestMap extends React.Component<Props, {}> {
  render() {
    return (
      <Map center={position} zoom={13} minZoom={12}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
        />
        <MapBounds
          render={({ bounds }) => (
            <div>
              {this.props.requests
                .map(id => this.props.lookup[id])
                .filter(filterByBounds(bounds))
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
          )}
        />
      </Map>
    );
  }
}
