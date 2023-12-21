import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { editAttribute } from "../../Redux/features/Attributes/attributesSlice";
import CrossIcon from "../../Assests/Dashboard/cross.svg";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { FormControl, InputLabel, MenuItem, Select, TextField, } from "@mui/material";
import { BASE_URL, ADD_ATTRIBUTE } from "../../Constants/Config";

const EditDeliveryAddress = ({attribute , allattributes}) => {
   
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [nameExists , setNameExists] =  useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [newAttribute, setNewAttribute] = useState("");
    const [nameExistsEdit , setNameExistsEdit] =  useState("");
    const [submitmessage, setsubmitmessage] = useState("");
    
    const openModal = () => {
        setShowModal(true);
        setNewAttribute(attribute.title);
      };

      
    const closeModal = () => {
        // setNewAttribute('');
        setShowModal(false);
      };
    const handleClose = () => {
      setOpen(false);
    //   values.errors.firstname = "";
    //   values.errors.lastname = "";
    //   values.errors.state = "";
    //   values.errors.city = "";
    //   values.errors.phone = "";
    //   values.errors.streetaddress = "";
    //   values.errors.apartmentnumber = "";
    //   values.errors.city = "";
    //   values.errors.zipcode = "";
    }
    // const {
    //   DeliveryAddressInput,
    //   handleSubmitDeliveryAddress,
    //   values,
    //   submitmessage,
    //   setsubmitmessage,
    // } = EditDeliveryAddressLogic({ handleClose ,address});
    const dispatch = useDispatch();
    const changeTittleHandler = (event) => {
        console.log(event.target.value);
        setNewAttribute(event.target.value);
        const nameExists = allattributes.some(
          (item) => item.title === event.target.value && item.id !== attribute.id
        );
        if (nameExists) {
          setErrorMessage("Attribute name already exists");
          setNameExists(true);
        } else {
          setErrorMessage("");
          setNameExists(false);
        }
        setShowModal(true);
        setNewAttribute(event.target.value);
      };

      const handleEditAttribute = async () => {
        console.log(attribute + "dfdsfsdf")
        console.log(allattributes)
        if(nameExists){
          return false;
        }
        const editItem = {
          merchant_id: "MAL0100CA",
          varient_id:attribute.id,
          title: newAttribute,
        };
        const data = editItem;
        // console.log(data);
        // return false;
        const response = await axios.post(BASE_URL + ADD_ATTRIBUTE, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response) {
          dispatch(editAttribute({id:attribute.id , title:newAttribute}))
          setShowModal(false);
          
        } else {
          setsubmitmessage(response.data.message);
        }
      };


    setTimeout(() => {
    //   setsubmitmessage("")
    }, 4000);
    return (
        <>
          <div>
       <Button className="modal-main-button edit-delivery-address-button" onClick={openModal}>
       {/* <img src={Edit}  alt="edit" /> */}Edit
       </Button>
       {showModal && (
        <div className="q-custom-modal-container" id="addtributes_">
          {/* Your modal JSX */}
          <div className="q-custom-modal-content">
            {/* Your modal content */}
            <div className="">
              <p className="q-custom-modal-header ">Update Attribute
              <img src={CrossIcon} alt="icon" className="ml-auto mb-4" onClick={closeModal} /></p>
            </div>
            {/* ... other modal content ... */}
            <input
              type="text"
              placeholder="Enter attribute title"
              className="q-custom-input-field"
              value={newAttribute}
              onChange={changeTittleHandler}
            />
            <span className="input-error">
              {errorMessage !== "" ? errorMessage : ""}
            </span>
          <div className='q-add-categories-section-middle-footer'>
            <button onClick={(handleEditAttribute)} className='quic-btn quic-btn-save'>
              Update
            </button>
            <button onClick={(closeModal) } className='quic-btn quic-btn-cancle'>
              Cancel
            </button>
          </div>
          </div>
        </div>
      )}
           
          </div>
        </>
      );
    };
export default EditDeliveryAddress;