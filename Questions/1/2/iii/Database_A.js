db.badges.aggregate([
    {
      '$match': {
        'name': 'Nice Question', 
        'date': {
          '$gt': new Date('Wed, 01 Jan 2020 00:00:00 GMT')
        }
      }
    }, {
      '$group': {
        '_id': '$user_id', 
        'user_id': {
          '$first': '$user_id'
        }, 
        'badge_name': {
          '$first': '$name'
        }, 
        'badge_awarded_date': {
          '$min': '$date'
        }
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'user_id', 
        'foreignField': 'id', 
        'as': 'user'
      }
    }, {
      '$unwind': {
        'path': '$user'
      }
    }, {
      '$project': {
        '_id': 0, 
        'user_id': '$user.id', 
        'display_name': '$user.display_name', 
        'badge_name': '$badge_name', 
        'badge_awarded_date': '$badge_awarded_date'
      }
    }, {
      '$lookup': {
        'from': 'questions', 
        'localField': 'user_id', 
        'foreignField': 'owner_user_id', 
        'as': 'questions'
      }
    }, {
      '$unwind': {
        'path': '$questions'
      }
    }, {
      '$lookup': {
        'from': 'comments', 
        'localField': 'questions.id', 
        'foreignField': 'post_id', 
        'as': 'comments'
      }
    }, {
      '$project': {
        'user_id': '$user_id', 
        'display_name': '$display_name', 
        'badge_name': '$badge_name', 
        'badge_awarded_date': '$badge_awarded_date', 
        'question_id': '$questions.id', 
        'question_title': '$questions.title', 
        'comment_id': '$comments.id'
      }
    }
  ]);