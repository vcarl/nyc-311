import * as React from "react";
import request311, { CityRequest } from "./request311";
import RequestMap from "./RequestMap";
import Sidebar from "./Sidebar";
import { FilterProvider, Filter } from "hepa";

import "./App.css";
import "./bootstrap.css";

interface State {
  requests: FetchedData<CityRequest>;
}

interface FetchedData<T> {
  status: string;
  error: string;
  data: T[];
}

class App extends React.Component<{}, State> {
  state = {
    requests: {
      status: "pending",
      error: "",
      data: [] as CityRequest[]
    }
  };
  componentDidMount() {
    this.setState({ requests: { status: "pending", error: "", data: [] } });
    this.fetchRequests();
  }
  fetchRequests = () => {
    request311()
      .then(data =>
        this.setState({
          requests: {
            status: "idle",
            error: "",
            data
          }
        })
      )
      .catch(error =>
        this.setState({ requests: { status: "error", error, data: [] } })
      );
  };
  render() {
    type TypedFilterProvider = new () => FilterProvider<CityRequest>;
    const TypedFilterProvider = FilterProvider as TypedFilterProvider;

    return (
      <TypedFilterProvider>
        <div className="app-root">
          {(function(requests: FetchedData<CityRequest>) {
            switch (requests.status) {
              case "error":
                return <div>JSON.stringify(requests.error)</div>;
              case "pending":
                return <div className="loading-state">loading...</div>;
              default:
                type TypedFilter = new () => Filter<CityRequest>;
                const TypedFilter = Filter as TypedFilter;
                return (
                  <TypedFilter
                    style={{ width: "100%" }}
                    data={requests.data}
                    render={data => <RequestMap requests={data} />}
                  />
                );
            }
          })(this.state.requests)}
          <div className="controls">
            <Sidebar
              requests={this.state.requests.data}
              refresh={this.fetchRequests}
            />
          </div>
        </div>
      </TypedFilterProvider>
    );
  }
}

export default App;
