-- Check if the record already exists before inserting
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM featured_resources WHERE title = 'Lent Pray40: The Return') THEN
        INSERT INTO featured_resources (title, description, image_url, link_url, is_active)
        VALUES (
            'Lent Pray40: The Return',
            'Join the 2026 Lenten challenge on Hallow. A journey back to God inspired by The Brothers Karamazov and the Parable of the Prodigal Son.',
            'https://assets.hallow.com/hallow-web-assets/images/challenges/pray40-2024/pray40-share-img.jpg',
            'https://hallow.com/collections/2845?is_shared=true',
            true
        );
    END IF;
END
$$;
