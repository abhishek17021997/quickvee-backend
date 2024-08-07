import React, { useState, useEffect, useRef } from "react";

import DeleteIcon from "../../Assests/Category/deleteIcon.svg";

import axios from "axios";
import { useAuthDetails } from "./../../Common/cookiesHelper";
import Upload from "../../Assests/Category/upload.svg";
import { useParams } from "react-router-dom";
import { BASE_URL, DEFAULTDATA, EDIT_DEFAULTS } from "../../Constants/Config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import SelectDropDown from "../../reuseableComponents/SelectDropDown";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import AlertModal from "../../reuseableComponents/AlertModal";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordShow from "./../../Common/passwordShow";
import SwitchToBackButton from "../../reuseableComponents/SwitchToBackButton";
const EditDefaults = ({ setVisible, defaultEditId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const [defaults, setDefaults] = useState({
    name: "",
    type: "",
    image: "", // New property for the image file
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    type: "",
    image: "",
  });
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");
  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };
  const [loader, setLoader] = useState(false);
  const params = useParams();
  async function fetchData() {
    const getdefaultsData = {
      id: params?.defaultsCode,
      token_id: userTypeData.token_id,
      login_type: userTypeData.login_type,
    };

    try {
      const response = await axios.post(
        BASE_URL + DEFAULTDATA,
        getdefaultsData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData.token}`,
          },
        }
      );

      if (response.data.status === "Success") {
        return response.data.result;
      }
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  }

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchDataAndUpdateState = async () => {
      const res = await fetchData();
      if (res) {
        setDefaults({
          id: res[0].id,
          name: res[0].name,
          type: res[0].type,
          image: res[0].media,
        });
        const initialSelectedCatSource =
          res[0].type === "1" ? "Category" : "Select";
        setSelectedCatSource(initialSelectedCatSource);
      }
    };

    fetchDataAndUpdateState();
  }, [params.defaultsCode]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[A-Za-z0-9 ]*$/;
    if (name === "name") {
      if (regex.test(value)) {
        setDefaults({ ...defaults, name: value });
      }
    } else {
      setDefaults((preValue) => {
        return {
          ...preValue,
          [name]: value,
        };
      });
    }
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newFieldErrors = {};

    // Validate name
    if (!defaults.name.trim()) {
      newFieldErrors.name = "Name is required";
      valid = false;
    }

    // Validate type
    if (selectedCatSource === "Select") {
      newFieldErrors.type = "Type is required";
      valid = false;
    }

    // Validate image

    setFieldErrors(newFieldErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Form is not valid, do not proceed
      return;
    }

    const formData = new FormData();
    formData.append("id", defaults.id);
    formData.append("name", defaults.name);
    formData.append("type", defaults.type);

    if (defaults.image && defaults.image.base64) {
      formData.append("image", defaults.image.base64);
      formData.append("filename", defaults.image.file.name);
    } else {
      formData.append("image", "");
      formData.append("filename", "");
    }
    formData.append("token_id", userTypeData.token_id);
    formData.append("login_type", userTypeData.login_type);
    setLoader(true);
    try {
      const res = await axios.post(BASE_URL + EDIT_DEFAULTS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userTypeData.token}`,
        },
      });

      const data = await res.data.status;
      const update_message = await res.data.msg;
      if (data == "Success") {
        ToastifyAlert("Updated Successfully", "success");
        // navigate("/users/view/unapprove/menu/defaults");
        navigate(-1);
      } else if (
        data == "Failed" &&
        update_message == "Default Title Already Exist!"
      ) {
        setErrorMessage(update_message);
      }
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
    setLoader(false);
  };

  // Function to prevent default behavior for drag over
  const inputRef = useRef(null);

  const openFileInput = () => {
    inputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle image drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDefaults((prevValue) => ({
          ...prevValue,
          image: {
            file: file,
            base64: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(file.name)) {

        showModal("Only jpeg, png, jpg files can be uploaded");
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDefaults((prevValue) => ({
            ...prevValue,
            image: {
              file: file,
              base64: reader.result,
            },
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDeleteImage = (e) => {
    e.stopPropagation();
    const fileInput = document.getElementById("filesBanner");
    if (fileInput) {
      fileInput.value = "";
    }
    setDefaults((prevValue) => ({
      ...prevValue,
      image: {
        file: null,
        base64: null,
      },
    }));
  };

  const myStyles = {
    display: "flex",
  };

  //   for dropdown select start
  const [selectedCatSource, setSelectedCatSource] = useState("");
  const [catSourceDropdownVisible, setCatSourceDropdownVisible] =
    useState(false);
  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case "category":
        setCatSourceDropdownVisible(!catSourceDropdownVisible);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (option, dropdown) => {
    switch (dropdown) {
      case "category":
        setSelectedCatSource(option.title);
        setCatSourceDropdownVisible(false);

        // Set defaults.type based on the selected option
        let typeValue;
        switch (option.title) {
          case "Select":
            typeValue = ""; // You can set it to an empty string or another default value
            break;
          case "Category":
            typeValue = 1;
            break;
          // Add more cases if needed
          default:
            typeValue = ""; // Set a default value if necessary
            break;
        }

        setDefaults((prevValue) => ({
          ...prevValue,
          type: typeValue,
        }));
        break;

      default:
        break;
    }
  };

  const category = [
    {
      title: "Select",
    },
    {
      title: "Category",
    },
  ];

  //   for dropdown select End

  return (
    <>
      <div className="q-category-main-page ">
        <div className="q-add-categories-section">
          <div className="mt-10 mb-4">
            <form enctype="multipart/form-data">
            <SwitchToBackButton 
              linkTo={"/unapprove/defaults"}
              title={"Edit Defaults"}
            />

              <div className="q-add-categories-section-middle-form">
                <div className="q-add-categories-single-input">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={defaults.name}
                    onChange={inputChange}
                  />
                </div>
                {errorMessage && (
                  <span className="error-message">{errorMessage}</span>
                )}
                {fieldErrors.name && (
                  <span className="error-message">{fieldErrors.name}</span>
                )}

                <Grid item xs={6}>
                  <label className="q-details-page-label ">Type</label>
                  <SelectDropDown
                    sx={{ pt: 0.5 }}
                    listItem={category}
                    title={"title"}
                    onClickHandler={handleOptionClick}
                    selectedOption={selectedCatSource}
                    dropdownFor={"category"}
                  />
                </Grid>
                {fieldErrors.type && (
                  <span className="error-message">{fieldErrors.type}</span>
                )}

                <div
                  className={`h-1/2  h-[100px] mt-6 flex items-center justify-center border-2 border-dashed border-[#BFBFBF] bg-white rounded-lg mt-2 defaultDrag_div`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={openFileInput}
                >
                  {defaults.image && defaults.image.base64 ? (
                    <>
                      <span
                        className="delete-image-icon img-DeleteIcon"
                        onClick={handleDeleteImage}
                      >
                        <img src={DeleteIcon} alt="delete-icon" />
                      </span>
                      <img
                        src={defaults.image.base64}
                        alt="Preview"
                        className="default-img"
                      />
                    </>
                  ) : (
                    <>
                      {defaults.image && defaults.image.length > 0 ? (
                        <div className="flex-column">
                          <img
                            src={`${BASE_URL}upload/defaults_images/${defaults.image}`}
                            alt="Default"
                            className="default-img"
                          />
                          <span
                            className="delete-image-icon img-DeleteIcon"
                            onClick={handleDeleteImage}
                          >
                            <img src={DeleteIcon} alt="delete-icon" />
                          </span>
                        </div>
                      ) : (
                        <div className="flex-column">
                          <img
                            src={Upload}
                            style={{ transform: "translate(2.5rem, 0px)" }}
                            alt="Default"
                          />
                          <span>Default Image</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="q-add-categories-single-input">
                    <input
                      type="file"
                      id="filesBanner"
                      name="image"
                      accept="image/*"
                      ref={inputRef}
                      className="default-img-inputfield"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                {fieldErrors.image && !defaults.image && (
                  <span className="error-message">{fieldErrors.image}</span>
                )}
              </div>

              <div className="q-add-categories-section-middle-footer">
                <button
                  onClick={handleSubmit}
                  className="quic-btn quic-btn-save attributeUpdateBTN"
                  disabled={loader}
                >
                  {loader ? (
                    <>
                      <CircularProgress
                        color={"inherit"}
                        className="loaderIcon"
                        width={15}
                        size={15}
                      />{" "}
                      Update
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
                <div>
                  <button
                    onClick={() => {
                      // setVisible("DefaultsDetail");
                      navigate("/unapprove/defaults");
                    }}
                    className="quic-btn quic-btn-cancle"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <AlertModal
        headerText={alertModalHeaderText}
        open={alertModalOpen}
        onClose={() => {
          setAlertModalOpen(false);
        }}
      />
    </>
  );
};

export default EditDefaults;
