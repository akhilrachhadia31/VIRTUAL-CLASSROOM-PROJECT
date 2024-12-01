import React from "react";
import useFetchWithAuth from "../hooks/UseFetchWithAuth.js";
import { clientURL } from "../constant.js";
import HomeLayout from "../components/common/HomeLayout.jsx";

const Home = () => {
  const { data, error, loading } = useFetchWithAuth(`${clientURL}/home`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <HomeLayout />;
};

export default Home;
