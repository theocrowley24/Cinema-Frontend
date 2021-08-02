export interface Transaction {
    id: number,
    transactionType: string,
    amount: number,
    date: Date
}

export const TransactionMapper = (data: any): Transaction => {
    const date = new Date(data?.date.secs_since_epoch * 1000);

    return {
        amount: data?.amount,
        date,
        id: data?.id,
        transactionType: data?.transaction_type
    }
}
