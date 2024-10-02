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

import { Navigate, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { FaArrowLeft, FaHashtag } from "react-icons/fa6";

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

const EditServer = () => {
  const [file, setFile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [serverName, setServerName] = useState("");
  const discordToken = Cookies.get("discordToken");
  const { id } = useParams();

  const fetcher = async (url) => {
    try {
      const res = await axios.get(url);

      if (res.status === 200) {
        const { server } = res.data;
        return server;
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const url = host + "/server/" + id;
  const { data, isLoading, mutate } = useSWR(url, fetcher);

  useEffect(() => {
    if (!isLoading) {
      setImageUrl(data?.image);
      setServerName(data?.name);
    }
  }, [isLoading]);

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
      if (!serverName) return;
      const url = host + "/server/" + id;
      const res = await axios.put(
        url,
        {
          name: serverName,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: discordToken,
          },
        },
      );
      if (res.status === 200) {
        toast.success(res.data.message, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  return (
    <div className="flex min-h-dvh min-w-[300px] flex-col bg-slate-900 px-3">
      <div className="mt-2 flex items-center gap-3">
        <FaArrowLeft
          onClick={() => navigate("/")}
          className="text-xl text-slate-300"
        />

        <div className="flex items-center gap-2">
          <FaHashtag className="text-xl text-slate-300" />
          <p className="font-semibold text-slate-300">Edit Server</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 h-fit w-[100%] max-w-md rounded-lg bg-gray-800 shadow-lg"
      >
        <div className="flex flex-col items-center gap-3 p-4">
          <h1 className="text-xl font-semibold text-white">Edit Your Server</h1>

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
              className="relative mt-10 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-100 p-5 text-white"
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
            <label className="font-semibold text-slate-300">Server name</label>

            <div className="mt-2 flex items-center rounded-2xl bg-slate-950">
              <input
                type="text"
                placeholder="Enter server name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="h-[50px] w-[90%] bg-transparent p-2 pl-3 text-sm text-white outline-none"
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
              style={
                serverName === data?.name || !serverName
                  ? { opacity: 0.5, pointerEvents: "none" }
                  : {}
              }
              type="submit"
              className="mt-4 h-[50px] w-full rounded-3xl bg-discord text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
        </div>
      </form>

      <h1 className="mt-10 text-center font-semibold text-slate-300">
        Members
      </h1>
      <ul className="w-[100%] bg-gray-800 shadow-lg">
        {data?.members.map((m) => {})}
      </ul>
    </div>
  );
};

export default EditServer;
