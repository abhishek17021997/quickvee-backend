import React, { useState, useEffect } from "react";
import CrossIcon from "../../../Assests/Dashboard/cross.svg";
import {
  fetchEmployeeListsData,
  deleteEmployee,
} from "../../../Redux/features/StoreSettings/AddEmployee/AddEmployeeSlice";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "../../../Assests/Category/addIcon.svg";

import "../../../Styles/Settings/Employee.css";

import AddEmployeeFormLogic from "../../StoreSetting/AddEmployee/AddEmployeeFormLogic";

import { useAuthDetails } from "../../../Common/cookiesHelper";
import { Grid } from "@mui/material";
import DraggableTable from "../../../reuseableComponents/DraggableTable";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { ToastifyAlert } from "../../../CommonComponents/ToastifyAlert";
import DeleteModal from "../../../reuseableComponents/DeleteModal";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordShow from "../../../Common/passwordShow";
const EmployeeList = ({ setVisible, setEmployeeId }) => {
  const employeeListDataState = useSelector((state) => state.employeelistData);
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const [employeeList, setemployeeList] = useState([]);
  const dispatch = useDispatch();
  // const [allemployee, setallemployee] = useState([]);
  const [states, setstates] = useState([]);
  // const [value, setValue] = useState();
  // const [inputValue, setInputValue] = useState('');
  // const [showModal, setShowModal] = useState(false);
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;

  const {
    handleAddEmployeeInput,
    handlePhoneInput,
    handlePinInput,
    handleZipInput,
    values,
    handleAddEmployee,
    submitmessage,
    showModal,
    setShowModal,
    scrollRef,
    setsubmitmessage,
    handleKeyPress,
    loader,
    // handleBlur,
  } = AddEmployeeFormLogic({ employeeList });

  const getEmployeeListData = async (data) => {
    try {
      await dispatch(fetchEmployeeListsData(data)).unwrap();
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };

  useEffect(() => {
    let data = {
      merchant_id: merchant_id,
      ...userTypeData,
    };
    if (data) {
      getEmployeeListData(data);
    }
  }, []);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    values.firstname = "";
    values.lastname = "";
    values.email = "";
    values.phone = "";
    values.pin = "";
    values.wages = "";
    values.address_line_1 = "";
    values.city = "";
    values.zipcode = "";
    values.state = "";

    values.errors.firstname = "";
    values.errors.lastname = "";
    values.errors.email = "";
    values.errors.phone = "";
    values.errors.pin = "";
    values.errors.wages = "";
    values.errors.address_line_1 = "";
    values.errors.city = "";
    values.errors.zipcode = "";
    values.errors.state = "";
  };

  useEffect(() => {
    if (
      !employeeListDataState.loading &&
      employeeListDataState.employeelistData
    ) {
      setemployeeList(employeeListDataState.employeelistData);
      const all_states = employeeListDataState.states;
      setstates(all_states);
    }
  }, [
    employeeListDataState,
    employeeListDataState.loading,
    employeeListDataState.employeelistData,
  ]);



  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteEmployee = (id) => {
    setDeleteEmployeeId(id);
    setDeleteModalOpen(true);
  };
  const confirmDeleteCategory = async () => {
    if (deleteEmployeeId) {
      const data = {
        employee_id: deleteEmployeeId,
        merchant_id: merchant_id,
        ...userTypeData,
      };
      if (data) {
        const response = await dispatch(deleteEmployee(data)).unwrap();
        ToastifyAlert("Deleted Successfully", "success");
      }
    }
    setDeleteEmployeeId(null);
    setDeleteModalOpen(false);
  };

  const myStyles = {
    // width: "58rem",
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "unset",
  };

  return (
    <>


      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderBottom: "1px solid #E8E8E8",
            }}
          >
            <Grid item>
              <div className="q-category-bottom-header">
                <span>Employee</span>
              </div>
            </Grid>
            <Grid item>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <div className="q-category-bottom-header">
                    <p onClick={openModal}>
                      Add Employee <img src={AddIcon} alt="add-icon" />
                    </p>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <DraggableTable
            tableHead={[
              "Sort",
              "Employee",
              "Phone",
              "Email",
              "Pin",
              "Role",
              "Action",
              "",
              "",
            ]}
            tableRow={employeeList}
            setFunction={setemployeeList}
            employeeTable={true}
            states={states}
            editBtnEmployee={{
              editButtonEnableEmployee: true,
              editButtonurlEmployee: "/store-settings/permission/",
            }}
            setVisible={setVisible}
            setEmployeeId={setEmployeeId}
            deleteButton={{
              deleteButtonEnable: true,
              deleteButtonFun: handleDeleteEmployee,
            }}
            //   table={"collection"}
            className="q-category-bottom-categories-single-category"
          />
        </Grid>
      </Grid>
      <DeleteModal
        headerText="Employee"
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={confirmDeleteCategory}
      />

      {showModal && (
        <>
          <div
            className="q-custom-modal-container  box_shadow_div"
            id="addemployee"
          >
            <div
              className="q-custom-modal-content modal_custom"
              style={myStyles}
            >
            
              <div
                className="q-add-categories-section-header"
                style={{ justifyContent: "space-between" }}
              >
                <span style={{ cursor: "unset" }}>Add Employee</span>
                <div className="float-right">
                  <img
                    src={CrossIcon}
                    alt="icon"
                    className="quic-btn-cancle w-6 h-6 cursor-pointer"
                    onClick={closeModal}
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="qvrow">
                  <div className="col-qv-4">
                    <div className="input_area">
                      <label>
                        First Name <span className="Asterisk_error">*</span>
                      </label>
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={values.firstname}
                        onChange={handleAddEmployeeInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                      />
                      <span className="input-error">
                        {values.errors.firstname !== ""
                          ? values.errors.firstname
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-qv-4">
                    <div className="input_area">
                      <label>Last Name</label>
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={values.lastname}
                        onChange={handleAddEmployeeInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                      />
                      <span className="input-error">
                        {values.errors.lastname !== ""
                          ? values.errors.lastname
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-qv-4">
                    <div className="input_area">
                      <label>
                        Email Address <span className="Asterisk_error">*</span>
                      </label>
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={values.email}
                        onChange={handleAddEmployeeInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                      />
                      <span className="input-error">
                        {values.errors.email !== "" ? values.errors.email : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="qvrow">
                  <div className="col-qv-4">
                    <div className="input_area">
                      <label>
                        Phone Number <span className="Asterisk_error">*</span>
                      </label>
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={values.phone}
                        inputProps={{ maxLength: 10 }}
                        // onChange={handlePhoneInput}
                        onChange={handleAddEmployeeInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                        onKeyPress={handleKeyPress}
                      />
                      <span className="input-error">
                        {values.errors.phone !== "" ? values.errors.phone : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-qv-4">
                    <div className="input_area">
                      <label>
                        PIN <span className="Asterisk_error">*</span>
                      </label>
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="pin"
                        placeholder="Pin"
                        value={values.pin}
                        inputProps={{ maxLength: 4 }}
                        onChange={handleAddEmployeeInput}
                        // onChange={handlePinInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                        onKeyPress={handleKeyPress}
                        // onBlur={() => handleBlur("pin")}
                      />
                      <span className="input-error">
                        {values.errors.pin !== "" ? values.errors.pin : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-qv-4">
                    <div className="input_area">
                      <label>Wages ($/hr)</label>
    
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="wages"
                        placeholder="Wages Per Hour"
                        value={values.wages}
                        onChange={handleAddEmployeeInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                      />
                      <span className="input-error">
                        {values.errors.wages !== "" ? values.errors.wages : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="qvrow">
                  <div className="col-qv-12">
                    <div className="input_area">
                      <label>Address</label>
                    
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="address_line_1"
                        placeholder="Address"
                        value={values.address_line_1}
                        onChange={handleAddEmployeeInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                      />
                      <span className="input-error">
                        {values.errors.address_line_1 !== ""
                          ? values.errors.address_line_1
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-qv-4">
                    <div className="input_area">
                     
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="city"
                        placeholder="City"
                        value={values.city}
                        onChange={handleAddEmployeeInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                      />
                      <span className="input-error">
                        {values.errors.city !== "" ? values.errors.city : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-qv-4">
                    <div className="input_area">
                     
                      <TextField
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                        id="outlined-basic"
                        type="text"
                        name="zipcode"
                        placeholder="Zip"
                        value={values.zipcode}
                        inputProps={{ maxLength: 5 }}
                        onChange={handleZipInput}
                        className="q-custom-input-field"
                        variant="outlined"
                        size="small"
                      />
                      <span className="input-error">
                        {values.errors.zipcode !== ""
                          ? values.errors.zipcode
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-qv-4">
                    <div className="input_area addEmployeeState">
                      

                      <Select
                        size="small"
                        name="state"
                        value={values.state}
                        onChange={handleAddEmployeeInput}
                        className="q-custom-input-field"
                        displayEmpty
                      >
                        <MenuItem value="">Select a state</MenuItem>
                        {states &&
                          states.map((state, index) => (
                            <MenuItem key={index} value={state.State}>
                              {state.State}
                            </MenuItem>
                          ))}
                      </Select>

                      <span className="input-error">
                        {values.errors.state !== "" ? values.errors.state : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="q-add-categories-section-middle-footer plr0">
                  <button
                    onClick={handleAddEmployee}
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
                        />
                        Add
                      </>
                    ) : (
                      "Add"
                    )}
                  </button>
                  <button
                    onClick={closeModal}
                    className="quic-btn quic-btn-cancle"
                  >
                    {" "}
                    Cancel{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EmployeeList;
