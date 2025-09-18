import React, { useState, useEffect, useCallback } from 'react';
import '../../App.css';
import '../../stylesheets/airbnb.css';
import { getAllAirbnbListingsAPI } from '../../services/airbnbService';
import { 
    TablePagination, 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Box, 
    Grid, 
    Chip, 
    Rating, 
    Avatar,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    Paper,
    Fab,
    Zoom,
    IconButton,
    Drawer,
    Slider,
    Button,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Search, LocationOn, Bed, Bathroom, People, Star, KeyboardArrowUp, FilterList } from '@mui/icons-material';

const Airbnb = () => {

    const [airbnb, setAirbnb] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [totalCount, setTotalCount] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [imageErrors, setImageErrors] = useState({});
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [scrollTimeout, setScrollTimeout] = useState(null);
    const [isRequestInProgress, setIsRequestInProgress] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    
    // Filter states
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterSearchText, setFilterSearchText] = useState('');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [minimumRating, setMinimumRating] = useState(0);
    const [filterTrigger, setFilterTrigger] = useState(0);
    
    // Applied filter states (these are sent to API)
    const [appliedSearchText, setAppliedSearchText] = useState('');
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, 5000]);
    const [appliedMinimumRating, setAppliedMinimumRating] = useState(0);


    // Fetch data when pageNo, pageSize, searchText, priceRange, minimumRating, or filterTrigger changes
    useEffect(() => {
        const fetchAirbnb = async (isLoadMore = false) => {
            try {
                // Prevent multiple simultaneous requests
                if (isLoadMore && isRequestInProgress) {
                    console.log('Request already in progress, skipping...');
                    return;
                }

                if (isLoadMore) {
                    setIsLoadingMore(true);
                    setIsRequestInProgress(true);
                } else {
                    setLoading(true);
                    // Clear existing data only on initial load or search change
                    setAirbnb([]);
                }
                setError(null);
                
                const response = await getAllAirbnbListingsAPI(pageNo, pageSize, appliedSearchText, appliedPriceRange, appliedMinimumRating);
                console.log('API Response:', response);
                
                // Handle the API response structure
                if (response && response.listings) {
                    if (isLoadMore) {
                        setAirbnb(prev => [...prev, ...response.listings]);
                    } else {
                        setAirbnb(response.listings);
                    }
                    setTotalCount(response.totalCount || response.total || response.listings.length);
                    
                    // Check if there's more data
                    const currentTotal = isLoadMore ? airbnb.length + response.listings.length : response.listings.length;
                    setHasMoreData(currentTotal < (response.totalCount || response.total || response.listings.length));
                } else if (Array.isArray(response)) {
                    if (isLoadMore) {
                        setAirbnb(prev => [...prev, ...response]);
                    } else {
                setAirbnb(response);
                    }
                    setTotalCount(response.length);
                    setHasMoreData(response.length === pageSize);
                } else {
                    if (!isLoadMore) {
                        setAirbnb([]);
                        setTotalCount(0);
                    }
                    setHasMoreData(false);
                }
            } catch (error) {
                setError(error);
            } finally {
                if (isLoadMore) {
                    setIsLoadingMore(false);
                    setIsRequestInProgress(false);
                } else {
                setLoading(false);
                }
            }
        }

        // Determine if this is a load more operation
        const isLoadMore = pageNo > 0 && airbnb.length > 0;
        fetchAirbnb(isLoadMore);
    }, [pageNo, pageSize, appliedSearchText, appliedPriceRange, appliedMinimumRating, filterTrigger]);

    // Infinite scroll effect with debouncing
    useEffect(() => {
        const handleScroll = () => {
            // Clear existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Set new timeout to debounce scroll events
            const timeout = setTimeout(() => {
                const scrollTop = document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = document.documentElement.clientHeight;
                
                // Only trigger when user is within 200px of the bottom
                const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;
                
                if (isNearBottom && hasMoreData && !isLoadingMore && !loading && !isRequestInProgress) {
                    setPageNo(prev => prev + 1);
                }
            }, 100); // 100ms debounce

            setScrollTimeout(timeout);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, [hasMoreData, isLoadingMore, loading, scrollTimeout, isRequestInProgress]);

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = document.documentElement.scrollTop;
            // Show button when scrolled down more than 300px
            setShowScrollToTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Filter functions
    const handleFilterOpen = () => {
        setFilterOpen(true);
    };

    const handleFilterClose = () => {
        setFilterOpen(false);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };


    const handleFilterSearch = () => {
        // Apply all filter values
        setAppliedSearchText(filterSearchText);
        setAppliedPriceRange(priceRange);
        setAppliedMinimumRating(minimumRating);
        setPageNo(0); // Reset to first page
        setFilterOpen(false);
        // Trigger API call by updating filter trigger
        setFilterTrigger(prev => prev + 1);
    };

    const handleFilterClear = () => {
        // Clear filter input values
        setFilterSearchText('');
        setPriceRange([0, 5000]);
        setMinimumRating(0);
        
        // Clear applied filter values
        setAppliedSearchText('');
        setAppliedPriceRange([0, 5000]);
        setAppliedMinimumRating(0);
        
        setPageNo(0); // Reset to first page
        setFilterOpen(false);
        // Trigger API call by updating filter trigger
        setFilterTrigger(prev => prev + 1);
    };

    // Helper function to format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    // Helper function to get image URL
    const getImageUrl = (images) => {
        if (!images) return '/images/airbnbsample.jpg';
        
        const imageUrl = images.picture_url || images.medium_url || images.thumbnail_url || '';
        
        // If no image URL is found, use the fallback image
        if (!imageUrl || imageUrl.trim() === '') {
            return '/images/airbnbsample.jpg';
        }
        
        return imageUrl;
    };

    // Helper function to format date
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString();
    };

    // Helper function to handle image loading errors
    const handleImageError = (listingId) => {
        setImageErrors(prev => ({
            ...prev,
            [listingId]: true
        }));
    };

    // Helper function to get image URL with error handling
    const getImageUrlWithFallback = (images, listingId) => {
        // If this image has failed to load before, use fallback immediately
        if (imageErrors[listingId]) {
            return '/images/airbnbsample.jpg';
        }
        
        return getImageUrl(images);
    };
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        🏠 Airbnb Listings
                    </Typography>
                    
                    {/* Filter Icon */}
                    <IconButton
                        onClick={handleFilterOpen}
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            }
                        }}
                        aria-label="filter"
                    >
                        <FilterList />
                    </IconButton>
                </Box>
            </Paper>

            {/* Loading State */}
            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ ml: 2 }}>Loading listings...</Typography>
                </Box>
            )}
            
            {/* Error State */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error loading listings: {error.message}
                </Alert>
            )}
            
            {/* Listings Grid */}
            {!loading && !error && (
                <div className="row g-3 mb-3">
                    {airbnb.map((listing) => (
                        <div 
                            className="col-xs-12 col-sm-12 col-md-6 col-lg-4"
                            key={listing._id}
                        >
                            <Card 
                                className="airbnb-card"
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                {/* Property Image */}
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={getImageUrlWithFallback(listing.images, listing._id)}
                                    alt={listing.name}
                                    onError={() => handleImageError(listing._id)}
                                    sx={{ objectFit: 'cover' }}
                                />
                                
                                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                    {/* Price */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            {formatPrice(listing.price)}
                                        </Typography>
                                        <Box display="flex" alignItems="center">
                                            <Star sx={{ color: '#ffc107', fontSize: 18, mr: 0.5 }} />
                                            <Typography variant="body2">
                                                {listing.review_scores?.review_scores_rating ? 
                                                    (listing.review_scores.review_scores_rating / 20).toFixed(1) : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Property Name */}
                                    <Typography variant="h6" component="h3" className="property-name" gutterBottom sx={{ 
                                        fontWeight: 'bold'
                                    }}>
                                        {listing.name}
                                    </Typography>

                                    {/* Location */}
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {listing.address?.suburb || listing.address?.street || 'Location not specified'}
                                        </Typography>
                                    </Box>

                                    {/* Property Details */}
                                    <Box className="card-details">
                                        <Box display="flex" alignItems="center">
                                            <People sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                                            <Typography variant="body2">{listing.accommodates}</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <Bed sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                                            <Typography variant="body2">{listing.bedrooms}</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <Bathroom sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                                            <Typography variant="body2">{listing.bathrooms}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Property Type & Room Type */}
                                    <Box className="card-chips">
                                        <Chip 
                                            label={listing.property_type} 
                                            size="small" 
                                            variant="outlined" 
                                            color="primary"
                                        />
                                        <Chip 
                                            label={listing.room_type} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </Box>

                                    {/* Host Info */}
                                    <Box className="card-host">
                                        <Box display="flex" alignItems="center">
                                            <Avatar 
                                                src={listing.host?.host_thumbnail_url} 
                                                sx={{ width: 24, height: 24, mr: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {listing.host?.host_name || 'Host'}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {listing.number_of_reviews} reviews
                                        </Typography>
                                    </Box>

                                    {/* Cancellation Policy */}
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        {listing.cancellation_policy?.replace(/_/g, ' ').toUpperCase()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
        </div>
            )}

            {/* Loading More Indicator */}
            {isLoadingMore && (
                <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ ml: 2 }}>Loading more listings...</Typography>
                </Box>
            )}

            {/* No Results */}
            {!loading && !error && airbnb.length === 0 && (
                <Box textAlign="center" py={8}>
                    <Typography variant="h5" color="text.secondary">
                        No listings found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Try adjusting your search criteria
                    </Typography>
                </Box>
            )}

            {/* End of Results */}
            {!loading && !error && airbnb.length > 0 && !hasMoreData && (
                <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary">
                        You've reached the end of the listings
                    </Typography>
                </Box>
            )}

            {/* Filter Overlay Drawer */}
            <Drawer
                anchor="right"
                open={filterOpen}
                onClose={handleFilterClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 400,
                        padding: 3,
                    },
                }}
            >
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Filters
                    </Typography>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    {/* Search Input */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Search
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search listings by name, location, or amenities..."
                            value={filterSearchText}
                            onChange={(e) => setFilterSearchText(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    
                    {/* Price Range Slider */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Price Range
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            ${priceRange[0]} - ${priceRange[1]} USD
                        </Typography>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={5000}
                            step={100}
                            marks={[
                                { value: 0, label: '$0' },
                                { value: 2500, label: '$2,500' },
                                { value: 5000, label: '$5,000' }
                            ]}
                            sx={{
                                color: '#1976d2',
                                '& .MuiSlider-thumb': {
                                    backgroundColor: '#1976d2',
                                },
                                '& .MuiSlider-track': {
                                    backgroundColor: '#1976d2',
                                },
                                '& .MuiSlider-rail': {
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                        />
                    </Box>
                    
                    {/* Minimum Rating Select */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Minimum Rating
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Rating</InputLabel>
                            <Select
                                value={minimumRating}
                                label="Rating"
                                onChange={(e) => setMinimumRating(e.target.value)}
                            >
                                <MenuItem value={0}>Any rating</MenuItem>
                                <MenuItem value={1}>1+ stars</MenuItem>
                                <MenuItem value={2}>2+ stars</MenuItem>
                                <MenuItem value={3}>3+ stars</MenuItem>
                                <MenuItem value={4}>4+ stars</MenuItem>
                                <MenuItem value={5}>5 stars only</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
                    {/* Action Buttons */}
                    <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleFilterClear}
                            sx={{ flex: 1 }}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleFilterSearch}
                            sx={{ flex: 1, backgroundColor: '#1976d2' }}
                        >
                            Search
                        </Button>
                    </Box>
                </Box>
            </Drawer>

            {/* Floating Scroll to Top Button */}
            <Zoom in={showScrollToTop}>
                <Fab
                    color="primary"
                    size="medium"
                    onClick={scrollToTop}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        boxShadow: 3,
                        '&:hover': {
                            boxShadow: 6,
                            transform: 'scale(1.1)'
                        },
                        transition: 'all 0.3s ease-in-out'
                    }}
                    aria-label="scroll to top"
                >
                    <KeyboardArrowUp />
                </Fab>
            </Zoom>
        </Box>
    )
}

export default Airbnb;