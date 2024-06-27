import React, { useState } from 'react';
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
} from '@mui/material';

const WeatherDashboard = () => {
  // Dummy data for autocomplete options
  const locations = [
    { label: 'New York, NY' },
    // { label: 'Brooklyn, NY' },
    // { label: 'Queens, NY' },
    // { label: 'Staten Island, NY'},
    // { label: 'Bronx, NY'}
    // Add more locations as needed
  ];

// maps location to unique id

 let locId = new Map();

 locId.set('New York, NY', 'GHCND:USW00094728')
//  locId.set('Brooklyn, NY', 'GHCND:USC00300958');
//  locId.set('Queens, NY', 'GHCND:US1NYQN0027');
//  locId.set('Staten Island, NY', 'GHCND:US1NYRC0001');
//  locId.set('Bronx, NY', 'GHCND:USC00300961');

  // State for selected location and date
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  // const [error, setError] = useState(null);

  const apiKey = 'AmOsARuHzfwAOlHufYEEFaWzfwWkzXuf'; // Replace with your actual API token

  const findValueByDatatype = (data, datatype) => {
    const entry = data.results.find(result => result.datatype === datatype);
    return entry ? entry.value : "N/A"; // Return value if entry found, otherwise null
  };

  // Function to handle button click
  const handleFetchData = async () => {
    try {
      const locationId = locId.get(selectedLocation.label);

      if (!locationId || !selectedDate) {
        console.error('Location or date not selected');
        return;
      }

      const url = `https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=${encodeURIComponent(locationId)}&startdate=${encodeURIComponent(selectedDate)}&enddate=${encodeURIComponent(selectedDate)}&units=standard&limit=100`;


      console.log(url);
      const response = await fetch(url, {
        mode: 'cors',
        method: 'GET',
        headers: {
          token: apiKey
        }
      });
      const data = await response.json();
      console.log(data);
      if(data.results) {
        console.log('test')
        setWeatherData(data);
      }

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <Box style={{ background: '#f2f6fc' }}>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={0} style={{ padding: '20px' }}>
                        <Typography variant="h6">NYC Weather Dashboard</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Autocomplete
                        options={locations}
                        getOptionLabel={(option) => option.label}
                        value = {selectedLocation}
                        onChange={(e, value) => {
                          setSelectedLocation(value)
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Location"
                            fullWidth
                        />)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        id="date"
                        label="Select Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                        shrink: true,
                        }}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleFetchData}>
                        Fetch Data
                    </Button>
                </Grid>
            </Grid>
        </Paper>
      {/* Additional UI elements for displaying weather data */}
      {weatherData && (
        <div>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Weather Information
          </Typography>
          <Typography variant="body1">
            Location: {selectedLocation.label}
          </Typography>
          <Typography variant="body1">Date: {selectedDate}</Typography>
          <Typography variant="body1">
            Max Temperature: {findValueByDatatype(weatherData, 'TMAX')}°F
          </Typography>
          <Typography variant="body1">
            Min Temperature: {findValueByDatatype(weatherData, 'TMIN')}°F
          </Typography>
          <Typography variant="body1">
            Rainfall: {findValueByDatatype(weatherData, 'PRCP')} inches
          </Typography>
          <Typography variant="body1">
            Snowfall: {findValueByDatatype(weatherData, 'SNOW')} inches
          </Typography>
          {/* Add more weather information as needed */}
        </Paper>
        </div>
      )}
    </Box>
  );
};

export default WeatherDashboard;
