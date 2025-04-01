import { CONTENT_TYPE } from '@/commons/constants/content-type.enum';
import { UserContentHistory } from '@/commons/interfaces/user-history';
import { ContentColorUtil } from '@/commons/utils/content-color.util';
import { cn } from '@/commons/utils/tailwind.util';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import Image from 'next/image';
import Link from 'next/link';

type IHistoryListProps = {
  title: string;
  contentType: CONTENT_TYPE;
  histories: UserContentHistory[];
};

const HistoryList = ({ title, contentType, histories }: IHistoryListProps) => {
  return (
    <div>
      <h3
        className={cn(
          'font-semibold text-2xl my-2 font-serif',
          contentType === CONTENT_TYPE.NOVEL
            ? 'text-novel-color'
            : contentType === CONTENT_TYPE.ANIME
              ? 'text-anime-color'
              : 'text-manga-color',
        )}
      >
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {histories.map((x) => {
          return (
            <Link
              href={`/${
                contentType === CONTENT_TYPE.NOVEL
                  ? 'novels'
                  : contentType === CONTENT_TYPE.ANIME
                    ? 'anime'
                    : 'manga'
              }/${x.id}`}
              key={x.id}
              className="w-full overflow-hidden"
            >
              <Card className="relative w-full overflow-hidden min-h-[250px] aspect-[2/3] flex flex-col">
                <CardHeader className="pb-4">
                  <p className="line-clamp-1 font-semibold text-xs text-primary/70">
                    {x.last_seen_at}
                  </p>
                  <p
                    className={cn(
                      'line-clamp-1 font-medium text-sm',
                      new ContentColorUtil(contentType).getTextColor(),
                    )}
                  >
                    {x.content.title}
                  </p>
                  <p className="line-clamp-2 font-semibold text-xs h-[36px]">
                    {x.title}
                  </p>
                </CardHeader>
                <CardContent className="relative w-full h-full flex-grow">
                  <div className="relative rounded-sm w-full h-full overflow-hidden">
                    <Image
                      src={x.cover_image_url}
                      alt={x.title}
                      fill
                      sizes="(max-width: 500px) 33vw, (max-width: 500px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryList;
