import React, { useEffect, useState } from "react";
import Servers from "./Servers";
import ServerDetails from "./ServerDetails";
import Discover from "./Discover";
import Cookies from "js-cookie";
import host from "../host";
import axios from "axios";
import { TbLogout } from "react-icons/tb";
import { IoNotifications, IoClose } from "react-icons/io5";
import { HiUser } from "react-icons/hi2";
import { GoHomeFill } from "react-icons/go";
import toast from "react-hot-toast";
import useSWR from "swr";
import { MdOutlineDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { LuComputer } from "react-icons/lu";

const Home = () => {
  const [currentServer, setCurrentServer] = useState("discover");
  const [notificationModal, setNotificationModal] = useState(false);

  const [user, setUser] = useState({});

  const token = Cookies.get("discordToken");
  const navigate = useNavigate();
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
    } catch (error) {}
  };

  const { data, isLoading, mutate } = useSWR(host + "/server", fetcher);

  const invitationsFetcher = async (url) => {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });

      if (res.status === 200) {
        return res.data.invitations;
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const { data: invites } = useSWR(host + "/invite", invitationsFetcher);

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

  const handleAcceptInvite = async (id, receiverUserId, serverId) => {
    try {
      const url = host + "/invite/" + id;

      const res = await axios.put(url, {
        receiverUserId,
        serverId,
      });
      if (res.status === 200) {
        toast.success(res.data.message, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  const handleRejectInvite = async (id) => {
    try {
      const url = host + "/invite/" + id;

      const res = await axios.delete(url);
      if (res.status === 200) {
        toast.success(res.data.message, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

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

          <div
            onClick={() => setNotificationModal(true)}
            className="flex flex-col items-center"
          >
            <IoNotifications className="text-2xl text-slate-400" />
            <p className="text-xs font-semibold text-slate-300">
              Notifications
            </p>
          </div>

          <div
            onClick={() => {
              Cookies.remove("discordToken");
              toast.success("Logout successful", { duration: 1000 });
              setTimeout(() => navigate("/login"), 1000);
            }}
            className="flex flex-col items-center"
          >
            <TbLogout className="text-2xl text-slate-400" />
            <p className="text-xs font-semibold text-slate-300">Logout</p>
          </div>
        </div>
      </div>

      {notificationModal && (
        <Modal onClose={() => setNotificationModal(false)}>
          <h1 className="border-b-2 border-b-slate-600 pb-2 text-center text-2xl font-semibold text-slate-200">
            Invites
          </h1>

          {invites?.length > 0 && (
            <ul className="mt-3 flex flex-col gap-5">
              {invites.map((i) => {
                const { _id, name, image, receiverUserId, serverId } = i;
                return (
                  <li
                    className="flex items-center justify-between gap-2"
                    key={i._id}
                  >
                    {image ? (
                      <img
                        alt={name}
                        src={image}
                        className="h-[50px] w-[50px] rounded-full"
                      />
                    ) : (
                      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-discord">
                        <LuComputer className="text-2xl" />
                      </div>
                    )}

                    <p className="flex-grow font-semibold text-slate-100">
                      {name}
                    </p>

                    <div className="flex items-center gap-2">
                      <div
                        onClick={() =>
                          handleAcceptInvite(_id, receiverUserId, serverId)
                        }
                        className="w-fit rounded-full bg-green-400 p-1 text-2xl text-white"
                      >
                        <MdOutlineDone />
                      </div>
                      <div
                        onClick={() => handleRejectInvite(_id)}
                        className="w-fit rounded-full bg-red-500 p-1 text-2xl text-white"
                      >
                        <IoClose />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Home;
