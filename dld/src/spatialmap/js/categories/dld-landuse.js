const landuseSubCategory = `<option value="landuse">Landuse</option>`;

const intensityElement = `<option value="intensity">Intensity</option>`;
const croppingItem = `<option value="cropping">Cropping</option>`;

const areaElement = `<option value="area">Area</option>`;
const ncaPercentItem = `<option value="ncap">NCA percentage</option>`;


const processLanduseIntensity = (mapData) => {
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    console.log(mapData);
    mapData.forEach(ele => {
        let crInt = Object.keys(ele)[0];
        if(ele[crInt] < 0){ele["group"] = "Unavailable";}
        else if(ele[crInt] >= 100 && ele[crInt] < 125){ele["group"] = "group1";}
        else if(ele[crInt] >= 125 && ele[crInt] < 150){ele["group"] = "group2";}
        else if(ele[crInt] >= 150 && ele[crInt] < 175){ele["group"] = "group3";}
        else if(ele[crInt] >= 175){ele["group"] = "group4";}
    });

    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#ADFF2F", "group4": "#008000"};
    let units = "(%)";
    let itemName = "Cropping";
    let elementName = "Intensity";
    let titleText = `
        <h4>Cropping Intensity across districts: 2014</h4>
    `;
    let scaleHtml = `
        <span>Cropping Intensity (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>100 to 125</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>125 to 150</small><br>
        <small class="dot" style="background-color:#ADFF2F"></small>&nbsp;<small>150 to 175</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small>> 175</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small>&nbsp;<small> Data Not Available</small><br>
    `;
    let distCount = mapData.filter(ele => (ele.group !== "Unavailable" && ele.group !== "Negligible")).length;
    let percentLegend = Object.keys(colorList).map(ele => {
        let color = colorList[ele];
        let percent = ((mapData.filter(el => el.group === ele).length/distCount)*100).toFixed(2);
        return `<span class="dot" style="background-color:${color}"></span>&nbsp;<span>${percent}%</span>&nbsp`
    }).join("\n");
    let percentHtml = `<span>Distribution of districts across groups</span><br>${percentLegend}`;

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2014");
}


const processLanduseNCA = (mapData) => {
    mapData.forEach(ele => {
        ele[Object.keys(ele)[0]] =  ((Object.values(ele)[0][1]/Object.values(ele)[0][0])*100).toFixed(2);
    })
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let ncaP = Object.keys(ele)[0];
        if(ele[ncaP] < 0){ele["group"] = "Unavailable";}
        else if(ele[ncaP] >=0 && ele[ncaP] < 1){ele["group"] = "Negligible";}
        else if(ele[ncaP] >=1 && ele[ncaP] < 30){ele["group"] = "group1";}
        else if(ele[ncaP] >=30 && ele[ncaP] < 50){ele["group"] = "group2";}
        else if(ele[ncaP] >=50 && ele[ncaP] < 75){ele["group"] = "group3";}
        else if(ele[ncaP] >=75){ele["group"] = "group4";}
    });
    
    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#ADFF2F", "group4": "#008000"};
    let units = "(%)";
    let itemName = "Net Cropped";
    let elementName = "Area Share";
    let titleText = `
        <h4>Distribution of Share of Net Cropped Area in Total Area: 2014</h4>
    `;
    let scaleHtml = `
        <span>NCA (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>1 to 30</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>30 to 50</small><br>
        <small class="dot" style="background-color:#ADFF2F"></small>&nbsp;<small>50 to 75</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small>> 75</small><br>
        <small class="dot" style="background-color:#CCCCCC"></small>&nbsp;<small>Negligible (< 1)</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small>&nbsp;<small> Data Not Available</small><br>
    `;
    let distCount = mapData.filter(ele => (ele.group !== "Unavailable" && ele.group !== "Negligible")).length;
    let percentLegend = Object.keys(colorList).map(ele => {
        let color = colorList[ele];
        let percent = ((mapData.filter(el => el.group === ele).length/distCount)*100).toFixed(2);
        return `<span class="dot" style="background-color:${color}"></span>&nbsp;<span>${percent}%</span>&nbsp`
    }).join("\n");
    let percentHtml = `<span>Distribution of districts across groups</span><br>${percentLegend}`;

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2014");
}

