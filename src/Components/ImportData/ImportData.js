import React from "react";

import { BASE_URL } from "../../Constants/Config";

const ImportData = () => {
  return (
    <>
      <div className="box">
        <div className="q-attributes-top-detail-section">
        <div className="flex justify-between">
       <ul>
              <li> Download and check sample CSV file for proper file format and fields.</li>
              <li>    Please enter variant names which are created for the store. (Also, they
                are case sensitive).</li>
       </ul>
          
      
      
       

  <div className="col-span-4">
    <button
      className="csv_btn"
      onClick={() => {
        // Handle the download functionality here
        window.location.href =
          BASE_URL+"upload/SampleCSV/SampleProductsCSVnew.csv";
      }}
    >
      Sample CSV Download
    </button>
  </div>
  </div>
  </div>
      </div>

    </>
  );
};

export default ImportData;

