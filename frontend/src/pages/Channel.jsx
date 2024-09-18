import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import host from "../host";
import axios from "axios";
import { FaArrowLeft, FaHashtag } from "react-icons/fa6";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { IoSend, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import Message from "./Message";

const Channel = () => {
  const [file, setFile] = useState();
  const [message, setMessage] = useState("");
  const [emojis, setEmojis] = useState(false);
  const [channel, setChannel] = useState({});
  const { id } = useParams();
  const socket = useRef();
  const token = Cookies.get("discordToken");
  const { userId, username } = jwtDecode(token);

  const navigate = useNavigate();

  useEffect(() => {
    socket.current = io(host);
    socket.current.emit("joinChannel", { channelId: id });

    //fetching channel details

    const fetchChannel = async () => {
      try {
        const url = host + "/channel/" + id;
        const res = await axios.get(url);
        if (res.status === 200) {
          setChannel(res.data?.channel);
        }
      } catch (error) {
        toast.error(error.response.data.message, { duration: 1000 });
      }
    };

    fetchChannel();
  }, [id]);

  const fetcher = async (url) => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        return res.data?.messages;
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const { data, isLoading, error, mutate } = useSWR(
    host + "/messages/" + id,
    fetcher,
    {
      onError: (err) => toast.error(err.message),
    },
  );

  const handleSendMessage = async () => {
    try {
      socket.current.emit("sendMessage", {
        channelId: id,
        message,
        userId,
        date: new Date(),
        username,
      });

      const url = host + "/message";
      const res = await axios.post(
        url,
        {
          channelId: id,
          message,
          date: new Date(),
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (res.status === 201) {
        toast.success("Message sent", { duration: 1000 });
        setMessage("");
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.off("message"); // Remove existing listeners
      socket.current.on("message", (data) => {
        mutate((messages) => [...messages, { ...data }], false);
      });
    }
    return () => {
      socket.current.off("message"); // Clean up to avoid duplicates
    };
  });

  const handleEmoji = (e) => {
    setMessage((prev) => prev + e.emoji);
  };

  return (
    <div className="relative flex min-h-dvh min-w-[300px] flex-col bg-slate-900">
      <div className="flex items-center gap-3 p-3">
        <FaArrowLeft
          onClick={() => navigate("/")}
          className="text-xl text-slate-300"
        />

        <div className="flex items-center gap-2">
          <FaHashtag className="text-xl text-slate-300" />
          <p className="font-semibold text-slate-200">Name</p>
        </div>
      </div>

      <div className="flex w-full max-w-[800px] flex-grow flex-col justify-end gap-2 self-center rounded-t-3xl bg-slate-800 p-4 pb-[80px] text-slate-100">
        <div className="flex w-full max-w-[600px] flex-col gap-2 self-center">
          <div className="w-fit rounded-full bg-slate-700 p-4 text-3xl">
            <FaHashtag />
          </div>

          <h1 className="text-3xl font-semibold">
            Welcome to
            <span className="first-letter:uppercase">
              {" "}
              {channel?.name}
            </span>{" "}
            server
          </h1>

          <p className="text-sm font-semibold text-slate-300">
            This is your brand new, shiny server.
          </p>
        </div>

        <ul className="mt-4 flex w-full max-w-[600px] flex-col gap-4 self-center">
          {data?.map((m) => {
            return (
              <Message mutate={mutate} key={v4()} userId={userId} data={m} />
            );
          })}
        </ul>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 m-auto flex max-w-[600px] items-center justify-center gap-2 bg-slate-800 p-3">
        <label
          htmlFor="file"
          className="rounded-full bg-discord p-2 text-2xl text-white"
        >
          <IoAddOutline />
        </label>

        <input
          onChange={(e) => setFile(e.target.files[0])}
          id="file"
          className="hidden"
          type="file"
        />
        <div className="flex flex-grow items-center justify-center rounded-3xl bg-slate-900 px-2">
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="h-[40px] w-[90%] bg-transparent pl-3 text-sm text-slate-200 outline-none"
          />

          <div className="relative flex h-[40px] w-[10%] items-center justify-center outline-none">
            {emojis ? (
              <IoCloseOutline
                onClick={() => setEmojis(false)}
                className="cursor-pointer text-2xl text-slate-200"
              />
            ) : (
              <BsFillEmojiSmileFill
                onClick={() => setEmojis(true)}
                className="cursor-pointer text-lg text-slate-200"
              />
            )}

            <div className="absolute bottom-[60px] right-0 z-50">
              <EmojiPicker
                autoFocusSearch={false}
                open={emojis}
                theme="dark"
                emojiStyle="google"
                width={300}
                height={350}
                onEmojiClick={handleEmoji}
                suggestedEmojisMode="recent"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSendMessage}
          className="rounded-full bg-discord p-2 text-2xl text-white"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default Channel;
