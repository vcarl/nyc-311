import * as React from "react";
import { MapComponent } from "react-leaflet";
import { Map as LeafletMap, LatLng, Evented } from "leaflet";
import * as PropTypes from "prop-types";

export interface Bounds {
  northEast: LatLng;
  southWest: LatLng;
}

interface Props {
  // tslint:disable-next-line:no-any
  render: ({ bounds }: { bounds: Bounds }) => React.ReactElement<any>;
}

export default class MapBounds extends MapComponent<Props, Evented> {
  static contextTypes = {
    map: PropTypes.instanceOf(LeafletMap)
  };
  componentDidMount() {
    this.context.map.on("moveend", this.handleViewportChange);
  }
  handleViewportChange = () => {
    this.forceUpdate();
  };
  render() {
    if (this.context.map === undefined) {
      return null;
    }
    const mapBounds = this.context.map.getBounds();
    const bounds: Bounds = {
      southWest: mapBounds.getSouthWest(),
      northEast: mapBounds.getNorthEast()
    };
    return this.props.render({ bounds });
  }
}
