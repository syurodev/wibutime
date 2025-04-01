import { CONTENT_TYPE } from '@/commons/constants/content-type.enum';
import { TOP_TYPE } from '@/commons/constants/top-type.enum';
import { ITopNovel } from '@/commons/interfaces/novels/top-novel';
import { UserContentHistory } from '@/commons/interfaces/user-history';
import { NovelEndpointUtils } from '@/commons/utils/endpoint/novel-endpoint.util';
import { fetchData } from '@/commons/utils/fetch.util';
import { Gallery4 } from '@/components/gallery4';
import HistoryList from '@/components/HistoryList';
import { PROJECT_ID } from '@workspace/commons';
import { notFound } from 'next/navigation';

export default async function Home() {
  const topNovel = await fetchData<ITopNovel[]>({
    url: new NovelEndpointUtils().getTopNovels,
    projectId: PROJECT_ID.NOVEL,
    params: {
      limit: 10,
      type: TOP_TYPE.WEEKLY,
    },
  });

  if (topNovel.status !== 200) {
    return notFound();
  }

  const novelHistories = await fetchData<UserContentHistory[]>({
    url: new NovelEndpointUtils().getHistories,
    projectId: PROJECT_ID.NOVEL,
    params: {
      limit: 4,
      page: 1,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Featured Novel Section */}
      <Gallery4 items={topNovel.data} />

      {/* Latest Updates Section */}
      <section>
        <div className="container mx-auto px-4">
          {/* <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-medium">Histories</h2>
          </div> */}
          {/* Placeholder for latest updates grid */}
          <div className="flex flex-col gap-4">
            <HistoryList
              title="Novel reading history"
              contentType={CONTENT_TYPE.NOVEL}
              histories={novelHistories.data}
            />

            <HistoryList
              title="Anime watching history"
              contentType={CONTENT_TYPE.ANIME}
              histories={novelHistories.data}
            />

            <HistoryList
              title="Manga reading history"
              contentType={CONTENT_TYPE.MANGA}
              histories={novelHistories.data}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
