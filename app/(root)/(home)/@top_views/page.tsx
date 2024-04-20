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
    {
      id: "fwfee21e21ew2r23r",
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      type: "anime",
      url_id: "fwfe21ee21ew2r23r",
      current:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      image:
        "https://images.unsplash.com/photo-1712315458167-f04b14f13d17?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd1r21r21w2r23r",
      name: "Example Title 2",
      type: "anime",
      url_id: "fwfe21r12rw212r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313197947-404fa28723cf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fw3123fe32r32rw2r23r",
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      type: "anime",
      url_id: "fwfe223r23r421w2r23r",
      current:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      image:
        "https://images.unsplash.com/photo-1712315458167-f04b14f13d17?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwf21ew123r12rrdw2r23r",
      name: "Example Title 3",
      type: "anime",
      url_id: "fwf213et5y45yw212r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313197947-404fa28723cf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fw3145y4523f12ew2r23r",
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      type: "anime",
      url_id: "fwfedw2u65u56421w2r23r",
      current:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum officiis vitae similique labore laudantium minima delectus, ut voluptate autem libero quaerat beatae, fugiat expedita sint error tempore neque saepe natus?",
      image:
        "https://images.unsplash.com/photo-1712315458167-f04b14f13d17?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwf21ewdg34gw2r23r",
      name: "Example Title 4",
      type: "anime",
      url_id: "fwf213ewi76i67212r23r",
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
    {
      id: "fwfe6u5u6u56w2r3r23r",
      name: "Example Title",
      type: "manga",
      url_id: "fwfew4u545u45uqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713416955425-fb2ec8543782?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewdg2r23f2312w2r23r",
      name: "Example Title 2",
      type: "manga",
      url_id: "fwfew2ggreger12r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313190872-80a41b864f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfew2a21d1d23dr3r23r",
      name: "Example Title 3",
      type: "manga",
      url_id: "fwfewqwgdf23r23r2ra23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713416955425-fb2ec8543782?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12wcfdsdfwes2r23r",
      name: "Example Title 4",
      type: "manga",
      url_id: "fwfew2csưegwggw12r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1712313190872-80a41b864f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfew2r12rewfw223r2r3r23r",
      name: "Example Title 5",
      type: "manga",
      url_id: "fwfe1r243y56u512rwqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713416955425-fb2ec8543782?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12bxcvbsw1e2e2r23r",
      name: "Example Title 6",
      type: "manga",
      url_id: "fwfew21fdsfdsfe12e2r2tr3r",
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
    {
      id: "fw2e2few2rbthrthrt3r23r",
      name: "Example Title",
      type: "lightnovel",
      url_id: "fwfe12trhrthrteewqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1682250058693-d3841f456916?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12wsrthsrht2csacsr23r",
      name: "Example Title 2",
      type: "lightnovel",
      url_id: "fwfewrthsrtrth2acsa12r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713322985754-80286a087746?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fw2e223rfew2rsthuju45r3r23r",
      name: "Example Title 3",
      type: "lightnovel",
      url_id: "fwfe12r3rr2ee34t34t34wqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1682250058693-d3841f456916?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12w2cse21egferg34acsr23r",
      name: "Example Title 4",
      type: "lightnovel",
      url_id: "fwfew2acsaf2d32dsadfs1f12r2tr3r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1713322985754-80286a087746?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fw2e2few2f32ffgg543t2fr3r23r",
      name: "Example Title 5",
      type: "lightnovel",
      url_id: "fwfe12e23f23dsfdfewffewqw2r23r",
      current: "lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1682250058693-d3841f456916?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "fwfewd12w2csưqdqwxxsaxsadacsr23r",
      name: "Example Title 6",
      type: "lightnovel",
      url_id: "fwfew2acsa12r2ưqjj76j76dwqdqtr3r",
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
