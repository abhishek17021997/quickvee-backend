import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditAdminFunctionality from "./editAdminFunctionality";
import { useAuthDetails } from "../../../../Common/cookiesHelper";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordShow from "../../../../Common/passwordShow";
import Loader from "../../../../CommonComponents/Loader";
import SwitchToBackButton from "../../../../reuseableComponents/SwitchToBackButton";

export default function EditAdmin({ EditAdminId, setVisible }) {
  const handleClick = () => {
    navigate(-1);
  };
  const setPositionLoader = {
    position: "absolute",
    top: "45%",
    left: "45%",
    transform: "translate(-45%, -45%)",
  };

  const {
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
  } = EditAdminFunctionality(handleClick);
  const { userTypeData } = useAuthDetails();
  const { showpPassword, jsxData } = PasswordShow();
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    handleEditAdmin({ admin_id: id, ...userTypeData });
  }, [id]);
  const handleKeyPressNew = (event) => {
    const allowedChars = /^\S+$/;
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  };
  return (
    <>
      {loaderEdit ? (
        <div style={setPositionLoader}>
          <div className="loaderarea">
            <Loader />
          </div>
        </div>
      ) : (
        <div className="box">
          <div className="box_shadow_div">
            <SwitchToBackButton linkTo={-1} title={"Edit Admin"} />
            <div className="pd_20">
              <div className="qvrow">
                <div className="col-qv-6">
                  <div className="input_area">
                    <label>
                      Owner Name<span className="Asterisk_error">*</span>
                    </label>
                    <input
                      className=""
                      type="text"
                      name="owner_name"
                      value={editData.owner_name}
                      onChange={handleChangeAdmin}
                      onKeyDown={keyEnter}
                    />
                    <label className="error">{errors.owner_name}</label>
                  </div>
                </div>

                <div className="col-qv-6">
                  <div className="input_area">
                    <label>
                      Email<span className="Asterisk_error">*</span>
                    </label>
                    <input
                      className=""
                      type="text"
                      name="email"
                      value={editData.email}
                      onChange={handleChangeAdmin}
                      onBlur={() => handleBlur("email")}
                      onKeyDown={keyEnter}
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute("readonly")}
                    />
                    <label className="error">{errors.email}</label>
                  </div>
                </div>
              </div>
              <div className="qvrow">
                <div className="col-qv-6">
                  <div className="input_area password-show-input">
                    <label>Password</label>
                    <input
                      className=""
                      type={showpPassword ? "text" : "password"}
                      name="password1"
                      onKeyDown={keyEnter}
                      value={editData.password1}
                      onChange={handleChangeAdmin}
                      onBlur={() => handleBlurPassword("password1")}
                      autoComplete="off"
                      onKeyPress={handleKeyPressNew}
                    />
                    {jsxData(editData.password1)}
                    <label className="error">{errors.password1}</label>
                  </div>
                </div>
                <div className="col-qv-6">
                  <div className="input_area">
                    <label>Phone</label>
                    <input
                      className=""
                      type="text"
                      name="phone"
                      value={editData.phone}
                      onKeyPress={handleKeyPress}
                      onKeyDown={keyEnter}
                      maxLength={10}
                      onChange={handleChangeAdmin}
                    />
                    <label className="error">{errors.phone}</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="q-add-categories-section-middle-footer">
              <button
                className="quic-btn quic-btn-save"
                onClick={handleSubmitAdmin}
                disabled={loader}
              >
                {loader ? <CircularProgress /> : "Update"}
              </button>
              <button
                onClick={handleClick}
                className="quic-btn quic-btn-cancle"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
