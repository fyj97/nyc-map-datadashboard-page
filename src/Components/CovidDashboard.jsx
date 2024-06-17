// CovidDashboard.jsx
import React, { useState, useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info';

import {
            Box,
            Typography, 
            Divider,
            Paper, 
            Grid, 
            TextField, 
            Button, 
            Autocomplete, 
            Snackbar,
            CircularProgress,
            Tooltip, 
            Alert} from '@mui/material';

const CovidDashboard = ({neighborData, selectedRegion}) => {

    let neighborFeatures = neighborData.features;

    // Create an empty object to store unique zipcodes as keys
    const neighborhoodBasicInfo = [];

    const zipcodeSet = new Set();

    // Map neighborData into features array
    neighborFeatures.map((feature) => {
        const zipcode = feature.properties.postalCode;

        if (!zipcodeSet.has(zipcode)) {
            // Add the zipcode to the set to mark it as seen
            zipcodeSet.add(zipcode);
            // Add the entry to the array
            neighborhoodBasicInfo.push({zipcode:zipcode,
                                        feature:feature});
          }
    });

    const [selectedData, setSelectedData] = useState(null);

    // Handle the change of input address by user
    const [locationInput, setLocationInput] = useState(null);
    const [autocompleteInput, setAutocompleteInput] = useState(null);

    // Handle the loading effects
    const [loading, setLoading] = useState(false);

    // Handle date state selection
    const [selectedDate, setSelectedDate] = useState("");

    // Handle undefined data fetch notification
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };

    const handleLocationInputChange = (event, value) => {
        console.log("User selected a zipcode from option list: "+String(value));
        setAutocompleteInput(value);
    };

    // Simulate fetching data based on the input (replace with actual API call)
    const handleFetchData = () => {
        setLoading(true);

        let headers = {
            "Content-Type": "text/plain"
        }
        
        const apiEndpoint = `https://ditectlab.civil.columbia.edu/covid/zipcode_dates/?date=${encodeURIComponent(selectedDate)}&zip_code=${encodeURIComponent(autocompleteInput)}`;
            
        console.log(apiEndpoint)

        try{
            // Make the API call
            fetch(apiEndpoint, {
                mode: 'cors',
                method: 'GET',
                headers: headers,
                })
                .then((response) => response.json())
                .then(
                    setTimeout(() => {
                        setLoading(false);
                    }, 2000)
                )
                .then((data) => {
                    if (data.length > 0) {
                        console.log("Fetched Result: ");
                        console.log(data);
                        setSelectedData(data[0]);
                    } else {
                        setSelectedData(null);
                        setSnackbarOpen(true);
                    }
                })
                } catch (error) {
                    console.log(error);
                    setLoading(true);
                } 
    };

    useEffect(() => {
        // Update the state when selectedRegion changes
        if (selectedRegion) {
            console.log("User clicked a region on the map and passed a zipcode: "+selectedRegion.properties.postalCode);
            setLocationInput(selectedRegion.properties.postalCode);
            setAutocompleteInput(selectedRegion.properties.postalCode);
            //handleFetchData();
        }
      }, [selectedRegion]);
    
    const errorDataNotification = (
        <div>
            <Box>
                <Alert severity="info">No data avaliable, please use filters above.</Alert>
            </Box>
        </div>
    )
    
    const noDataView = (
        <div>
            <Typography >
                <InfoIcon/>
                    No data avaliable
            </Typography>
        </div>
    )
    var dataView = !selectedData ? errorDataNotification : 
        Object.entries(selectedData).map(([title, data]) => (
            <React.Fragment key={title}>
                <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="body1" sx={{ alignContent: 'left', color: '#000000' }}>
                    {String(title)}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1">{data}</Typography>
                </Grid>
                </Grid>
                <Divider/>
            </React.Fragment>))

    return (
        <Box style={{ background: '#f2f6fc'}}>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper elevation={0} style={{ padding: '20px' }}>
                            <Typography variant="h6">COVID-19 Dashboard</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            id="autocomplete-address-bar"
                            // calling the freeSolo prop inside the Autocomplete component
                            freeSolo
                            options={neighborhoodBasicInfo.map((entry) => {
                                const optionString = `${entry.zipcode}`;
                                return optionString})}
                            //getOptionLabel={(info) => info.label.BOROUGH+" "+info.label.GEOCODE+": "+info.label.GEONAME}
                            value={locationInput}
                            onChange={handleLocationInputChange}
                            renderInput={(params) => <TextField {...params} 
                                        label="Enter a zipcode"
                                        fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Tooltip title="Select Date" arrow>
                            <TextField
                                id="date"
                                label="Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{
                                shrink: true,
                                }}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                variant="outlined"
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" 
                                color="primary" 
                                onClick={handleFetchData}
                                disabled={!selectedDate}>
                        Get Data
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        {loading && <CircularProgress color="primary"/>}
                    </Grid>
                </Grid>
            </Paper>
            
            {!loading && (
                <div>
                    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                        {dataView}
                    </Paper>

                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={4000}
                        onClose={handleSnackbarClose}
                        message="No data returned from the API."
                        severity="warning"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    />
                </div>
            )}
        </Box>
    );
};

export default CovidDashboard;
