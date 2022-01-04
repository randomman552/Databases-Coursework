db.badges.aggregate([
    {
      '$match': {
        'name': 'Fanatic'
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
        'user_id': '$user_id', 
        'display_name': '$user.display_name', 
        'badge_name': '$name', 
        'date_awarded': '$date'
      }
    }
  ]);