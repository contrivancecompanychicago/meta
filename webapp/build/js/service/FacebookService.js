define(function () {
  function FacebookService() {
  }

  FacebookService.fetch = function (user) {
    var fbId = user.get('authData').facebook.id;
    
    var p1 = new Promise(function (res, rej) {
      FB.api(
          "/" + fbId, {
          fields: 'about, age_range, first_name, cover'
        },
        function (response) {
          if (!response.error) {
            res(response);
          } else {
            rej(response.error)
          }
        }.bind(this)
      );
    });

    var p2 = new Promise(function (res, rej) {
      FB.api(
          "/" + fbId + "/picture", {
          "redirect": false,
          "height": "200",
          "type": "normal",
          "width": "200"
        },
        function (response) {
          if (!response.error) {
            res(response);
          } else {
            rej(response.error)
          }
        }.bind(this)
      );
    });

    return Promise.all([p1, p2])
      .then(function (results) {
        var profile = results[0];
        var picture = results[1];

        return user.save({
          firstName: profile.first_name,
          about: profile.about || '',
          minAge: profile.age_range.min,
          pictureUrl: picture.data.url,
          bannerUrl: profile.cover.source,
          bannerOffset: profile.cover.offset_y
        });
      });
  };

  FacebookService.update = FacebookService.fetch;
  
  if (window.Debug) window.FacebookService = FacebookService;

  return FacebookService;
});
