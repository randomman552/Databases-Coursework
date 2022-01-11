MATCH (b:Badge)<-[er:EARNED]-(u:User)-[pr:POSTED]->(q:Question)
WHERE
    b.name = 'Nice Question' AND er.date >= datetime({year: 2020})
RETURN
    collect(DISTINCT u.id)[0] as `User ID`,
    collect(DISTINCT u.display_name)[0] as `Display Name`,
    collect(DISTINCT b.name)[0] as `Badge Name`,
    q.id as `Question ID`,
    q.title as `Question Title`