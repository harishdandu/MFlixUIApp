import React, { useState, useEffect } from 'react';
import '../../App.css';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import "../../stylesheets/header.css";

const Header = ({handleComponentSelect}) => {

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        navigate('/User');
    };

    const changePassword = () => {
        handleClose();
        sessionStorage.setItem("activeLink", "ChangePassword");
        navigate('/Dashboard/ChangePassword');
        handleComponentSelect('ChangePassword');
    };

    return (
        <div className="row">
            <Card className="px-0 py-1 fixed top-0 w-100 rounded-0" id="m-card">
                <div className="container-fluid">
                    <div className="row p-0">
                        <div className="col-12 d-flex align-items-center justify-content-between">
                            
                            {/* Logo Section */}
                            <div className="d-flex align-items-center">
                                <div className="px-2">
                                    <img src="/images/ciana.png" id="archents-logo" className="cianalogoimage h-10" alt="user-logo" />
                                </div>
                            </div>

                            {/* User Profile Section */}
                            <div className="d-flex align-items-center">
                                <div className="border-start mx-3" style={{ height: '40px' }}></div>

                                <div className="d-flex align-items-center">
                                    <div id="u-pic" style={{ cursor: 'pointer' }}>
                                        <img src="/images/user.jpg" className="userimage h-8 rounded" id="profile" alt="user-img" />
                                    </div>

                                    <div className="position-relative">
                                        <IconButton
                                            aria-controls="simple-menu"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <ArrowDropDownIcon id="md-arrow" />
                                        </IconButton>

                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={changePassword} id="changePassword">
                                                Change Password
                                            </MenuItem>

                                            <MenuItem onClick={logout} id="logout">
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Header;