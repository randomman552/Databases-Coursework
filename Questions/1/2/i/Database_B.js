db.users.aggregate([
    {
        '$match': {
            'badges': {
                '$elemMatch': {
                'name': 'Fanatic'
                }
            }
        }
    }, {
        '$project': {
            '_id': 0, 
            'id': 1, 
            'display_name': 1, 
            'badges': {
                '$filter': {
                'input': '$badges', 
                'as': 'badge', 
                'cond': {
                    '$eq': [
                    '$$badge.name', 'Fanatic'
                    ]
                }
                }
            }
        }
    }, {
        '$unwind': {
            'path': '$badges'
        }
    }, {
        '$project': {
            'user_id': "$id",
            'display_name': 1,
            'badge_name': '$badges.name',
            'date_awarded': '$badges.date'
        }
    }
]);