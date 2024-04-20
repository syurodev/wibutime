import TopUsers from "@/components/page/Home/TopUser/TopUser";
import React from "react";

const sampleUser: {
  daily: TopUser[];
  weekly: TopUser[];
  monthly: TopUser[];
  all: TopUser[];
} = {
  daily: [
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
    {
      id: 5,
      name: "User 1",
      like: 10132321312420,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 6,
      name: "User 2",
      username: "username2",
      like: 93423439,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 7,
      name: "User 3",
      image:
        "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      like: 923218,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 8,
      name: "User 4",
      like: 97123,
      upload: 1,
      created_at: 1713105140331,
    },
  ],
  weekly: [
    {
      id: 9,
      name: "User 1",
      like: 10132321312420,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 10,
      name: "User 2",
      username: "username2",
      like: 93423439,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 11,
      name: "User 3",
      image:
        "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      like: 923218,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 12,
      name: "User 4",
      like: 97123,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 13,
      name: "User 1",
      like: 10132321312420,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 14,
      name: "User 2",
      username: "username2",
      like: 93423439,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 15,
      name: "User 3",
      image:
        "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      like: 923218,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 16,
      name: "User 4",
      like: 97123,
      upload: 1,
      created_at: 1713105140331,
    },
  ],
  monthly: [
    {
      id: 17,
      name: "User 1",
      like: 10132321312420,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 18,
      name: "User 2",
      username: "username2",
      like: 93423439,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 19,
      name: "User 3",
      image:
        "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      like: 923218,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 20,
      name: "User 4",
      like: 97123,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 21,
      name: "User 1",
      like: 10132321312420,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 22,
      name: "User 2",
      username: "username2",
      like: 93423439,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 23,
      name: "User 3",
      image:
        "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      like: 923218,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 24,
      name: "User 4",
      like: 97123,
      upload: 1,
      created_at: 1713105140331,
    },
  ],
  all: [
    {
      id: 25,
      name: "User 1",
      like: 10132321312420,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 26,
      name: "User 2",
      username: "username2",
      like: 93423439,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 27,
      name: "User 3",
      image:
        "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      like: 923218,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 28,
      name: "User 4",
      like: 97123,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 29,
      name: "User 1",
      like: 10132321312420,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 30,
      name: "User 2",
      username: "username2",
      like: 93423439,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 31,
      name: "User 3",
      image:
        "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      like: 923218,
      upload: 1,
      created_at: 1713105140331,
    },
    {
      id: 32,
      name: "User 4",
      like: 97123,
      upload: 1,
      created_at: 1713105140331,
    },
  ],
};

const TopUserPage = () => {
  return <TopUsers data={sampleUser} />;
};

export default TopUserPage;
