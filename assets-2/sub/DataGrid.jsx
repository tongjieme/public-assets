if (gridRef.current.api) {
                        let columns = gridRef.current.api.getColumnDefs();
                        let _columnsDefs = columns.map(colDef => {
                            if (colDef.field === field){
                                colDef.valueFormatter = formaterComify
                                colDef.type = "rightAligned"
                                colDef.valueGetter = getIfNumber(field)
                                colDef.filter = "agNumberColumnFilter"
                                colDef.cellStyle = { fontFamily: "Arial, sans-serif" }
                            }
                            return colDef
                        });
                        setColumnDefs(_columnsDefs)
                    }
