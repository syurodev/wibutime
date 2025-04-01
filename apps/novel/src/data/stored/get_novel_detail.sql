CREATE PROCEDURE get_novel_detail(IN p_id integer, OUT result jsonb, OUT status integer, OUT message text)
    LANGUAGE plpgsql
AS $$
BEGIN
    -- Set default success status
    status := 0;
    message := 'success';

    -- Main query using a CTE to properly structure volumes and their chapters
    WITH volume_chapters AS (
        SELECT
            v.id AS volume_id,
            v.title AS volume_title,
            v.volume_number,
            v.cover_image,
            v.release_date,
            v.synopsis,
            SUM(c.word_count) AS word_count,
            jsonb_agg(
                jsonb_build_object(
                    'id', c.id,
                    'title', c.title,
                    'created_at', TO_CHAR(c.created_at, 'DD/MM/YYYY'),
                    'index', c.index,
                    'status', c.status
                ) ORDER BY c.index
            ) FILTER (WHERE c.id IS NOT NULL) AS chapters
        FROM volumes v
        LEFT JOIN volume_chapter_maps vcm ON vcm.volume_id = v.id
        LEFT JOIN chapters c ON c.id = vcm.chapter_id
        WHERE v.lightnovel_id = p_id
        GROUP BY v.id, v.title, v.volume_number, v.cover_image, v.release_date
    )
SELECT
        jsonb_build_object(
            'id', ln.id,
            'title', ln.title,
            'cover_image_url', ln.cover_image_url,
            'summary', ln.summary,
            'alternative_names', ln.alternative_names,
            'status', ln.status,
            'type', ln.type,
            'author', jsonb_build_object(
                'id', author.id,
                'name', author.name
            ),
            'artist', jsonb_build_object(
                'id', artist.id,
                'name', artist.name
            ),
            'genres', COALESCE(
                jsonb_agg(
                    DISTINCT jsonb_build_object(
                        'id', genre.id,
                        'name', genre.name
                    )
                ) FILTER (WHERE genre.id IS NOT NULL),
                '[]'::jsonb
            ),
            'volumes', COALESCE(
                (SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', vc.volume_id,
                        'title', vc.volume_title,
                        'volume_number', vc.volume_number,
                        'cover_image_url', vc.cover_image,
                        'release_date', vc.release_date,
                        'synopsis', vc.synopsis,
                        'word_count', vc.word_count,
                        'chapters', COALESCE(vc.chapters, '[]'::jsonb)
                    ) ORDER BY vc.volume_number
                ) FROM volume_chapters vc),
                '[]'::jsonb
            ),
            'word_count', COALESCE(SUM(chapter.word_count), 0)
        ) INTO result
    FROM lightnovels ln
    LEFT JOIN authors author ON author.id = ln.author_id
    LEFT JOIN artists artist ON artist.id = ln.artist_id
    LEFT JOIN lightnovel_genre_maps map ON map.novel_id = ln.id
    LEFT JOIN genres genre ON genre.id = map.genre_id
    LEFT JOIN chapters chapter ON chapter.novel_id = ln.id
    WHERE ln.id = p_id
    GROUP BY ln.id, author.id, artist.id;

    -- Check if novel exists
    IF result IS NULL THEN
        status := 1;
        message := 'Light novel not found';
        result := '{}'::jsonb;
    END IF;

EXCEPTION WHEN OTHERS THEN
    status := 1;
    message := SQLERRM;
    result := '{}'::jsonb;
END;
$$;

ALTER PROCEDURE get_novel_detail(INTEGER, OUT jsonb, OUT INTEGER, OUT TEXT) OWNER TO syuro;

