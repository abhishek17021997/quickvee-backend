import axios from 'axios'
import React,{useState,useEffect}  from 'react'
import{BASE_URL,GET_EDIT_ADMIN,UPDATE_ADMIN_RECORD}from '../../../../Constants/Config'
import { useNavigate } from 'react-router-dom';

const EditAdminFunctionality=()=>{
    const navigate = useNavigate();
    const[editData,setEditData]=useState({owner_name:'',email:'',password:'',phone:'',password:''})
    const[errors,setErrors]=useState({
      owner_name:'',
      phone:'',
      email:'',
  })

    const handleEditAdmin=async(data)=>{
        
        const dataNew={admin_id:data}
        // console.log(dataNew)
        await axios.post(BASE_URL+GET_EDIT_ADMIN,dataNew,{headers:{
            "Content-Type":'multipart/form-data'
          }}).then(response=>{
            if(response.data.status==200)
            {
              //  console.log(response.data.message[0])
                setEditData(response.data.message[0])

            }

          }
           
          )
    }
    const handleChangeAdmin=(e)=>{
        const{name,value}=e.target
        let updatedErrors = { ...errors };
        // console.log(name)
      
        if (name === "owner_name") {
          updatedErrors[name] = value === "" ? `please fill the ${name} field` : '';
        }
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
             if(numericValue=="")
             {
              updatedErrors[name] = '';

             }else if (numericValue.length !== 10) {
              updatedErrors[name] = 'Phone number must be 10 digits';
            } else {
              updatedErrors[name] = '';
            }
        //   updatedErrors['phone'] = value === "" ? `please fill the ${name} field` : '';
        }
       
        setErrors(updatedErrors);
        setEditData((prevCustomerData) => ({
          ...prevCustomerData,
          [name]: value,
        }));
        
        // setEditData({...editData,[name]:value})
        

    }
    const handleKeyPress = (e) => {
      // Allow only numeric characters (key codes 48 to 57) and backspace (key code 8)
      if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
        e.preventDefault();
      }
    };

    const handleSubmitAdmin=async(e)=>{
        const data={admin_id:editData.id,name:editData.owner_name,owner_name:editData.owner_name,password:editData.password,phone:editData.phone,email:editData.email}
       
        let validate=Object.values(errors).filter(error => error !== '').length;
        
        if(validate == 0)
        {
          await axios.post(BASE_URL+UPDATE_ADMIN_RECORD,data,{headers:{
            "Content-Type":'multipart/form-data'
          }}).then(result=>{
            setEditData({owner_name:'',email:'',password:'',phone:'',password:''})
            navigate('/users/admin')
          })

        }

        

    }
    return{handleEditAdmin,editData,handleChangeAdmin,handleSubmitAdmin,errors,handleKeyPress}

}
export default EditAdminFunctionality