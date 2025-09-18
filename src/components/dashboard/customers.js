import React, { useState, useEffect } from 'react';
import { 
    TablePagination,
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Avatar,
    CircularProgress,
    Alert,
    Paper,
    Tabs,
    Tab,
    Grid,
    Divider,
    Tooltip,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { 
    Search, 
    Info as InfoIcon, 
    Person, 
    Email, 
    LocationOn, 
    AccountBalance,
    Visibility,
    People
} from '@mui/icons-material';
import { getAllCustomersAPI, getProductDetailsAPI } from '../../services/customersService';
import '../../App.css';
import '../../stylesheets/customers.css';
import TransactionsDialog from './transactionsDialog';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0); // zero-based page index
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalCount, setTotalCount] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('Customers');
    const [searchProductText, setSearchProductText] = useState('');
    const [debouncedSearchProductText, setDebouncedSearchProductText] = useState('');
    const [products, setProducts] = useState([]);

    // Debounce function for products search text
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchProductText(searchProductText);
        }, 1000); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchProductText]);

    useEffect(() => {
        if(selectedTab == 'Customers'){
            getCustomers();
        }else if(selectedTab == 'Products'){
            getProducts();
        }
    }, [page, rowsPerPage, searchText, debouncedSearchProductText]);

    const getCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllCustomersAPI(page, rowsPerPage, searchText);
            console.log('Customers fetched:', response);
            setCustomers(response?.customers || []);
            setTotalCount(response.totalCount || 50); // Use actual total from API if available
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to fetch customers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProductDetailsAPI(page, rowsPerPage, debouncedSearchProductText);
            console.log('Products fetched:', JSON.stringify(response));
            if(response.statusCode == "S"){
                setProducts(response.products || []);
                setTotalCount(response.totalCount || 0);
            }
            else{
                setProducts([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products. Please try again.');
            setProducts([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }

    const handleSearchProductChange = (e) => {
        setSearchProductText(e.target.value);
        setPage(0);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = (accountNo) => {
        // debugger;
        setSelectedAccount(accountNo);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAccount(null);
    };

    

    const handleTabClick = (tab) => {
        setPage(0);
        setSearchText('');
        setSearchProductText('');
        setDebouncedSearchProductText('');
        setRowsPerPage(20);
        setProducts([]);
        setSelectedTab(tab);
    };

    return (
        <Box sx={{ px: 2, py: 1}}>

            {/* Tabs Section */}
            <Tabs 
                value={selectedTab} 
                onChange={(e, newValue) => handleTabClick(newValue)}
                sx={{ 
                    mb: 1,
                    '& .MuiTab-root': { 
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem'
                    }
                }}
            >
                <Tab 
                    label="Customers" 
                    value="Customers"
                    icon={<People />}
                    iconPosition="start"
                />
                <Tab 
                    label="Products" 
                    value="Products"
                    icon={<AccountBalance />}
                    iconPosition="start"
                />
            </Tabs>

            {selectedTab === 'Customers' && (
                <Box>
                    {/* Search Section */}
                    <Paper sx={{ p: 0, mb: 1, borderRadius: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search customers by name, email, or username..."
                                value={searchText}
                                onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Paper>

                    {/* Error Display */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={40} />
                        </Box>
                    )}

                    {/* Customers Table */}
                    {!loading && !error && (
                        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="customers table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Customer</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Contact</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Address</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Accounts</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <TableRow 
                                                key={customer._id}
                                                sx={{ 
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    '&:hover': { backgroundColor: '#f8f9fa' }
                                                }}
                                            >
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar 
                                                            sx={{ 
                                                                bgcolor: '#1976d2',
                                                                width: 40,
                                                                height: 40,
                                                                mr: 2,
                                                                fontSize: '1rem',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                {customer.name || 'N/A'}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                @{customer.username || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                            <Email sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                                                            <Typography variant="body2">
                                                                {customer.email || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                                                        <Typography variant="body2">
                                                            {customer.address || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {customer.accounts?.map((account, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={account}
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                                clickable
                                                                onClick={() => handleOpenDialog(account)}
                                                                sx={{ 
                                                                    fontSize: '0.75rem',
                                                                    cursor: 'pointer',
                                                                    '&:hover': {
                                                                        backgroundColor: '#e3f2fd',
                                                                        borderColor: '#1976d2'
                                                                    }
                                                                }}
                                                            />
                                                        )) || (
                                                            <Typography variant="body2" color="text.secondary">
                                                                No accounts
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <People sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                                        No customers found
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Try adjusting your search criteria or check back later.
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Pagination */}
                    {!loading && !error && customers.length > 0 && (
                        <Paper sx={{ mt: 3, borderRadius: 2 }}>
                        <TablePagination
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[20, 50, 100]}
                                labelRowsPerPage="Customers per page:"
                                sx={{
                                    '& .MuiTablePagination-toolbar': {
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                    }
                                }}
                            />
                        </Paper>
                    )}

                </Box>
            )}

            {selectedTab === 'Products' && (
                <Box>
                    {/* Search Section */}
                    <Paper sx={{ p: 0, mb: 1, borderRadius: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search products by name or email..."
                            value={searchProductText}
                            onChange={handleSearchProductChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Paper>

                    {/* Error Display */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={40} />
                        </Box>
                    )}

                    {/* Products Table */}
                    {!loading && !error && (
                        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="products table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Account ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Product</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.length > 0 ? (
                                        products.map((product, index) => (
                                            <TableRow 
                                                key={index}
                                                sx={{ 
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    '&:hover': { backgroundColor: '#f8f9fa' }
                                                }}
                                            >
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {product.name || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Email sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                                                        <Typography variant="body2">
                                                            {product.email || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={product.account_id || 'N/A'}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        clickable
                                                        onClick={() => handleOpenDialog(product.account_id)}
                                                        sx={{ 
                                                            fontSize: '0.75rem',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                backgroundColor: '#e3f2fd',
                                                                borderColor: '#1976d2'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={product.product || 'N/A'}
                                                        size="small"
                                                        variant="filled"
                                                        color="secondary"
                                                        sx={{ fontSize: '0.75rem' }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <AccountBalance sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                                        No products found
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Try adjusting your search criteria or check back later.
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Pagination */}
                    {!loading && !error && products.length > 0 && (
                        <Paper sx={{ mt: 3, borderRadius: 2 }}>
                            <TablePagination
                                component="div"
                                count={totalCount}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[20, 50, 100]}
                                labelRowsPerPage="Products per page:"
                                sx={{
                                    '& .MuiTablePagination-toolbar': {
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                    }
                                }}
                            />
                        </Paper>
                    )}
                </Box>
            )}

            {/* Transactions Dialog - Available for both tabs */}
            <TransactionsDialog
                open={openDialog}
                onClose={handleCloseDialog}
                accountNo={selectedAccount}
            />
        </Box>
    );
};

export default Customers;
