import React, { useState, useEffect } from "react";
import { Title } from "../props/Title";
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
import {
  TbX,
  TbEdit,
  TbCheck,
  TbEditOff,
  TbExclamationCircle,
} from "react-icons/tb";
import { useJobOrderData } from "../../data/JobOrderData";
import Swal from "sweetalert2";
import { useAdminData } from "../../data/AdminData";
import { useJobAlertProgress } from "../../data/useJobAlertProgress";

const servicesList = {
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

const ViewOnProcess = ({ jobOrder, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedProject, setUpdatedProject] = useState(jobOrder);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { updateJobOrder } = useJobOrderData();
  const { getLoggedInAdmin, admin } = useAdminData();
  const [admins, setAdmins] = useState([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const {
    alertProjectDelayed,
    alertProjectExtended,
    alertProjectExtendedFinishToday,
  } = useJobAlertProgress(today);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        const fetchedAdmins = await getLoggedInAdmin();
        if (fetchedAdmins) {
          setAdmins([fetchedAdmins]);
        }
      } catch (err) {
        console.error("Error fetching admins:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, [getLoggedInAdmin]);

  useEffect(() => {
    setUpdatedProject(jobOrder);
    setSelectedOptions(jobOrder.jobServices || []);
    setHasUnsavedChanges(false);
  }, [jobOrder]);

  useEffect(() => {
    const isChanged =
      JSON.stringify(updatedProject) !== JSON.stringify(jobOrder);
    setHasUnsavedChanges(isChanged);
  }, [updatedProject, jobOrder]);

  const handleToggleOption = (option) => {
    setSelectedOptions((prev) => {
      const newOptions = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];

      setUpdatedProject((prev) => ({
        ...prev,
        jobServices: newOptions,
      }));

      return newOptions;
    });
  };

  const handleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setUpdatedProject(jobOrder);
      setSelectedOptions(jobOrder.jobServices || []);
    }
  };

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
    });
  };

  const handleUpdateProject = async () => {
    if (!updatedProject || !updatedProject._id) {
      showAlert("error", "Error", "Invalid project data");
      return;
    }

    const result = await Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const { success, message } = await updateJobOrder(
          updatedProject._id,
          updatedProject,
        );
        setLoading(false);

        if (success) {
          showAlert("success", "Saved!", "Job order updated successfully!");
          onClose();
        } else {
          showAlert("error", "Oops...", message);
        }
      } catch (error) {
        setLoading(false);
        showAlert("error", "Error", "Failed to update job order.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedProject(jobOrder);
    setSelectedOptions(jobOrder.jobServices || []);
    setHasUnsavedChanges(false);
  };

  const handleJobTypeChange = (value) => {
    setSelectedOptions([]);
    setUpdatedProject({
      ...updatedProject,
      jobType: value,
    });
  };

  return (
    <div className="relative max-w-[500px] rounded-lg">
      <div className="flex cursor-pointer items-center justify-between rounded-t-md border border-b-0 border-secondary-300 bg-secondary-100 px-4 py-2">
        <Title>
          Current Status:
          <span className="ml-1 capitalize">{jobOrder.jobStatus}</span>
        </Title>
        <div
          className="flex items-center rounded-full p-2 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-200/50 active:text-secondary-500"
          onClick={onClose}
        >
          <button>
            <TbX />
          </button>
        </div>
      </div>
      <div className="max-h-[90vh] overflow-y-auto rounded-b-md border border-secondary-300 bg-white p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <div className="flex justify-end gap-2">
              {editMode ? (
                <>
                  <Button
                    className="!flex !items-center !bg-red-500 !p-2 !shadow-none"
                    onClick={handleCancelEdit}
                  >
                    Cancel edit
                    <TbEditOff className="ml-2 text-[16px]" />
                  </Button>
                  {hasUnsavedChanges && (
                    <Button
                      className="flex items-center bg-blue-500 !p-2 !shadow-none"
                      onClick={handleUpdateProject}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="loading loading-dots loading-sm h-1 py-2"></span>
                      ) : (
                        <>
                          Save changes
                          <TbCheck className="ml-2 text-[16px]" />
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : jobOrder.jobStatus === "in progress" ||
                jobOrder.jobStatus === "on process" ||
                jobOrder.jobStatus === "inquiry" ? (
                <Button
                  className="flex items-center bg-blue-500 !p-2 !shadow-none"
                  onClick={handleEditMode}
                >
                  Edit Details
                  <TbEdit className="ml-2 text-[16px]" />
                </Button>
              ) : null}
            </div>
          </div>

          {jobOrder.jobStatus === "inquiry" && (
            <>
              <Textarea
                id="clientMessage"
                name="clientMessage"
                label="Client Message"
                readOnly
                value={jobOrder.clientMessage}
              />
            </>
          )}

          {jobOrder.jobStatus === "on process" && (
            <>
              <div className="flex items-center text-sm font-semibold">
                <span className="whitespace-nowrap pr-2 text-red-400">
                  Inspection Schedule
                </span>
                <div className="my-2 h-[1px] w-full bg-secondary-200 text-sm"></div>
              </div>
              <Input
                id="jobInspectionDate"
                type={editMode ? "date" : "text"}
                name="jobInspectionDate"
                label="Inspection Date"
                disabled={
                  editMode
                    ? updatedProject.jobNotificationAlert ===
                      "ready for quotation"
                    : false
                }
                value={
                  editMode
                    ? updatedProject.jobInspectionDate
                    : new Date(jobOrder.jobInspectionDate).toLocaleDateString(
                        "en-US",
                      )
                }
                onChange={(e) =>
                  editMode &&
                  setUpdatedProject({
                    ...updatedProject,
                    jobInspectionDate: e.target.value,
                  })
                }
                readOnly={!editMode}
              />
            </>
          )}

          {jobOrder.jobStatus === "in progress" && (
            <>
              <div className="flex items-center text-sm font-semibold">
                <span className="whitespace-nowrap pr-2 text-red-400">
                  Project Schedule
                </span>
                <div className="my-2 h-[1px] w-full bg-secondary-200"></div>
              </div>
              {/* Extended Date - shows only if the project is delayed or extended */}
              {(alertProjectExtended(jobOrder) ||
                alertProjectDelayed(jobOrder) ||
                alertProjectExtendedFinishToday(jobOrder)) && (
                <>
                  {alertProjectDelayed(jobOrder) && (
                    <div className="rounded-lg border border-green-500 bg-green-50 p-1">
                      <span className="flex items-center text-xs">
                        <TbExclamationCircle className="mr-1 text-red-500" />
                        Did you want to extend it?
                      </span>
                    </div>
                  )}
                  {alertProjectExtendedFinishToday(jobOrder) && (
                    <div className="rounded-lg border border-green-500 bg-green-50 p-1">
                      <span className="flex items-center text-xs">
                        <TbExclamationCircle className="mr-1 text-red-500" />
                        Did you want to extend it again?
                      </span>
                    </div>
                  )}
                  <Input
                    id="jobExtendedDate"
                    type={editMode ? "date" : "text"}
                    name="jobExtendedDate"
                    label="Extended Date"
                    value={
                      editMode
                        ? updatedProject.jobExtendedDate
                        : jobOrder.jobExtendedDate
                          ? new Date(
                              jobOrder.jobExtendedDate,
                            ).toLocaleDateString("en-US")
                          : ""
                    }
                    onChange={(e) =>
                      editMode &&
                      setUpdatedProject({
                        ...updatedProject,
                        jobExtendedDate: e.target.value,
                      })
                    }
                    readOnly={!editMode}
                  />
                </>
              )}

              <div className="flex gap-2">
                {/* Start Date */}
                <Input
                  id="jobStartDate"
                  type={editMode ? "date" : "text"}
                  name="jobStartDate"
                  label="Start Date"
                  value={
                    editMode
                      ? updatedProject.jobStartDate
                      : new Date(jobOrder.jobStartDate).toLocaleDateString(
                          "en-US",
                        )
                  }
                  onChange={(e) =>
                    editMode &&
                    setUpdatedProject({
                      ...updatedProject,
                      jobStartDate: e.target.value,
                    })
                  }
                  readOnly={!editMode || alertProjectDelayed(jobOrder)}
                  disabled={
                    editMode &&
                    (alertProjectDelayed(jobOrder) ||
                      alertProjectExtended(jobOrder) ||
                      alertProjectExtendedFinishToday(jobOrder))
                  }
                />
                {/* End Date */}
                <Input
                  id="jobEndDate"
                  type={editMode ? "date" : "text"}
                  name="jobEndDate"
                  label="End Date"
                  value={
                    editMode
                      ? updatedProject.jobEndDate
                      : new Date(jobOrder.jobEndDate).toLocaleDateString(
                          "en-US",
                        )
                  }
                  onChange={(e) =>
                    editMode &&
                    setUpdatedProject({
                      ...updatedProject,
                      jobEndDate: e.target.value,
                    })
                  }
                  readOnly={!editMode}
                  disabled={
                    editMode &&
                    (alertProjectDelayed(jobOrder) ||
                      alertProjectExtended(jobOrder) ||
                      alertProjectExtendedFinishToday(jobOrder))
                  }
                />
              </div>

              {!editMode ? (
                <div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={jobOrder.jobQuotation}
                    className="rounded-md border border-gray-400 bg-gray-200 p-2 text-sm text-secondary-900 hover:bg-gray-300"
                  >
                    View Quotation
                  </a>
                </div>
              ) : (
                <Input
                  id="jobQuotation"
                  type="file"
                  name="jobQuotation"
                  label="Upload New Quotation"
                  className="!py-2"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUpdatedProject({
                        ...updatedProject,
                        jobQuotation: file,
                      });
                    }
                  }}
                />
              )}
            </>
          )}
          {jobOrder.jobStatus === "cancelled" && (
            <>
              <div className="flex items-center text-sm font-semibold">
                <span className="whitespace-nowrap pr-2 text-red-400">
                  Cancellation Information
                </span>
                <div className="my-2 h-[1px] w-full bg-secondary-200 text-sm"></div>
              </div>
              <div className="flex flex-col gap-2">
                {/* Cancellation Reason */}
                <Textarea
                  id="jobCancellationReason"
                  name="jobCancellationReason"
                  label="Cancellation Reason"
                  value={jobOrder.jobCancellationReason}
                  readOnly
                />
                <div className="flex gap-2">
                  {/* Cancellation Date */}
                  <Input
                    id="jobCancellationDate"
                    name="jobCancellationDate"
                    label="Cancelled Date"
                    value={new Date(
                      jobOrder.jobCancelledDate,
                    ).toLocaleDateString("en-US")}
                    readOnly
                  />
                  {/* Previous Status */}
                  <Input
                    id="jobPreviousStatus"
                    name="jobPreviousStatus"
                    label="Cancelled On"
                    className="capitalize"
                    value={jobOrder.jobPreviousStatus}
                    readOnly
                  />
                </div>
              </div>
            </>
          )}
          {jobOrder.jobStatus === "completed" && (
            <>
              <div className="flex items-center text-sm font-semibold">
                <span className="whitespace-nowrap pr-2 text-green-500">
                  Completed Information
                </span>
                <div className="my-2 h-[1px] w-full bg-secondary-200 text-sm"></div>
              </div>
              <Input
                id="jobCompletionDate"
                name="jobCompletionDate"
                label="Completation Date"
                value={new Date(jobOrder.jobCompletedDate).toLocaleDateString(
                  "en-US",
                )}
              />
              <div className="flex gap-2">
                <Input
                  label="Start Date"
                  value={new Date(jobOrder.jobStartDate).toLocaleDateString(
                    "en-US",
                  )}
                />
                <Input
                  label="End Date"
                  value={new Date(jobOrder.jobEndDate).toLocaleDateString(
                    "en-US",
                  )}
                />
              </div>
              <div className="flex gap-2">
                {jobOrder.jobExtendedDate ? (
                  <Input
                    label="Extended Date"
                    value={new Date(
                      jobOrder.jobExtendedDate,
                    ).toLocaleDateString("en-US")}
                  />
                ) : (
                  ""
                )}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={jobOrder.jobQuotation}
                  className="whitespace-nowrap rounded-md border border-gray-400 bg-gray-200 p-2 text-sm text-secondary-900 hover:bg-gray-300"
                >
                  View Quotation
                </a>
              </div>
            </>
          )}

          <div className="flex items-center text-sm font-semibold">
            <span className="whitespace-nowrap pr-2 text-secondary-500">
              Client Information
            </span>
            <div className="my-2 h-[1px] w-full bg-secondary-200 text-sm"></div>
          </div>
          <div className="flex gap-2">
            <Input
              id="clientFirstName"
              name="clientFirstName"
              className="uppercase"
              label="First name"
              value={
                editMode
                  ? updatedProject.clientFirstName
                  : jobOrder.clientFirstName
              }
              onChange={(e) =>
                editMode &&
                setUpdatedProject({
                  ...updatedProject,
                  clientFirstName: e.target.value,
                })
              }
              readOnly={!editMode}
            />
            <Input
              id="clientLastName"
              name="clientLastName"
              className="uppercase"
              label="Last name"
              value={
                editMode
                  ? updatedProject.clientLastName
                  : jobOrder.clientLastName
              }
              onChange={(e) =>
                editMode &&
                setUpdatedProject({
                  ...updatedProject,
                  clientLastName: e.target.value,
                })
              }
              readOnly={!editMode}
            />
          </div>
          <Input
            id="clientAddress"
            name="clientAddress"
            className="capitalize"
            label="Home address"
            value={
              editMode ? updatedProject.clientAddress : jobOrder.clientAddress
            }
            onChange={(e) =>
              editMode &&
              setUpdatedProject({
                ...updatedProject,
                clientAddress: e.target.value,
              })
            }
            readOnly={!editMode}
          />
          <div className="flex gap-2">
            <Input
              id="clientEmail"
              name="clientEmail"
              className="lowercase"
              label="Email"
              value={
                editMode ? updatedProject.clientEmail : jobOrder.clientEmail
              }
              onChange={(e) =>
                editMode &&
                setUpdatedProject({
                  ...updatedProject,
                  clientEmail: e.target.value,
                })
              }
              readOnly={!editMode}
            />
            <Input
              id="clientPhone"
              name="clientPhone"
              label="Phone number"
              value={
                editMode ? updatedProject.clientPhone : jobOrder.clientPhone
              }
              onChange={(e) =>
                editMode &&
                setUpdatedProject({
                  ...updatedProject,
                  clientPhone: e.target.value,
                })
              }
              readOnly={!editMode}
            />
          </div>
          <div className="flex items-center text-sm font-semibold">
            <span className="whitespace-nowrap pr-2 text-secondary-500">
              Job Order Information
            </span>
            <div className="my-2 h-[1px] w-full bg-secondary-200 text-sm"></div>
          </div>
          <Input
            id="projectID"
            name="projectID"
            label="Project ID"
            value={jobOrder.projectID}
            readOnly
            disabled={editMode}
          />
          {!editMode ? (
            <Input
              id="jobType"
              name="jobType"
              label="Type of job"
              value={jobOrder.jobType}
              readOnly
            />
          ) : (
            <Select
              label="Select Type of Job"
              value={updatedProject.jobType}
              onChange={handleJobTypeChange}
            >
              {Object.keys(servicesList).map((jobType) => (
                <Option key={jobType} value={jobType}>
                  {jobType}
                </Option>
              ))}
            </Select>
          )}

          {!editMode ? (
            <Input
              id="jobServices"
              name="jobServices"
              label="Selected Services"
              value={jobOrder.jobServices.join(", ")}
              readOnly
            />
          ) : (
            <>
              <label className="text-sm">Select Services:</label>
              <div className="max-h-[104px] overflow-y-auto rounded border">
                <List className="flex-col">
                  {servicesList[updatedProject.jobType] &&
                  servicesList[updatedProject.jobType].length > 0 ? (
                    servicesList[updatedProject.jobType].map(
                      (service, index) => (
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
                            <Typography variant="small">{service}</Typography>
                          </label>
                        </ListItem>
                      ),
                    )
                  ) : (
                    <Typography variant="small" className="p-2 text-gray-500">
                      Please select a job type first.
                    </Typography>
                  )}
                </List>
              </div>
            </>
          )}

          <div className="my-1 h-[1px] w-full bg-secondary-200 text-sm"></div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-secondary-900">
                  Created By:{" "}
                  <span className="capitalize">
                    {isLoading ? (
                      <span className="animate-pulse">Please wait...</span>
                    ) : jobOrder && jobOrder.createdBy ? (
                      <>
                        {jobOrder.createdBy.firstName}{" "}
                        {jobOrder.createdBy.lastName}
                      </>
                    ) : (
                      <span className="normal-case">Client</span>
                    )}
                  </span>
                </span>
                <span className="text-xs text-secondary-500">
                  {jobOrder && jobOrder.createdAt
                    ? new Date(jobOrder.createdAt).toLocaleString()
                    : "Loading..."}
                </span>
              </div>

              {jobOrder.updatedAt !== jobOrder.createdAt &&
                jobOrder.updatedBy && (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-secondary-900">
                      Updated By:{" "}
                      <span className="capitalize">
                        {jobOrder.updatedBy?.firstName || (
                          <>
                            <span className="animate-pulse normal-case animate-duration-1000">
                              Please wait...
                            </span>
                          </>
                        )}{" "}
                        {jobOrder.updatedBy?.lastName}
                      </span>
                    </span>
                    <span className="text-xs text-secondary-500">
                      {new Date(jobOrder.updatedAt).toLocaleString()}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOnProcess;