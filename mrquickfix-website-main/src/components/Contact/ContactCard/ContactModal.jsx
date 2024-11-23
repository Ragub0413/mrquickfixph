import {
  Button,
  Checkbox,
  Input,
  List,
  ListItem,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaXmark } from "react-icons/fa6";
import Swal from "sweetalert2";

const ContactModal = ({ isOpen, onClose }) => {
  const [formValues, setFormValues] = useState({
    clientFirstName: "",
    clientLastName: "",
    clientEmail: "",
    clientPhone: "",
    clientMessage: "",
    jobType: "",
    jobServices: "",
  });

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const jobTypeServices = {
    Repairs: [
      "Fits-outs (Painting, Carpentry, Masonry)",
      "Door and Window Repairs",
      "Electrical Works",
    ],
    Renovation: [
      "Fits-outs (Painting, Carpentry, Masonry)",
      "Kitchen and Bath Renovation",
      "Outdoor and Landscaping",
    ],
    "Preventive Maintenance Service (PMS)": ["Aircon Services"],
    "Cleaning Services": ["Household Cleaning Services"],
  };

  const validateForm = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!values.clientFirstName)
      errors.clientFirstName = "First name is required";
    if (!values.clientLastName) errors.clientLastName = "Last name is required";

    if (!values.clientEmail) {
      errors.clientEmail = "Email is required";
    } else if (!emailRegex.test(values.clientEmail)) {
      errors.clientEmail = "Invalid email format";
    }

    if (!values.clientPhone) {
      errors.clientPhone = "Phone number is required";
    } else if (!phoneRegex.test(values.clientPhone)) {
      errors.clientPhone = "Invalid phone number format";
    }

    if (selectedOptions.length === 0)
      errors.jobServices = "Please select at least one service";

    return errors;
  };

  const onChangeRecaptcha = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(formValues);

    if (!recaptchaToken) {
      Swal.fire({
        icon: "error",
        title: "ReCAPTCHA Validation",
        text: "Please complete the ReCAPTCHA.",
        confirmButtonText: "Okay",
        confirmButtonColor: "#f44336",
      });
      return;
    }

    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).join(",\n");

      Swal.fire({
        icon: "error",
        title: "This field is required",
        text: errorMessages,
        confirmButtonText: "Okay",
        confirmButtonColor: "#f44336",
      });

      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formValues,
        jobType: selectedJobType,
        jobServices: selectedOptions,
        inquiryStatus: "pending",
      };

      const response = await fetch("http://localhost:5000/api/job-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      Swal.fire({
        icon: "success",
        title: "Form Submitted Successfully!",
        text: "Thank you for your inquiry. We will get back to you soon.",
        confirmButtonText: "Okay",
      }).then(() => {
        setTimeout(() => onClose(), 1000);
      });

      setFormValues({
        clientFirstName: "",
        clientLastName: "",
        clientEmail: "",
        clientPhone: "",
        clientMessage: "",
        jobType: "",
      });
      setSelectedJobType("");
      setSelectedOptions([]);
      setRecaptchaToken(null);
    } catch (error) {
      console.error("Error submitting data:", error);

      Swal.fire({
        icon: "error",
        title: "Error Submitting Form",
        text: "There was an error submitting your form. Please try again later.",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormValues({
        clientFirstName: "",
        clientLastName: "",
        clientEmail: "",
        clientPhone: "",
        clientMessage: "",
        jobType: "",
      });
      setSelectedOptions([]);
      setSelectedJobType("");
      setFormErrors({});
      setRecaptchaToken(null);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleOption = (service) => {
    setSelectedOptions((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service],
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-30 bg-black/20"></div>
      <div className="relative z-10 max-h-[60vh] w-full max-w-[600px] overflow-auto rounded-md bg-white md:max-h-[85vh]">
        <button
          className="absolute right-2 top-2 rounded-full p-2 text-secondary-500 hover:bg-secondary-500/30 md:text-xl"
          onClick={onClose}
        >
          <FaXmark />
        </button>
        <div className="flex flex-col gap-4 p-4 md:p-8">
          <div>
            <Typography
              variant="h4"
              color="blue-gray"
              className="text-xl font-medium md:text-2xl"
            >
              Inquiry Form
            </Typography>
            <Typography
              variant="h5"
              color="blue-gray"
              className="text-sm font-medium md:text-base"
            >
              Please take a moment to fill in our inquiry form
            </Typography>
          </div>
          <div className="h-[1px] w-full bg-secondary-300"></div>
          <h1 className="text-sm font-semibold text-primary-500 md:text-base">
            Client Information
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                variant="standard"
                label="First Name"
                name="clientFirstName"
                value={formValues.clientFirstName}
                onChange={handleInputChange}
                error={!!formErrors.clientFirstName}
                helpertext={formErrors.clientFirstName}
              />
              <Input
                variant="standard"
                label="Last Name"
                name="clientLastName"
                value={formValues.clientLastName}
                onChange={handleInputChange}
                error={!!formErrors.clientLastName}
                helpertext={formErrors.clientLastName}
              />
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                variant="standard"
                label="Email Address"
                name="clientEmail"
                value={formValues.clientEmail}
                onChange={handleInputChange}
                error={!!formErrors.clientEmail}
                helpertext={formErrors.clientEmail}
              />
              <Input
                variant="standard"
                label="Phone Number"
                name="clientPhone"
                value={formValues.clientPhone}
                onChange={handleInputChange}
                error={!!formErrors.clientPhone}
                helpertext={formErrors.clientPhone}
              />
            </div>
            <h1 className="text-sm font-semibold text-primary-500 md:text-base">
              Job Order Details
            </h1>
            <div>
              <Select
                variant="standard"
                label="Select Type of Job"
                value={selectedJobType}
                onChange={(value) => {
                  setSelectedJobType(value);
                  setSelectedOptions([]);
                }}
                error={!!formErrors.jobType}
                helpertext={formErrors.jobType}
              >
                <Option value="Renovation">Renovation</Option>
                <Option value="Repairs">Repairs</Option>
                <Option value="Preventive Maintenance Service (PMS)">
                  Preventive Maintenance Service (PMS)
                </Option>
                <Option value="Cleaning Services">Cleaning Services</Option>
              </Select>

              <div className="mt-4">
                <label className="text-sm text-blue-gray-500">
                  Select Services:
                </label>
                <div className="max-h-[150px] overflow-y-auto border">
                  <List className="select-none flex-col">
                    {jobTypeServices[selectedJobType] &&
                    jobTypeServices[selectedJobType].length > 0 ? (
                      jobTypeServices[selectedJobType].map((service, index) => (
                        <ListItem key={index} className="p-0">
                          <label
                            htmlFor={`service-checkbox-${index}`}
                            className="flex w-full cursor-pointer items-center"
                          >
                            <Checkbox
                              id={`service-checkbox-${index}`}
                              checked={selectedOptions.includes(service)}
                              onChange={() => handleToggleOption(service)}
                            />
                            <Typography
                              variant="small"
                              className={`text-sm ${
                                selectedOptions.includes(service)
                                  ? "font-semibold text-primary-500"
                                  : "text-gray-600"
                              }`}
                            >
                              {service}
                            </Typography>
                          </label>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="small" className="p-2 text-gray-500">
                        Please select a job type first.
                      </Typography>
                    )}
                  </List>
                </div>
              </div>

              <div className="mt-8">
                <Textarea
                  variant="static"
                  label="Have any other questions or concerns?"
                  name="clientMessage"
                  value={formValues.clientMessage}
                  onChange={handleInputChange}
                  placeholder="Leave us a message"
                />
              </div>
              <div className="mt-2 w-full">
                {/* ReCAPTCHA */}
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={onChangeRecaptcha}
                />
              </div>
              <div className="text-end">
                <Button
                  variant="filled"
                  size="md"
                  className="mt-4 rounded-sm bg-primary-500"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
