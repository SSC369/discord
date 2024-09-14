import React, { useEffect, useState } from "react";
import Servers from "./Servers";
import ServerDetails from "./ServerDetails";
import Discover from "./Discover";
import Cookies from "js-cookie";
import host from "../host";
import axios from "axios";

const Home = () => {
  const [currentServer, setCurrentServer] = useState("discover");
  const token = Cookies.get("discordToken");
  const [user, setUser] = useState();

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
    <div className="relative flex min-h-[140vh] bg-slate-950">
      <Servers setCurrentServer={setCurrentServer} />
      {currentServer === "discover" ? (
        <Discover />
      ) : (
        <ServerDetails currentServer={currentServer} />
      )}

      <div className="fixed inset-x-0 bottom-0 h-[80px] bg-slate-700">
        Profile
      </div>
    </div>
  );
};

export default Home;
