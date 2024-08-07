import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Grid, Typography, MenuItem, Stepper, InputLabel, Step, StepLabel, Select, FormControl, FormControlLabel, FormGroup, Checkbox, FormHelperText, FormLabel, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { styled } from '@mui/system';
import api from '../api';
import AuthContext from '../context/AuthContext';

const Container = styled('div')({
  padding: 24,
  marginTop: 24,
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
});

const FormSection = styled('div')({
  marginTop: 24,
});

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    street_address: '',
    postal_code: '',
    city: '',
    country: '',
    category: '',
    sub_category: '',
    target_audience: [],
    description: '',
    images: [], // Change to array for multiple images //new
    date: '',
    start_time: '',
    end_time: '',
    duration: '',
    pricing: '',
    capacity: '',
    seatCategories: [],
    priceCategories: [],
    simple_count: '',
    vip_count: '',
    premium_count: '',
    simple_price: '',
    vip_price: '',
    premium_price: '',
    recurring: false,
    recurrence: '',
  });

  const [imagePreviews, setImagePreviews] = useState([]); // To store image previews //new
  const [openImageModal, setOpenImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked ? [...prevData[name], e.target.value] : prevData[name].filter((item) => item !== e.target.value),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));

    // Generate image previews
    const previews = files.map(file => URL.createObjectURL(file)); //new
    setImagePreviews(previews); //new
  };

  const handleImageClick = (image) => {
    setCurrentImage(image);
    setOpenImageModal(true);
  };
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setCurrentImage('');
  };

  useEffect(() => {
    if (formData.start_time && formData.end_time) {
      const start = new Date(`1970-01-01T${formData.start_time}:00`);
      const end = new Date(`1970-01-01T${formData.end_time}:00`);
      const duration = (end - start) / 60000;
      setFormData((prevData) => ({
        ...prevData,
        duration: duration > 0 ? duration : 0,
      }));
    }
  }, [formData.start_time, formData.end_time]);

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prevStep) => prevStep + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.name && formData.venue && formData.street_address && formData.postal_code && formData.city && formData.country;
      case 1:
        return formData.category && formData.sub_category;
      case 2:
        return formData.target_audience.length > 0 && formData.description && formData.images.length > 0;
      case 3:
        return formData.date && formData.start_time && formData.end_time && formData.duration;
      case 4:
        return validatePricingStep();
      case 5:
        return formData.recurring !== null && (formData.recurring ? formData.recurrence : true);
      case 6:
        return true;
      default:
        return false;
    }
  };

  const validatePricingStep = () => {
    if (formData.pricing === 'free') {
      return formData.capacity && validateSeatCategories();
    } else if (formData.pricing === 'paid') {
      return formData.capacity && validateSeatCategories() && validateSeatPrices();
    }
    return false;
  };

  const validateSeatCategories = () => {
    const totalCapacity = ['simple', 'vip', 'premium']
      .filter(category => formData.seatCategories.includes(category))
      .reduce((total, category) => total + Number(formData[`${category}_count`]), 0);
    return totalCapacity === Number(formData.capacity) &&
      formData.seatCategories.every(category => Number(formData[`${category}_count`]) > 0);
  };

  const validateSeatPrices = () => {
    return formData.seatCategories.every(category => formData[`${category}_price`] !== '');
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData(); //new
    Object.keys(formData).forEach(key => { //new
      if (key === 'images') { //new
        formData[key].forEach(image => { //new
          formDataToSend.append('images', image); //new
        }); //new
      } else { //new
        formDataToSend.append(key, formData[key]); //new
      } //new
    }); //new

    try {
      const response = await api.post('/event/create', formDataToSend, { //new
        headers: { //new
          'Content-Type': 'multipart/form-data' //new
        } //new
      }); //new
      console.log('Event created successfully:', response.data);
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'organisateur') {
        navigate('/organisator-dashboard');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const steps = ['Basic Information', 'Categories', 'Audience and Description', 'Date and Time', 'Seat Allocation and Pricing', 'Recurrence', 'Validate'];

  if (!user) {
    return (
      <Container>
        <Typography variant="h6" gutterBottom>
          Please log in to create an event.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {`Welcome ${user.role === 'organisateur' ? user.nomDeStructure : 'ADMIN'}`}
      </Typography>
      {step === 0 && (
        <Typography variant="h6" gutterBottom>
          Vous êtes à une étape de créer votre événement !
        </Typography>
      )}

      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === steps.length ? (
        <Typography variant="h5" gutterBottom>
          Event Created Successfully!
        </Typography>
      ) : (
        <div>
          {step === 0 && (
            <FormSection>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Event Name"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    helperText="Write the name of your event"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Venue"
                    fullWidth
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    helperText="Write the name of the building holding the event"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Street Address"
                    fullWidth
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    helperText="Generate it"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Postal Code"
                    fullWidth
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    helperText="Generate it"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    fullWidth
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    helperText="Generate it"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    fullWidth
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    helperText="Generate it"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setStep(0)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </FormSection>
          )}

          {step === 1 && (
            <FormSection>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Category"
                    fullWidth
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    select
                  >
                    {['Cultural', 'Sport', 'Conference/Seminar'].map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Sub-Category"
                    fullWidth
                    name="sub_category"
                    value={formData.sub_category}
                    onChange={handleChange}
                    select
                  >
                    {formData.category === 'Cultural' && ['Festival', 'Art Exhibition', 'Theater Performance', 'Concert'].map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                    {formData.category === 'Sport' && ['Single Match'].map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                    {formData.category === 'Conference/Seminar' && ['Academic Conference', 'Professional Development Workshop'].map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setStep(0)}
                >
                  Cancel
                </Button>
              </div>
            </FormSection>
          )}

          {step === 2 && (
            <FormSection>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Target Audience</InputLabel>
                    <Select
                      name="target_audience"
                      multiple
                      value={formData.target_audience}
                      onChange={handleChange}
                    >
                      {['children', 'adult', 'family', 'all'].map((audience) => (
                        <MenuItem key={audience} value={audience}>
                          {audience}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    helperText="Décrire votre évènement"
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange} //new
                  />
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    {imagePreviews.map((preview, index) => ( //new
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => handleImageClick(preview)}
                      />
                    ))} 
                  </div> 
                  <Dialog open={openImageModal} onClose={handleCloseImageModal}>
                    <DialogTitle>Image Preview</DialogTitle>
                    <DialogContent>
                      <img src={currentImage} alt="Current Preview" style={{ width: '100%', height: 'auto' }} />
                    </DialogContent>
                  </Dialog>
                </Grid>
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setStep(0)}
                >
                  Cancel
                </Button>
              </div>
            </FormSection>
          )}

          {step === 3 && (
            <FormSection>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Date"
                    fullWidth
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="The date of the event"
                    inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Time"
                    fullWidth
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="The time at which the event starts"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Time"
                    fullWidth
                    name="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="The time at which the event stops"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duration"
                    fullWidth
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    disabled
                    helperText="The number of minutes the event will last"
                  />
                </Grid>
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setStep(0)}
                >
                  Cancel
                </Button>
              </div>
            </FormSection>
          )}

          {step === 4 && (
            <FormSection>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Pricing"
                    fullWidth
                    name="pricing"
                    value={formData.pricing}
                    onChange={handleChange}
                    select
                  >
                    {['free', 'paid'].map((pricing) => (
                      <MenuItem key={pricing} value={pricing}>
                        {pricing}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Capacity"
                    fullWidth
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    helperText="Enter the total capacity of the event"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Seat Categories</FormLabel>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.seatCategories.includes('simple')}
                            onChange={(e) => {
                              const { checked } = e.target;
                              setFormData((prevData) => ({
                                ...prevData,
                                seatCategories: checked
                                  ? [...prevData.seatCategories, 'simple']
                                  : prevData.seatCategories.filter((cat) => cat !== 'simple'),
                              }));
                            }}
                            name="simple"
                          />
                        }
                        label="Simple"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.seatCategories.includes('vip')}
                            onChange={(e) => {
                              const { checked } = e.target;
                              setFormData((prevData) => ({
                                ...prevData,
                                seatCategories: checked
                                  ? [...prevData.seatCategories, 'vip']
                                  : prevData.seatCategories.filter((cat) => cat !== 'vip'),
                              }));
                            }}
                            name="vip"
                          />
                        }
                        label="VIP"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.seatCategories.includes('premium')}
                            onChange={(e) => {
                              const { checked } = e.target;
                              setFormData((prevData) => ({
                                ...prevData,
                                seatCategories: checked
                                  ? [...prevData.seatCategories, 'premium']
                                  : prevData.seatCategories.filter((cat) => cat !== 'premium'),
                              }));
                            }}
                            name="premium"
                          />
                        }
                        label="Premium"
                      />
                    </FormGroup>
                    <FormHelperText>Select applicable seat categories</FormHelperText>
                  </FormControl>
                </Grid>
                {formData.seatCategories.includes('simple') && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Simple Count"
                      fullWidth
                      name="simple_count"
                      type="number"
                      value={formData.simple_count}
                      onChange={handleChange}
                    />
                  </Grid>
                )}
                {formData.seatCategories.includes('vip') && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="VIP Count"
                      fullWidth
                      name="vip_count"
                      type="number"
                      value={formData.vip_count}
                      onChange={handleChange}
                    />
                  </Grid>
                )}
                {formData.seatCategories.includes('premium') && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Premium Count"
                      fullWidth
                      name="premium_count"
                      type="number"
                      value={formData.premium_count}
                      onChange={handleChange}
                    />
                  </Grid>
                )}
                {formData.pricing === 'paid' && (
                  <>
                    <Grid item xs={12}>
                      <FormLabel component="legend">Seat Prices</FormLabel>
                    </Grid>
                    {formData.seatCategories.includes('simple') && (
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Simple Price"
                          fullWidth
                          name="simple_price"
                          type="number"
                          value={formData.simple_price}
                          onChange={handleChange}
                          helperText="Simple seat price in €"
                        />
                      </Grid>
                    )}
                    {formData.seatCategories.includes('vip') && (
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="VIP Price"
                          fullWidth
                          name="vip_price"
                          type="number"
                          value={formData.vip_price}
                          onChange={handleChange}
                          helperText="VIP seat price in €"
                        />
                      </Grid>
                    )}
                    {formData.seatCategories.includes('premium') && (
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Premium Price"
                          fullWidth
                          name="premium_price"
                          type="number"
                          value={formData.premium_price}
                          onChange={handleChange}
                          helperText="Premium seat price in €"
                        />
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setStep(0)}
                >
                  Cancel
                </Button>
              </div>
            </FormSection>
          )}

          {step === 5 && (
            <FormSection>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Recurring</InputLabel>
                    <Select
                      name="recurring"
                      value={formData.recurring}
                      onChange={handleChange}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {formData.recurring && (
                  <Grid item xs={12}>
                    <TextField
                      label="Recurrence"
                      fullWidth
                      name="recurrence"
                      value={formData.recurrence}
                      onChange={handleChange}
                      select
                    >
                      {['daily', 'weekly', 'monthly'].map((recurrence) => (
                        <MenuItem key={recurrence} value={recurrence}>
                          {recurrence}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setStep(0)}
                >
                  Cancel
                </Button>
              </div>
            </FormSection>
          )}

          {step === 6 && (
            <FormSection>
              <Typography variant="h6" gutterBottom>
                Validate your event details before submitting.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Event Name:</strong> {formData.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Venue:</strong> {formData.venue}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Address:</strong> {formData.street_address}, {formData.city}, {formData.postal_code}, {formData.country}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Category:</strong> {formData.category}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Sub-Category:</strong> {formData.sub_category}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Target Audience:</strong> {formData.target_audience.join(', ')}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Description:</strong> {formData.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Date:</strong> {formData.date}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Start Time:</strong> {formData.start_time}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>End Time:</strong> {formData.end_time}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Duration:</strong> {formData.duration} minutes</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Pricing:</strong> {formData.pricing}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Capacity:</strong> {formData.capacity}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Seat Categories:</strong> {formData.seatCategories.join(', ')}</Typography>
                </Grid>
                {formData.seatCategories.includes('simple') && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body1"><strong>Simple Count:</strong> {formData.simple_count}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1"><strong>Simple Price:</strong> {formData.simple_price}</Typography>
                    </Grid>
                  </>
                )}
                {formData.seatCategories.includes('vip') && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body1"><strong>VIP Count:</strong> {formData.vip_count}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1"><strong>VIP Price:</strong> {formData.vip_price}</Typography>
                    </Grid>
                  </>
                )}
                {formData.seatCategories.includes('premium') && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body1"><strong>Premium Count:</strong> {formData.premium_count}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1"><strong>Premium Price:</strong> {formData.premium_price}</Typography>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Recurring:</strong> {formData.recurring ? 'Yes' : 'No'}</Typography>
                </Grid>
                {formData.recurring && (
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>Recurrence:</strong> {formData.recurrence}</Typography>
                  </Grid>
                )}
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </FormSection>
          )}
        </div>
      )}
    </Container>
  );
};

export default CreateEvent;
