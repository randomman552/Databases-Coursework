MATCH (b:Badge)<-[er:EARNED]-(u:User)-[pr:POSTED]->(q:Question)-[ar:ACCEPTS]->(a:Answer)
WHERE
    b.name = "Inquisitive"
RETURN
    collect(DISTINCT u.id)[0] as `User ID`,
    collect(DISTINCT u.display_name)[0] as `Display Name`,
    collect(DISTINCT b.name)[0] as `Badge Name`,
    q.id as `Question ID`,
    q.title as `Question Title`,
    a.id as `Answer ID`