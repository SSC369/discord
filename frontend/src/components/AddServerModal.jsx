import React, { useEffect, useState } from "react";
import { IoClose, IoCloseCircle } from "react-icons/io5";
import { MdCameraAlt } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import host from "../host";
import { app } from "../utils/firebase";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { PiWarningCircleFill } from "react-icons/pi";
import Modal from "./Modal";
import { FaArrowLeft } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";

function generateUniqueRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

const AddServerModal = ({ isOpen, onClose, mutate }) => {
  const [file, setFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [serverName, setServerName] = useState("");
  const [joinServerModal, setJoinServerModal] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const discordToken = Cookies.get("discordToken");
  const [errorMessage, setErrorMessage] = useState(false);

  const uploadFile = () => {
    const storage = getStorage(app);
    const name = new Date() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");

            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setFile("");
        });
      },
    );
  };

  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const url = host + "/server";
      const res = await axios.post(
        url,
        {
          name: serverName,
          image: imageUrl,
          inviteCode: generateUniqueRandomString(),
        },
        {
          headers: {
            Authorization: discordToken,
          },
        },
      );
      if (res.status === 201) {
        toast.success(res.data.message, { duration: 1000 });
        mutate();
        setServerName("");
        setImageUrl("");
        onClose();
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const handleJoinSevrer = () => {
    try {
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="mx-4 h-fit w-[100%] max-w-md rounded-lg bg-gray-800 shadow-lg sm:mx-auto"
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="m-2 text-gray-500 hover:text-[#57F287]"
              >
                <IoClose fontSize={30} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 p-4">
              <h1 className="text-xl font-semibold text-white">
                Create Your Server
              </h1>
              <p className="max-w-[400px] text-center text-sm text-gray-300">
                Your server is where you and your friends hang out. Make yours
                and start talking.
              </p>

              {imageUrl ? (
                <div className="relative">
                  <img
                    className="h-[80px] w-[80px] rounded-full"
                    src={imageUrl}
                    alt="server"
                  />
                  <div
                    onClick={(e) => {
                      setImageUrl("");
                      e.stopPropagation();
                    }}
                    className="absolute right-0 top-0 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-discord text-white"
                  >
                    <IoClose />
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="file"
                  className="relative mt-10 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-100 p-5"
                >
                  <MdCameraAlt fontSize={30} />
                  <p className="text-sm uppercase text-slate-300">Upload</p>

                  <div className="absolute right-1 top-1 rounded-full bg-discord p-1">
                    <IoAddOutline className="text-white" />
                  </div>
                </label>
              )}

              <input
                onChange={(e) => setFile(e.target.files[0])}
                id="file"
                className="hidden"
                type="file"
              />

              <div className="w-full">
                <label className="font-semibold text-slate-300">
                  Server name
                </label>

                <div className="mt-2 flex items-center rounded-2xl bg-slate-950">
                  <input
                    type="text"
                    placeholder="Enter server name"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="h-[50px] w-[90%] bg-transparent p-2 pl-3 text-sm outline-none"
                  />
                  {serverName && (
                    <button className="flex w-[10%] items-center justify-center">
                      <IoCloseCircle
                        onClick={() => setServerName("")}
                        className="text-2xl text-slate-300"
                      />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-4 h-[50px] w-full rounded-3xl bg-discord text-sm font-semibold"
                >
                  Create Server
                </button>

                <p className="my-3 mt-4 text-center text-lg font-semibold">
                  Have an invite already?
                </p>
                <div
                  onClick={() => setJoinServerModal(true)}
                  className="flex h-[50px] w-full items-center justify-center rounded-3xl bg-discord text-sm font-semibold"
                >
                  <p>Join a Server</p>
                </div>
              </div>
            </div>
          </form>
          {joinServerModal && (
            <Modal>
              <button
                onClick={() => {
                  setJoinServerModal(false);
                  onClose();
                }}
              >
                <FaArrowLeft className="text-xl" />
              </button>

              <h1 className="text-center text-xl font-bold">
                Join an existing server
              </h1>
              <p className="mt-2 text-center text-sm font-semibold text-slate-400">
                Enter an invite below to join an existing server
              </p>

              <div className="mt-4 flex flex-col">
                <label className="text-sm font-semibold text-slate-300">
                  Invite Link
                </label>
                <div className="mt-2 flex items-center rounded-2xl bg-slate-950">
                  <input
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        setErrorMessage(true);
                      }
                    }}
                    type="text"
                    placeholder="https://discord.gg/htkzmak"
                    value={inviteLink}
                    onChange={(e) => {
                      setErrorMessage(false);
                      setInviteLink(e.target.value);
                      if (e.target.value === "") {
                        setErrorMessage(true);
                      }
                    }}
                    className="h-[50px] w-[90%] bg-transparent p-2 pl-3 text-sm outline-none placeholder:font-semibold"
                  />
                  {serverName && (
                    <button className="flex w-[10%] items-center justify-center">
                      <IoCloseCircle
                        onClick={() => setInviteLink("")}
                        className="text-2xl text-slate-300"
                      />
                    </button>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="mt-2 flex items-center gap-1 text-red-500">
                  <PiWarningCircleFill className="" />

                  <p className="text-xs font-semibold">
                    Please enter a valid invite link or invite code.
                  </p>
                </div>
              )}

              <p className="mt-2 text-xs font-semibold text-slate-400">
                Invites should look like https://discord.gg/htkzmak or
                https://discord.gg/cool-people
              </p>

              <button className="mt-4 h-[50px] w-full rounded-3xl bg-discord text-sm font-semibold">
                Join with Invite Link
              </button>
            </Modal>
          )}
        </div>
      )}
    </>
  );
};

export default AddServerModal;
