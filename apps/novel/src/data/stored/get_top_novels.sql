CREATE PROCEDURE get_top_novels(IN p_type integer, IN p_limit integer, OUT result jsonb, OUT status integer, OUT message text)
    LANGUAGE plpgsql
AS $$
DECLARE
    view_table TEXT;
    sql_query TEXT;
BEGIN
    -- Mặc định trạng thái thành công
    status := 0;
    message := 'success';

    -- Xác định bảng theo loại view
    CASE p_type
        WHEN 1 THEN view_table := 'daily_views';
        WHEN 2 THEN view_table := 'weekly_views';
        WHEN 3 THEN view_table := 'monthly_views';
        WHEN 4 THEN view_table := 'yearly_views';
        WHEN 5 THEN view_table := 'chapters'; -- Tổng tất cả thời gian
        ELSE
            status := 1;
            message := 'Invalid top_type';
            result := '[]'::jsonb;
            RETURN;
    END CASE;

    -- Truy vấn động với EXECUTE FORMAT
    sql_query := FORMAT(
        'WITH view_data AS (
            SELECT novel_id, SUM(views) AS total_views
            FROM %I
            GROUP BY novel_id
        ),
        latest_chapters AS (
            SELECT DISTINCT ON (c.novel_id) 
                c.novel_id, c.id, c.index, c.title, c.created_at
            FROM chapters c
            ORDER BY c.novel_id, c.created_at DESC
        ),
        final_data AS (
            SELECT 
                ln.id AS id,
                ln.title AS title,
                ln.cover_image_url AS cover_image_url,
				ln.summary,
                author.id AS author_id,
                author.name AS author_name,
                artist.id AS artist_id,
                artist.name AS artist_name,
                COALESCE(
                    jsonb_agg(DISTINCT jsonb_build_object(''id'', genre.id, ''name'', genre.name))
                    FILTER (WHERE genre.id IS NOT NULL), 
                    ''[]''::jsonb
                ) AS genres,
                COALESCE(vd.total_views, 0) AS views,
                jsonb_build_object(
                    ''id'', lc.id,
                    ''index'', lc.index,
                    ''title'', lc.title,
                    ''created_at'', lc.created_at
                ) AS latest_chapter,
                lc.created_at AS latest_chapter_date
            FROM lightnovels ln
            LEFT JOIN view_data vd ON vd.novel_id = ln.id
            LEFT JOIN authors author ON author.id = ln.author_id
            LEFT JOIN artists artist ON artist.id = ln.artist_id
            LEFT JOIN lightnovel_genre_maps map ON map.novel_id = ln.id
            LEFT JOIN genres genre ON genre.id = map.genre_id
            INNER JOIN latest_chapters lc ON lc.novel_id = ln.id
            GROUP BY ln.id, ln.title, ln.cover_image_url, author.id, author.name, artist.id, artist.name, vd.total_views, lc.id, lc.index, lc.title, lc.created_at
            ORDER BY views DESC
            LIMIT %L
        )
        SELECT jsonb_agg(final_data) FROM final_data;', view_table, p_limit
    );

    -- Thực thi truy vấn động và lấy kết quả JSON
    EXECUTE sql_query INTO result;

EXCEPTION WHEN OTHERS THEN
    status := 1;
    message := SQLERRM;
    result := '[]'::jsonb;
END;
$$;

ALTER PROCEDURE get_top_novels(INTEGER, INTEGER, OUT jsonb, OUT INTEGER, OUT TEXT) OWNER TO syuro;

