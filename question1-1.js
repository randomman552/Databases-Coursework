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
    '$lookup': {
      'from': 'questions', 
      'let': {
        'id': '$id'
      }, 
      'as': 'questions', 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$eq': [
                '$owner_user_id', '$$id'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0
          }
        }
      ]
    }
  }, {
    '$lookup': {
      'from': 'answers', 
      'let': {
        'id': '$id'
      }, 
      'as': 'answers', 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$eq': [
                '$owner_user_id', '$$id'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0
          }
        }
      ]
    }
  }, {
    '$lookup': {
      'from': 'comments', 
      'let': {
        'id': '$id'
      }, 
      'as': 'comments', 
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
            '_id': 0
          }
        }
      ]
    }
  }, {
    '$out': {
      'db': 'database_B', 
      'coll': 'users'
    }
  }
]);