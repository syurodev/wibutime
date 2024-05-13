import React from "react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { buttonVariants } from "@/components/ui/button";

import DivSlide from "../Animation/DivSlide";
import Link from "next/link";
import LinkButton from "../Button/LinkButton";

const order_name = [
  "高校時代に傲慢だった女王様との同棲生活は意外と居心地が悪くない",
  "Koukou Jidai ni Gouman datta Joou-sama to no Dousei Seikatsu wa Igaito Igokochi ga Warukunai",
  "Living with the Arrogant Queen from High School is Surprisingly Not Uncomfortable",
  "Sống chung với Nữ hoàng kiêu ngạo",
];

type IProps = {
  order_name: string[];
  summary: string;
  note?: string;
};

const LightnovelDetailRightSide: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Tên khác */}
      <DivSlide delay={0.45} className="h-fit">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tên khác</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc">
              {order_name.map((item) => {
                return (
                  <li key={item} className="text-sm ml-4 mb-2 last:mb-0">
                    {item}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </DivSlide>

      {/* Tóm tắt */}
      <DivSlide delay={0.5} className="h-fit">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tóm tắt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {`Vào đêm khuya của một ngày nọ, Yamamoto - một sinh viên đại học đang làm việc bán thời gian tại một cửa hàng tiện lợi bắt gặp một khách hàng nữ mang trong mình bộ đồ nỉ tại quầy thu ngân.

              Đó là Megumi Hayashi, là bạn cũng lớp với Yamamoto thời cao trung và cũng là cô gái xinh đẹp nhất lớp. Với tính cách hiếu thắng và cao ngạo của mình , cô nàng được mọi người gọi với biệt danh "Nữ hoàng".

              Trong khi trò chuyện tầm phào về công việc cùng Hayashi-san, người mà cậu không thực sự quá thân thiết ở trường, Yamamoto nhận thấy một vết bầm tím đau đớn trên tay cô.

              Biết được nguồn cơn của vết thương này là từ bạn trai của cô nàng, cậu quyết định đưa cô về nhà một khoảng thời gian và che giấu cô ấy.

              Bỗng nhiên, vào khoảnh khắc Yamamoto chuẩn bị đi ngủ, cậu bất ngờ bị Hayashi-san ôm từ phía sau...!?

              Điều gì sẽ xảy ra đối với cuộc sống chung của cậu và "Nữ hoàng" bị tổn thương, được bắt đầu từ mối quan hệ tồi tệ nhất...!?`}
            </p>
          </CardContent>
        </Card>
      </DivSlide>

      {/* Volume */}
      <Accordion
        type="single"
        collapsible
        className="border px-4 rounded-xl min-w-[300px] overflow-x-hidden"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger>Volume 1</AccordionTrigger>
          <AccordionContent className="flex flex-row gap-4 items-start max-h-[500px]">
            {/* Volume image */}
            <div className="relative aspect-[2/3] w-[150px] flex-none shadow overflow-hidden rounded-lg">
              <Image
                alt=""
                src={
                  "https://images.unsplash.com/photo-1715169928516-b5d77ba9b6bf?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                fill
                priority
                sizes="full"
                className="object-cover"
              />
            </div>

            {/* Chapter */}
            <ScrollArea className="w-full h-[225px] flex flex-col gap-4 overflow-x-hidden">
              <LinkButton url="#">
                Chapter 1: Lorem ipsum dolor sit amet consectetur, adipisicing
                elit. Velit illum excepturi nihil eum officia consectetur neque
                ipsam beatae dolor est atque autem incidunt fuga, nemo placeat
                quas labore numquam maxime.
              </LinkButton>
              <LinkButton url="#">
                Chapter 2: Lorem ipsum dolor sit amet consectetur, adipisicing
                elit. Velit illum excepturi nihil eum officia consectetur neque
                ipsam beatae dolor est atque autem incidunt fuga, nemo placeat
                quas labore numquam maxime.
              </LinkButton>
              <LinkButton url="#">
                Chapter 3: Lorem ipsum dolor sit amet consectetur, adipisicing
                elit. Velit illum excepturi nihil eum officia consectetur neque
                ipsam beatae dolor est atque autem incidunt fuga, nemo placeat
                quas labore numquam maxime.
              </LinkButton>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible
        className="border px-4 rounded-xl min-w-[300px] overflow-x-hidden"
      >
        <AccordionItem value="item-2" className="border-none">
          <AccordionTrigger className="px-0 line-clamp-1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit
            perferendis hic veritatis optio eum. Assumenda in nisi eius magnam,
            quo voluptatibus rem illo consequuntur. Perferendis eligendi libero
            sit recusandae veritatis.
          </AccordionTrigger>
          <AccordionContent className="flex flex-row gap-4 items-start max-h-[500px]">
            {/* Volume image */}
            <div className="relative aspect-[2/3] w-[150px] flex-none shadow overflow-hidden rounded-lg">
              <Image
                alt=""
                src={
                  "https://images.unsplash.com/photo-1715169928516-b5d77ba9b6bf?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                fill
                priority
                sizes="full"
                className="object-cover"
              />
            </div>

            {/* Chapter */}
            <ScrollArea className="w-full h-[225px] flex flex-col gap-4 overflow-x-hidden">
              <LinkButton url="#">
                Chapter 1: Lorem ipsum dolor sit amet consectetur, adipisicing
                elit. Velit illum excepturi nihil eum officia consectetur neque
                ipsam beatae dolor est atque autem incidunt fuga, nemo placeat
                quas labore numquam maxime.
              </LinkButton>
              <LinkButton url="#">
                Chapter 2: Lorem ipsum dolor sit amet consectetur, adipisicing
                elit. Velit illum excepturi nihil eum officia consectetur neque
                ipsam beatae dolor est atque autem incidunt fuga, nemo placeat
                quas labore numquam maxime.
              </LinkButton>
              <LinkButton url="#">
                Chapter 3: Lorem ipsum dolor sit amet consectetur, adipisicing
                elit. Velit illum excepturi nihil eum officia consectetur neque
                ipsam beatae dolor est atque autem incidunt fuga, nemo placeat
                quas labore numquam maxime.
              </LinkButton>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LightnovelDetailRightSide;
