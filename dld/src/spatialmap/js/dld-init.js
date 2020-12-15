let cropAppData;
const getCropAppData = () => {
    let apportionedYears = [];
    for(year=1966; year<=2015; year++){
        apportionedYears.push(year.toString());
    }
    get("apportioned/area-production-yield")
    .then(aResponse => {
        if(aResponse){
            let cropAppResponse = JSON.parse(aResponse);
            cropAppData = cropAppResponse.items.map(crop => {
                let areaIndex = cropAppResponse.headers.findIndex(ele => ele.header === crop + " AREA");
                let productionIndex = cropAppResponse.headers.findIndex(ele => ele.header === crop + " PRODUCTION");
                let yieldIndex = cropAppResponse.headers.findIndex(ele => ele.header === crop + " YIELD");
                let yearIndex = cropAppResponse.headers.findIndex(ele => ele.header === "Year");
                let distCodeIndex = cropAppResponse.headers.findIndex(ele => ele.header === "Dist Code");
                let yearwiseData = apportionedYears.map(year => {
                    return{
                        "year": year,
                        "data": cropAppResponse.data.filter(dt => dt[yearIndex] === year).map(ele => {
                            return{
                                "id": ele[distCodeIndex],
                                "area": parseFloat(ele[areaIndex]),             // 1000 ha
                                "prod": parseFloat(ele[productionIndex]),       // 1000 tons
                                "yield": parseFloat(ele[yieldIndex])            // Kg per ha
                            }
                        })
                    }
                });
                return {"crop": crop.toLocaleLowerCase(), "yData": yearwiseData};
            });
            // localStorage.setItem("cropAppData", LZString.compress(JSON.stringify(cropAppData)));
        }
    });
}

let cropUnappData;
const getCropUnappData = () => {
    get("unapportioned/area-production-yield")
    .then(uResponse => {
        if(uResponse){
            let cropUnappResponse = JSON.parse(uResponse);
            cropUnappData = cropUnappResponse.items.map(crop => {
                let areaIndex = cropUnappResponse.headers.findIndex(ele => ele.header === crop + " AREA");
                let productionIndex = cropUnappResponse.headers.findIndex(ele => ele.header === crop + " PRODUCTION");
                let yieldIndex = cropUnappResponse.headers.findIndex(ele => ele.header === crop + " YIELD");
                let yearIndex = cropUnappResponse.headers.findIndex(ele => ele.header === "Year");
                let distCodeIndex = cropUnappResponse.headers.findIndex(ele => ele.header === "Dist Code");
                return{
                    "crop": crop.toLocaleLowerCase(),
                    "data": cropUnappResponse.data.filter(dt => dt[yearIndex] === "2015").map(ele => {
                        return{
                            "id": ele[distCodeIndex],
                            "area": parseFloat(ele[areaIndex]),             // 1000 ha
                            "prod": parseFloat(ele[productionIndex]),       // 1000 tons
                            "yield": parseFloat(ele[yieldIndex])            // Kg per ha
                        }
                    })
                };
            });
            // localStorage.setItem("cropUnappData", LZString.compress(JSON.stringify(cropUnappData)));
        }
    });
}


let rainData;
const getRainData = () => {
    get("unapportioned/monthly-rainfall")
    .then(uResponse => {
        if(uResponse){
            let rainResponse = JSON.parse(uResponse);
            let annualIndex = rainResponse.headers.findIndex(ele => ele.header === "ANNUAL RAINFALL");
            let yearIndex = rainResponse.headers.findIndex(ele => ele.header === "Year");
            let distCodeIndex = rainResponse.headers.findIndex(ele => ele.header === "Dist Code");
            rainData = rainResponse.data.filter(dt => dt[yearIndex] === "2015").map(ele => {
                return{
                    "id": ele[distCodeIndex],
                    "ann": parseFloat(ele[annualIndex])
                };
            });
            // localStorage.setItem("rainData", LZString.compress(JSON.stringify(rainData)));
        }
    });
}

let landuseData;
const getLanduseData = () => {
    get("unapportioned/landuse")
    .then(uResponse => {
        if(uResponse){
            let landuseResponse = JSON.parse(uResponse);
            let croppingIndex = landuseResponse.headers.findIndex(ele => ele.header === "CROPING INTENSITY");
            let totalAreaIndex = landuseResponse.headers.findIndex(ele => ele.header == "TOTAL AREA");
            let netCroppedAreaIndex = landuseResponse.headers.findIndex(ele => ele.header === "NET CROPPED AREA");
            let yearIndex = landuseResponse.headers.findIndex(ele => ele.header === "Year");
            let distCodeIndex = landuseResponse.headers.findIndex(ele => ele.header === "Dist Code");
            landuseData = landuseResponse.data.filter(dt => dt[yearIndex] === "2014").map(ele => {
                return {
                    "id": ele[distCodeIndex],
                    "crInt": parseFloat(ele[croppingIndex]),        // %
                    "ta": parseFloat(ele[totalAreaIndex]),          // 1000 ha
                    "nca": parseFloat(ele[netCroppedAreaIndex])     // 1000 ha
                };
            });
            // localStorage.setItem("landuseData", LZString.compress(JSON.stringify(landuseData)));
        }
    });
}

let fertilizerData;
const getFertilizerData = () => {
    get("unapportioned/fertilizer-consumption")
    .then(uResponse => {
        if(uResponse){
            let fertilizerResponse = JSON.parse(uResponse);
            let totalNcaIndex = fertilizerResponse.headers.findIndex(ele => ele.header === "TOTAL PER HA OF NCA");
            let yearIndex = fertilizerResponse.headers.findIndex(ele => ele.header === "Year");
            let distCodeIndex = fertilizerResponse.headers.findIndex(ele => ele.header === "Dist Code");
            fertilizerData = fertilizerResponse.data.filter(dt => dt[yearIndex] === "2014").map(ele => {
                return {
                    "id": ele[distCodeIndex],
                    "tNca": parseFloat(ele[totalNcaIndex])  // tons
                };
            });
            // localStorage.setItem("fertilizerData", LZString.compress(JSON.stringify(fertilizerData)));
        }
    });
}

let populationData;
const getPopulationData = () => {
    get("unapportioned/population")
    .then(uResponse => {
        if(uResponse){
            let populationResponse = JSON.parse(uResponse);
            let urbanPopulationIndex = populationResponse.headers.findIndex(ele => ele.header === "TOTAL URBAN POPULATION");
            let totalPopulationIndex = populationResponse.headers.findIndex(ele => ele.header === "TOTAL POPULATION");
            let ruralLiteratesIndex = populationResponse.headers.findIndex(ele => ele.header === "TOTAL RURAL LITERATES POPULATION");
            let ruralPopulationIndex = populationResponse.headers.findIndex(ele => ele.header === "TOTAL RURAL POPULATION");
            let yearIndex = populationResponse.headers.findIndex(ele => ele.header === "Year");
            let distCodeIndex = populationResponse.headers.findIndex(ele => ele.header === "Dist Code");
            populationData = populationResponse.data.filter(dt => dt[yearIndex] === "2011").map(ele => {
                return {
                    "id": ele[distCodeIndex],
                    "uPop": parseFloat(ele[urbanPopulationIndex]),      // 1000 number
                    "tPop": parseFloat(ele[totalPopulationIndex]),      // 1000 number
                    "rLit": parseFloat(ele[ruralLiteratesIndex]),       // 1000 number
                    "rPop": parseFloat(ele[ruralPopulationIndex])       // 1000 number
                };
            });
            // localStorage.setItem("populationData", LZString.compress(JSON.stringify(populationData)));
        }
    });
}

let livestockData;
const getLivestockData = () => {
    get("unapportioned/livestock")
    .then(uResponse => {
        if(uResponse){
            let livestockResponse = JSON.parse(uResponse);
            let buffaloShareIndex = livestockResponse.headers.findIndex(ele => ele.header === "BUFFALO SHARE IN LARGE RUMINANT");
            let goatShareIndex = livestockResponse.headers.findIndex(ele => ele.header === "GOATS SHARE IN SMALL RUMINANT");
            let yearIndex = livestockResponse.headers.findIndex(ele => ele.header === "Year");
            let distCodeIndex = livestockResponse.headers.findIndex(ele => ele.header === "Dist Code");
            livestockData = livestockResponse.data.filter(dt => dt[yearIndex] === "2012").map(ele => {
                return {
                    "id": ele[distCodeIndex],
                    "bSh":  parseFloat(ele[buffaloShareIndex]),     // %
                    "gSh": parseFloat(ele[goatShareIndex])          // %
                };
            });
            // localStorage.setItem("livestockData", LZString.compress(JSON.stringify(livestockData)));
        }
    });
}

let nutritionData;
const getNutritionData = () => {
    get("other/nutrition")
    .then(uResponse => {
        if(uResponse){
            let nutritionResponse = JSON.parse(uResponse);
            let underweightChildrenIndex = nutritionResponse.headers.findIndex(ele => ele.header === "CHILDREN UNDER 5-YRS UNDER WEIGHT");
            let stuntedChildrenIndex = nutritionResponse.headers.findIndex(ele => ele.header === "CHILDREN UNDER 5-YRS STUNTED");
            let anemicWomenIndex = nutritionResponse.headers.findIndex(ele => ele.header === "WOMEN ANAEMIC 15-49 YEARS");
            let yearIndex = nutritionResponse.headers.findIndex(ele => ele.header === "Year");
            let distCodeIndex = nutritionResponse.headers.findIndex(ele => ele.header === "Dist Code");
            nutritionData = nutritionResponse.data.filter(dt => dt[yearIndex] === "2015").map(ele => {
                return {
                    "id": ele[distCodeIndex],
                    "cUW": parseFloat(ele[underweightChildrenIndex]),   // %
                    "cST": parseFloat(ele[stuntedChildrenIndex]),       // %
                    "wAN": parseFloat(ele[anemicWomenIndex])            // %
                };
            });
            // localStorage.setItem("nutritionData", LZString.compress(JSON.stringify(nutritionData)));
        }
    });
}

let apportionedDistricts;
const getApportionedDistricts = () => {
    get("apportioned/districts")
    .then(aResponse => {
        if(aResponse){
            let districtsResponse = JSON.parse(aResponse);
            apportionedDistricts = districtsResponse.map(ele => {
                return{
                    "id": ele.DIST,
                    "state": ele.STNAME,
                    "district": ele.DISTNAME
                }
            });
            apportionedDistricts.forEach(ele => {
                if(ele.state === "Telangana"){ele.state = "Andhra Pradesh";}
                if(ele.state === "Chhattisgarh"){ele.state = "Madhya Pradesh";}
                if(ele.state === "Jharkhand"){ele.state = "Bihar";}
                if(ele.state === "Uttarakhand"){ele.state = "Uttar Pradesh";}
            });
            apportionedDistricts.sort((a, b) => a.state > b.state ? 0 : -1);
            // localStorage.setItem("apportionedDistricts", LZString.compress(JSON.stringify(apportionedDistricts)));
        }
    });
}

const init = () => {
    setTimeout(() => {getCropAppData();}, 0);              // CROPS-APPORTIONED-(1966-2015)
    setTimeout(() => {getApportionedDistricts();}, 0);
    setTimeout(() => {getCropUnappData();}, 1500);         // CROPS-UNAPPORTIONED-2015
    setTimeout(() => {getRainData();}, 1500);              // BIOPHYSICAL-UNAPPORTIONED-2015
    setTimeout(() => {getLanduseData();}, 1500);           // BIOPHYSICAL-UNAPPORTIONED-2014
    setTimeout(() => {getFertilizerData();}, 1500);        // INPUTS-UNAPPORTIONED-2014
    setTimeout(() => {getPopulationData();}, 1500)         // CENSUS-UNAPPORTIONED-2011
    setTimeout(() => {getLivestockData();}, 1500)          // CENSUS-UNAPPORTIONED-2012
    setTimeout(() => {getNutritionData();}, 1500)          // NUTRITION-UNAPPORTIONED-2015
    setTimeout(() => {getAppGeoJSONData();}, 500);         // Apportioned Map
    setTimeout(() => {getUnappGeoJSONData();}, 1000);      // Unapportioned Map
}

