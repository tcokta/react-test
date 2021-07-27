// import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import axios from "axios";
import TableScrollbar from "react-table-scrollbar";
import "./App.css";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function App() {
  const [data, setData] = useState([]);
  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
      const result = await axios("https://api.tvmaze.com/search/shows?q=snow");
      setData(result.data);
    })();
  }, []);

  function addEntities(e) {
    console.log("You clicked me");
    setData([
      ...data,
      {
        show: {
          name: "The Snow Lord",
          language: "Russian",
          genres: ["Drama", "Romance"],
          status: "Ended",
          runtime: 600,
        },
      },
      {
        show: {
          name: "Summer snow",
          language: "Russian",
          genres: ["Drama", "Romance"],
          status: "Ended",
          runtime: 90,
        },
      },
      {
        show: {
          name: "Summer storm",
          language: "Korean",
          genres: ["Drama", "Romance"],
          status: "Ended",
          runtime: 105,
        },
      },
      {
        show: {
          name: "Razor",
          language: "English",
          genres: ["Drama", "Romance"],
          status: "Ended",
          runtime: 400,
        },
      },
      {
        show: {
          name: "Major Grom: The plague Doctor",
          language: "Russian",
          genres: ["Drama", "Action"],
          status: "Ended",
          runtime: 105,
        },
      },
      {
        show: {
          name: "Scripted",
          language: "Russian",
          genres: ["Drama", "Thriller"],
          status: "Ended",
          runtime: 65,
        },
      },
      {
        show: {
          name: "Blade",
          language: "English",
          genres: ["Drama", "Animated"],
          status: "Ended",
          runtime: 70,
        },
      },
      {
        show: {
          name: "The Snow",
          language: "Russian",
          genres: ["Thriller", "Romance"],
          status: "Ended",
          runtime: 65,
        },
      },
      {
        show: {
          name: "The Plane",
          language: "Romanian",
          genres: ["Drama", "Comedy"],
          status: "Ended",
          runtime: 120,
        },
      },
      {
        show: {
          name: "The snake",
          language: "Russian",
          genres: ["Comedy", "Romance"],
          status: "Ended",
          runtime: 130,
        },
      },
    ]);
  }
  //   const data = React.useMemo(
  //     () => [
  //       {
  //         col1: 'Minsk',
  //         col2: '27',
  //         col3: 'rain',
  //       },
  //       {
  //         col1: 'Vilnius',
  //         col2: '30',
  //         col3: 'rain',
  //       },
  //       {
  //         col1: 'London',
  //         col2: '23',
  //         col3: 'rain',
  //       },
  //     ],
  //     []
  // )

  const columns = React.useMemo(
    () => [
      {
        Header: "Movie title",
        accessor: "show.name",
      },
      {
        Header: "Language",
        accessor: "show.language",
      },
      {
        Header: "Genre(s)",
        accessor: "show.genres",
      },
      {
        Header: "Runtime",
        accessor: "show.runtime",
      },
      {
        Header: "Status",
        accessor: "show.status",
      },
    ],
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );
  return (
    <div className="App">
      <header className="App-header">
        <div className="TopBar">
          <p>test</p>
        </div>
        <div className="TripleLayout">
          <div className="SideBar">
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
          <div className="MidBotLayout">
            <div className="Middle">
              <TableScrollbar>
                <table
                  {...getTableProps()}
                  style={{ border: "solid 1px black" }}
                >
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            style={{
                              borderBottom: "solid 3px red",
                              color: "black",
                            }}
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? "🔽"
                                  : "🔼"
                                : ""}
                            </span>
                            <div>
                              {column.canFilter
                                ? column.render("Filter")
                                : null}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                    {/* <tr>
           <th
             colSpan={visibleColumns.length}
             style={{
               textAlign: 'left',
             }}
           >
             <GlobalFilter
               preGlobalFilteredRows={preGlobalFilteredRows}
               globalFilter={state.globalFilter}
               setGlobalFilter={setGlobalFilter}
             />
           </th>
         </tr> */}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                style={{
                                  padding: "10px",
                                  border: "solid 1px gray",
                                }}
                              >
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableScrollbar>
            </div>
            <div className="Bottom">
              <button onClick={addEntities}>Dodaj entitete v tabelo</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
