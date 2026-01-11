-- SQL script to insert Academic Reading passage: Older Workers in the Workforce
-- This script inserts the reading passage, questions, and answers into the database
-- Run this script against your PostgreSQL database
--
-- To run this script:
--   1. Connect to your PostgreSQL database: psql -U postgres -d ielts_prep
--   2. Run: \i backend/src/main/resources/insert_older_workers_reading.sql
--   OR copy and paste the contents into your database client
--
-- Note: If you have the exact passage content, you can replace the paragraph text below

DO $$
DECLARE
    reading_id_var BIGINT;
BEGIN
    -- Insert the main reading record
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
        'Academic Reading – Older Workers',
        'medium',
        'MCQS',
        'As populations age across many developed countries, the issue of older workers in the workforce has become increasingly significant. Companies are beginning to recognize that older employees bring valuable experience, stability, and expertise to their organizations. However, there are still challenges that need to be addressed to fully integrate older workers into modern workplaces.

Many organizations are now reconsidering their approach to retirement and career transitions. Instead of viewing retirement as a sudden departure from work, some companies are exploring phased retirement programs that allow employees to gradually reduce their working hours. This approach not only helps retain valuable knowledge and skills but also provides older workers with a smoother transition into retirement.

One notable example is Skill Team, a consulting firm that has implemented innovative programs specifically designed for older workers. The company has created flexible work arrangements, including part-time positions and project-based contracts that appeal to experienced professionals who may not want to commit to full-time employment. These arrangements have proven successful in attracting and retaining talented older workers who might otherwise have left the workforce entirely.

Research has shown that "bridge" jobs—positions that serve as a transition between full-time employment and full retirement—are becoming increasingly common. These jobs often allow older workers to maintain some level of professional engagement while enjoying more flexibility and reduced responsibilities. Bridge jobs can take various forms, from consulting roles to part-time positions in the same or different industries.

A study conducted by David Storey examined the impact of older workers on organizational performance. The research found that companies with a higher proportion of older workers often demonstrate greater stability and lower turnover rates. Additionally, these organizations tend to have stronger mentoring relationships, as older employees frequently take on roles as mentors to younger colleagues, facilitating knowledge transfer and professional development.

Despite these positive findings, challenges remain. Age discrimination, though illegal in many jurisdictions, can still be a barrier for older workers seeking employment or advancement. Furthermore, some older workers may need additional training to adapt to rapidly changing technologies and work practices. However, many organizations are finding that the investment in training older workers pays dividends in terms of loyalty, experience, and institutional knowledge.',
        'Read the text and answer questions 1–4.',
        NULL,
        false,
        '1-4',
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO reading_id_var;

    -- Insert MCQ questions with options (A, B, C, D)
    -- Question 1
    INSERT INTO reading_questions (reading_id, question_text, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        'In paragraph one, the writer suggests that companies could consider:',
        'A',
        1,
        true
    );
    
    INSERT INTO reading_question_options (reading_question_id, option_text, option_order) VALUES
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 1), 'implementing phased retirement programs and flexible work arrangements', 0),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 1), 'reducing the number of older workers in their organizations', 1),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 1), 'focusing only on younger employees for innovation', 2),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 1), 'eliminating retirement benefits for older workers', 3);

    -- Question 2
    INSERT INTO reading_questions (reading_id, question_text, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        'Skill Team is an example of a company which:',
        'B',
        2,
        true
    );
    
    INSERT INTO reading_question_options (reading_question_id, option_text, option_order) VALUES
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 2), 'only hires younger professionals', 0),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 2), 'has created flexible work arrangements specifically for older workers', 1),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 2), 'requires all employees to work full-time', 2),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 2), 'does not value experience in the workplace', 3);

    -- Question 3
    INSERT INTO reading_questions (reading_id, question_text, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        'According to the writer, ''bridge'' jobs:',
        'C',
        3,
        true
    );
    
    INSERT INTO reading_question_options (reading_question_id, option_text, option_order) VALUES
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 3), 'are only available in consulting industries', 0),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 3), 'require full-time commitment from workers', 1),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 3), 'serve as a transition between full-time employment and full retirement', 2),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 3), 'are becoming less common in modern workplaces', 3);

    -- Question 4
    INSERT INTO reading_questions (reading_id, question_text, correct_answer, question_order, is_initial_question)
    VALUES (
        reading_id_var,
        'David Storey''s study found that:',
        'D',
        4,
        true
    );
    
    INSERT INTO reading_question_options (reading_question_id, option_text, option_order) VALUES
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 4), 'older workers reduce organizational performance', 0),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 4), 'younger workers are more valuable than older workers', 1),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 4), 'age discrimination is not a significant issue', 2),
        ((SELECT id FROM reading_questions WHERE reading_id = reading_id_var AND question_order = 4), 'companies with more older workers show greater stability and lower turnover', 3);

END $$;

