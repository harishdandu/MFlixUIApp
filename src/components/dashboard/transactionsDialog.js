import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    IconButton,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Chip,
    Avatar
} from '@mui/material';
import { 
    Close as CloseIcon,
    AccountBalance,
    TrendingUp,
    TrendingDown,
    Receipt,
    ArrowUpward,
    ArrowDownward
} from '@mui/icons-material';
import { transactionsByAccountNoAPI } from '../../services/customersService';

const TransactionsDialog = ({ open, onClose, accountNo }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    useEffect(() => {
        if (open && accountNo) {
            fetchTransactions(accountNo);
        }
    }, [open, accountNo]);

    const fetchTransactions = async (accountNo) => {
        try {
            setLoading(true);
            setError(null);
            const response = await transactionsByAccountNoAPI(accountNo);
            setTransactions(response.transactions || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to fetch transactions. Please try again.');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date (date only, no time)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    // Helper function to format amount
    const formatAmount = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Helper function to get transaction type color
    const getTransactionTypeColor = (code) => {
        if (!code) return 'default';
        const codeStr = code.toString().toLowerCase();
        if (codeStr.includes('credit') || codeStr.includes('deposit')) return 'success';
        if (codeStr.includes('debit') || codeStr.includes('withdraw')) return 'error';
        return 'primary';
    };

    // Helper function to get transaction type icon
    const getTransactionTypeIcon = (code) => {
        if (!code) return <Receipt />;
        const codeStr = code.toString().toLowerCase();
        if (codeStr.includes('credit') || codeStr.includes('deposit')) return <TrendingUp />;
        if (codeStr.includes('debit') || codeStr.includes('withdraw')) return <TrendingDown />;
        return <Receipt />;
    };

    // Function to handle date sorting
    const handleSortByDate = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    // Get sorted transactions
    const getSortedTransactions = () => {
        if (!transactions.length) return [];
        
        return [...transactions].sort((a, b) => {
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);
            
            if (sortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                pb: 2,
                borderBottom: '1px solid #e0e0e0'
            }}>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                    <AccountBalance />
                </Avatar>
                <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Account Transactions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Account Number: {accountNo}
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ 
                        position: 'absolute', 
                        right: 16, 
                        top: 16,
                        '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={40} />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ m: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="transactions table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell 
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#e9ecef' }
                                        }}
                                        onClick={handleSortByDate}
                                    >
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                '& .sort-icon': {
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s ease-in-out'
                                                },
                                                '&:hover .sort-icon': {
                                                    opacity: 1
                                                }
                                            }}
                                        >
                                            Date
                                            <Box className="sort-icon">
                                                {sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Transaction Code</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getSortedTransactions().length > 0 ? (
                                    getSortedTransactions().map((txn, index) => (
                                        <TableRow 
                                            key={index}
                                            sx={{ 
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:hover': { backgroundColor: '#f8f9fa' }
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {formatDate(txn.date)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={txn.transaction_code || 'N/A'}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ fontSize: '0.75rem' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {getTransactionTypeIcon(txn.transaction_code)}
                                                    <Typography variant="body2">
                                                        {txn.transaction_code || 'Unknown'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 'bold',
                                                        color: getTransactionTypeColor(txn.transaction_code) === 'success' 
                                                            ? '#2e7d32' 
                                                            : getTransactionTypeColor(txn.transaction_code) === 'error'
                                                            ? '#d32f2f'
                                                            : '#1976d2'
                                                    }}
                                                >
                                                    {formatAmount(txn.amount)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                    No transactions found
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    This account has no transaction history.
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TransactionsDialog;
