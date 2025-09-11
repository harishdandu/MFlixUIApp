import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { transactionsByAccountNoAPI } from '../../services/customersService'; // Adjust path accordingly

const TransactionsDialog = ({ open, onClose, accountNo }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (open && accountNo) {
            fetchTransactions(accountNo);
        }
    }, [open, accountNo]);

    const fetchTransactions = async (accountNo) => {
        try {
            const response = await transactionsByAccountNoAPI(accountNo);
            setTransactions(response.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Transactions for Account {accountNo}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {transactions.length > 0 ? (
                    <ul>
                        {transactions.map((txn, index) => (
                            <li key={index}>
                                <strong>Date:</strong> {txn.date} | <strong>Amount:</strong> {txn.amount} | <strong>Code:</strong> {txn.transaction_code}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No transactions found.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TransactionsDialog;
