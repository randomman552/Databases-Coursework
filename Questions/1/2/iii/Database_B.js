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
        '$min': '$badges.date'
      }, 
      'questions': {
        '$first': '$questions'
      }
    }
  }, {
    '$unwind': {
      'path': '$questions'
    }
  }, {
    '$project': {
      '_id': 0, 
      'user_id': 1, 
      'display_name': 1, 
      'badge_name': 1, 
      'badge_date_awarded': 1, 
      'question_id': '$questions.id', 
      'question_title': '$questions.title', 
      'comment_id': '$questions.comments.id'
    }
  }, {
    '$project': {
      '_id': 0
    }
  }
]);