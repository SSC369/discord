import React, { useEffect, useState, useCallback } from "react";
import host from "../host";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { debounce } from "lodash";
import { HiUser } from "react-icons/hi2";

const InviteFriends = ({ serverId, query, inviterUserId, close }) => {
  const [friends, setFriends] = useState([]);

  // Wrap the fetchFriends function with debounce
  const fetchFriends = useCallback(
    debounce(async (searchQuery) => {
      try {
        const url = host + "/invite/users/" + serverId + "?name=" + searchQuery;
        const res = await axios.get(url);
        if (res.status === 200) {
          setFriends(res.data.users);
        }
      } catch (error) {
        toast.error(error.response.data.message, { duration: 1000 });
      }
    }, 500),
    [serverId],
  );

  useEffect(() => {
    if (query) {
      fetchFriends(query);
    }
    // Cleanup: cancel pending debounced calls if `query` changes or component unmounts
    return () => {
      fetchFriends.cancel();
    };
  }, [query]);

  const handleInvite = async (id) => {
    try {
      const url = host + "/invite";
      const res = await axios.post(url, {
        inviterUserId,
        receiverUserId: id,
        serverId,
      });
      if (res.status === 201) {
        toast.success(res.data.message, { duration: 1000 });
        close();
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    }
  };

  return (
    <ul className="mt-3 list-none">
      {friends?.map((f) => {
        const { username, invite } = f;
        return (
          <li className="flex items-center gap-3" key={f._id}>
            <div className="mt-1 w-fit rounded-full bg-discord p-3 text-2xl text-white">
              <HiUser />
            </div>
            <p className="mr-auto text-xl text-white">{username}</p>

            {invite && (
              <button
                onClick={() => handleInvite(f._id)}
                className="cursor-pointer rounded-lg bg-discord p-2 text-sm font-medium text-white"
              >
                Invite
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default InviteFriends;
