import * as React from "react";
import { Exact } from "hepa";
import { CityRequest } from "./request311";
import { uniq } from "ramda";

interface Props {
  requests: CityRequest[];
  refresh: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}

const SelectFilter = ({
  name,
  children,
  ...rest
}: {
    name: string;
    children: (JSX.Element | JSX.Element[])[];
    // tslint:disable-next-line:no-any
    [key: string]: any;
  }) => {
  type TypedExact = new () => Exact<CityRequest>;
  const TypedExact = Exact as TypedExact;
  return (
    <TypedExact
      name={name}
      render={({
        value,
        onChange
      }: {
          value: string;
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        }) => (
          <select value={value} onChange={onChange} {...rest}>
            {children}
          </select>
        )}
    />
  );
};

const Sidebar = ({ requests, refresh }: Props) => (
  <div>
    <div className="form-group">
      <label htmlFor="agency_name">Filter by Agency</label>
      <SelectFilter className="form-control" name="agency_name">
        <option value="">All</option>
        {uniq(requests.map(r => r.agency_name)).map(name => (
          <option value={name} key={name}>
            {name}
          </option>
        ))}
      </SelectFilter>
    </div>
    <button className="btn btn-sm btn-primary btn-block" onClick={refresh}>
      Reload Data (data changes daily)
    </button>
  </div>
);

export default Sidebar;
