let cropUnappResponse = null;
let cropUnappData = null;

const getCropUnappData = async () => {
    if(cropUnappResponse){
        setTimeout(() => {
            cropUnappData = processCropUnappData(cropUnappResponse);
            localStorage.setItem("cropUnappData", LZString.compress(JSON.stringify(cropUnappData)));
        });
    } else{
        get("unapportioned/area-production-yield")
        .then(aResponse => {
            if(aResponse){
                cropUnappResponse = JSON.parse(aResponse);
                cropUnappData = processCropUnappData(cropUnappResponse);
                localStorage.setItem("cropUnappData", LZString.compress(JSON.stringify(cropUnappData)));
            }
        });
    }
}