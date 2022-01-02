db.users.aggregate([
    {
      '$match': {
        'badges': {
          '$elemMatch': {
            'name': 'Nice Question', 
            'date': {
              '$gt': new Date('Wed, 01 Jan 2020 00:00:00 GMT')
            }
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
              '$and': [
                {
                  '$eq': [
                    '$$badge.name', 'Nice Question'
                  ]
                }, {
                  '$gt': [
                    '$$badge.date', new Date('Wed, 01 Jan 2020 00:00:00 GMT')
                  ]
                }
              ]
            }
          }
        }, 
        'questions': 1
      }
    }, {
      '$unwind': {
        'path': '$badges'
      }
    }, {
      '$sort': {
        'badges': 1
      }
    }, {
      '$group': {
        '_id': '$id', 
        'user_id': {
          '$first': '$id'
        }, 
        'display_name': {
          '$first': '$display_name'
        }, 
        'badge_name': {
          '$first': '$badges.name'
        }, 
        'badge_date_awarded': {
          '$first': '$badges.date'
        }, 
        'questions': {
          '$first': '$questions'
        }
      }
    }, {
      '$project': {
        '_id': 0
      }
    }, {
      '$unwind': {
        'path': '$questions'
      }
    }, {
      '$group': {
        '_id': '$user_id', 
        'user_id': {
          '$first': '$user_id'
        }, 
        'question_id': {
          '$push': '$questions.id'
        }, 
        'question_title': {
          '$push': '$questions.title'
        }, 
        'badge_name': {
          '$first': '$badge_name'
        }, 
        'badge_date_awarded': {
          '$first': '$badge_date_awarded'
        }, 
        'display_name': {
          '$first': '$display_name'
        }
      }
    }, {
      '$project': {
        '_id': 0
      }
    }
  ], {"allowDiskUse": true});