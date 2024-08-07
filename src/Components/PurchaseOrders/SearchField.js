import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";


const SearchField = () => {

    const [searchId, setSearchId] = useState(""); // State to track search ID

    // const handleFilter = (filterType) => {
    //   console.log("Selected filter:", filterType);
    // };
  
    const handleSearch = () => {
      console.log("Search ID:", searchId);
    };
  return (
    <>
      <div className="mx-2 my-2">
        <div
          className="box-content h-[100px] w-70 p-4 border-4 border-white bg-white rounded-xl opacity-100 my-9 mx-8"
          style={{ boxShadow: "0px 3px 6px #0000001F" }}
        >
                   <div className="bg-white p-4 mb-3 rounded-md">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search Purchase Order"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full px-4 py-2 border-none focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="text-black px-4 py-2 focus:outline-none text-xl"
              >
                <AiOutlineSearch className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SearchField;
