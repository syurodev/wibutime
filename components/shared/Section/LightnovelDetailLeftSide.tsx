import React from "react";
import { Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import ContentCard from "../Card/CardContent";

type IProps = {
  //user
  user: {
    user_id: number;
    name: string;
    image?: string;
  };

  //translate group
  translate_group: {
    translate_group_id: number;
    translate_group_name: string;
    image?: string;
  };
};

const data: ContentCardType = {
  id: "đưqdwqđưqd",
  url_id:
    "3213-Koukou-Jidai-ni-Gouman-datta-Joou-sama-to-no-Dousei-Seikatsu-wa-Igaito-Igokochi-ga-Warukunai-e2",
  name: "Koukou Jidai ni Gouman datta Joou-sama to no Dousei Seikatsu wa Igaito Igokochi ga Warukunai",
  type: "lightnovel",
  current: "1",
  image:
    "https://images.unsplash.com/photo-1584596681352-a6134bc588a6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const LightnovelDetailLeftSide: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* User */}
      <Card className="min-w-[300px] h-fit">
        <CardHeader className="flex flex-row gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="!mt-0">
            <p className="text-sm font-semibold">user name</p>
            <p className="text-xs font-medium">translate group</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-semibold">Ghi chú:</p>

          <div className="text-sm">
            <p>Tiến độ: không xác định</p>
            <p>
              Đây là project đầu tay của mình. Hy vọng các bạn sẽ có thể đưa ra
              lời đánh giá cả tích cực lẫn tiêu cực để mình có thể hoàn thiện bộ
              truyện này nhé.
            </p>
            <p>
              Vì đây là dịch trực tiếp nên có thể văn phong sẽ hơi lủng củng.
            </p>
            <p>
              <i>Mọi sự ủng hộ sẽ góp phần cổ vũ mình dịch nhanh hơn:</i>
            </p>
            <b>1. STK: 102876833996 VIETIN - PHUNG TUAN DAT </b>
            <b>2. Các bạn có thể ủng hộ mình 1 follow tại:</b>
            <p>-----------------------</p>
            <p>Theo dõi trang cá nhân của tác giả và họa sĩ tại:</p>
            <b>
              Tác giả Misoneta Dozaemon:{" "}
              <a href="https://x.com/jAHFrtti5CzkfTG">
                https://x.com/jAHFrtti5CzkfTG
              </a>
            </b>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Accordion
        type="single"
        collapsible
        className="border px-4 rounded-xl min-w-[300px]"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger>
            <div className="flex flex-row items-center gap-1">
              Có thể bạn sẽ thích <Sparkles className="size-4" />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, index) => {
                return (
                  <ContentCard
                    key={`Recommendation-${index}`}
                    data={data}
                    direction="vertical"
                  />
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LightnovelDetailLeftSide;
