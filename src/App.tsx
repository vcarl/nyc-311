import * as React from "react";
import request311, { CityRequest } from "./request311";
import RequestMap from "./RequestMap";

interface State {
  requests: {
    status: string;
    error: string;
    data: CityRequest[];
  };
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
  }
  render() {
    switch (this.state.requests.status) {
      case "error":
        return <div>JSON.stringify(this.state.requests.error)</div>;
      case "pending":
        return <div>"loading..."</div>;
      default:
        return <RequestMap requests={this.state.requests.data} />;
    }
  }
}

export default App;
