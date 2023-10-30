import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";

import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css';
import LS from "../utils/LS.js";
import {Button, Space, theme} from "antd";
import {commify} from "../utils/utils.js";


export default function ({data,defaultColDef,columnDefs, id}) {
    defaultColDef = defaultColDef || {}
    columnDefs = columnDefs || []
    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row



    const sideBar = useMemo(() => {
        return {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                    minWidth: 225,
                    maxWidth: 225,
                    width: 225
                },
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                    minWidth: 180,
                    maxWidth: 400,
                    width: 250
                }
            ],
            position: 'right',
            // defaultToolPanel: 'columns',
            // hiddenByDefault: false
        };
    }, []);

    // Each Column Definition results in one Column.
    const [ColumnDefs, setColumnDefs] = useState([]);

    // DefaultColDef sets props common to all Columns
    const _defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true,
        resizable: true,
        ...defaultColDef
    }));

    const [ColOverrides, setColOverrides] = useState([])

    // Example load data from server
    useEffect(() => {
        let columns = [{a: ""}]
        let newColumns = []
        if(data.length) {
            columns = Object.keys(data[0]).map(ColumnName => {

                let columnDefOption = {}

                columnDefs.map(c => {
                    if(ColumnName === c.field) {
                        columnDefOption = c;
                    }
                })
                ColOverrides.map(c => {
                    if(ColumnName === c.field) {
                        columnDefOption = {...columnDefOption, ...c};
                    }
                })
                let col = {
                    field: ColumnName,
                    enablePivot: true,
                    enableRowGroup: true,
                    ...columnDefOption
                }

                if(typeof data[0][ColumnName] === "number") {
                    col.enableValue = true
                    col.filter = 'agNumberColumnFilter'
                    col.cellStyle = { fontFamily: "Arial, sans-serif" }
                    col.type = 'rightAligned'
                }
                return col
            })
            columnDefs.map(c => {
                let isNewColumn = true
                columns.map(col => {
                    if(col.field === c.field) {
                        isNewColumn = false
                    }
                })
                if (isNewColumn) {
                    newColumns.push(c)
                }
            })
        }
        setColumnDefs([...columns, ...newColumns])
        setRowData(data)
        // applyColumnState()
    }, [data, ColOverrides]);

    // Example using Grid's API
    // const buttonListener = useCallback( e => {
    //     gridRef.current.api.deselectAll();
    // }, []);

    const statusBar = useMemo(() => {
        return {
            statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'agSelectedRowCountComponent' },
                { statusPanel: 'agAggregationComponent' },
            ],
        };
    }, []);

    const CustomCountRenderer = (props) => {
        const { value } = props;
        const count = value && value.length;

        return <span> count: {count}</span>
        // return <span>({count} items)</span>;
    }


    const saveColumnState = function () {
        if(gridRef.current.columnApi) {
            console.log("saveColumnState")
            if(id) {
                LS.set("GRID_COLUMN_STATE_" + id, gridRef.current.columnApi.getColumnState())
            }
        }
    }
    const applyColumnState = function () {
        if(gridRef.current.columnApi) {
            console.log("applyColumnState")
            let newVar = LS.get("GRID_COLUMN_STATE_" + id);
            if(newVar && gridRef.current && gridRef.current.columnApi) {
                gridRef.current.columnApi.applyColumnState({
                    state: newVar,
                    applyOrder: true,
                })
            }
        }
    }

    const onStateChange = function(event) {
        // Handle column state change
        // saveColumnState()
    }

    const autoGroupColumnDef = useMemo(() => {
        return {
            // headerName: 'My Group',
            // minWidth: 220,
            pinned: 'left',//force pinned left. Does not work in columnDef
            resizable: true,
            cellRendererParams: {
                suppressCount: true,
                // cellRendererFramework: CustomCountRenderer, // Custom cell renderer component
                // checkbox: true,
            },
        };
    }, []);


    // Example of consuming Grid Event
    const cellClickedListener = useCallback( event => {
        console.log('cellClicked', event);
    }, []);



    const onGridReady = function () {
        // applyColumnState()
    }
    const { token } = theme.useToken();


    const getMainMenuItems = function (params) {
        let field = params.column.getId();
        console.log(field, params)


        return [
            ...params.defaultItems,
            {
                // our own item with an icon
                name: 'Joe Abercrombie',
                action: () => {
                    console.log('He wrote a book');
                },
                icon:
                    '<img src="https://www.ag-grid.com/example-assets/lab.png" style="width: 14px;" />',
            },
            {
                // our own item with an icon
                name: 'Format to xxx,xxx.00',
                action: () => {
                    let newColumnsDefs = [...ColumnDefs]
                    newColumnsDefs.push({
                        field: field,
                        valueFormatter: formaterComify,
                        type: 'rightAligned'
                    })

                    setColOverrides(newColumnsDefs)
                    // console.log('He wrote a book');
                },
                icon: '<img src="https://www.ag-grid.com/example-assets/lab.png" style="width: 14px;" />',
            },
            {
                // our own item with an icon
                name: 'Reset Format',
                action: () => {
                    let newColumnsDefs = [...ColumnDefs]
                    newColumnsDefs.push({
                        field: field,
                        valueFormatter: params => params.value,
                        // type: 'leftAligned'
                    })

                    setColOverrides(newColumnsDefs)
                },
                icon:
                    '<img src="https://www.ag-grid.com/example-assets/lab.png" style="width: 14px;" />',
            },
        ]
        // return params.defaultItems;
    }
    return (
        <div>

            {/* Example using Grid's API */}
            {/*<button onClick={buttonListener}>Push Me</button>*/}

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-balham" style={{width: "100%", height: "90vh"}}>

                {/*<Space style={{paddingBottom: token.paddingXS}}>*/}
                {/*    <Button type="primary" onClick={saveColumnState}>Save</Button>*/}
                {/*    <Button onClick={applyColumnState}>apply</Button>*/}
                {/*</Space>*/}


                <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API

                    rowData={rowData} // Row Data for Rows
                    enableRangeSelection={true}
                    statusBar={statusBar}
                    sideBar={sideBar}

                    columnDefs={ColumnDefs} // Column Defs for Columns
                    defaultColDef={_defaultColDef} // Default Column Properties

                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection='multiple' // Options - allows click selection of rows
                    autoGroupColumnDef={autoGroupColumnDef}
                    onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                    groupDefaultExpanded={0}
                    onColumnMoved={onStateChange}
                    onFilterChanged={onStateChange}
                    onSortChanged={onStateChange}
                    onGridReady={onGridReady}
                    onRowDataUpdated={applyColumnState}
                    getMainMenuItems={getMainMenuItems}
                />
            </div>
        </div>
    );
}

function formaterComify(params) {
    return commify(params.value, 2)
}