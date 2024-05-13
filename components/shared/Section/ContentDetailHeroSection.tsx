import React from "react";
import Image from "next/image";
import { Heart, Eye, CaseSensitive, MessageCircle, Star } from "lucide-react";

import BadgeLink from "@/components/shared/Badge/BadgeLink/BadgeLink";
import LinkButton from "@/components/shared/Button/LinkButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    content_type: ContentType;

    //lightnovel
    author?: string;
    illustrator?: string;
    words?: number;
  };
};

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
    <div className="flex flex-col md:flex-row gap-4 flex-none relative">
      <DivSlide className="relative w-[300px] h-[450px] mx-auto rounded-lg overflow-hidden shadow flex-none">
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

      <div className="flex flex-col gap-4">
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

        <DivSlide delay={0.35} className="h-fit">
          <Card className="flex flex-col gap-3 p-4">
            {/* Tác giả */}
            <h3 className="text-sm">
              <span className="font-semibold">Tác giả: </span>{" "}
              <LinkButton
                url={`/search?type=lightnovel&author=${encodeURIComponent(
                  "Misoneta Dozaemon (ミソネタ・ドざえもん)"
                )}`}
              >
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
                illum excepturi nihil eum officia consectetur neque ipsam beatae
                dolor est atque autem incidunt fuga, nemo placeat quas labore
                numquam maxime
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

            {/* Ngày tạo */}
            <h3 className="text-sm">
              <span className="font-semibold">Ngày tạo: </span>
              {new Date(1711099616608).toDateString()}
            </h3>

            {/* Cập nhật lần cuối */}
            <h3 className="text-sm">
              <span className="font-semibold">Cập nhật lần cuối: </span>
              {new Date(1713099616608).toDateString()}
            </h3>
          </Card>
        </DivSlide>

        <DivSlide delay={0.4} className="h-fit">
          <Card className="flex items-center justify-between w-full p-4">
            {/* Số từ */}
            <div className="flex flex-col items-center justify-center w-full">
              <CaseSensitive className="size-5" />
              <p className="font-medium text-xs">{numberFormat(32131421)}</p>
            </div>

            {/* Số lượt xem */}
            <div className="flex flex-col items-center justify-center w-full">
              <Eye className="size-5" />
              <p className="font-medium text-xs">{numberFormat(32131421)}</p>
            </div>

            {/* Số bình luận */}
            <Button
              className="flex flex-col items-center justify-center w-full p-0"
              variant={"ghost"}
              rounded={"lg"}
            >
              <MessageCircle className="size-5" />
              <p className="font-medium text-xs">{numberFormat(120)}</p>
            </Button>

            {/* Số yêu thích */}
            <Button
              className="flex flex-col items-center justify-center w-full p-0"
              variant={"ghost"}
              rounded={"lg"}
            >
              <Heart className="size-5" />
              <p className="font-medium text-xs">{numberFormat(31421)}</p>
            </Button>

            {/* Số điểm đánh giá */}
            <Button
              className="flex flex-col items-center justify-center w-full p-0"
              variant={"ghost"}
              rounded={"lg"}
            >
              <Star className="size-5" />
              <p className="font-medium text-xs">4.5</p>
            </Button>
          </Card>
        </DivSlide>
      </div>
    </div>
  );
};

export default React.memo(ContentDetailHeroSection);
