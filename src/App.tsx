import * as React from "react";
import request311, { CityRequest } from "./request311";
import RequestMap from "./RequestMap";
import Sidebar from "./Sidebar";
import Attribution from "./Attribution";
import { FilterProvider, Filter } from "hepa";
import { groupBy } from "ramda";

import "./App.css";
import "./bootstrap.css";

interface State {
  requests: FetchedData;
  filter: FilterState;
}

type FilterState = { group: string; predicate?: Function };

type FetchedData = {
  status: string;
  error: string;
  data: DataMap;
};

export type DataMap = {
  keyed: { [key: string]: CityRequest };
  byAgency: { [key: string]: string[] };
  byBorough: { [key: string]: string[] };
};

const handleData = (data: CityRequest[]) => {
  let requests = {} as DataMap;
  let keyed = {};

  data.forEach(x => (keyed[x.unique_key] = x));
  requests.keyed = keyed;
  requests.byAgency = groupBy(x => keyed[x].agency, Object.keys(keyed));
  return requests;
};

const filterData = (data: DataMap, filter: FilterState): string[] => {
  if (filter.predicate === undefined) {
    if (filter.group !== "") {
      return data.byAgency[filter.group];
    }
    return Object.keys(data.keyed);
  }
  return Object.values(data.keyed)
    .filter(x => (filter.predicate as Function)(x))
    .map(x => x.unique_key);
};

const emptyData: DataMap = {
  keyed: {},
  byAgency: {},
  byBorough: {}
};

class App extends React.Component<{}, State> {
  state = {
    requests: {
      status: "pending",
      error: "",
      data: emptyData
    },
    filter: {
      group: "",
      predicate: undefined
    }
  };
  componentDidMount() {
    this.setState({
      requests: { status: "pending", error: "", data: emptyData }
    });
    this.fetchRequests();
  }
  fetchRequests = () => {
    request311()
      .then(data =>
        this.setState({
          requests: {
            status: "idle",
            error: "",
            data: handleData(data)
          }
        })
      )
      .catch(error =>
        this.setState({ requests: { status: "error", error, data: emptyData } })
      );
  };
  handleFilterChange = (filter: FilterState) => {
    this.setState({ filter });
  };
  render() {
    type TypedFilterProvider = new () => FilterProvider<CityRequest>;
    const TypedFilterProvider = FilterProvider as TypedFilterProvider;

    return (
      <TypedFilterProvider>
        <div className="app-root">
          {((requests: FetchedData) => {
            switch (requests.status) {
              case "error":
                return <div>JSON.stringify(requests.error)</div>;
              case "pending":
                return <div className="loading-state">loading...</div>;
              default:
                type TypedFilter = new () => Filter<DataMap>;
                const TypedFilter = Filter as TypedFilter;
                return (
                  <RequestMap
                    lookup={requests.data.keyed}
                    requests={filterData(requests.data, this.state.filter)}
                  />
                );
            }
          })(this.state.requests)}
          <div className="controls">
            <Sidebar
              requests={this.state.requests.data}
              refresh={this.fetchRequests}
              onFilterChange={this.handleFilterChange}
            />
            <Attribution />
          </div>
        </div>
      </TypedFilterProvider>
    );
  }
}

export default App;
