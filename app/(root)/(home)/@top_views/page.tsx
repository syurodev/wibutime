import React from "react";

import TopViews from "@/components/page/Home/TopView/TopViews";

const data: {
  animes: ContentCardType[];
  mangas: ContentCardType[];
  lightnovels: ContentCardType[];
} = {
  animes: [
    {
      id: "fwfew2r23r",
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      type: "anime",
      url_id: "fwfew2r23r",
      current:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      image:
        "https://images.unsplash.com/photo-1712315458167-f04b14f13d17?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewdw2r23r",
      name: "Example Title 2",
      type: "anime",
      url_id: "fwfew212r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313197947-404fa28723cf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fw3123few2r23r",
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      type: "anime",
      url_id: "fwfe2421w2r23r",
      current:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      image:
        "https://images.unsplash.com/photo-1712315458167-f04b14f13d17?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwf21ewdw2r23r",
      name: "Example Title 3",
      type: "anime",
      url_id: "fwf213ew212r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313197947-404fa28723cf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fw3123f12ew2r23r",
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      type: "anime",
      url_id: "fwfedw2421w2r23r",
      current:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      image:
        "https://images.unsplash.com/photo-1712315458167-f04b14f13d17?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwf21ewdw2r23r",
      name: "Example Title 4",
      type: "anime",
      url_id: "fwf213ew212r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313197947-404fa28723cf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  mangas: [
    {
      id: "fwfew2r3r23r",
      name: "Example Title",
      type: "manga",
      url_id: "fwfewqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713416955425-fb2ec8543782?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12w2r23r",
      name: "Example Title 2",
      type: "manga",
      url_id: "fwfew212r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313190872-80a41b864f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfew2ar3r23r",
      name: "Example Title 3",
      type: "manga",
      url_id: "fwfewqw2ra23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713416955425-fb2ec8543782?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12wcs2r23r",
      name: "Example Title 4",
      type: "manga",
      url_id: "fwfew2cs12r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313190872-80a41b864f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfew2r12r2r3r23r",
      name: "Example Title 5",
      type: "manga",
      url_id: "fwfe1r212rwqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713416955425-fb2ec8543782?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12w1e2e2r23r",
      name: "Example Title 6",
      type: "manga",
      url_id: "fwfew2112e2r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313190872-80a41b864f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  lightnovels: [
    {
      id: "fw2e2few2r3r23r",
      name: "Example Title",
      type: "lightnovel",
      url_id: "fwfe12eewqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1682250058693-d3841f456916?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12w2csacsr23r",
      name: "Example Title 2",
      type: "lightnovel",
      url_id: "fwfew2acsa12r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713322985754-80286a087746?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fw2e223rfew2r3r23r",
      name: "Example Title 3",
      type: "lightnovel",
      url_id: "fwfe12r3rr2eewqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1682250058693-d3841f456916?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12w2cse21eacsr23r",
      name: "Example Title 4",
      type: "lightnovel",
      url_id: "fwfew2acsaf21f12r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713322985754-80286a087746?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fw2e2few2f32f2fr3r23r",
      name: "Example Title 5",
      type: "lightnovel",
      url_id: "fwfe12e23f23fewqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1682250058693-d3841f456916?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12w2csưqdqwdacsr23r",
      name: "Example Title 6",
      type: "lightnovel",
      url_id: "fwfew2acsa12r2ưqdwqdqtr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713322985754-80286a087746?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
};

const TopViewsPage = () => {
  return <TopViews data={data} />;
};

export default TopViewsPage;
