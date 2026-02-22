-- ============================================================================
-- Daily Reflections Update for Feb 22, 2026
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

INSERT INTO daily_reflections (
    date,
    liturgical_color,
    title,
    first_reading_ref,
    first_reading_text,
    psalm_ref,
    psalm_response,
    psalm_text,
    second_reading_ref,
    second_reading_text,
    gospel_acclamation,
    gospel_ref,
    gospel_text,
    reflection_body
) VALUES (
    '2026-02-22',
    'Violet',
    'First Sunday of Lent',
    'Genesis 2:7-9; 3:1-7',
    'The Lord God planted a garden in Eden which is in the east, and there he put the man he had fashioned. The Lord God caused to spring up from the soil every kind of tree, enticing to look at and good to eat, with the tree of life and the tree of the knowledge of good and evil in the middle of the garden.
The serpent was the most subtle of all the wild beasts that the Lord God had made. It asked the woman, "Did God really say you were not to eat from any of the trees in the garden?" The woman answered the serpent, "We may eat the fruit of the trees in the garden. But of the fruit of the tree in the middle of the garden God said, ''You must not eat it, nor touch it, under pain of death.'' " Then the serpent said to the woman, "No! You will not die! God knows in fact that on the day you eat it your eyes will be opened and you will be like gods, knowing good and evil." The woman saw that the tree was good to eat and pleasing to the eye, and that it was desirable for the knowledge that it could give. So she took some of its fruit and ate it. She gave some also to her husband who was with her, and he ate it. Then the eyes of both of them were opened and they realised that they were naked. So they sewed fig-leaves together to make themselves loin-cloths.',
    'Psalm 50: 3-6, 12-14, 17. R. v. 3',
    'A broken, humbled heart, O God, you will not scorn.',
    NULL,
    'Romans 5: 12, 17-19 (Longer form: Romans 5:12-19)',
    'Sin entered the world through one man, and through sin death, and thus death has spread through the whole human race because everyone has sinned.
If it is certain that death reigned over everyone as the consequence of one man''s fall, it is even more certain that one man, Jesus Christ, will cause everyone to reign in life who receives the free gift that he does not deserve, of being made righteous. Again, as one man''s fall brought condemnation on everyone, so the good act of one man brings everyone life and makes them justified. As by one man''s disobedience many were made sinners, so by one man''s obedience many will be made righteous.',
    'A human lives not on bread alone but on every word that comes from the mouth of God.',
    'Matthew 4: 1-11',
    'Jesus was led by the Spirit out into the wilderness to be tempted by the devil. He fasted for forty days and forty nights, after which he was very hungry, and the tempter came and said to him, "If you are the Son of God, tell these stones to turn into loaves." But he replied, "Scripture says: Man does not live on bread alone but on every word that comes from the mouth of God."
The devil then took him to the holy city and made him stand on the parapet of the Temple. "If you are the Son of God," he said, "throw yourself down; for scripture says: He will put you in his angels'' charge, and they will support you on their hands in case you hurt your foot against a stone." Jesus said to him, "Scripture also says: You must not put the Lord your God to the test."
Next, taking him to a very high mountain, the devil showed him all the kingdoms of the world and their splendour. "I will give you all these," he said, "if you fall at my feet and worship me." Then Jesus replied, "Be off, Satan! For scripture says: You must worship the Lord your God, and serve him alone."
Then the devil left him, and angels appeared and looked after him.',
    'All religions and cultures have a sacred story that describes the beginning of the world. Most begin with everything being good and then things go wrong. Our story is that of the garden of Eden. Adam and Eve did not listen to the word of God. They listened to the serpent instead and turned away from God. However, their disobedience was overcome when God''s promise of salvation was fulfilled. Jesus came in the name of God and lived by the word of God thus showing an obedience that Adam and Eve lacked.
In the Gospel today Jesus has just been baptised and affirmed as the beloved Son of God so he goes into the desert to discern what this could really mean. His identity and relationship with God are challenged but he listens only to God and trusts in the truth of God''s word.
Today''s readings encourage me to take time to listen more deeply to God''s word, to face the truth of my identity and my relationship with God. Is my relationship with God being tested? Where do I notice the grace of God keeping me strong? I pray that I may fix my eyes more and more on Jesus as Lent progresses.'
)
ON CONFLICT (date) DO UPDATE SET
    liturgical_color = EXCLUDED.liturgical_color,
    title = EXCLUDED.title,
    first_reading_ref = EXCLUDED.first_reading_ref,
    first_reading_text = EXCLUDED.first_reading_text,
    psalm_ref = EXCLUDED.psalm_ref,
    psalm_response = EXCLUDED.psalm_response,
    psalm_text = EXCLUDED.psalm_text,
    second_reading_ref = EXCLUDED.second_reading_ref,
    second_reading_text = EXCLUDED.second_reading_text,
    gospel_acclamation = EXCLUDED.gospel_acclamation,
    gospel_ref = EXCLUDED.gospel_ref,
    gospel_text = EXCLUDED.gospel_text,
    reflection_body = EXCLUDED.reflection_body;
