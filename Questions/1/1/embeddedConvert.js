// Create indices to speed up lookup operations
db.comments.createIndex({'post_id': 1});
db.answers.createIndex({'parent_id': 1});
db.badges.createIndex({'user_id': 1});

// Run the query
db.users.aggregate([
  {
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
    '$unwind': {
      'path': '$questions', 
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$lookup': {
      'from': 'answers', 
      'let': {
        'qid': '$questions.id'
      }, 
      'as': 'questions.answers', 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$eq': [
                '$parent_id', '$$qid'
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
        'qid': '$questions.id'
      }, 
      'as': 'questions.comments', 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$eq': [
                '$post_id', '$$qid'
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
    '$group': {
      '_id': '$_id', 
      'id': {
        '$first': '$id'
      }, 
      'display_name': {
        '$first': '$display_name'
      }, 
      'about_me': {
        '$first': '$about_me'
      }, 
      'age': {
        '$first': '$age'
      }, 
      'creation_date': {
        '$first': '$creation_date'
      }, 
      'last_access_date': {
        '$first': '$last_access_date'
      }, 
      'location': {
        '$first': '$location'
      }, 
      'reputation': {
        '$first': '$reputation'
      }, 
      'up_votes': {
        '$first': '$up_votes'
      }, 
      'down_votes': {
        '$first': '$down_votes'
      }, 
      'views': {
        '$first': '$views'
      }, 
      'profile_image_url': {
        '$first': '$profile_image_url'
      }, 
      'website_url': {
        '$first': '$website_url'
      }, 
      'questions': {
        '$push': '$questions'
      }
    }
  }, {
    '$set': {
      'questions': {
        '$filter': {
          'input': '$questions', 
          'as': 'q', 
          'cond': {
            '$in': [
              '$$q.id', '$questions.id'
            ]
          }
        }
      }
    }
  }, {
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