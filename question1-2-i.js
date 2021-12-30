// Database A
db.users.aggregate([
    {
      '$lookup': {
        'from': 'badges', 
        'let': {
          'id': '$id'
        }, 
        'as': 'badges', 
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$user_id', '$$id'
                ]
              }
            }
          }, {
            '$project': {
              '_id': 0, 
              'id': 0, 
              'user_id': 0
            }
          }
        ]
      }
    }, {
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
        'id': 1, 
        'display_name': 1, 
        'badge_name': '$badges.name', 
        'date_awarded': '$badges.date'
      }
    }
]);

// Database B
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
        'id': 1, 
        'display_name': 1, 
        'badge_name': '$badges.name', 
        'date_awarded': '$badges.date'
        }
    }
]);