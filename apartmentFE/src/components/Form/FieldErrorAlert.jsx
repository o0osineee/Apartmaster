import React from 'react';
import Alert from '@mui/material/Alert';

const FieldErrorAlert = ({ errors, fieldName }) => {
  if (!errors[fieldName]) return null;
  
  return (
    <Alert severity="error" sx={{ mt: 1 }}>
      {errors[fieldName].message}
    </Alert>
  );
};

export default FieldErrorAlert; 