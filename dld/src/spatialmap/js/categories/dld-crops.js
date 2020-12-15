const cropSubCategory = `<option value="area-production-yield">Area-Production-Yield</option>`;
const cropElement = `
    <option value="area">Area</option>
    <option value="production">Production</option>
    <option value="yield">Yield</option>
`;
const cropItem = `
    <option value="rice">Rice</option>
    <option value="wheat">Wheat</option>
    <option value="kharif sorghum">Kharif Sorghum</option>
    <option value="rabi sorghum">Rabi Sorghum</option>
    <option value="sorghum">Sorghum</option>
    <option value="pearl millet">Pearl Millet</option>
    <option value="maize">Maize</option>
    <option value="finger millet">Finger Millet</option>
    <option value="barley">Barley</option>
    <option value="chickpea">Chickpea</option>
    <option value="pigeonpea">Pigeonpea</option>
    <option value="minor pulses">Minor Pulses</option>
    <option value="groundnut">Groundnut</option>
    <option value="sesamum">Sesamum</option>
    <option value="rapeseed and mustard">Rapeseed and Mustard</option>
    <option value="safflower">Safflower</option>
    <option value="castor">Castor</option>
    <option value="linseed">Linseed</option>
    <option value="sunflower">Sunflower</option>
    <option value="soyabean">Soyabean</option>
    <option value="sugarcane">Sugarcane</option>
    <option value="cotton">Cotton</option>
`;

const cropFiveColors = {"group1":"#F08080", "group2":"#FFFF00", "group3":"#ADFF2F", "group4":"#00FF7F", "group5":"#008000"};
const cropSixColors = {"group1": "#F08080", "group2": "#F6CF80", "group3": "#FFFF00", "group4": "#ADFF2F", "group5": "#00FF7F", "group6": "#008000"};
const cropFiveParts = {"group1": 0.4, "group2": 0.2, "group3": 0.2,"group4": 0.1, "group5": 0.1};
const cropSixParts = {"group1": 0.2, "group2": 0.2, "group3": 0.2, "group4": 0.2, "group5": 0.1, "group6": 0.1};
const crops95Base = ["soyabean", "sunflower", "safflower", "castor", "linseed", "sesamum"];


const cropBaseGroup = (cropProperty, cropName, cropSortedData) => {
    let parts = ["rice", "wheat"].includes(cropName) ? cropSixParts : cropFiveParts;
    let cropData;
    switch(true){
        case(cropProperty === "area" || cropProperty === "production"):
            cropData = groupAreaProd(cropSortedData, cropProperty, cropName, parts);
            return cropData;
        case(cropProperty === "yield"):
            cropData = groupYield(cropSortedData, cropName, parts);
            return cropData;
    }
}

const getCropUnits = (cropProperty) => {
    switch(cropProperty){
        case ("area"): return "(000 ha)";
        case ("production"): return "(000 tons)";
        case ("yield"): return "(Kg per ha)";
    }
}

const groupAreaProd = (cropSortedData, cropProperty, cropName, parts) => {
    let colors = ["rice", "wheat"].includes(cropName) ? cropSixColors : cropFiveColors;
    let startAt = (cropProperty === "area") ? 1 : 0.5;
    let groupedData = [];
    // Unavailable and Negligible
    let uArr = cropSortedData.filter(ele => ele[Object.keys(ele)[0]] < 0);
    uArr.forEach(ele => ele["group"] = "Unavailable");
    let nArr = cropSortedData.filter(ele => ele[Object.keys(ele)[0]] >= 0 && ele[Object.keys(ele)[0]] < startAt);
    nArr.forEach(ele => ele["group"] = "Negligible");
    // Considerable
    let considerableData = cropSortedData.filter(ele => ele[Object.keys(ele)[0]] >= startAt);
    let arr = [];
    let count = considerableData.length;
    let takeCount;
    // Divide by percentages
    Object.keys(parts).forEach(key => {
        takeCount = Math.ceil(count * parts[key]);
        for(let i=0; i<takeCount; i++){
            resultItem = considerableData.shift();
            if(resultItem){
                resultItem["group"] = key;
                arr.push(resultItem);
            }
        }
    });
    // Adjust to end before next group start (not needed for yield)
    let cropGroups = Array.from(new Set(arr.map(data => data.group)));
    cropGroups.forEach((_, index) => {
        if(index <= cropGroups.length-2){ 
            let currentGroup = arr.filter(ele => ele.group === cropGroups[index]);
            let nextGroup = arr.filter(ele => ele.group === cropGroups[index+1]);
            let cMax = Math.max(...currentGroup.map(ele => ele[Object.keys(ele)[0]]));
            let nMin = Math.min(...nextGroup.map(ele => ele[Object.keys(ele)[0]]));

            if(Math.ceil(cMax) >= Math.floor(nMin)){
                nextGroup.filter(ele => ele[Object.keys(ele)[0]] < Math.ceil(cMax)).forEach(ele => ele.group = cropGroups[index]);
            } 
        }
    });
    // Consolidate all base-map data
    groupedData.push(...uArr, ...nArr, ...arr);
    // Meant for grouping yearly data
    let groupMinMax = cropGroups.map((grp, index) => {
        if(index === 0){
            return {
                "group": grp,
                "min": startAt,
                "max": Math.ceil(Math.max(...arr.filter(ele => ele.group === cropGroups[index]).map(ele => ele[Object.keys(ele)[0]]))),
                "color": colors[grp]
            };
        } else if(index > 0 && index <= cropGroups.length-1){
            return{
                "group": grp,
                "min": Math.ceil(Math.max(...arr.filter(ele => ele.group === cropGroups[index-1]).map(ele => ele[Object.keys(ele)[0]]))),
                "max": Math.ceil(Math.max(...arr.filter(ele => ele.group === cropGroups[index]).map(ele => ele[Object.keys(ele)[0]]))),
                "color": colors[grp]
            };
        }
    });
    // Actual legend
    let scaleMinMax =  (cropProperty === "area") ? `<span>Area (000 ha)</span><br>` : `<span>Production (000 tons)</span><br>`;
    scaleMinMax += groupMinMax.map((grp, index) => {
        if(index === 0){
            return `<small class="dot" style="background-color:${grp.color}"></small>&nbsp;<small>${startAt} to ${grp.max}</small><br>`;
        } else if(index > 0 && index < groupMinMax.length-1){
            return `<small class="dot" style="background-color:${grp.color}"></small>&nbsp;<small>${grp.min} to ${grp.max}</small><br>`;
        } else if(index === groupMinMax.length-1){
            return `<small class="dot" style="background-color:${grp.color}"></small>&nbsp;<small>> ${grp.min}</small><br>`
        }
    }).join("\n");
    scaleMinMax += `
        <small class="dot" style="background-color:#CCCCCC"></small><small> Negligible (< ${startAt})</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small><small> Data not available</small><br>
    `;
    return {
        "baseMapData": groupedData, // 2015-data for unapportioned, 1966/1995-data for apportioned
        "groupMinMax": groupMinMax,
        "scaleMinMax": scaleMinMax
    }
}

const groupYield = (cropSortedData, cropName, parts) => {
    let colors = (cropName === "rice" || cropName === "wheat") ? cropSixColors : cropFiveColors;
    let groupedData = [];
    // Unavailable and Negligible
    let uArr = cropSortedData.filter(ele => ele[Object.keys(ele)[0]].includes(-1));
    uArr.forEach(ele => ele["group"] = "Unavailable");
    let nArr = cropSortedData.filter(ele => !ele[Object.keys(ele)[0]].includes(-1) && ((ele[Object.keys(ele)[0]][1] >= 0 && ele[Object.keys(ele)[0]][1] < 1) || ele[Object.keys(ele)[0]][0] === 0));
    nArr.forEach(ele => ele["group"] = "Negligible");
    // Considerable
    let considerableData = cropSortedData.filter(ele => !ele[Object.keys(ele)[0]].includes(-1) && ele[Object.keys(ele)[0]][1] >= 1 && ele[Object.keys(ele)[0]][0] > 0);
    considerableData.sort((a, b) =>(Object.values(a)[0])[0] > (Object.values(b)[0])[0] ? 0 : -1);
    let arr = [];
    let count = considerableData.length;
    let takeCount;
    Object.keys(parts).forEach(key => {
        takeCount = Math.ceil(count * parts[key]);
        for(let i=0; i<takeCount; i++){
            resultItem = considerableData.shift();
            if(resultItem){
                resultItem["group"] = key;
                arr.push(resultItem);
            }
        }
    });
    // Consolidate all base-map data
    groupedData.push(...uArr, ...nArr, ...arr);
    groupedData.forEach(ele => ele[Object.keys(ele)[0]] = Object.values(ele)[0][0]);
    let cropGroups = Array.from(new Set(arr.map(data => data.group)));
    // Meant for grouping yearly data
    let groupMinMax = cropGroups.map((grp, index) => {
        if(index === 0){
            return {
                "group": grp,
                "min": Math.min(...arr.filter(ele => ele.group === cropGroups[index]).map(ele => ele[Object.keys(ele)[0]])),
                "max": Math.max(...arr.filter(ele => ele.group === cropGroups[index]).map(ele => ele[Object.keys(ele)[0]])),
                "color": colors[grp]
            };
        } else if(index > 0 && index <= cropGroups.length-1){
            return {
                "group": grp,
                "min": Math.max(...arr.filter(ele => ele.group === cropGroups[index-1]).map(ele => ele[Object.keys(ele)[0]])),
                "max": Math.max(...arr.filter(ele => ele.group === cropGroups[index]).map(ele => ele[Object.keys(ele)[0]])),
                "color": colors[grp]
            }
        }
    });
    let scaleMinMax = `<span>Yield (Kg per ha)</span><br>`;
    scaleMinMax += groupMinMax.map((grp, index) => {
        if(index === 0){
            return `<small class="dot" style="background-color:${grp.color}"></small>&nbsp;<small>< ${grp.max}</small><br>`;
        } else if(index > 0 && index < groupMinMax.length-1){
            return `<small class="dot" style="background-color:${grp.color}"></small>&nbsp;<small>${grp.min} to ${grp.max}</small><br>`;
        } else if(index === groupMinMax.length-1){
            return `<small class="dot" style="background-color:${grp.color}"></small>&nbsp;<small>> ${grp.min}</small><br>`
        }
    }).join("\n");
    scaleMinMax += `
        <small class="dot" style="background-color:#CCCCCC"></small><small> Negligible (Area < 1000 ha)</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small><small> Data not available</small><br>
    `;
    return {
        "baseMapData": groupedData, // 2015-data for unapportioned, 1966/1995-data for apportioned
        "groupMinMax": groupMinMax,
        "scaleMinMax": scaleMinMax
    }
}

const cropAppBaseData = (cropAppData, cropProperty, cropName) => {
    // 1966 and 2016 depending on cropName/cropProperty 
    let cropAppFilteredData = cropAppData.find(ele => ele.crop === cropName).yData;
    let cropAppSortedData;
    switch(cropProperty){
        case("area"):
            cropAppSortedData = crops95Base.includes(cropName)?
                                cropAppFilteredData.find(ele => ele.year === "1995").data.map(ele => {return {[ele.id]: ele.area};}):
                                cropAppFilteredData.find(ele => ele.year === "1966").data.map(ele => {return {[ele.id]: ele.area};});
            cropAppSortedData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);    
            return cropAppSortedData;
        case("production"):
            cropAppSortedData = crops95Base.includes(cropName)?
                                cropAppFilteredData.find(ele => ele.year === "1995").data.map(ele => {return {[ele.id]: ele.prod};}):
                                cropAppFilteredData.find(ele => ele.year === "1966").data.map(ele => {return {[ele.id]: ele.prod};});
            cropAppSortedData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);                                
            return cropAppSortedData;
        case("yield"):
            cropAppSortedData = cropAppFilteredData.find(ele => ele.year === "1995").data.map(ele => {return {[ele.id]: [ele.yield, ele.area]};});
            cropAppSortedData.sort((a, b) => Object.values(a)[0][1] > Object.values(b)[0][1] ? 0 : -1); 
            return cropAppSortedData;
    }
}


const cropAppAreaProd = (yearData, groupMinMax, startAt) => {
    // Take baseMapData and rearrange groups, not needed for unapportioned. Returns percentHtml
    let mapData = [];
    let uArr = yearData.filter(ele => ele[Object.keys(ele)[0]] === -1);
    uArr.forEach(ele => ele["group"] = "Unavailable");
    let nArr = yearData.filter(ele => ele[Object.keys(ele)[0]] >= 0 && ele[Object.keys(ele)[0]] < startAt);
    nArr.forEach(ele => ele["group"] = "Negligible");
    let arr = yearData.filter(ele => ele[Object.keys(ele)[0]] >= startAt);
    let percentHtml = ``
    groupMinMax.forEach((grp, index) => {
        let grpList, grpPercent;
        if(index < groupMinMax.length-1){
            grpList = arr.filter(ele => ele[Object.keys(ele)[0]] >= grp.min && ele[Object.keys(ele)[0]] < grp.max);
            grpList.forEach(ele => ele["group"] = grp.group);
            grpPercent = (arr.length) ? (grpList.length/arr.length * 100).toFixed(2) : 0
            percentHtml += `<span class="dot" style="background-color:${grp.color}"></span>&nbsp;<span>${grpPercent}%</span>&nbsp;\n`;
        } else if(index === groupMinMax.length-1){
            grpList = arr.filter(ele => ele[Object.keys(ele)[0]] >= grp.min);
            grpList.forEach(ele => ele["group"] = grp.group);
            grpPercent = (arr.length) ? (grpList.length/arr.length * 100).toFixed(2) : 0
            percentHtml += `<span class="dot" style="background-color:${grp.color}"></span>&nbsp;<span>${grpPercent}%</span>`;
        }
    });
    mapData.push(...uArr, ...nArr, ...arr);
    return {
        "mapData": mapData,
        "percentHtml": percentHtml
    };
}

const cropAppYield = (yearData, groupMinMax) => {
    let mapData = [];
    let uArr = yearData.filter(ele => ele[Object.keys(ele)[0]].includes(-1));
    uArr.forEach(ele => ele["group"] = "Unavailable");
    let nArr = yearData.filter(ele => !ele[Object.keys(ele)[0]].includes(-1) && ((ele[Object.keys(ele)[0]][1] >= 0 && ele[Object.keys(ele)[0]][1] < 1) || ele[Object.keys(ele)[0]][0] === 0));
    nArr.forEach(ele => ele["group"] = "Negligible");
    let arr = yearData.filter(ele => !ele[Object.keys(ele)[0]].includes(-1) && ele[Object.keys(ele)[0]][1] >= 1 && ele[Object.keys(ele)[0]][0] > 0);
    arr.sort((a, b) => (Object.values(a)[0])[0] > (Object.values(b)[0])[0] ? 0 : -1);
    let percentHtml = ``;
    groupMinMax.forEach((grp, index) => {
        let grpList, grpPercent;
        if(index === 0){
            grpList = arr.filter(ele => ele[Object.keys(ele)[0]][0] >= 0 && ele[Object.keys(ele)[0]][0] < grp.max);
            grpList.forEach(ele => ele["group"] = grp.group);
            grpPercent = (arr.length) ? (grpList.length/arr.length * 100).toFixed(2) : 0
            percentHtml += `<span class="dot" style="background-color:${grp.color}"></span>&nbsp;<span>${grpPercent}%</span>&nbsp;`
        } else if(index > 0 && index < groupMinMax.length-1){
            grpList = arr.filter(ele => ele[Object.keys(ele)[0]][0] >= grp.min && ele[Object.keys(ele)[0]][0] < grp.max);
            grpList.forEach(ele => ele["group"] = grp.group);
            grpPercent = (arr.length) ? (grpList.length/arr.length * 100).toFixed(2) : 0
            percentHtml += `<span class="dot" style="background-color:${grp.color}"></span>&nbsp;<span>${grpPercent}%</span>&nbsp;`
        } else if(index === groupMinMax.length-1){
            grpList = arr.filter(ele => ele[Object.keys(ele)[0]][0] >= grp.min);
            grpList.forEach(ele => ele["group"] = grp.group);
            grpPercent = (arr.length) ? (grpList.length/arr.length * 100).toFixed(2) : 0
            percentHtml += `<span class="dot" style="background-color:${grp.color}"></span>&nbsp;<span>${grpPercent}%</span>`
        }
    });
    mapData.push(...uArr, ...nArr, ...arr);
    mapData.forEach(ele => ele[Object.keys(ele)[0]] = Object.values(ele)[0][0]);

    return {
        "mapData": mapData,
        "percentHtml": percentHtml
    };
}


const processCropApp = (cropAppData, cropProperty, cropName, selectedYear) => {
    let appBaseData = cropAppBaseData(cropAppData, cropProperty, cropName);
    let baseData = cropBaseGroup(cropProperty, cropName, appBaseData);
    let yearData = cropUnappBaseData(cropAppData.find(ele => ele.crop === cropName).yData.find(ele => ele.year === selectedYear).data, cropProperty);
    let groupMinMax = baseData["groupMinMax"];
    let scaleHtml = baseData["scaleMinMax"];
    let mapData, percentHtml, yearMapData;
    let titleText = `<h4>Distribution of ${toTitleCase(cropName)} ${toTitleCase(cropProperty)}: ${selectedYear}</h4>`;
    titleText += (crops95Base.includes(cropName) || cropProperty === "yield") ?
                 `<h5>(${selectedYear} data overlaid on 1966 district boundaries and 1995 groupings)</h5>`:
                 `<h5>(${selectedYear} data overlaid on 1966 district boundaries and groupings)</h5>`;
    let colorList = ["rice", "wheat"].includes(cropName) ? cropSixColors : cropFiveColors;
    let units = getCropUnits(cropProperty);
    // generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, dataset, year)
    switch(true){
        case(cropProperty === "area" || cropProperty === "production"):
            let startAt = (cropProperty === "area") ? 1 : 0.5;
            yearMapData = cropAppAreaProd(yearData, groupMinMax, startAt);
            mapData = yearMapData["mapData"];
            percentHtml = (crops95Base.includes(cropName)) ? 
                          `<span>Distribution of districts over 1995 groupings</span><br>${yearMapData["percentHtml"]}`:
                          `<span>Distribution of districts over 1966 groupings</span><br>${yearMapData["percentHtml"]}`
            break;
        case(cropProperty === "yield"):
            yearMapData = cropAppYield(yearData, groupMinMax);
            mapData = yearMapData["mapData"];
            percentHtml = `<span>Distribution of districts over 1995 groupings</span><br>${yearMapData["percentHtml"]}`;
            break;
    }

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, toTitleCase(cropName), toTitleCase(cropProperty), units, "apportioned", selectedYear);
}

let compDownloadableData = [];
const processCropAppCompare = (cropAppData, cropProperty, cropName, selectedYears) => {
    compDownloadableData.forEach(dist => {
        let dKeys = Object.keys(dist);
        dKeys.filter(ele => !["id", "state", "district"].includes(ele)).forEach(ele => delete dist[ele]);
    });
    let appBaseData = cropAppBaseData(cropAppData, cropProperty, cropName);
    let baseData = cropBaseGroup(cropProperty, cropName, appBaseData);
    let groupMinMax = baseData["groupMinMax"];
    let scaleHtml = baseData["scaleMinMax"].replace(/<br>/g, "&nbsp;");
    let colorList = ["rice", "wheat"].includes(cropName) ? cropSixColors : cropFiveColors;
    let units = getCropUnits(cropProperty);
    let titleText = `<h4>Distribution of ${toTitleCase(cropName)} ${toTitleCase(cropProperty)}: ${String(selectedYears).replace(/,/g, ", ")}</h4>`;
    titleText += (crops95Base.includes(cropName) || cropProperty === "yield") ?
                 `<h5>(Data overlaid on 1966 district boundaries and 1995 groupings)</h5>`:
                 `<h5>(Data overlaid on 1966 district boundaries and groupings)</h5>`;
    $("#maps-title").empty().html(titleText + scaleHtml);
    $("#maps-citation").empty().html(`
        <small class="text-muted">District level Database (DLD) for India. International Crops Research Institute for the Semi-Arid Tropics (ICRISAT).<br>
        <a href="http://data.icrisat.org/dld/" target="blank_">http://data.icrisat.org/dld/</a></small>
    `);
    $("#maps-logo").empty().html(`<img src="img/logo1.png" width="180" height="50">`);
    // compDownloadableData = JSON.parse(LZString.decompress(localStorage.getItem("apportionedDistricts")));
    compDownloadableData = apportionedDistricts;
    selectedYears.forEach(selectedYear => {
        let yearData = cropUnappBaseData(cropAppData.find(ele => ele.crop === cropName).yData.find(ele => ele.year === selectedYear).data, cropProperty);
        let mapData, percentHtml, yearMapData;
        switch(true){
            case(cropProperty === "area" || cropProperty === "production"):
                let startAt = (cropProperty === "area") ? 1 : 0.5;
                yearMapData = cropAppAreaProd(yearData, groupMinMax, startAt);
                mapData = yearMapData["mapData"];
                percentHtml = (crops95Base.includes(cropName)) ? 
                              `<div class="text-center mt-3"><small>Distribution of ${selectedYear} data over 1995 groupings<br><small>${yearMapData["percentHtml"]}</small></small></div>`:
                              `<div class="text-center mt-3"><small>Distribution of ${selectedYear} data over 1966 groupings<br><small>${yearMapData["percentHtml"]}</small></small></div>`;
                break;
            case(cropProperty === "yield"):
                yearMapData = cropAppYield(yearData, groupMinMax);
                mapData = yearMapData["mapData"];
                percentHtml = `<div class="text-center mt-3"><small>Distribution of ${selectedYear} data over 1995 groupings<br><small>${yearMapData["percentHtml"]}</small></small></div>`;
                break;
        }
        compDownloadableData.forEach(dist => {
            let yData = (mapData.find(ele => Object.keys(ele)[0] === String(dist.id)));
            if(yData){
                let yVal = Object.values(yData)[0];
                if(yVal === -1){dist["y"+selectedYear] = "N/A";} 
                else{dist["y"+selectedYear] = yVal;}
            } else{
                dist["y"+selectedYear] = "N/A";
            }
        });
        compareMaps(mapData, colorList, selectedYear, percentHtml, toTitleCase(cropName), toTitleCase(cropProperty), units, selectedYears);
    });
}

const cropUnappBaseData = (cropUnappData, cropProperty) => {
    // Only 2015 for unapportioned, for apportioned will be using other years too
    let cropUnappSortedData;
    switch(cropProperty){
        case("area"):
            cropUnappSortedData = cropUnappData.map(ele => { return {[ele.id]: ele.area};});
            cropUnappSortedData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
            return cropUnappSortedData;
        case("production"):
            cropUnappSortedData = cropUnappData.map(ele => { return {[ele.id]: ele.prod};});
            cropUnappSortedData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
            return cropUnappSortedData;
        case("yield"):
            cropUnappSortedData = cropUnappData.map(ele => { return {[ele.id]: [ele.yield, ele.area]};});
            cropUnappSortedData.sort((a, b) => Object.values(a)[0][1] > Object.values(b)[0][1] ? 0 : -1);
            return cropUnappSortedData;
    }
}

const processCropUnapp = (cropUnappData, cropProperty, cropName) => {
    let cropUnappFilteredData = cropUnappData.find(ele => ele.crop === cropName).data;
    let unappBaseData = cropUnappBaseData(cropUnappFilteredData, cropProperty);
    let baseData = cropBaseGroup(cropProperty, cropName, unappBaseData);
    let mapData = baseData["baseMapData"];
    let scaleHtml = baseData["scaleMinMax"];
    let groupMinMax = baseData["groupMinMax"];
    let titleText = `<h5>Distribution of ${toTitleCase(cropName)} ${toTitleCase(cropProperty)}: 2015</h5>`;
    let percentHtml = `<span>Distribution of districts across groups</span><br>\n`;
    let cropNNData = mapData.filter(ele => !["Unavailable","Negligible"].includes(ele.group));
    let colorList = ["rice", "wheat"].includes(cropName) ? cropSixColors : cropFiveColors;
    let units = getCropUnits(cropProperty);
    groupMinMax.forEach(grp => {
        let grpList = cropNNData.filter(ele => ele.group === grp.group);
        let grpPercent = ((grpList.length/cropNNData.length)*100).toFixed(2);
        percentHtml += `<span class="dot" style="background-color:${grp.color}"></span>&nbsp;<span>${grpPercent}%</span>&nbsp;\n`;
    });

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, toTitleCase(cropName), toTitleCase(cropProperty), units, "unapportioned", "2015");

}

