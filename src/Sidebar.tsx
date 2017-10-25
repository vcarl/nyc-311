import * as React from "react";
// import { Exact } from "hepa";
// import { CityRequest } from "./request311";
import { uniq } from "ramda";
import { DataMap } from "./App";

interface Props {
  requests: DataMap;
  refresh: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  onFilterChange: Function;
}

// const SelectFilter = ({
//   name,
//   children,
//   ...rest
// }: {
//   name: string;
//   children: (JSX.Element | JSX.Element[])[];
//   // tslint:disable-next-line:no-any
//   [key: string]: any;
// }) => {
//   type TypedExact = new () => Exact<CityRequest>;
//   const TypedExact = Exact as TypedExact;
//   return (
//     <TypedExact
//       name={name}
//       render={({
//         value,
//         onChange
//       }: {
//         value: string;
//         onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//       }) => (
//         <select value={value} onChange={onChange} {...rest}>
//           {children}
//         </select>
//       )}
//     />
//   );
// };

const Sidebar = ({ requests, refresh, onFilterChange }: Props) => (
  <div>
    <div className="form-group">
      <label htmlFor="agency_name">Filter by Agency</label>
      <select
        onChange={e => {
          onFilterChange({ group: e.target.value });
        }}
        className="form-control"
        name="agency_name"
      >
        <option value="">All</option>
        {uniq(
          Object.values(requests.keyed).map(r => [r.agency, r.agency_name])
        ).map(([agency, name]) => (
          <option value={agency} key={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
    <button className="btn btn-sm btn-primary btn-block" onClick={refresh}>
      Reload Data (data changes daily)
    </button>
  </div>
);

export default Sidebar;
