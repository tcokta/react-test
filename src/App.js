// import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import './App.css';


function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
const count = preGlobalFilteredRows.length
const [value, setValue] = React.useState(globalFilter)
const onChange = useAsyncDebounce(value => {
setGlobalFilter(value || undefined)
}, 200)

return (
<span>
Search:{' '}
<input
value={value || ""}
onChange={e => {
setValue(e.target.value);
onChange(e.target.value);
}}
placeholder={`${count} records...`}
style={{
fontSize: '1.1rem',
border: '0',
}}
/>
</span>
)
}

// Define a default UI for filtering
function DefaultColumnFilter({
         column: { filterValue, preFilteredRows, setFilter },
       }) {
const count = preFilteredRows.length

return (
<input
value={filterValue || ''}
onChange={e => {
setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
}}
placeholder={`Search ${count} records...`}
/>
)
}


function App() {
  function addEntities(e){
    console.log('You clicked me');
  }
  const data = React.useMemo(
    () => [
      {
        col1: 'Minsk',
        col2: '27',
        col3: 'rain',
      },
      {
        col1: 'Vilnius',
        col2: '30',
        col3: 'rain',
      },
      {
        col1: 'London',
        col2: '23',
        col3: 'rain',
      },
    ],
    []
)
  const columns = React.useMemo(
    ()=>[
      {
        Header:'ID',
        accessor:'col1',
      },
      {
        Header:'Ime',
        accessor:'col2',
      },
      {
        Header:'number',
        accessor:'col3',
      },
    ],[]
    )

    const defaultColumn = React.useMemo(
      () => ({
        // Let's set up our default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );
  const {getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter, } =
    useTable(
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
            <p>bs</p>
          </div>
          <div className="MidBotLayout">
            <div className="Middle">
              <table {...getTableProps()} style={{ border: "solid 1px black" }}>
              <thead>
         {headerGroups.map(headerGroup => (
             <tr {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map(column => (
                   <th
                       {...column.getHeaderProps(column.getSortByToggleProps())}
                       style={{
                         borderBottom: 'solid 3px red',
                         color: 'black',
                       }}
                   >
                     {column.render('Header')}
                     <span>
                       {column.isSorted
                           ? column.isSortedDesc
                               ? '🔽'
                               : '🔼'
                           : ''}
                    </span>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                   </th>
               ))}
             </tr>
         ))}
         <tr>
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
         </tr>
         </thead>
         <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
               <tr {...row.getRowProps()}>
                 {row.cells.map(cell => {
                   return (
                       <td
                           {...cell.getCellProps()}
                           style={{
                             padding: '10px',
                             border: 'solid 1px gray',
                           }}
                       >
                         {cell.render('Cell')}
                       </td>
                   )
                 })}
               </tr>
           )
         })}
         </tbody>
              </table>
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
