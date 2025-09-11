import React, { useState, useEffect } from 'react';
import { TablePagination } from '@mui/material';
import { getAllCustomersAPI, getProductDetailsAPI } from '../../services/customersService';
import '../../App.css';
import '../../stylesheets/customers.css';
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TransactionsDialog from './transactionsDialog';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0); // zero-based page index
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalCount, setTotalCount] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    useEffect(() => {
        if(selectedTab == 'Customers'){
            getCustomers();
        }else if(selectedTab == 'Products'){
            getProducts();
        }
    }, [page, rowsPerPage, searchText]);

    const getCustomers = async () => {
        try {
            const response = await getAllCustomersAPI(page, rowsPerPage, searchText);
            console.log('Customers fetched:', response);
            setCustomers(response?.customers);
            setTotalCount(response.totalCount || 50); // Use actual total from API if available
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const getProducts = async () => {
        // Placeholder for fetching products logic
        console.log('Fetching products with search text:', searchText);
        try {
            const response = await getProductDetailsAPI(searchText);
            console.log('Products fetched:', response);
            
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    }

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
        setSelectedAccount(accountNo);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAccount(null);
    };

    const [selectedTab, setSelectedTab] = useState('Customers');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="container my-4">
            <div className="tabsContainers">
                <div id="13399" className={`tab-common ${selectedTab === "Customers" ? 'activetabs' : 'tabSections'}`}
                    onClick={() => handleTabClick('Customers')} >
                    <span id="doc">Customers</span></div>
                <div id="13400" className={`tab-common ${selectedTab === "Products" ? 'activetabs' : 'tabSections'}`}
                    onClick={() => handleTabClick('Products')}>
                    <span id="pat">Products</span></div>
                <div className="ml-auto flex-1 max-w-md"></div>
            </div>
            {
                selectedTab === 'Customers' && (
                    <div className="row mt-2">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name..."
                                value={searchText}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>User Name</th>
                                        <th>Email</th>
                                        <th>Accounts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <tr key={customer._id}>
                                                <td>{customer.name}</td>
                                                <td>{customer.address}</td>
                                                <td>{customer.username}</td>
                                                <td>{customer.email}</td>
                                                <td>
                                                    {customer.accounts.map((account, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-1">
                                                            <span>{account}</span>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDialog(account)}
                                                            >
                                                                <InfoIcon fontSize="small" />
                                                            </IconButton>
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No customers found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <TransactionsDialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                accountNo={selectedAccount}
                            />
                        </div>

                        <TablePagination
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[20, 50, 100]}
                        />
                    </div>
                )
            }
            {
                selectedTab === 'Products' && (
                    <div className="row mt-2">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name..."
                                value={searchText}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                )
            }



        </div>
    );
};

export default Customers;
