export const validateForm = (values) => {
    const errors = {};
  
    if (!values.clientFirstName) {
      errors.clientFirstName = "First Name is required";
    }
    if (!values.clientLastName) {
      errors.clientLastName = "Last Name is required";
    }
    if (!values.clientEmail) {
      errors.clientEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.clientEmail)) {
      errors.clientEmail = "Invalid email address";
    }
    if (!values.clientPhone) {
      errors.clientPhone = "Phone number is required";
    } else if (!/^[0-9]{10,11}$/.test(values.clientPhone)) {
      errors.clientPhone = "Invalid phone number";
    }
    if (!values.clientMessage) {
      errors.clientMessage = "Message is required";
    }
  
    return errors;
  };