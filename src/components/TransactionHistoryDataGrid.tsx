import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowsProp} from "@material-ui/data-grid";
import {getTransactionHistory} from "../api";
import {TransactionMapper} from "../types/tokens";

export const TransactionHistoryDataGrid = () => {
    const [rows, setRows] = useState<GridRowsProp>([]);

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 150},
        {field: 'transactionType', headerName: 'Transaction type', width: 200},
        {field: 'amount', headerName: 'Amount in pence', width: 250},
        {field: 'date', headerName: 'Date', width: 250},
    ];

    useEffect(() => {
        let mounted = true;

        getTransactionHistory().then(response => {
            if (mounted) {
                setRows(response.map((t: any) => TransactionMapper(t)));
            }
        }).catch(error => {
            console.log(error);
        });

        return () => {
            mounted = false;
        }
    }, []);

    return <div style={{height: 300, width: '100%'}}>
        <DataGrid rows={rows} columns={columns}/>
    </div>
}
