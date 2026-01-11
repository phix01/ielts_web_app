-- Insert IELTS Academic Reading Test 1 (3 sections, 40 questions)
-- Run against the project database to add this reading for frontend use

DO $$
DECLARE
    reading_id_var BIGINT;
BEGIN
    INSERT INTO readings (
        title,
        level,
        type,
        paragraph,
        what_to_do,
        indicator_value,
        extra_data,
        initial_question_numbers,
        ending_question_numbers,
        created_at,
        updated_at
    ) VALUES (
        'IELTS Academic Reading Test 1',
        'hard',
        'MCQS',
        -- Paragraph contains three passages (Section 1, 2 and 3) separated by headings
        'Section 1: Aphantasia: A life without mental images

Aphantasia is a condition in which people are unable to form mental images. Those affected report that when they try to picture a face or a place, nothing appears: there is no mental picture. This phenomenon has raised questions about how imagination, memory and creativity are connected to inner visual imagery. Some researchers argue that people with aphantasia can still remember facts and details but rely on different cognitive strategies to do so.

Section 2: Life lessons from villains, crooks and gangsters

Writers and thinkers have long studied how fictional and historical villains teach lessons about social values and human motivations. Studying unsavory characters can reveal how societies define right and wrong, and how antiheroes reflect cultural anxieties. This approach can provide surprising insights into ethics, leadership, and the attraction of charisma in problematic figures.

Section 3: Britain needs strong TV industry

Policymakers debate the importance of maintaining a robust television industry that supports national culture and creative employment. A strong domestic TV sector is argued to sustain local storytelling, provide jobs for skilled workers, and help export cultural products abroad.',
        'Read the passage and answer questions 1–40.',
        NULL,
        false,
        '1-25',
        '26-40',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO reading_id_var;

    -- Section 1: Questions 1-13 (Q1-8 TRUE/FALSE/NOT GIVEN, Q9-13 Sentence completion up to two words)
    -- Insert initial questions (we place Section 1 and part of Section 2 into initialQuestions)
    INSERT INTO reading_initial_questions (reading_id, question) VALUES
        (reading_id_var, '1. The writer suggests that people with aphantasia cannot remember facts.'),
        (reading_id_var, '2. The term aphantasia refers to a mental condition involving inner visual imagery.'),
        (reading_id_var, '3. People with aphantasia are unable to perform creative tasks.'),
        (reading_id_var, '4. Researchers agree on a single cause for aphantasia.'),
        (reading_id_var, '5. Some people without mental imagery use different cognitive strategies.'),
        (reading_id_var, '6. The passage states that aphantasia is very common.'),
        (reading_id_var, '7. The report claims that visual memory is always impaired in aphantasia.'),
        (reading_id_var, '8. The passage describes experiments used to identify aphantasia.'),
        (reading_id_var, '9. Sentence completion: Many people with aphantasia rely on _.'),
        (reading_id_var, '10. Sentence completion: Aphantasia affects one''s ability to form mental _.'),
        (reading_id_var, '11. Sentence completion: Researchers study aphantasia to understand imagination and _.'),
        (reading_id_var, '12. Sentence completion: People with the condition may use alternative memory _.'),
        (reading_id_var, '13. Sentence completion: The absence of imagery does not necessarily mean lack of _.' );

    -- Section 2: Questions 14-26 (Q14-21 Matching Headings A–H; Q22-25 Sentence Completion ONE WORD; Q26 MCQ A–D)
    INSERT INTO reading_initial_questions (reading_id, question) VALUES
        (reading_id_var, '14. Matching heading: Choose headings A–H for paragraphs 1–8 (list headings separately).'),
        (reading_id_var, '15. Matching heading: Identify the main idea of paragraph 2.'),
        (reading_id_var, '16. Matching heading: Identify the main idea of paragraph 3.'),
        (reading_id_var, '17. Matching heading: Identify the main idea of paragraph 4.'),
        (reading_id_var, '18. Matching heading: Identify the main idea of paragraph 5.'),
        (reading_id_var, '19. Matching heading: Identify the main idea of paragraph 6.'),
        (reading_id_var, '20. Matching heading: Identify the main idea of paragraph 7.'),
        (reading_id_var, '21. Matching heading: Identify the main idea of paragraph 8.'),
        (reading_id_var, '22. Sentence completion: A study of villains can reveal insights into _.'),
        (reading_id_var, '23. Sentence completion: Villains reflect cultural _.'),
        (reading_id_var, '24. Sentence completion: Studying antiheroes helps understand _.'),
        (reading_id_var, '25. Sentence completion: Reflection on villains often informs debates about _.' );

    -- Section 2: Question 26 (MCQ) — insert as a full MCQ with non-null option columns
    INSERT INTO reading_questions (reading_id, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        '26. According to the passage, studying villains primarily helps us understand:',
        'the biographies of criminals',
        'the justification of criminal acts',
        'societal values and human motivations',
        'legal frameworks for punishment',
        'C',
        26,
        true
    );

    -- Section 3: Questions 27-40 (Q27-31 TRUE/FALSE/NOT GIVEN; Q32-35 MCQ; Q36-40 Summary completion NO MORE THAN TWO WORDS)
    INSERT INTO reading_ending_questions (reading_id, question) VALUES
        (reading_id_var, '27. The government''s role is central to the TV industry''s success.'),
        (reading_id_var, '28. A strong TV industry helps export cultural products.'),
        (reading_id_var, '29. Local storytelling is unaffected by policy changes.'),
        (reading_id_var, '30. Maintaining jobs in TV requires support for skilled workers.'),
        (reading_id_var, '31. The passage argues that a weak TV industry benefits local talent.'),
        (reading_id_var, '36. Summary completion: The author recommends investment in _ to maintain creative employment.'),
        (reading_id_var, '37. Summary completion: Strong TV supports the export of _.'),
        (reading_id_var, '38. Summary completion: Policy should help preserve _.'),
        (reading_id_var, '39. Summary completion: The sector offers jobs for _.'),
        (reading_id_var, '40. Summary completion: A vibrant TV industry promotes _.' );

    -- Section 3 MCQs (Q32-35): insert as proper MCQs with non-null option columns
    INSERT INTO reading_questions (reading_id, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        '32. What is cited as a benefit of a strong domestic TV industry?',
        'supporting local storytelling',
        'reducing exports',
        'limiting cultural variety',
        'increasing isolation',
        'A',
        32,
        false
    );

    INSERT INTO reading_questions (reading_id, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        '33. The passage suggests that TV jobs are important because they:',
        'export cultural goods exclusively',
        'provide employment for skilled workers',
        'reduce production quality',
        'promote foreign content only',
        'B',
        33,
        false
    );

    INSERT INTO reading_questions (reading_id, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        '34. Which argument is used to support the case for a strong TV industry?',
        'decreasing creative jobs',
        'closing domestic channels',
        'discouraging local talent',
        'sustaining national culture and employment',
        'D',
        34,
        false
    );

    INSERT INTO reading_questions (reading_id, question_text, option_a, option_b, option_c, option_d, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        '35. The passage recommends that policy should:',
        'ignore creative industries',
        'reduce cultural exports',
        'support the TV sector to protect jobs',
        'ban foreign productions',
        'C',
        35,
        false
    );

    -- Insert answers for non-MCQ questions (so they appear after submission)
    INSERT INTO reading_answers (reading_id, answer) VALUES
        (reading_id_var, 'NOT GIVEN'),
        (reading_id_var, 'TRUE'),
        (reading_id_var, 'NOT GIVEN'),
        (reading_id_var, 'FALSE'),
        (reading_id_var, 'TRUE'),
        (reading_id_var, 'NOT GIVEN'),
        (reading_id_var, 'FALSE'),
        (reading_id_var, 'TRUE'),
        (reading_id_var, 'different strategies'),
        (reading_id_var, 'images'),
        (reading_id_var, 'creativity'),
        (reading_id_var, 'methods'),
        (reading_id_var, 'memory'),
        (reading_id_var, 'A'),
        (reading_id_var, 'B'),
        (reading_id_var, 'C'),
        (reading_id_var, 'D'),
        (reading_id_var, 'INSIGHT'),
        (reading_id_var, 'VALUES'),
        (reading_id_var, 'ETHICS'),
        (reading_id_var, 'POLICY'),
        (reading_id_var, 'TRUE'),
        (reading_id_var, 'TRUE'),
        (reading_id_var, 'NOT GIVEN'),
        (reading_id_var, 'TRUE'),
        (reading_id_var, 'WORKFORCE'),
        (reading_id_var, 'CULTURE'),
        (reading_id_var, 'ARCHIVES'),
        (reading_id_var, 'PRODUCTIONS'),
        (reading_id_var, 'ECONOMIC BENEFITS');

END $$;
