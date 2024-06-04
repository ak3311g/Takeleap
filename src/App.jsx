import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { Autocomplete } from '@mui/material'
import TextField from '@mui/material/TextField';
import axios from 'axios';

function App() {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json');
        setColleges(response.data);
      } catch (error) {
        console.error('Error fetching college data:', error);
      }
      setLoading(false);
    };
    fetchColleges();
  }, []);

  const handleCollegeChange = async (event, value) => {
    setSelectedCollege(value);
    if (value) {
      try {
        const domain = value.domains[0];
        const logoResponse = `https://logo.clearbit.com/${domain}`;
        setLogoUrl(logoResponse);
      } catch (error) {
        console.error('Error fetching logo:', error);
        setLogoUrl('');
      }
    } else {
      setLogoUrl('');
    }
  };

  return (
    <Container>
      <Box>
        <Typography m={4}>
          College Dashboard
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Autocomplete
            options={colleges}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            onChange={handleCollegeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a College"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )}
        {selectedCollege && (
          <Box mt={2}>
            <Typography>{selectedCollege.name}</Typography>
            {logoUrl==='' ? (
              <Typography>No logo found</Typography>
            ) : (
              <img src={logoUrl} alt="College Logo" style={{ width: 100, height: 100 }} />
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
