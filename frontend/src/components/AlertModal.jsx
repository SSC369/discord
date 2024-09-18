import React from "react";
import { IoClose } from "react-icons/io5";

const AlertModal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex h-[120px] w-[80%] max-w-[400px] flex-col justify-center rounded-xl bg-slate-800">
        {children}
      </div>
    </div>
  );
};

export default AlertModal;
