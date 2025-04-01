import { PROJECT_ID } from "@/commons/constants/projectid.enum";
import { type INovelDetail } from "@/commons/interfaces/novels/novel-detail";
import { NovelEndpointUtils } from "@/commons/utils/endpoint/novel-endpoint.util";
import { fetchData } from "@/commons/utils/fetch.util";
import { StringUtil } from "@/commons/utils/string.util";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NovelDetail } from "./components/NovelDetail";

export default async function NovelPage({ params }: any) {
  const paramData = await params;

  const novelDetail = await fetchData<INovelDetail>({
    url: new NovelEndpointUtils().getNovelDetail(+paramData.novelId),
    projectId: PROJECT_ID.NOVEL,
  });

  if (novelDetail.status !== 200) {
    return notFound();
  }

  return (
    <div className="min-h-screen w-screen bg-background">
      <div className="flex">
        <div className="aspect-[2/3] relative w-full max-w-[300px] rounded-md overflow-hidden shadow-md">
          <Image
            src={new StringUtil(
              novelDetail.data.cover_image_url
            ).imageWithDefault()}
            alt="novelDetail.data.title"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-left text-[50px] font-serif font-semibold uppercase text-balance">
            {novelDetail.data.title}
          </h1>
        </div>
      </div>
      <NovelDetail data={novelDetail.data.volumes} />
    </div>
  );
}
