import TopUsers from "@/components/page/Home/TopUser/TopUser";
import React from "react";

const sampleUser: TopUser[] = [
  {
    id: 1,
    name: "User 1",
    like: 10132321312420,
    upload: 1,
    created_at: 1713105140331,
  },
  {
    id: 2,
    name: "User 2",
    username: "username2",
    like: 93423439,
    upload: 1,
    created_at: 1713105140331,
  },
  {
    id: 3,
    name: "User 3",
    image:
      "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    like: 923218,
    upload: 1,
    created_at: 1713105140331,
  },
  {
    id: 4,
    name: "User 4",
    like: 97123,
    upload: 1,
    created_at: 1713105140331,
  },
];

const TopUserPage = () => {
  return <TopUsers userData={sampleUser} />;
};

export default TopUserPage;
