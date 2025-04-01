CREATE OR REPLACE PROCEDURE sp_g_reading_histories(
    IN userId integer,
    OUT result jsonb,
    OUT status integer,
    OUT message text
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Thiết lập trạng thái mặc định thành công
    status := 0;
    message := 'success';

    SELECT jsonb_agg(novel_data) INTO result
    FROM (
        SELECT
            ln.id,
            ln.title,
            rh.last_read_at,
            jsonb_build_object(
                'id', ch.id,
                'title', ch.title,
                'index', ch.index,
                'reading_status', rh.status
            ) AS chapter
        FROM (
            -- Lấy duy nhất 1 bản ghi reading_history cho mỗi novel với last_read_at lớn nhất
            SELECT DISTINCT ON (novel_id) *
            FROM reading_histories
            WHERE user_id = userId
            ORDER BY novel_id, last_read_at DESC
        ) AS rh
        JOIN lightnovels ln ON ln.id = rh.novel_id
        JOIN chapters ch ON ch.id = rh.chapter_id
    ) novel_data;

EXCEPTION WHEN OTHERS THEN
    status := 1;
    message := SQLERRM;
    result := '{}'::jsonb;
END;
$$;

ALTER PROCEDURE sp_g_reading_histories(INTEGER, OUT jsonb, OUT INTEGER, OUT TEXT) OWNER TO syuro;