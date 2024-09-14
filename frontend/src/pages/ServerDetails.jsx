import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import useSWR from "swr";
import host from "../host";
import Loader from "../components/Loader";
import Cookies from "js-cookie";
import Channels from "./Channels";
import { FaAngleRight } from "react-icons/fa6";
import { LuComputer } from "react-icons/lu";
import Modal from "../components/Modal";
import { GoDotFill } from "react-icons/go";
import { IoPersonAdd, IoNotifications } from "react-icons/io5";
import { FaHashtag } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { HiSpeakerWave } from "react-icons/hi2";
import { TailSpin } from "react-loader-spinner";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const ServerDetails = ({ currentServer }) => {
  const [serverModal, setServerModal] = useState(false);
  const [createChannelModal, setCreateChannelModal] = useState(false);
  const [serverName, setServerName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("discordToken");
  const { userId } = jwtDecode(token);
  const socket = useRef();

  useEffect(() => {
    if (currentServer) {
      socket.current = io(host);
      socket.current.emit("userOnline", { serverId: currentServer, userId });

      socket.current.on("onlineUsersCount", (count) => {
        setOnlineUsers(count);
      });
    }
  }, [currentServer]);

  const fetchServer = async (url) => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        return res.data.server;
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const { data, isLoading } = useSWR(
    host + "/server/" + currentServer,
    fetchServer,
  );

  const fetchChannels = async (url) => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        return res.data.channels;
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const {
    data: channelsData,
    isLoading: channelsLoading,
    mutate,
  } = useSWR(host + "/channels/" + currentServer, fetchChannels);

  const handleChannel = async () => {
    try {
      if (serverName.length === 0) return;
      const url = host + "/channel";
      const res = await axios.post(
        url,
        {
          serverId: currentServer,
          name: serverName,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (res.status === 201) {
        toast.success(res.data.message, { duration: 1000 });
        mutate();
        setServerName("");
        setCreateChannelModal(false);
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  return (
    <>
      <div
        style={{ width: "calc(100vw - 100px)" }}
        className="min-h-dvh flex-grow rounded-tl-[30px] bg-slate-900 text-white"
      >
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <div className="flex flex-col border-b-2 border-slate-700 p-3 pl-5">
              <div
                onClick={() => setServerModal(true)}
                className="flex cursor-pointer items-center gap-2"
              >
                <h1 className="text-lg font-semibold">{data?.name} server</h1>
                <FaAngleRight className="text-xs text-slate-400" />
              </div>
            </div>

            {!channelsLoading && <Channels data={channelsData} />}
          </div>
        )}
      </div>

      {/* Server details modal*/}
      {serverModal && (
        <Modal onClose={() => setServerModal(false)}>
          {data?.image ? (
            <img
              className="mb-2 h-[60px] w-[60px] rounded-xl"
              src={data?.image}
              alt={data?.name}
            />
          ) : (
            <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-discord">
              <LuComputer className="text-2xl" />
            </div>
          )}
          <h1 className="mt-4 text-2xl font-semibold text-slate-100">
            {data?.name}
          </h1>

          <div className="mt-3 flex items-center gap-4 text-sm font-medium text-slate-400">
            <div className="flex items-center">
              <GoDotFill className="mr-1 text-green-500" />
              <span>{onlineUsers}</span>
              <p>Online</p>
            </div>

            <div className="flex items-center">
              <GoDotFill className="mr-1" />
              <span>{data?.members?.length + 1}</span>
              <p className="">Member</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-6">
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-slate-600 text-2xl text-slate-300">
              <IoPersonAdd />
            </div>

            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-slate-600 text-2xl text-slate-300">
              <IoNotifications />
            </div>

            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-slate-600 text-2xl text-slate-300">
              <IoIosSettings />
            </div>
          </div>

          <ul className="mt-4 flex flex-col rounded-2xl bg-slate-700 p-3 text-sm font-semibold text-slate-100">
            <li
              onClick={() => {
                setCreateChannelModal(true);
              }}
              className="mb-3 cursor-pointer border-b-2 border-b-slate-600 pb-2"
            >
              Create Channel
            </li>
            <li className="cursor-pointer">Edit Server Profile</li>
          </ul>
        </Modal>
      )}

      {/* Channel creation  modal*/}
      {createChannelModal && (
        <Modal onClose={() => setCreateChannelModal(false)}>
          <h1 className="text-center text-lg font-semibold text-slate-100">
            Create Channel
          </h1>
          <div className="mt-3 flex flex-col">
            <label className="text-lg font-semibold text-slate-400">
              Channel Name
            </label>
            <input
              onChange={(e) => setServerName(e.target.value)}
              value={serverName}
              type="text"
              placeholder="Enter channel name"
              className="h-[60px] border-b-2 border-b-slate-700 bg-transparent text-sm font-semibold text-slate-200 placeholder-gray-500 outline-none"
            />
          </div>

          <label className="mt-3 text-lg font-semibold text-slate-400">
            Channel Type
          </label>

          <div className="flex items-center p-3 text-slate-400">
            <FaHashtag className="text-3xl" />
            <div className="ml-4 flex flex-grow flex-col text-sm">
              <p className="text-slate-200">Text</p>
              <p>Post images, GIFs, stickers, opinions, and puns</p>
            </div>
            <input
              name="channel"
              defaultChecked
              className="h-[16px] w-[16px]"
              type="radio"
            />
          </div>

          <div className="flex items-center p-3 text-slate-400">
            <HiSpeakerWave className="text-3xl" />
            <div className="ml-4 flex flex-grow flex-col text-sm">
              <p className="text-slate-200">Voice</p>
              <p>Hang out together with voice, video, and screen share</p>
            </div>
            <input name="channel" className="h-[16px] w-[16px]" type="radio" />
          </div>

          <button
            style={
              serverName === "" ? { opacity: 0.5, pointerEvents: "none" } : {}
            }
            onClick={handleChannel}
            type="submit"
            className="mb-2 mt-5 flex h-12 w-[200px] items-center justify-center self-center rounded-lg bg-discord text-sm font-medium text-white transition"
          >
            {loading ? (
              <TailSpin
                visible={true}
                height="30"
                width="30"
                color="white"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "Create"
            )}
          </button>
        </Modal>
      )}
    </>
  );
};

export default ServerDetails;
