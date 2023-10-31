if (gridRef.current.api) {
                        let columns = gridRef.current.api.getColumnDefs();
                        let _columnsDefs = columns.map(colDef => {
                            if (colDef.field === field){
                                colDef.valueFormatter = formaterComify
                                colDef.type = "rightAligned"
                            }
                            return colDef
                        });
                        setColumnDefs(_columnsDefs)
                    }
