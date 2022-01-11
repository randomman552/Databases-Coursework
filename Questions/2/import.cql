// Create constraints
CREATE CONSTRAINT ON (n:User) ASSERT n.id IS UNIQUE;
CREATE CONSTRAINT ON (n:Badge) ASSERT n.id IS UNIQUE;
CREATE CONSTRAINT ON (n:Question) ASSERT n.id IS UNIQUE;
CREATE CONSTRAINT ON (n:Answer) ASSERT n.id IS UNIQUE;
CREATE CONSTRAINT ON (n:Comment) ASSERT n.id IS UNIQUE;

// Create indices
CREATE INDEX badge_name FOR (n:Badge) ON (n.name)

// Load Users
LOAD CSV WITH HEADERS FROM "file:///users.csv" AS r
WITH r, toInteger(r.id) AS userID
MERGE (u:User {id:userID})
    SET u.display_name = r.display_name,
        u.profile_image_url = CASE (r.profile_image_url) WHEN "null" THEN null ELSE r.profile_image_url END,
        u.about_me = CASE (r.about_me) WHEN "null" THEN null ELSE r.about_me END,
        u.location = CASE (r.location) WHEN "null" THEN null ELSE r.location END,
        u.age = toInteger(r.age),
        u.last_access_date = datetime(r.last_access_date),
        u.creation_date = datetime(r.creation_date),
        u.reputation = toInteger(r.reputation),
        u.down_votes = toInteger(r.down_votes),
        u.up_votes = toInteger(r.up_votes),
        u.views = toInteger(r.views)
RETURN u;

// Load Badges
LOAD CSV WITH HEADERS FROM "file:///badges.csv" AS r
WITH r, toInteger(r.id) AS badgeID
MERGE (b:Badge {id:badgeID})
    SET b.user_id = toInteger(r.user_id),
        b.name = r.name,
        b.date = datetime(r.date),
        b.tag_based = toBoolean(r.tag_based),
        b.class = toInteger(r.class)
RETURN b;

// Load Questions
LOAD CSV WITH HEADERS FROM "file:///questions.csv" AS r
WITH r, toInteger(r.id) as questionID
MERGE (q:Question {id:questionID})
    SET q.title = r.title,
        q.tags = r.tags,

        q.post_type_id = toInteger(r.post_type_id),
        q.score = toInteger(r.score),
        q.view_count = toInteger(r.view_count),
        q.favorite_count = toInteger(r.favorite_count),

        q.owner_user_id = toInteger(r.owner_user_id),
        q.last_editor_user_id = toInteger(r.last_editor_user_id),

        q.creation_date = datetime(r.creation_date),
        q.last_activity_date = datetime(r.last_activity_date),

        q.answer_count = toInteger(r.answer_count),
        q.accepted_answer_id = toInteger(r.accepted_answer_id),

        q.comment_count = toInteger(r.comment_count)
RETURN q;

// Load Answers
LOAD CSV WITH HEADERS FROM "file:///answers.csv" as r
WITH r, toInteger(r.id) as answerID
MERGE (a:Answer {id:answerID})
    SET a.parent_id = toInteger(r.parent_id),
        a.post_type_id = toInteger(r.post_type_id),

        a.comment_count = toInteger(r.comment_count),
        a.score = toInteger(r.score),

        a.owner_user_id = toInteger(r.owner_user_id),
        a.last_editor_user_id = toInteger(r.last_editor_user_id),

        a.creation_date = datetime(r.creation_date),
        a.last_activity_date = datetime(r.last_activity_date)
RETURN a;

// Load comments
LOAD CSV WITH HEADERS FROM "file:///comments.csv" as r
WITH r, toInteger(r.id) as commentID
MERGE (c:Comment {id:commentID})
    SET c.post_id = toInteger(r.post_id),
        c.user_id = toInteger(r.user_id),
        c.score = toInteger(r.score),
        c.creation_date = datetime(r.creation_date)
RETURN c;


// Create relationships
// Create User --> Badge relationship
MATCH (u:User), (b:Badge)
WHERE u.id = b.user_id
MERGE (u)-[r:EARNED {date: b.date, tag_based: b.tag_based}]->(b)
REMOVE b.user_id, b.tag_based
RETURN u, r, b;


// Create User -[POSTED]-> Question relationships
MATCH (u:User), (q:Question)
WHERE u.id = q.owner_user_id
MERGE (u)-[r:POSTED {date: q.creation_date}]->(q)
REMOVE q.owner_user_id, q.creation_date
RETURN u, r, q;

// Create User -[EDITED]-> Question relationships
MATCH (u:User), (q:Question)
WHERE u.id = q.last_editor_user_id
MERGE (u)-[r:EDITED]->(q)
REMOVE q.last_editor_user_id
RETURN u, r, q;

// Create User -[POSTED]-> Answer relationship
MATCH (u:User), (a:Answer)
WHERE u.id = a.owner_user_id
MERGE (u)-[r:POSTED {date: a.creation_date}]->(a)
REMOVE a.owner_user_id, a.creation_date
RETURN u, r, a;

// Create User -[POSTED]-> Comment relationship
MATCH (u:User), (c:Comment)
WHERE u.id = c.user_id
MERGE (u)-[r:POSTED {date: c.creation_date}]->(c)
REMOVE c.user_id, c.creation_date
RETURN u, r, c;

// Create Question -[ACCEPTS]-> Answer relationship
MATCH (q:Question), (a:Answer)
WHERE q.accepted_answer_id = a.id
MERGE (q)-[r:ACCEPTS]->(a)
REMOVE q.accepted_answer_id
RETURN q, r, a;

// Create Answer -[ANSWERS]-> Question
MATCH (a:Answer), (q:Question)
WHERE a.parent_id = q.id
MERGE (a)-[r:ANSWERS]->(q)
REMOVE a.parent_id
RETURN a, r, q;

// Create Comment -[COMMENTS_ON]-> Question
MATCH (c:Comment), (q:Question)
WHERE c.post_id = q.id
MERGE (c)-[r:COMMENTS_ON]->(q)
REMOVE c.post_id
RETURN c, r, q;


// Create Comment -[COMMENTS_ON]-> Answer
MATCH (c:Comment), (a:Answer)
WHERE c.post_id = a.id
MERGE (c)-[r:COMMENTS_ON]->(a)
REMOVE c.post_id
RETURN c, r, a;