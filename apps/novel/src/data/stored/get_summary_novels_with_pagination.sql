CREATE PROCEDURE get_summary_novels_with_pagination(IN p_user_id integer, IN p_author_id integer, IN p_artist_id integer, IN p_status smallint, IN p_type smallint, IN p_key_search text, IN p_page integer, IN p_limit integer, OUT total_record integer, OUT result jsonb, OUT status integer, OUT message text)
    LANGUAGE plpgsql
AS $$
DECLARE
    offset_value INT;
BEGIN
    status := 0;
    message := 'success';
    offset_value := (p_page - 1) * p_limit;

    BEGIN
        WITH filtered_novels AS (
            SELECT 
                ln.id, 
                ln.title, 
                ln.cover_image_url, 
                ln.author_id, 
                ln.artist_id, 
                ln.average_score, 
                ln.vote_count 
            FROM lightnovels ln
            WHERE 
                (p_user_id = -1 OR ln.user_id = p_user_id) 
                AND (p_author_id = -1 OR ln.author_id = p_author_id) 
                AND (p_artist_id = -1 OR ln.artist_id = p_artist_id) 
                AND (p_status = -1 OR ln.status = p_status) 
                AND (p_type = -1 OR ln.type = p_type) 
                AND (p_key_search IS NULL OR ln.title ILIKE '%' || p_key_search || '%' OR p_key_search = ANY(ln.alternative_names))
        ),
        total_count_data AS (
            SELECT COUNT(*) AS total_count FROM filtered_novels
        ),
        paginated_novels AS (
            SELECT * 
            FROM filtered_novels 
            ORDER BY id DESC
            OFFSET offset_value LIMIT p_limit
        ),
        latest_chapters AS (
            SELECT DISTINCT ON (c.novel_id) 
                c.novel_id, c.id, c.index, c.title, c.created_at
            FROM chapters c
            WHERE c.novel_id IN (SELECT id FROM paginated_novels)
            ORDER BY c.novel_id, c.created_at DESC
        ),
        total_views_data AS (
            SELECT c.novel_id, COALESCE(SUM(c.views), 0) AS total_views
            FROM chapters c
            WHERE c.novel_id IN (SELECT id FROM paginated_novels)
            GROUP BY c.novel_id
        ),
        final_data AS (
            SELECT 
                ln.id AS id,
                ln.title AS title,
                ln.cover_image_url AS cover_image_url,
                author.id AS author_id,
                author.name AS author_name,
                artist.id AS artist_id,
                artist.name AS artist_name,
                COALESCE(
                    jsonb_agg(DISTINCT jsonb_build_object('id', genre.id, 'name', genre.name))
                    FILTER (WHERE genre.id IS NOT NULL), 
                    '[]'::jsonb
                ) AS genres,
                ln.average_score AS average_score,
                ln.vote_count AS vote_count,
                COALESCE(tv.total_views, 0) AS views, 
                jsonb_build_object(
                    'id', lc.id,
                    'index', lc.index,
                    'title', lc.title,
                    'created_at', lc.created_at
                ) AS latest_chapter,
				lc.created_at AS latest_chapter_date
            FROM paginated_novels ln
            LEFT JOIN authors author ON author.id = ln.author_id
            LEFT JOIN artists artist ON artist.id = ln.artist_id
            LEFT JOIN lightnovel_genre_maps map ON map.novel_id = ln.id
            LEFT JOIN genres genre ON genre.id = map.genre_id
            LEFT JOIN latest_chapters lc ON lc.novel_id = ln.id
            LEFT JOIN total_views_data tv ON tv.novel_id = ln.id
            GROUP BY 
                ln.id, ln.title, ln.cover_image_url, 
                author.id, author.name, artist.id, artist.name, 
                ln.average_score, ln.vote_count, tv.total_views, 
                lc.id, lc.index, lc.title, lc.created_at
        )
        SELECT 
            (SELECT total_count FROM total_count_data),
            COALESCE(jsonb_agg(fd.*), '[]'::jsonb)
        INTO total_record, result
        FROM final_data fd;

    EXCEPTION WHEN OTHERS THEN
        status := 1;
        message := SQLERRM;
    END;
END;
$$;

ALTER PROCEDURE get_summary_novels_with_pagination(INTEGER, INTEGER, INTEGER, SMALLINT, SMALLINT, TEXT, INTEGER, INTEGER, OUT INTEGER, OUT jsonb, OUT INTEGER, OUT TEXT) OWNER TO syuro;

