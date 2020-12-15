const root_url = "http://data.icrisat.org/dldAPI/";
let loader = 0;
    
  const get = (url) => {
      loader++;
      return new Promise((resolve,reject) => {
        $.ajax({
            type: "GET",
            url: root_url + url,
            success: function (response){
                loader--;
                resolve(response);
            },
            error: function (err){
                loader--;
                alert("Cannot connect to server");
                reject(err);
            }
        });
      });
  }

  const post = (url, data) => {
    loader++;
    return new Promise((resolve,reject) => {
      $.ajax({
          'type': "POST",
          'url': root_url + url,
          'data': data,
          success: function (response){
              loader--;
              resolve(response);
          },
          error: function (err){
              loader--;
              alert("Cannot connect to server");
              reject(err);
          }
      });
    });

 
}