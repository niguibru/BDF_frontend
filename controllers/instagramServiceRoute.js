var ig = require('instagram-node').instagram();

ig.use({ access_token: '15691853.5b9e1e6.b7592e1fab9f4c598889c3663efcea7a' });
ig.use({ client_id: '3e5c5debcd8743a6b474cda1999374b8 ',
         client_secret: '957f94b3ffe74a3e9243812b8fd63ff1 ' });

//ig.subscriptions(function(err, subscriptions, limit){
//  console.log(subscriptions);
//});
//ig.user_search('niguibru', function(err, users, limit) {
//  console.log(users);
//});
//ig.tag_media_recent('fifa2014', function(err, medias, pagination, limit) {
//  console.log(medias);
//});


module.exports = exports = {

  // Web Services
  getInstaPrevs: function(req, res) {
    var lat = parseFloat(req.query.lat);
    var long = parseFloat(req.query.long);
    ig.media_search(lat, long, function(err, medias, limit) {
      var instaResp = []; 
      for (var i = 0; (i <= medias.length -1); i++) {
        instaResp.push({ 
          username: medias[i].user.username,
          link: medias[i].link,
          image: medias[i].images.low_resolution.url,
        });
      }
      res.json(instaResp);
    });
    
    
    
//    ig.tag_media_recent('fifa2014', function(err, medias, pagination, limit) {
//      var instaMedias = medias[0];
//      console.log(instaMedias);
//      var instaResp = { 
//        username: instaMedias.user.username,
//        link: instaMedias.link,
//        image: instaMedias.images.low_resolution.url,
//      };
//      res.json(instaResp);
//    });
  }
}

//
//{ attribution: null,
//  tags: [ 'brasil2014', 'fifa', 'españa2014', 'fifa2014' ],
//  location: null,
//  comments: { count: 0, data: [] },
//  filter: 'Normal',
//  created_time: '1402102126',
//  link: 'http://instagram.com/p/o7F0AxSarv/',
//  likes: { count: 0, data: [] },
//  images: 
//   { low_resolution: 
//      { url: 'http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/10454034_1489704361258919_1463268644_a.jpg',
//        width: 306,
//        height: 306 },
//     thumbnail: 
//      { url: 'http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/10454034_1489704361258919_1463268644_s.jpg',
//        width: 150,
//        height: 150 },
//     standard_resolution: 
//      { url: 'http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/10454034_1489704361258919_1463268644_n.jpg',
//        width: 640,
//        height: 640 } },
//  users_in_photo: [],
//  caption: 
//   { created_time: '1402102126',
//     text: 'La final que todos esperamos BRASIL 2014 #brasil2014 #fifa #fifa2014 #españa2014',
//     from: 
//      { username: 'michaelguilamof',
//        profile_picture: 'http://images.ak.instagram.com/profiles/profile_1184314713_75sq_1394987836.jpg',
//        id: '1184314713',
//        full_name: 'Michael Guilamo Figueroa' },
//     id: '737208529005947859' },
//  type: 'image',
//  id: '737208528477465327_1184314713',
//  user: 
//   { username: 'michaelguilamof',
//     website: '',
//     profile_picture: 'http://images.ak.instagram.com/profiles/profile_1184314713_75sq_1394987836.jpg',
//     full_name: 'Michael Guilamo Figueroa',
//     bio: '',
//     id: '1184314713' } }
