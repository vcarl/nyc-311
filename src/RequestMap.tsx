import * as React from "react";
import { Map, TileLayer } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";
import { CityRequest } from "./request311";
import MapBounds from "./MapBounds";
import RequestMarkers from "./RequestMarkers";
import * as PropTypes from "prop-types";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const position = { lat: 40.710934, lng: -73.965134 };

interface Props {
  requests: CityRequest[];
}

export default class RequestMap extends React.Component<Props, {}> {
  state = {
    viewport: {}
  };
  static contextTypes = {
    map: PropTypes.instanceOf(LeafletMap)
  };
  handleViewportChange = () => {};
  render() {
    return (
      <Map center={position} zoom={13} style={{ height: "100vh" }}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
        />
        <MapBounds
          render={({ bounds }) => (
            <RequestMarkers bounds={bounds} requests={this.props.requests} />
          )}
        />
      </Map>
    );
  }
}
