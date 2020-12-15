const rootUrl = "http://data.icrisat.org/dldAPI/";
let loader = 0;
let cacheMap = new Map();

let appGeoJsonData = null;
let unappGeoJsonData = null;
let excludedStates = null;

const get = (url) => {
    loader++;
    handleLoader();
    return new Promise((resolve, reject) => {
        if (cacheMap.get(url)) {
            resolve(cacheMap.get(url));
        } else {
            $.ajax({
                type: "GET",
                dataType: "JSON",
                url: rootUrl + url,
                success: function (response) {
                    loader--;
                    handleLoader();
                    cacheMap.set(url, response);
                    resolve(JSON.stringify(cacheMap.get(url)));
                },
                error: function (err) {
                    loader--;
                    handleLoader();
                    alert("Cannot connect to server");
                    reject(err);
                }
            });
        }
    });
}

const getAppGeoJSONData = () => {
    // Apportioned Map GeoJSON
    loader++;
    handleLoader();
    $.ajax({
        type: "GET",
        dataType: 'JSON',
        url: "dld-apportioned.min.json",
        success: function (response) {
            loader--;
            handleLoader();
            appGeoJsonData = response;
        },
        error: function (err) {
            loader--;
            handleLoader();
            alert("Cannot load Geojson file.");
            reject(err);
        }
    });
}

const getUnappGeoJSONData = () => {
    // Unapportioned Map GeoJSON
    loader++;
    handleLoader();
    $.ajax({
        type: "GET",
        dataType: 'JSON',
        url: "dld-unapportioned.min.json",
        success: function (response) {
            loader--;
            handleLoader();
            unappGeoJsonData = response;
        },
        error: function (err) {
            loader--;
            handleLoader();
            alert("Cannot load Geojson file.");
            reject(err);
        }
    });
}
const handleLoader = () => {
    if(loader === 0){
        $("#main-waiting").hide();
        $("#main-container").show();
    } else{
        $("#main-container").hide();
        $("#main-waiting").show();
    }
}

$(window).on("load", function (){
    init();
    $("#single-panel-pill").trigger("click");
});
