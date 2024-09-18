import React, { useEffect, useState } from "react";
import Servers from "./Servers";
import ServerDetails from "./ServerDetails";
import Discover from "./Discover";
import Cookies from "js-cookie";
import host from "../host";
import axios from "axios";
import { IoNotifications } from "react-icons/io5";
import { HiUser } from "react-icons/hi2";
import { GoHomeFill } from "react-icons/go";
import toast from "react-hot-toast";
import useSWR from "swr";

const Home = () => {
  const [currentServer, setCurrentServer] = useState("discover");
  const token = Cookies.get("discordToken");
  const [user, setUser] = useState({});

  const fetcher = async (url) => {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      if (res.status === 200) {
        return res.data.servers;
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const { data, isLoading, mutate } = useSWR(host + "/server", fetcher);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = host + "/profile";
        const res = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });
        if (res.status === 200) {
          setUser(res.data?.user);
        }
      } catch (error) {
        toast.error(error.response.data.message, { duration: 1000 });
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="relative flex min-h-dvh bg-slate-950">
      <Servers
        data={data}
        isLoading={isLoading}
        mutate={mutate}
        setCurrentServer={setCurrentServer}
      />
      {currentServer === "discover" ? (
        <Discover />
      ) : (
        <ServerDetails
          setCurrentServer={setCurrentServer}
          mutate={mutate}
          currentServer={currentServer}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 h-[80px] bg-slate-700 p-3">
        <div className="m-auto flex max-w-[400px] items-center justify-between gap-2 px-3">
          {user?.profileImage ? (
            <img src={user?.profileImage} alt={user?.username} className="" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-fit rounded-full bg-discord p-2 text-xl text-white">
                <HiUser />
              </div>
              <p className="font-semibold text-white">{user?.username}</p>
            </div>
          )}

          <div className="flex flex-col items-center">
            <GoHomeFill className="text-2xl text-slate-400" />
            <p className="text-xs font-semibold text-slate-300">Home</p>
          </div>

          <div className="flex flex-col items-center">
            <IoNotifications className="text-2xl text-slate-400" />
            <p className="text-xs font-semibold text-slate-300">
              Notifications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
