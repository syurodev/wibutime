import React from "react";
import Image from "next/image";
import {
  LuCaseSensitive,
  LuClock,
  LuEye,
  LuHeart,
  LuStar,
} from "react-icons/lu";

import BadgeLink from "@/components/shared/Badge/BadgeLink/BadgeLink";
import LinkButton from "@/components/shared/Button/LinkButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { numberFormat } from "@/common/format-data/number-format";
import DivSlide from "../Animation/DivSlide";
import H2Slide from "../Animation/H2Slide";

type IProps = {
  data: {
    name: string;
    categories: Category[];
    status: ContentStatus;
    updated_at: number;
    image?: string;
    rating?: number;
    score: number;
    favorites: number;
    views: number;
    order_name: string[];
    summary: string;
    content_type: ContentType;

    //lightnovel
    author?: string;
    illustrator?: string;
    words?: number;
  };
};

const order_name = [
  "高校時代に傲慢だった女王様との同棲生活は意外と居心地が悪くない",
  "Koukou Jidai ni Gouman datta Joou-sama to no Dousei Seikatsu wa Igaito Igokochi ga Warukunai",
  "Living with the Arrogant Queen from High School is Surprisingly Not Uncomfortable",
  "Sống chung với Nữ hoàng kiêu ngạo",
];

const categories = [
  {
    id: "1",
    name: "Comedy",
  },
  {
    id: "2",
    name: "Drama",
  },
];

const content_type = "lightnovel";

const ContentDetailHeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <DivSlide
        delay={0.1}
        className="relative aspect-[2/3] w-full md:w-1/2 max-w-[500px] mx-auto md:m-0 rounded-lg overflow-hidden shadow flex-none"
      >
        <Image
          src={
            "https://images.unsplash.com/photo-1713109510454-90f68a4269f1?q=80&w=1921&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt=""
          fill
          priority
          sizes="full"
          className="object-cover"
        />
      </DivSlide>

      <section className="w-full min-h-10 h-full flex flex-col gap-3">
        {/* Tiêu đề */}
        <H2Slide
          delay={0.15}
          className="font-semibold text-pretty text-2xl lg:text-3xl font-serif text-center md:text-left"
        >
          Sống chung với Nữ hoàng kiêu ngạo thời cao trung hoá ra lại không hề
          khó chịu một cách đáng ngạc nhiên
        </H2Slide>

        {/* Thể loại */}
        <div className="flex flex-row gap-2 items-start flex-wrap justify-center md:justify-start">
          {categories.map((category, index) => {
            return (
              <BadgeLink
                key={`category-${category.id}`}
                url={`/search?type=${content_type}&categories=${encodeURIComponent(
                  category.name
                )}`}
                variant={"outline"}
                delay={0.2 + index * 0.05}
              >
                {category.name}
              </BadgeLink>
            );
          })}
        </div>

        <DivSlide delay={0.35}>
          <Card className="flex flex-col gap-3 p-4">
            {/* Tác giả */}
            <h3 className="text-sm">
              <span className="font-semibold">Tác giả: </span>{" "}
              <LinkButton
                url={`/search?type=lightnovel&author=${encodeURIComponent(
                  "Misoneta Dozaemon (ミソネタ・ドざえもん)"
                )}`}
              >
                Misoneta Dozaemon (ミソネタ・ドざえもん)
              </LinkButton>
            </h3>

            {/* Hoạ sĩ */}
            <h3 className="text-sm">
              <span className="font-semibold">Hoạ sĩ: </span>
              <LinkButton
                url={`/search?type=lightnovel&illustrator=${encodeURIComponent(
                  "Yuga (ゆが一)"
                )}`}
              >
                Yuga (ゆが一)
              </LinkButton>
            </h3>

            {/* Trạng thái */}
            <h3 className="text-sm">
              <span className="font-semibold">Trạng thái: </span>
              <LinkButton url={`/search?type=lightnovel&status=inprocess`}>
                Đang tiến hành
              </LinkButton>
            </h3>
          </Card>
        </DivSlide>

        <DivSlide delay={0.4}>
          <Card className="flex items-center justify-between w-full p-4">
            {/* Cập nhật lần cuối */}
            <div className="flex flex-col items-center justify-center w-full">
              <LuClock />
              <p className="font-medium text-xs line-clamp-1">
                {new Date(1713099616608).toDateString()}
              </p>
            </div>

            {/* Số từ */}
            <div className="flex flex-col items-center justify-center w-full">
              <LuCaseSensitive />
              <p className="font-medium text-xs">{numberFormat(32131421)}</p>
            </div>

            {/* Số lượt xem */}
            <div className="flex flex-col items-center justify-center w-full">
              <LuEye />
              <p className="font-medium text-xs">{numberFormat(32131421)}</p>
            </div>

            {/* Số yêu thích */}
            <Button
              className="flex flex-col items-center justify-center w-full p-0"
              variant={"ghost"}
              rounded={"lg"}
            >
              <LuHeart />
              <p className="font-medium text-xs">{numberFormat(31421)}</p>
            </Button>

            {/* Số điểm đánh giá */}
            <Button
              className="flex flex-col items-center justify-center w-full p-0"
              variant={"ghost"}
              rounded={"lg"}
            >
              <LuStar />
              <p className="font-medium text-xs">4.5</p>
            </Button>
          </Card>
        </DivSlide>

        {/* Tên khác */}
        <DivSlide delay={0.45}>
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
        <DivSlide delay={0.5}>
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
      </section>
    </div>
  );
};

export default React.memo(ContentDetailHeroSection);
