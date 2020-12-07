// 9, 10, 11, 12, 14
use MDBMusic;
db.createCollection("Band");
db.createCollection("Album")
db.createCollection("Track")
// mongoimport --db MDBMusic --collection Band --file ~/Desktop/Band.json
// mongoimport --db MDBMusic --collection Track --file ~/Desktop/Track.json
// mongoimport --db MDBMusic --collection Album --file ~/Desktop/Album.json
// 13
show collections;
// 15
db.Track.aggregate([
    {
        $lookup:
        {
            localField: "album",
            from: "Album",
            foreignField: "title",
            as: "Album"
        }
   },
   {$match: {"Album.genre": "Rock"}},
   {$project: {_id: 0, id: 0, timeSec: 0, album: 0, Album: 0}},
   {$lookup:
       {
          localField: "band",
          from: "Band",
          foreignField: "id",
          as: "Band"
       }
   },
   {$unwind: "$Band"},
   {$project: {"Band.name": 1, title:1}}
]);
// 16
db.Album.aggregate([
    {
        $group:
        {
            _id:
            {
                band:"$band"
            },
            count:
            {
                $sum: 1
            }
        }
    },
    {
        $project:
        {
            _id:1,
            count:{$cond: [{"$gte": ["$count", 4]}, 1, 0]}
        }
    },
    {
        $match:
        {
            count: {"$gt": 0}
        }
    },
    {$lookup:
       {
          localField: "_id.band",
          from: "Band",
          foreignField: "id",
          as: "Band"
       }
   },
   {$project: {"Band.name": 1, _id:0}}
]);
// 17