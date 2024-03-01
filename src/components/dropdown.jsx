import React, { useState } from "react";
import FontAwesome from "react-fontawesome";

const DropdownSingle = ({ sortList, handleSortChange }) => {
  const [isListOpen, setIsListOpen] = useState(false);

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  const selectItem = (item) => {
    setIsListOpen(!isListOpen);
    handleSortChange(item);
  };

  return (
    <div className="bg-white relative">
      <button
        type="button"
        className="px-3 flex w-28 justify-between items-center rounded-md bg-white border-2"
        onClick={toggleList}
      >
        {/* <FontAwesomeIcon icon="fa-solid fa-arrow-up-wide-short" /> */}
        <div className="font-semibold ">Sort By</div>
        {isListOpen ? (
          <FontAwesome name="angle-up" />
        ) : (
          <FontAwesome name="angle-down" />
        )}
      </button>
      {isListOpen && (
        <div
          role="list"
          className="flex flex-col items-start border-b-2 border-l-2 border-r-2 absolute bg-white w-28 rounded-b-md"
        >
          {sortList.map((item) => (
            <button
              type="button"
              className="pl-2 font-normal "
              key={item.field}
              onClick={() => selectItem(item.field)}
            >
              {item.field} {item.isSelected && <FontAwesome name="check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DropdownMulti = ({ filteredList, handleFilterChange }) => {
  const [isListOpen, setIsListOpen] = useState(false);

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  const selectItem = (item) => {
    setIsListOpen(!isListOpen);
    handleFilterChange(item);
  };

  return (
    <div className="bg-white relative">
      <button
        type="button"
        className="px-3 flex w-36 justify-between items-center rounded-md bg-white border-2 "
        onClick={toggleList}
      >
        {/* <FontAwesomeIcon icon="fa-solid fa-arrow-up-wide-short" /> */}
        <div className="font-semibold ">Filter By</div>
        {isListOpen ? (
          <FontAwesome name="angle-up" />
        ) : (
          <FontAwesome name="angle-down" />
        )}
      </button>
      {isListOpen && (
        <div
          role="list"
          className="flex flex-col items-start border-b-2 border-l-2 border-r-2 absolute bg-white w-36 rounded-b-md"
        >
          {filteredList.map((item) => (
            <button
              type="button"
              className="pl-2 font-normal w-full text-start"
              key={item.field}
              onClick={() => selectItem(item.field)}
            >
              {item.field} {item.isSelected && <FontAwesome name="check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { DropdownMulti, DropdownSingle };
