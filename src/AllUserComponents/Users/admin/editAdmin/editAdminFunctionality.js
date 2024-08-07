import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  BASE_URL,
  GET_EDIT_ADMIN,
  CHECK_ADMIN_EMAIL,
  UPDATE_ADMIN_RECORD,
  ADMIN_CHECK_USER,
} from "../../../../Constants/Config";
import { useNavigate } from "react-router-dom";
import { useAuthDetails } from "../../../../Common/cookiesHelper";
import { ToastifyAlert } from "../../../../CommonComponents/ToastifyAlert";
import PasswordShow from "../../../../Common/passwordShow";

const EditAdminFunctionality = (handleClick) => {
  const navigate = useNavigate();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const [editData, setEditData] = useState({
    owner_name: "",
    email: "",
    password1: "",
    phone: "",
    password: "",
  });
  const { userTypeData } = useAuthDetails();

  const [errors, setErrors] = useState({
    owner_name: "",
    phone: "",
    email: "",
    password1: "",
  });
  const [loader, setLoader] = useState(false);
  const [loaderEdit, setLoaderEdit] = useState(false);
  const [ExitEmail, setExitEmail] = useState("");

  const handleEditAdmin = async (data) => {
    const { token, ...newData } = data;
    try {
      setLoaderEdit(true);
      await axios
        .post(BASE_URL + GET_EDIT_ADMIN, newData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoaderEdit(false);
          if (response.data.status == 200) {
            console.log(response.data.message[0]);
            setEditData({ password1: "", ...response.data.message[0] });
            setExitEmail(response.data.message[0].email);
          }
        });
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };
  const passwordValidate = async (email, password) => {
    const { token, ...newData } = userTypeData;
    const dataNew = { email: email, password: password, ...newData };
    try {
      const response = await axios.post(BASE_URL + ADMIN_CHECK_USER, dataNew, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };
  const emailValidate = async (data) => {
    const { token, ...newData } = userTypeData;
    const dataNew = { email: data, ...newData };
    try {
      const response = await axios.post(BASE_URL + CHECK_ADMIN_EMAIL, dataNew, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };
  const handleBlur = async (name) => {
    if (name === "email") {
      console.log(errors.email);
      if (errors.email == "") {
        try {
          let result = await emailValidate(editData.email);
          if (result == true) {
            if (ExitEmail !== editData.email) {
              setErrors((prev) => ({
                ...prev,
                email: "Email already exists",
              }));
            } else {
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }
          } else {
            console.log("nooo");
            setErrors((prev) => ({
              ...prev,
              email: "",
            }));
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
    }
  };
  const handleBlurPassword = async (name) => {
    if (name == "password1") {
      if (
        errors.email == "" &&
        editData.email !== "" &&
        editData.password1 !== ""
      ) {
        let result = await passwordValidate(editData.email, editData.password1);
        if (result == true) {
          setErrors((prev) => ({
            ...prev,
            password1: "Password already exists",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            password1: "",
          }));
        }
      }
    }
  };
  const handleChangeAdmin = (e) => {
    const { name, value } = e.target;
    let updatedErrors = { ...errors };
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    console.log(editData);

    if (name === "owner_name") {
      updatedErrors[name] =
        value.trim() === ""
          ? `Owner Name is required`
          : value[0] === " "
            ? `Owner Name cannot start with a space`
            : "";
    }
    if (name == "email") {
      console.log(value);
      updatedErrors[name] =
        value === ""
          ? `Email is required`
          : !emailRegex.test(value)
            ? "Please enter a valid email"
            : "";
    }
    if (name == "password1") {
      updatedErrors[name] = value === "" ? "" : "";
    }
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue == "") {
        updatedErrors[name] = ``;
      } else if (numericValue.length !== 10) {
        updatedErrors[name] = "Phone number must be 10 digits";
      } else {
        updatedErrors[name] = "";
      }
    }

    setErrors(updatedErrors);
    setEditData((prevCustomerData) => ({
      ...prevCustomerData,
      [name]: value,
    }));
  };
  const handleKeyPress = (e) => {
    if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
      e.preventDefault();
    }
  };
  const validateForm = async () => {
    let error = false;
    let updatedErrors = { ...errors };
    if (!editData.owner_name) {
      updatedErrors.owner_name = "Owner Name is required";
      error = true;
    } else {
      updatedErrors.owner_name = "";
    }
    if (!editData.email) {
      updatedErrors.email = "Email is required";
      error = true;
    } else {
      try {
        setLoader(true);
        const emailValid = await emailValidate(editData.email);
        setLoader(false);
        if (emailValid) {
          if (ExitEmail !== editData.email) {
            updatedErrors.email = "Email already exists";
            error = true;
          } else {
            updatedErrors.email = "";
          }
        } else {
          updatedErrors.email = "";
        }
      } catch (validationError) {
        console.error("Error validating email:", validationError);
        updatedErrors.email = "Error validating email";
        error = true;
      }
    }
    if (!editData.password1) {
      updatedErrors.password1 = "";
    } else {
      try {
        setLoader(true);
        const passwordValid = await passwordValidate(
          editData.email,
          editData.password1
        );
        setLoader(false);
        if (passwordValid) {
          updatedErrors.password1 = "Password already exists";
          error = true;
        } else {
          updatedErrors.password1 = "";
        }
      } catch (validationError) {
        console.error("Error validating password:", validationError);
        updatedErrors.password1 = "Error validating password";
        error = true;
      }
    }
    setErrors(updatedErrors);
    console.log(error);
    return !error;
  };
  const keyEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setEditData((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
      if (loader == false) {
        handleSubmitAdmin(event);
      }
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", keyEnter);
    return () => {
      document.removeEventListener("keydown", keyEnter);
    };
  }, [editData]);
  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
    const { token, ...newData } = userTypeData;
    const data = {
      admin_id: editData.id,
      name: editData.owner_name.trim(),
      owner_name: editData.owner_name.trim(),
      password: editData.password1.trim(),
      phone: editData.phone,
      email: editData.email.trim(),
      ...newData,
    };
    let validate = Object.values(errors).filter((error) => error !== "").length;
    const validateBlank = await validateForm();
    if (validateBlank == true) {
      if (validate == 0) {
        setLoader(true);
        try {
          await axios
            .post(BASE_URL + UPDATE_ADMIN_RECORD, data, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((result) => {
              setLoader(false);
              setEditData({
                owner_name: "",
                email: "",
                password: "",
                phone: "",
                password: "",
              });
              setExitEmail("");
              ToastifyAlert("Updated Successfully", "success");
              navigate("/users/admin");
            });
        } catch (error) {
          if (error.status == 401 || error.response.status === 401) {
            getUnAutherisedTokenMessage();
            handleCoockieExpire();
          } else if (error.status == "Network Error") {
            getNetworkError();
          }
        }
      }
    }
  };
  return {
    handleEditAdmin,
    editData,
    handleChangeAdmin,
    handleSubmitAdmin,
    errors,
    handleKeyPress,
    loader,
    loaderEdit,
    handleBlur,
    keyEnter,
    handleBlurPassword,
  };
};
export default EditAdminFunctionality;
