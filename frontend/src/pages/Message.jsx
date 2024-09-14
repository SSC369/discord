import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { HiUser } from "react-icons/hi2";
import { LiaEdit } from "react-icons/lia";
import host from "../host";

const Message = ({ data, userId, mutate }) => {
  const { message, username, date } = data;
  const [edit, setEdit] = useState(false);
  const [editMessage, setEditMessage] = useState(message);

  const handleEdit = async () => {
    try {
      const url = host + "/message/" + data._id;
      const res = await axios.put(url, {
        message: editMessage,
        date: new Date(),
      });
      if (res.status === 200) {
        setEdit(false);
        mutate();
        toast.success(res.data?.message, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const handleDelete = async () => {
    try {
      const url = host + "/message/" + data._id;
      const res = await axios.delete(url);
      if (res.status === 200) {
        mutate();
        toast.success(res.data?.message, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  return (
    <li className="flex items-start gap-3">
      <div
        className={`mt-1 w-fit rounded-full p-3 text-2xl ${userId === data.userId ? "bg-discord" : "bg-slate-900"}`}
      >
        <HiUser />
      </div>

      <div className="flex w-full flex-col justify-start gap-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold first-letter:capitalize">
              {username}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              {dayjs(date).format("DD/MM/YYYY hh:mm A")}
            </p>
          </div>

          {userId === data.userId && (
            <div className="flex items-start gap-2 text-sm md:text-lg">
              <AiFillDelete
                onClick={handleDelete}
                className="cursor-pointer hover:text-discord"
              />
              <LiaEdit
                onClick={() => setEdit(true)}
                className="cursor-pointer hover:text-discord"
              />
            </div>
          )}
        </div>
        {edit ? (
          <div className="flex items-center rounded-md bg-slate-700">
            <input
              value={editMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEdit();
                }
              }}
              onChange={(e) => setEditMessage(e.target.value)}
              className="h-[36px] w-[90%] bg-transparent pl-2 text-sm outline-none"
            />
            {message !== editMessage && editMessage !== "" && (
              <button
                onClick={handleEdit}
                className="flex w-[10%] items-center justify-center pr-2 text-xs font-medium"
              >
                Save
              </button>
            )}
          </div>
        ) : (
          <p className="text-wrap text-sm font-medium text-slate-300">
            {message}
          </p>
        )}
      </div>
    </li>
  );
};

export default Message;
