import { db } from "@/drizzle/db";
import { formatNumber } from "@/lib/formatNumber";
import { sql } from "drizzle-orm";

export const findlAnimeTrending = async (limit: number): Promise<TrendingData[] | null> => {
  try {
    const topAnime: {
      id: string,
      name: string,
      image: string | null,
      numfavorites: bigint,
      totalviews: bigint
    }[] | null = await db.execute(sql`
        SELECT
          a.id,
          a.name,
          as1.image AS image,
          COUNT(DISTINCT fav.user_id) AS numFavorites,
          SUM(ae.viewed) AS totalViews
        FROM
          anime a
        LEFT JOIN (
          SELECT
            as2.anime_id,
            as2.image
          FROM
            anime_season as2
          LEFT JOIN anime_episode ae ON as2.id = ae.season_id
          WHERE
            ae.updated_at BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
            AND as2.created_at = (
              SELECT
                MAX(as3.created_at)
              FROM
                anime_season as3
              WHERE
                as3.anime_id = as2.anime_id
            )
        ) as1 ON a.id = as1.anime_id
        LEFT JOIN anime_episode ae ON as1.anime_id = ae.season_id
        LEFT JOIN favorite_anime fav ON a.id = fav.anime_id
        WHERE
          EXISTS (
            SELECT 1
            FROM anime_season as2
            LEFT JOIN anime_episode ae ON as2.id = ae.season_id
            WHERE
              ae.updated_at BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
              AND as2.anime_id = a.id
          )
        GROUP BY
          a.id, a.name, as1.image
        ORDER BY
          numFavorites DESC
        LIMIT
          ${limit};  
      `)

    const animeTrendingResult: TrendingData[] = topAnime && topAnime.length > 0 ?
      topAnime.map((item) => ({
        id: item.id,
        image: item.image ? JSON.parse(item.image) : null,
        name: item.name,
        numfavorites: formatNumber(Number(item.numfavorites)),
        totalviews: formatNumber(Number(item.totalviews))
      }))
      : []
    return animeTrendingResult

  } catch (error) {
    console.log(error)
    return null
  }
}