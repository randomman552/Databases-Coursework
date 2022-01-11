MATCH (b:Badge)<-[r:EARNED]-(u:User)
WHERE b.name = 'Fanatic'
RETURN 
    u.id as `User ID`, 
    u.display_name as `Display Name`, 
    b.name as `Badge Name`, 
    r.date as `Date Awarded`;