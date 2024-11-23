export const validateForm = (formValues) => {
    let errors = {};
  
    if (!formValues.clientFirstName) errors.clientFirstName = "First Name is required";
    if (!formValues.clientLastName) errors.clientLastName = "Last Name is required";
  
    if (!formValues.clientEmail) {
      errors.clientEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.clientEmail)) {
      errors.clientEmail = "Please enter a valid email address";
    }
  
    const phonePattern = /^[0-9]{10,11}$/;
    if (!formValues.clientPhone) {
      errors.clientPhone = "Phone number is required";
    } else if (!phonePattern.test(formValues.clientPhone)) {
      errors.clientPhone = "Please enter a valid phone number";
    }
  
    if (!formValues.clientMessage) errors.clientMessage = "Message is required";
  
    return errors;
  };