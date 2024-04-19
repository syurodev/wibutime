import HomeNews from "@/components/page/Home/News/HomeNews";
import TopUsers from "@/components/page/Home/TopUser/TopUser";
import TopViews from "@/components/page/Home/TopView/TopViews";

const sampleData: New[] = [
  {
    id: "1",
    url_id: "sample-news",
    name: "Sample News Title",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae pretium magna. Duis ac nisl vel justo fringilla luctus. Phasellus tristique ex vitae odio aliquet, ut varius nisl gravida. Sed at justo vestibulum, efficitur urna et, maximus metus. Curabitur sit amet purus vehicula, cursus justo vel, dapibus lectus. Donec auctor ligula vel sem fringilla, in convallis leo convallis. Fusce ultricies mi in efficitur pellentesque. Sed ac nisi vitae urna sodales vestibulum. Nulla ut odio ut eros consectetur viverra. Sed nec venenatis magna. Ut ut augue eget lectus sollicitudin accumsan non et ex. Vivamus tincidunt fermentum libero, ac finibus justo scelerisque quis.",
    current: "Sample content of the news.",
    type: "anime",
    categories: [
      { id: "1", name: "Sample Category 1" },
      { id: "2", name: "Sample Category 2" },
    ],
    image:
      "https://images.unsplash.com/photo-1505533321630-975218a5f66f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    url_id: "sample-news-2",
    name: "Sample News Title 2",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae pretium magna. Duis ac nisl vel justo fringilla luctus. Phasellus tristique ex vitae odio aliquet, ut varius nisl gravida. Sed at justo vestibulum, efficitur urna et, maximus metus. Curabitur sit amet purus vehicula, cursus justo vel, dapibus lectus. Donec auctor ligula vel sem fringilla, in convallis leo convallis. Fusce ultricies mi in efficitur pellentesque. Sed ac nisi vitae urna sodales vestibulum. Nulla ut odio ut eros consectetur viverra. Sed nec venenatis magna. Ut ut augue eget lectus sollicitudin accumsan non et ex. Vivamus tincidunt fermentum libero, ac finibus justo scelerisque quis.",
    current: "Sample content of the news.",
    type: "lightnovel",
    categories: [
      { id: "1", name: "Sample Category 1" },
      { id: "2", name: "Sample Category 2" },
    ],
    image:
      "https://images.unsplash.com/photo-1713182025153-c33ae2b6cb3d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    url_id: "sample-news-3",
    name: "Sample News Title 3",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae pretium magna. Duis ac nisl vel justo fringilla luctus. Phasellus tristique ex vitae odio aliquet, ut varius nisl gravida. Sed at justo vestibulum, efficitur urna et, maximus metus. Curabitur sit amet purus vehicula, cursus justo vel, dapibus lectus. Donec auctor ligula vel sem fringilla, in convallis leo convallis. Fusce ultricies mi in efficitur pellentesque. Sed ac nisi vitae urna sodales vestibulum. Nulla ut odio ut eros consectetur viverra. Sed nec venenatis magna. Ut ut augue eget lectus sollicitudin accumsan non et ex. Vivamus tincidunt fermentum libero, ac finibus justo scelerisque quis.",
    current: "Sample content of the news.",
    type: "manga",
    categories: [
      { id: "1", name: "Sample Category 1" },
      { id: "2", name: "Sample Category 2" },
    ],
    image:
      "https://images.unsplash.com/photo-1713151516865-9d9d3130de35?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

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

export default function Home() {
  return (
    <div className="px-4 h-dvh overflow-y-auto pb-4 pt-[88px] flex flex-col gap-4">
      <HomeNews data={sampleData} />

      <TopViews />

      <TopUsers userData={sampleUser} />
    </div>
  );
}
