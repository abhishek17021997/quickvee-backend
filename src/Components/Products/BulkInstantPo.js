import React, { useEffect, useMemo, useState } from "react";
import { bulkInstantPo } from "./data";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  saveBulkInstantPo,
  saveSingleVarientPO,
} from "../../Redux/features/Product/ProductSlice";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import { useAuthDetails } from "../../Common/cookiesHelper";
import { Box, CircularProgress, Grid } from "@mui/material";
import PasswordShow from "../../Common/passwordShow";

const BulkInstantPo = ({
  productData,
  modalType,
  varientIndex,
  varientData,
  handleCloseEditModal,
  fetchProductDataById,
  inventoryData,
  isVarientEdit,
  fetchSingleVarientData,
  varientName,
}) => {
  const dispatch = useDispatch();
  const productId = useParams();
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const { getUnAutherisedTokenMessage } = PasswordShow();
  const [instantPoSingle, setInstantPoSingle] = useState({
    // qty:
    //   varientData?.length > 0
    //     ? varientData?.find((varient) => varient?.variant === varientName)
    //         ?.quantity
    //     : productData?.quantity,
    qty:"",
    cost:
      varientData?.length > 0
        ? varientData.find((varient) => varient?.variant === varientName)
            ?.costperItem
        : productData?.costperItem,

    description: "",
  });
  const [loading, setLoading] = useState(false);

  const [instancePoMultiple, setInstancePoMultiple] = useState({
    instantPoState: [],
    description: "",
  });

  const [required, setRequired] = useState({
    qty: "",
    cost: "",
  });
  const [error, setError] = useState(false);

  const instantPoForm = useMemo(() => {
    if (modalType === "bulk-edit") {
      return [...new Set(varientData)]?.map((varient) => ({
        // qty:varient.quantity ?? "",
        qty:"",
        cost:varient.costperItem ?? "",
      }));
    }
    return [];
  }, [modalType]);

  useEffect(() => {
    if (modalType === "bulk-edit") {
      setInstancePoMultiple({
        instantPoState: instantPoForm,
        description: "",
      });
      setRequired(
        [...new Set(instantPoForm)]?.map(() => ({
          qty: "",
          cost: "",
        }))
      );
    }
  }, [modalType, instantPoForm]);

  const handleChangeSinglePo = (e, index) => {
    const { name, value } = e.target;

    /// allowed value in 0.00 format
    let fieldValue;
    fieldValue = value
      // Remove extra dots and ensure only one dot exists at most
      .replace(/[^\d.]/g, "") // Allow digits and dots only
      .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
      .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

    let inputStr = fieldValue.replace(/\D/g, "");
    if (name === "cost" && inputStr.trim() === "0") {
      fieldValue = "0.00"; // Set fieldValue to "0.00" specifically for costPerItem when inputStr is "0"
    } else {
      inputStr = inputStr.replace(/^0+/, "");
    }

    if (inputStr.length == "") {
      fieldValue = "";
    } else if (inputStr.length === 1) {
      fieldValue = "0.0" + inputStr;
    } else if (inputStr.length === 2) {
      fieldValue = "0." + inputStr;
    } else {
      fieldValue =
        inputStr.slice(0, inputStr.length - 2) + "." + inputStr.slice(-2);
    }

    let qtyfieldValue;
    if (name === "qty") {
      // Remove all characters that are not digits, minus sign, or decimal point
      let cleanedValue = value.replace(/[^0-9.-]/g, "");

      // Ensure only one minus sign at the start and only one decimal point
      if (cleanedValue.indexOf("-") > 0 || cleanedValue.split("-").length > 2) {
        cleanedValue = cleanedValue.replace(/-/g, ""); // Remove all minus signs
      }
      if (cleanedValue.indexOf("-") === -1 && value[0] === "-") {
        cleanedValue = "-" + cleanedValue; // Add a single minus sign at the start if needed
      }
      let validNumberRegex = /^-?\d*(\.\d+)?$/;
      if (validNumberRegex.test(cleanedValue)) {
        qtyfieldValue = cleanedValue;
      } else {
        qtyfieldValue = inputStr;
      }
    } else if (name === "description") {
      qtyfieldValue = value;
    }

    setInstantPoSingle((prev) => ({
      ...prev,
      [name]:
        name !== "description" && name !== "qty" ? fieldValue : qtyfieldValue,
    }));
  };

  const handleChangeMultiplePo = (e, index) => {
    const { name, value } = e.target;

    /// allowed value in 0.00 format
    let fieldValue;
    fieldValue = value
      // Remove extra dots and ensure only one dot exists at most
      .replace(/[^\d.]/g, "") // Allow digits and dots only
      .replace(/^(\d*\.)(.*)\./, "$1$2") // Remove extra dots
      .replace(/^(\d*\.\d*)(.*)\./, "$1$2"); // Remove extra dots after the decimal point

    let inputStr = fieldValue.replace(/\D/g, "");
    if (name === "cost" && inputStr.trim() === "0") {
      fieldValue = "0.00"; // Set fieldValue to "0.00" specifically for costPerItem when inputStr is "0"
    } else {
      inputStr = inputStr.replace(/^0+/, "");
    }

    if (inputStr.length == "") {
      fieldValue = "";
    } else if (inputStr.length === 1) {
      fieldValue = "0.0" + inputStr;
    } else if (inputStr.length === 2) {
      fieldValue = "0." + inputStr;
    } else {
      fieldValue =
        inputStr.slice(0, inputStr.length - 2) + "." + inputStr.slice(-2);
    }

    let qtyfieldValue;
    if (name === "qty") {
      // Remove all characters that are not digits, minus sign, or decimal point
      let cleanedValue = value.replace(/[^0-9.-]/g, "");

      // Ensure only one minus sign at the start and only one decimal point
      if (cleanedValue.indexOf("-") > 0 || cleanedValue.split("-").length > 2) {
        cleanedValue = cleanedValue.replace(/-/g, ""); // Remove all minus signs
      }
      if (cleanedValue.indexOf("-") === -1 && value[0] === "-") {
        cleanedValue = "-" + cleanedValue; // Add a single minus sign at the start if needed
      }
      let validNumberRegex = /^-?\d*(\.\d+)?$/;
      if (validNumberRegex.test(cleanedValue)) {
        qtyfieldValue = cleanedValue;
      } else {
        qtyfieldValue = inputStr;
      }
    }

    if (name !== "description") {
      const multiplePoData = [...instancePoMultiple?.instantPoState];
      multiplePoData[index][name] = name !== "qty" ? fieldValue : qtyfieldValue;
      setInstancePoMultiple((prev) => ({
        instantPoState: multiplePoData,
        description: prev?.description,
      }));
    } else {
      setInstancePoMultiple((prev) => ({
        instantPoState: prev?.instantPoState,
        description: value,
      }));
    }
  };

  const handleBlur = (e, index) => {
    const { value, name } = e.target;
    if (modalType === "single_instant") {
      if (name === "qty" && value) {
        setRequired((prev) => ({
          ...prev,
          qty: "",
        }));
      } else if (name === "cost" && value) {
        setRequired((prev) => ({
          ...prev,
          cost: "",
        }));
      } else if ((name === "qty" && !value) || (name === "cost" && !value)) {
        setRequired((prev) => ({
          ...prev,
          [name]: `${
            name === "qty"
              ? "Quantity"
              : name.charAt(0).toUpperCase() + name.slice(1) + " Per Item"
          } is required`,
        }));
      }
    } else {
      const newRequired = [...required];
      if (name === "qty" && value) {
        newRequired[index][name] = "";
      } else if (name === "cost" && value) {
        newRequired[index][name] = "";
      } else if ((name === "qty" && value) || (name === "cost" && value)) {
        newRequired[index][name] =
          name === "qty"
            ? "Quantity is required"
            : `${
                name.charAt(0).toUpperCase() + name.slice(1)
              } Per Item is required`;
      }
      setRequired(newRequired);
    }
  };
  const validateFields = () => {
    let hasError = false;
    const newErrors = instancePoMultiple?.instantPoState?.map((item, index) => {
      const itemErrors = { qty: "", cost: "" };
      if (item.qty && !item.cost) {
        // itemErrors.qty = "Quantity is required";
        // hasError = true;
        itemErrors.cost = "Cost Per Item is required";
        hasError = true;
      }
      if (!item.qty && item.cost) {
        itemErrors.qty = "Quantity is required";
        hasError = true;
      }
      return itemErrors;
    });
    setRequired(newErrors);
    return !hasError; // return true if no errors
  };

  const areAllKeysEmpty = (arr) => {
    return arr.every((obj) => {
      return Object.values(obj).every((value) => value === "");
    });
  };

  const handlSumbitInstantPo = async () => {
    const formData = new FormData();
    let error = false;
    if (modalType !== "bulk-edit") {
      if (
        inventoryData?.inv_setting?.split(",")?.includes("2") &&
        !instantPoSingle?.description
      ) {
        setError(true);
        error = true;
      } else {
        setError(false);
      }
      if (!instantPoSingle?.qty) {
        setRequired((prev) => ({
          ...prev,
          qty: "Quantity is required",
        }));
        error = true;
      }
      if (!instantPoSingle?.cost) {
        setRequired((prev) => ({
          ...prev,
          cost: "Cost Per Item is required",
        }));
        error = true;
      }

      if (!error) {
        setLoading(true);
        setError(false);
        setRequired({ qty: "", cost: "" });

        formData.append("product_id", productId?.id);
        formData.append(
          "variant_id",
          isVarientEdit
            ? varientIndex
            : !Boolean(+productData?.isvarient) && !isVarientEdit
              ? ""
              : modalType === "bulk-edit"
                ? ""
                : varientIndex
        );
        formData.append(
          "merchant_id",
          LoginGetDashBoardRecordJson?.data?.merchant_id
        );
        formData.append("description", instantPoSingle?.description);
        formData.append("qty", instantPoSingle?.qty);
        formData.append("price", instantPoSingle?.cost);
        formData.append("login_type", userTypeData?.login_type);
        formData.append("token_id", userTypeData?.token_id);
        formData.append("token", userTypeData?.token);

        try {
          const response = await dispatch(
            saveSingleVarientPO(formData)
          ).unwrap();

          if (response?.status) {
            setInstantPoSingle({
              qty: "",
              cost: "",
              description: "",
            });
            ToastifyAlert("Updated Successfully", "success");
            if (isVarientEdit) {
              await fetchSingleVarientData();
            } else {
              await fetchProductDataById();
            }
            handleCloseEditModal();
          }
        } catch (err) {
          ToastifyAlert("Error!", "error");
          getUnAutherisedTokenMessage();
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (!validateFields()) {
        error = true;
      }
      if (areAllKeysEmpty(instancePoMultiple?.instantPoState)) {
        error = true;
        if (
          inventoryData?.inv_setting?.split(",")?.includes("2") &&
          !instancePoMultiple?.description
        ) {
          error = true;
        } else {
          handleCloseEditModal();
        }
      }
      if (
        inventoryData?.inv_setting?.split(",")?.includes("2") &&
        !instancePoMultiple?.description
      ) {
        setError(true);
        setLoading(false);
        error = true;
      } else {
        setError(false);
      }
      if (!error) {
        setLoading(true);
        setError(false);

        // find varient Id's
        const getFilledVarDataIds = (dataArr, varDataArr) => {
          return dataArr.reduce((ids, item, index) => {
            const allKeysFilled = Object.values(item).every(
              (value) => value !== ""
            );
            if (allKeysFilled && varDataArr[index]?.id) {
              ids.push(varDataArr[index].id);
            }
            return ids;
          }, []);
        };

        const filledVarDataIds = getFilledVarDataIds(
          instancePoMultiple?.instantPoState,
          varientData
        );

        // find varient qty

        const getFilledQtys = (instancePoState) => {
          return instancePoState
            .filter((item) =>
              Object.values(item).every((value) => value !== "")
            ) // Filter filled objects
            .map((item) => item.qty); // Map to qty values
        };

        const filledQtys = getFilledQtys(
          instancePoMultiple.instantPoState
        ).toString();

        // find price

        const getFillPrice = (instancePoState) => {
          return instancePoState
            .filter((item) =>
              Object.values(item).every((value) => value !== "")
            ) // Filter filled objects
            .map((item) => item.cost); // Map to qty values
        };

        const filledPrice = getFillPrice(
          instancePoMultiple.instantPoState
        ).toString();

        // start payload

        formData.append("product_id", productId?.id);
        formData.append(
          "variant_id",
          !Boolean(+productData?.isvarient)
            ? ""
            : modalType === "bulk-edit"
              ? filledVarDataIds?.map((i) => i)?.toString()
              : varientIndex
        );
        formData.append(
          "merchant_id",
          LoginGetDashBoardRecordJson?.data?.merchant_id
        );
        formData.append("description", instancePoMultiple?.description);
        formData.append("qty", filledQtys);
        formData.append("price", filledPrice);
        formData.append("login_type", userTypeData?.login_type);
        formData.append("token_id", userTypeData?.token_id);
        formData.append("token", userTypeData?.token);

        try {
          const response = await dispatch(saveBulkInstantPo(formData)).unwrap();

          if (response?.status) {
            setInstancePoMultiple({
              instantPoState: [],
              description: "",
            });
            ToastifyAlert("Updated Successfully", "success");
            if (isVarientEdit) {
              await fetchSingleVarientData();
            } else {
              await fetchProductDataById();
            }
            handleCloseEditModal();
          }
        } catch (err) {
          ToastifyAlert("Error!", "error");
          getUnAutherisedTokenMessage();
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <>
      <div>
        <div class="bulk-instant-po">
          <div container class="varient-form custom-scroll">
            {/* for bulk instant PO */}

            {modalType !== "single_instant" ? (
              <>
                {varientData?.map((varient, index) => {
                  return (
                    <div class="varient-container px-5">
                      {console.log("bulkInstantPo", instancePoMultiple)}
                      <div class="varientform ">
                        <p className="varientName">{varient?.variant}</p>
                        <div class="form">
                          {bulkInstantPo?.length
                            ? bulkInstantPo?.map((inp, formindex) => {
                                return (
                                  <div
                                    className="col-qv-6 inputs"
                                    key={formindex}
                                  >
                                    <div className="varient-input-wrapper">
                                      <label>{inp?.label}</label>
                                      <div className="input_area">
                                        <input
                                          class="varient-input-field"
                                          type={inp?.type}
                                          name={inp?.name}
                                          value={
                                            instancePoMultiple
                                              ?.instantPoState?.[index]?.[
                                              inp?.name
                                            ]
                                          }
                                          placeholder={inp?.placeholder}
                                          onChange={(e) =>
                                            handleChangeMultiplePo(e, index)
                                          }
                                          onBlur={(e) => handleBlur(e, index)}
                                          maxLength={
                                            // inp?.name === "qty" ? 6 : 9
                                            inp?.name === "qty" &&
                                            instancePoMultiple?.instantPoState?.[
                                              index
                                            ]?.[inp?.name].includes("-")
                                              ? 7
                                              : inp?.name === "qty"
                                                ? 6
                                                : 9
                                          }
                                        />
                                      </div>
                                      {inp?.name === "qty" &&
                                      !!required?.[index]?.qty ? (
                                        <span className="error-alert">
                                          {required?.[index]?.qty}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      {inp?.name === "cost" &&
                                      !!required?.[index]?.cost ? (
                                        <span className="error-alert">
                                          {required?.[index]?.cost}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div class="po-description-area px-5">
                  <div className="col-qv-12 inputs">
                    <div className="varient-input-wrapper">
                      <label className="varientName">Description</label>
                      <div className="input_area">
                        <textarea
                          class="varient-input-field"
                          type="text"
                          name="description"
                          style={{ height: "140px" }}
                          onChange={(e) => handleChangeMultiplePo(e, null)}
                          value={instancePoMultiple?.description}
                          placeholder="Type here..."
                        />
                        {error ? (
                          <span className="error-alert mb-2">
                            Description is required
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {Array.from({ length: 1 })?.map((_, index) => {
                  return (
                    <div class="varient-container px-5">
                      <div class="varientform ">
                        <Grid container sx={{ pt: 2.5 }}>
                          <Grid item xs={12}>
                            <p className="heading">
                              {productData.title}{" "}
                              {varientName ? `- ${varientName}` : ""}{" "}
                            </p>
                          </Grid>
                        </Grid>
                        <p className="varientName">
                          {varientData?.[varientIndex]?.variant}
                        </p>
                        <div class="form">
                          {bulkInstantPo?.length
                            ? bulkInstantPo?.map((inp, formindex) => {
                                return (
                                  <>
                                    <div
                                      className="col-qv-8 inputs"
                                      key={formindex}
                                    >
                                      <div className="varient-input-wrapper">
                                        <label>{inp?.label}</label>
                                        <div className="input_area">
                                          <input
                                            class="varient-input-field"
                                            type={inp?.type}
                                            name={inp?.name}
                                            value={instantPoSingle?.[inp?.name]}
                                            placeholder={inp?.placeholder}
                                            onChange={(e) =>
                                              handleChangeSinglePo(e, index)
                                            }
                                            onBlur={(e) => handleBlur(e)}
                                            maxLength={
                                              // inp?.name === "qty" ? 6 : 9
                                              inp?.name === "qty" &&
                                              instantPoSingle?.[
                                                inp?.name
                                              ]?.includes("-")
                                                ? 7
                                                : inp?.name === "qty"
                                                  ? 6
                                                  : 9
                                            }
                                          />
                                          {inp?.name === "qty" &&
                                          !!required?.qty ? (
                                            <span className="error-alert">
                                              {required?.qty}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                          {inp?.name === "cost" &&
                                          !!required?.cost ? (
                                            <span className="error-alert">
                                              {required?.cost}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div class="po-description-area px-5">
                  <div className="col-qv-12 inputs">
                    <div className="varient-input-wrapper">
                      <label className="varientName">Description</label>
                      <div className="input_area">
                        <textarea
                          class="varient-input-field"
                          type="text"
                          name="description"
                          style={{ height: "140px" }}
                          value={instantPoSingle?.["description"]}
                          onChange={handleChangeSinglePo}
                        />
                        {error ? (
                          <span className="error-alert mb-2">
                            Description is required
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* for single varient instant PO */}
          </div>
          <div className="box">
            <div className="variant-attributes-container">
              {/* Your existing JSX for variant attributes */}
              <div
                style={{
                  justifyContent: `${!!!varientIndex ? "space-between" : ""}`,
                }}
                className="q-add-categories-section-middle-footer  "
              >
                {!!!varientIndex ? (
                  <p
                    style={{ fontFamily: "CircularSTDBook" }}
                    className="bulk-edit-note"
                  >
                    <span className="note">Note: </span>
                    By clicking on update, Cost & Quantity of each variant will
                    be updated
                  </p>
                ) : (
                  ""
                )}
                <div
                  style={{ padding: "0px" }}
                  className="q-category-bottom-header"
                >
                  <button
                    className="quic-btn quic-btn-update submit-btn-click"
                    style={{
                      backgroundColor: "#0A64F9",
                    }}
                    onClick={handlSumbitInstantPo}
                    disabled={loading}
                  >
                    {loading ? (
                      <Box className="loader-box">
                        <CircularProgress />
                      </Box>
                    ) : (
                      ""
                    )}
                    Update
                  </button>
                  <button
                    className="quic-btn quic-btn-cancle"
                    onClick={handleCloseEditModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkInstantPo;
