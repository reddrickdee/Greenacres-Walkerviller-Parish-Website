-- ============================================================================
-- Daily Reflections Update for Feb 15 - Mar 1, 2026
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ============================================================================

-- 2026-02-15 (6th Sunday in Ordinary Time)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    second_reading_ref, second_reading_text,
    gospel_acclamation, gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-02-15', 'Green', '6th Sunday in Ordinary Time',
    'Leviticus 13: 1-2, 44-46', 'The Lord said to Moses and Aaron, "If a swelling or scab or shiny spot appears on a man''s skin..."',
    'Psalm 31: 1-2, 5, 11', 'I turn to you, Lord, in time of trouble, and you fill me with the joy of salvation.', 'I turn to you, Lord, in time of trouble, and you fill me with the joy of salvation.',
    '1 Corinthians 10: 31 - 11: 1', 'Whatever you eat, whatever you drink, whatever you do at all, do it for the glory of God...',
    'Alleluia, alleluia! A great prophet has appeared among us; God has visited his people. Alleluia!', 'Mark 1: 40-45', 'A leper came to Jesus and pleaded on his knees: "If you want to" he said "you can cure me."...',
    'Jesus'' healing of the leper is a powerful story. His touch healed and restored the outcast to the community. We too are called to reach out to the marginalized and see the face of Christ in everyone we meet.'
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

-- 2026-02-22 (1st Sunday of Lent)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    second_reading_ref, second_reading_text,
    gospel_acclamation, gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-02-22', 'Violet', 'First Sunday of Lent',
    'Genesis 2:7-9; 3:1-7', 'The Lord God planted a garden in Eden which is in the east, and there he put the man he had fashioned. The Lord God caused to spring up from the soil every kind of tree, enticing to look at and good to eat, with the tree of life and the tree of the knowledge of good and evil in the middle of the garden.
The serpent was the most subtle of all the wild beasts that the Lord God had made. It asked the woman, "Did God really say you were not to eat from any of the trees in the garden?" The woman answered the serpent, "We may eat the fruit of the trees in the garden. But of the fruit of the tree in the middle of the garden God said, ''You must not eat it, nor touch it, under pain of death.'' " Then the serpent said to the woman, "No! You will not die! God knows in fact that on the day you eat it your eyes will be opened and you will be like gods, knowing good and evil." The woman saw that the tree was good to eat and pleasing to the eye, and that it was desirable for the knowledge that it could give. So she took some of its fruit and ate it. She gave some also to her husband who was with her, and he ate it. Then the eyes of both of them were opened and they realised that they were naked. So they sewed fig-leaves together to make themselves loin-cloths.',
    'Psalm 50: 3-6, 12-14, 17. R. v. 3', 'A broken, humbled heart, O God, you will not scorn.', 'A broken, humbled heart, O God, you will not scorn.',
    'Romans 5: 12, 17-19', 'Sin entered the world through one man, and through sin death, and thus death has spread through the whole human race because everyone has sinned.
If it is certain that death reigned over everyone as the consequence of one man''s fall, it is even more certain that one man, Jesus Christ, will cause everyone to reign in life who receives the free gift that he does not deserve, of being made righteous. Again, as one man''s fall brought condemnation on everyone, so the good act of one man brings everyone life and makes them justified. As by one man''s disobedience many were made sinners, so by one man''s obedience many will be made righteous.',
    'A human lives not on bread alone but on every word that comes from the mouth of God.', 'Matthew 4: 1-11', 'Jesus was led by the Spirit out into the wilderness to be tempted by the devil. He fasted for forty days and forty nights, after which he was very hungry, and the tempter came and said to him, "If you are the Son of God, tell these stones to turn into loaves." But he replied, "Scripture says: Man does not live on bread alone but on every word that comes from the mouth of God."
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

-- 2026-02-23 (Monday, 1st Week of Lent)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-02-23', 'Violet', '1st Week of Lent',
    'Leviticus 19: 1-2, 11-18', 'The Lord spoke to Moses; he said: "Speak to the whole community of the sons of Israel and say to them: ''Be holy, for I, the Lord your God, am holy...''"',
    'Psalm 18: 8-10, 15', 'Your words, Lord, are spirit and life.', 'Your words, Lord, are spirit and life.',
    'Matthew 25: 31-46', 'Jesus said to his disciples: "When the Son of Man comes in his glory, escorted by all the angels, then he will take his seat on his throne of glory..."',
    'Today''s readings remind us of our call to holiness and how that holiness is expressed in our daily lives through concrete actions of love, especially towards the least among us. The profound truth is that whatever we do to others, we do to Christ himself.'
)
ON CONFLICT (date) DO UPDATE SET
    liturgical_color = EXCLUDED.liturgical_color,
    title = EXCLUDED.title,
    first_reading_ref = EXCLUDED.first_reading_ref,
    first_reading_text = EXCLUDED.first_reading_text,
    psalm_ref = EXCLUDED.psalm_ref,
    psalm_response = EXCLUDED.psalm_response,
    psalm_text = EXCLUDED.psalm_text,
    gospel_ref = EXCLUDED.gospel_ref,
    gospel_text = EXCLUDED.gospel_text,
    reflection_body = EXCLUDED.reflection_body;

-- 2026-02-24 (Tuesday, 1st Week of Lent)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-02-24', 'Violet', '1st Week of Lent',
    'Isaiah 55: 10-11', 'Thus says the Lord: "As the rain and the snow come down from the heavens and do not return without watering the earth, making it yield and giving growth..."',
    'Psalm 33: 4-7, 16-19', 'From all their afflictions God will deliver the just.', 'From all their afflictions God will deliver the just.',
    'Matthew 6: 7-15', 'Jesus said to his disciples: "In your prayers do not babble as the pagans do, for they think that by using many words they will make themselves heard. Do not be like them; your Father knows what you need before you ask him. So you should pray like this: ''Our Father in heaven...''"',
    'The Lord''s Prayer is the model for all Christian prayer. Jesus invites us into an intimate relationship with God as our Father. Prayer isn''t about endless repetition, but about aligning our hearts with God''s will and recognizing our total dependence on Him.'
)
ON CONFLICT (date) DO UPDATE SET
    liturgical_color = EXCLUDED.liturgical_color,
    title = EXCLUDED.title,
    first_reading_ref = EXCLUDED.first_reading_ref,
    first_reading_text = EXCLUDED.first_reading_text,
    psalm_ref = EXCLUDED.psalm_ref,
    psalm_response = EXCLUDED.psalm_response,
    psalm_text = EXCLUDED.psalm_text,
    gospel_ref = EXCLUDED.gospel_ref,
    gospel_text = EXCLUDED.gospel_text,
    reflection_body = EXCLUDED.reflection_body;

-- 2026-02-25 (Wednesday, 1st Week of Lent)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-02-25', 'Violet', '1st Week of Lent',
    'Jonah 3: 1-10', 'The word of the Lord was addressed to Jonah: ''Up!'' he said, ''Go to Nineveh, the great city, and preach to them as I told you to.'' Jonah set out and went to Nineveh in obedience to the word of the Lord. Now Nineveh was a city great beyond compare: it took three days to cross it. Jonah went on into the city, making a day''s journey. He preached in these words, ''Only forty days more and Nineveh is going to be destroyed.'' And the people of Nineveh believed in God; they proclaimed a fast and put on sackcloth, from the greatest to the least. The news reached the king of Nineveh, who rose from his throne, took off his robe, put on sackcloth and sat down in ashes. A proclamation was then promulgated throughout Nineveh, by decree of the king and his ministers, as follows: ''Men and beasts, herds and flocks, are to taste nothing; they must not eat, they must not drink water. All are to put on sackcloth and call on God with all their might; and let everyone renounce his evil behaviour and the wicked things he has done. Who knows if God will not change his mind and relent, if he will not renounce his burning wrath, so that we do not perish?'' God saw their efforts to renounce their evil behaviour. And God relented: he did not inflict on them the disaster which he had threatened.',
    'Psalm 50: 3-4, 12-13, 18-19. R. v. 19', 'A broken, humbled heart, O God, you will not scorn.', 'A broken, humbled heart, O God, you will not scorn.',
    'Luke 11: 29-32', 'The crowds got even bigger and Jesus addressed them. ''This is a wicked generation; it is asking for a sign. The only sign it will be given is the sign of Jonah. For just as Jonah became a sign to the Ninevites, so will the Son of Man be to this generation. On Judgement day the Queen of the South will rise up with the men of this generation and condemn them, because she came from the ends of the earth to hear the wisdom of Solomon; and there is something greater than Solomon here. On Judgement day the men of Nineveh will stand up with this generation and condemn it, because when Jonah preached they repented; and there is something greater than Jonah here.''',
    'Jonah was given a task to do by God—to go to Nineveh and preach repentance. However, he boarded a ship and hastened in the opposite direction. During the trip he managed to get himself thrown overboard and was picked up by a whale who returned him to the shores of Nineveh. He then got on with his God-given task and found himself surprised by the way the Ninevites listened, took his words to heart and repented. Jonah spoke, they listened and acted immediately and so God forgave them. Like Jonah and the Ninevites I am invited this Lent to listen to God''s voice, to turn back to God and to allow my heart to be changed. A humble, contrite heart, O God, you will not scorn says the psalmist. If I need a guide, who better do I have than Jesus who is the Way and the Truth towards Life?'
)
ON CONFLICT (date) DO UPDATE SET
    liturgical_color = EXCLUDED.liturgical_color,
    title = EXCLUDED.title,
    first_reading_ref = EXCLUDED.first_reading_ref,
    first_reading_text = EXCLUDED.first_reading_text,
    psalm_ref = EXCLUDED.psalm_ref,
    psalm_response = EXCLUDED.psalm_response,
    psalm_text = EXCLUDED.psalm_text,
    gospel_ref = EXCLUDED.gospel_ref,
    gospel_text = EXCLUDED.gospel_text,
    reflection_body = EXCLUDED.reflection_body;

-- 2026-02-26 (Thursday, 1st Week of Lent)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-02-26', 'Violet', '1st Week of Lent',
    'Esther 4:17', 'Queen Esther took refuge with the Lord in the mortal peril which had overtaken her. She besought the Lord God of Israel in these words: ''My Lord, our King, the only one, come to my help, for I am alone and have no helper but you and am about to take my life in my hands. I have been taught from my earliest years, in the bosom of my family, that you, Lord, chose Israel out of all the nations and our ancestors out of all the people of old times to be your heritage for ever; and that you have treated them as you promised. Remember, Lord; reveal yourself in the time of our distress. As for me, give me courage, King of gods and master of all power. Put persuasive words into my mouth when I face the lion; change his feeling into hatred for our enemy, that the latter and all like him may be brought to their end. As for ourselves, save us by your hand, and come to my help, for I am alone and have no one but you, Lord.''',
    'Psalm 137: 1-3, 7-8. R. v. 3', 'Lord, on the day I called for help, you answered me.', 'Lord, on the day I called for help, you answered me.',
    'Matthew 7: 7-12', 'Jesus said to his disciples; ''Ask, and it will be given to you; search, and you will find; knock, and the door will be opened to you. For the one who asks always receives; the one who searches always finds; the one who knocks will always have the door opened to him. Is there a man among you who would hand his son a stone when he asked for bread? Or would hand him a snake when he asked for a fish? If you, then, who are evil, know how to give your children what is good, how much more will your Father in heaven give good things to those who ask him! So always treat others as you would like them to treat you; that is the meaning of the Law and the Prophets.''',
    'Experience tells me that ''faith'' is trusting that God knows my needs better than I do and that my prayers may be answered in ways I have not anticipated. Why doesn''t God always give me what I ask for? If I look to Esther, I notice she comes to God aware of her need for help but not feeling entitled to receive the answer she wants. She simply asks God to give her courage and knowledge so she can find the right words to say. Jesus encourages me to ask God for help, to seek answers and to knock till the door opens because God will always give good things. Perhaps I need to be open enough to realise what seems like a door closing may really be a door opening. What does God want to give me this Lent? I may have to take time to notice how God answers my prayers.'
)
ON CONFLICT (date) DO UPDATE SET
    liturgical_color = EXCLUDED.liturgical_color,
    title = EXCLUDED.title,
    first_reading_ref = EXCLUDED.first_reading_ref,
    first_reading_text = EXCLUDED.first_reading_text,
    psalm_ref = EXCLUDED.psalm_ref,
    psalm_response = EXCLUDED.psalm_response,
    psalm_text = EXCLUDED.psalm_text,
    gospel_ref = EXCLUDED.gospel_ref,
    gospel_text = EXCLUDED.gospel_text,
    reflection_body = EXCLUDED.reflection_body;

-- 2026-02-27 (Friday, 1st Week of Lent)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-02-27', 'Violet', '1st Week of Lent',
    'Ezekiel 18: 21-28', 'Thus says the Lord God: ''If the wicked man renounces all the sins he has committed, respects my laws and is law-abiding and honest, he will certainly live; he will not die. All the sins he committed will be forgotten from then on; he shall live because of the integrity he has practised. What! Am I likely to take pleasure in the death of a wicked man—it is the Lord who speaks—and not prefer to see him renounce his wickedness and live? But if the upright man renounces his integrity, commits sin, copies the wicked man and practises every kind of filth, is he to live? All the integrity he has practised shall be forgotten from then on; but this is because he himself has broken faith and committed sin, and for this he shall die. But you object, "What the Lord does is unjust." Listen, you House of Israel: is what I do unjust? Is it not what you do that is unjust? When the upright man renounces his integrity to commit sin and dies because of this, he dies because of the evil that he himself has committed. When the sinner renounces sin to become law-abiding and honest, he deserves to live. He has chosen to renounce all his previous sins, he shall certainly live; he shall not die.''',
    'Psalm 129. R. v. 3', 'If you, O Lord, laid bare our guilt, who could endure it?', 'If you, O Lord, laid bare our guilt, who could endure it?',
    'Matthew 5: 20-26', 'Jesus said to his disciples: ''If your virtue goes no deeper than that of the scribes and Pharisees, you will never get into the kingdom of heaven. You have learnt how it was said to our ancestors: You must not kill, and if anyone does kill he must answer for it before the court. But I say this to you: anyone who is angry with his brother will answer for it before the court; if a man calls his brother "Fool" he will answer for it before the Sanhedrin, and if a man calls him "Renegade" he will answer for it in hell fire. So then, if you are bringing your offering to the altar and there remember that your brother has something against you, leave your offering there before the altar, go and be reconciled with your brother first, and then come back and present your offering. Come to terms with your opponent in good time while you are still on the way to the court with him, or he may hand you over to the judge and the judge to the officer, and you will be thrown into prison. I tell you solemnly, you will not get out till you have paid the last penny.''',
    'Ezekiel invites us to trust in God—to leave our sins behind, take responsibility for our lives and do what is right and just. Jesus invites us to think seriously about what we do—we may not actually kill a person but our angry and hurtful thoughts and words towards another may nonetheless turn us away from God and others. Lent is a good time to think about these invitations and seek reconciliation. The words of the psalmist inspire me to pray: Out of the depths of my being I humbly come before you, God, asking once again for your mercy and forgiveness. May the dawn of each new day remind me of your unconditional love for me and may your compassion fill my whole being so I can be reconciled with others and thus with you. Let there be reconciliation and peace on earth and let it begin with me.'
)
ON CONFLICT (date) DO UPDATE SET
    liturgical_color = EXCLUDED.liturgical_color,
    title = EXCLUDED.title,
    first_reading_ref = EXCLUDED.first_reading_ref,
    first_reading_text = EXCLUDED.first_reading_text,
    psalm_ref = EXCLUDED.psalm_ref,
    psalm_response = EXCLUDED.psalm_response,
    psalm_text = EXCLUDED.psalm_text,
    gospel_ref = EXCLUDED.gospel_ref,
    gospel_text = EXCLUDED.gospel_text,
    reflection_body = EXCLUDED.reflection_body;

-- 2026-02-28 (Saturday, 1st Week of Lent)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-02-28', 'Violet', '1st Week of Lent',
    'Deuteronomy 26: 16-19', 'Moses said to the people: "The Lord your God today commands you to observe these laws and customs..."',
    'Psalm 118: 1-2, 4-5, 7-8. R. v. 1', 'Happy are they who follow the law of the Lord!', 'Happy are they who follow the law of the Lord!',
    'Matthew 5: 43-48', 'Jesus said to his disciples: "You have learnt how it was said: You must love your neighbour and hate your enemy. But I say this to you: love your enemies and pray for those who persecute you; in this way you will be sons of your Father in heaven, for he causes his sun to rise on bad men as well as good..."',
    'Love your enemies, pray for those who persecute you ... be perfect just as your heavenly Father is perfect. Jesus doesn''t make it easy! The challenge of the Gospel today is to open our hearts to see and love everyone as God sees and loves them. Sometimes it takes a long time and much effort to be able to look beyond divisions and past hurts. But we also know healing can come when situations can be worked through in conversation, mediation processes or prayer. Where am I at the moment? Perhaps all I can do is pray for the grace to love as God loves and leave the rest to God.'
)
ON CONFLICT (date) DO UPDATE SET
    liturgical_color = EXCLUDED.liturgical_color,
    title = EXCLUDED.title,
    first_reading_ref = EXCLUDED.first_reading_ref,
    first_reading_text = EXCLUDED.first_reading_text,
    psalm_ref = EXCLUDED.psalm_ref,
    psalm_response = EXCLUDED.psalm_response,
    psalm_text = EXCLUDED.psalm_text,
    gospel_ref = EXCLUDED.gospel_ref,
    gospel_text = EXCLUDED.gospel_text,
    reflection_body = EXCLUDED.reflection_body;

-- 2026-03-01 (Second Sunday of Lent)
INSERT INTO daily_reflections (
    date, liturgical_color, title,
    first_reading_ref, first_reading_text,
    psalm_ref, psalm_response, psalm_text,
    second_reading_ref, second_reading_text,
    gospel_acclamation, gospel_ref, gospel_text,
    reflection_body
) VALUES (
    '2026-03-01', 'Violet', 'Second Sunday of Lent',
    'Genesis 12: 1-4', 'The Lord said to Abram, "Leave your country, your family and your father''s house, for the land I will show you..."',
    'Psalm 32: 4-5, 18-20, 22. R. v. 22', 'Lord, let your mercy be on us, as we place our trust in you.', 'Lord, let your mercy be on us, as we place our trust in you.',
    '2 Timothy 1: 8-10', 'With me, bear the hardships for the sake of the Good News, relying on the power of God...',
    'From the bright cloud the Father''s voice was heard: "This is my Son, the Beloved. Listen to him!"',
    'Matthew 17: 1-9', 'Jesus took with him Peter and James and his brother John and led them up a high mountain where they could be alone. There in their presence he was transfigured... "His face shone like the sun and his clothes became as white as the light."',
    'Today''s Gospel is one of the most dramatic moments in all scripture—the transfiguration of Jesus Christ, in which our Lord appears to his chosen disciples in glory... truth of eternity. What they saw, indeed, was but the merest glance, the slightest revelation; anything more would have overwhelmed them—but it was enough to fill them with awe and wonder. And it is this same Jesus Christ who appears to us in every Mass, clothed, not in raiment of dazzling white, but in the visible form of humble bread and wine. Let us therefore say at each celebration of the Eucharist, ''Lord, it is good for us to be here!'''
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
