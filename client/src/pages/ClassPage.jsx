import React from "react";
import useFetchWithAuth from "../hooks/UseFetchWithAuth.js";
import { clientURL } from "../constant.js";
import { useParams } from "react-router-dom";
import ClassLayout from "../components/common/ClassLayout.jsx";

const Class = () => {
  const subject = useParams().subject;
  const { data, error, loading } = useFetchWithAuth(
    `${clientURL}/home/${subject}`
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ClassLayout />
    </div>
  );
};

export default Class;
