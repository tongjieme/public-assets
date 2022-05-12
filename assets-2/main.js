const columnDefs = [
    {  enableRowGroup: true, field: "name" ,},
    {  enableRowGroup: true, field: "device" ,},
    {  enableRowGroup: true, field: "ip" , aggFunc: params => {
            return [...new Set(params.values)].length;
        }},
    {  enableRowGroup: true, field: "referer" , },
    {  enableRowGroup: true, field: "CreatedAt" , },
];

// specify the data
const rowData = [

];

// let the grid know which columns and what data to use
const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,

    defaultColDef: {
        flex: 1,
        minWidth: 100,
        filter: true,
        resizable: true,
        sortable: true,
        allowedAggFuncs: ['sum', 'min', 'max', 'random'],
    },
    animateRows: true,
    enableRangeSelection: true,
    // pivotMode: true,
    // pivotPanelShow: "always",
    rowSelection: 'multiple',
    statusBar: {
        statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agTotalRowCountComponent', align: 'center' },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
            { statusPanel: 'agAggregationComponent' },
        ],
    },
    sideBar: {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
            },
            {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
            },
        ],
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    window.Grid = new agGrid.Grid(gridDiv, gridOptions);
});

$(function(){
    $(".J-search").on("click", function (e) {
        let startDate = $("#startDate").val();
        let endDate = $("#endDate").val();
        $.ajax({
            url: "/api/eventSearch",
            type: 'post',
            data: {
                "days": 0,
                "startDate": startDate,
                "endDate": endDate,
                "includeDetailList": $("#includeDetailList").is(":checked")
            },
            dataType: 'json',
            timeout: 20e3,
            success: function(e) {
                Grid.gridOptions.api.setRowData(e.detailList)
                Grid.gridOptions.api.sizeColumnsToFit();
            }
        });
    })

    $(".J-save-states").on("click", function (e) {
        var states = Grid.gridOptions.columnApi.getColumnState();
        localStorage.setItem("states", JSON.stringify(states))
    })
    $(".J-restore-states").on("click", function (e) {
        var states = JSON.parse(localStorage.getItem("states"))
        Grid.gridOptions.columnApi.applyColumnState({
            state: states,
            applyOrder: true,
        });
    })
    $(".J-reset-states").on("click", function (e) {
        Grid.gridOptions.columnApi.resetState()
    })

});
