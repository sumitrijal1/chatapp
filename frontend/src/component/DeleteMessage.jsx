import { useState } from "react";
import { useDispatch } from "react-redux";
import { deltemessageforme, deleteforeveryone } from "../store/message";

const DeleteMessage = ({messageid,onClose}) => {
  const [deleteMessage, setDeleteMessage] = useState(false);
  const dispatch = useDispatch()

  const handleMoreDelete = (e) => {
    e.stopPropagation(); // prevents click from bubbling to parent
    setDeleteMessage((prev) => !prev); // toggle instead of only setting true
  };
  console.log(deleteMessage);

  const handleDeleteForMe = (e) => {
    e.stopPropagation();
    // Handle delete for me logic here
    dispatch(deltemessageforme(messageid)); // Call the thunk to delete the message for the user
    onClose()
  };

  const handleDeleteForEveryone = (e) => {
    e.stopPropagation();
    // Handle delete for everyone logic here
    dispatch(deleteforeveryone(messageid)); // Call the thunk to delete the message for everyone
   onClose()
  };
  


  return (
    <div className="relative">
      {/* Three dot button */}
      <p
        className="cursor-pointer hover:text-red-400"
        onClick={handleMoreDelete}
      >
        delete
      </p>

      {/* Delete options dropdown */}
      {deleteMessage && (
        <div className="absolute bg-gray-800 rounded shadow-lg z-10">
          <p onClick={handleDeleteForMe} className="text-red-400 px-3 py-1 cursor-pointer hover:bg-gray-700">
            delete for me
          </p>
          <p onClick={handleDeleteForEveryone} className="cursor-pointer px-3 py-1 hover:bg-gray-700 hover:text-gray-300">
            delete for everyone
          </p>
        </div>
      )}
    </div>
  );
};

export default DeleteMessage;


//  Whenever a parent conditionally renders a child AND both have onClick, 
//  the bubble will cause the parent to re-render and reset the child's state.

// Use e.stopPropagation() whenever a child element has a click handler and its parent
//  also has a click handler that you don't want triggered at the same time.