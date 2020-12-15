const livestockSubCategory = `<option value="livestock">Livestock</option>`;

const smallRuminantElement = `<option value="small ruminant">Share in Small Ruminants</option>`;
const largeRuminantElement = `<option value="large ruminant">Share in Large Ruminants</option>`;

const smallRuminantItem = `<option value="goat">Goats</option>`;
const largeRuminantItem = `<option value="buffalo">Buffaloes</option>`;


const processSmallRuminant = (mapData) => {
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let sr = Object.keys(ele)[0];
        if(ele[sr] < 0){ele["group"] = "Unavailable";}
        else if(ele[sr] >= 0 && ele[sr] < 50){ele["group"] = "group1";}
        else if(ele[sr] >= 50 && ele[sr] < 75){ele["group"] = "group2";}
        else if(ele[sr] >= 75){ele["group"] = "group3";}
    });
    
    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#008000"};
    let units = "(%)";
    let itemName = "Goats";
    let elementName = "Share in Small Ruminants";
    let titleText = `
        <h4>Distribution of Share of Goats in Total Small Ruminant Population: 2012 census</h4>
    `;

    let scaleHtml = `
        <span>Share (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>0 to 50</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>50 to 75</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small>> 75</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small>&nbsp;<small>Data Not Available</small><br>
    `;

    let distCount = mapData.filter(ele => (ele.group !== "Unavailable" && ele.group !== "Negligible")).length;
    let percentLegend = Object.keys(colorList).map(ele => {
        let color = colorList[ele];
        let percent = ((mapData.filter(el => el.group === ele).length/distCount)*100).toFixed(2);
        return `<span class="dot" style="background-color:${color}"></span>&nbsp;<span>${percent}%</span>&nbsp`
    }).join("\n");
    let percentHtml = `<span>Distribution of districts across groups</span><br>${percentLegend}`;

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2012");
}


const processLargeRuminant = (mapData) => {
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let lt = Object.keys(ele)[0];
        if(ele[lt] < 0){ele["group"] = "Unavailable";}
        else if(ele[lt] >= 0 && ele[lt] < 15){ele["group"] = "group1";}
        else if(ele[lt] >= 15 && ele[lt] < 40){ele["group"] = "group2";}
        else if(ele[lt] >= 40 && ele[lt] < 65){ele["group"] = "group3";}
        else if(ele[lt] >= 65){ele["group"] = "group4";}
    });

    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#ADFF2F", "group4": "#008000"};
    let units = "(%)";
    let itemName = "Buffaloes";
    let elementName = "Share in Large Ruminants";
    let titleText = `
        <h4>Distribution of Share of Buffalo in Total Large  Ruminant Population: 2012 Census</h4>
    `;
    let scaleHtml = `
        <span>Share (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>< 15</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>15 to 40</small><br>
        <small class="dot" style="background-color:#ADFF2F"></small>&nbsp;<small>40 to 65</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small>> 65</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small>&nbsp;<small>Data Not Available</small><br>
    `;
    let distCount = mapData.filter(ele => (ele.group !== "Unavailable" && ele.group !== "Negligible")).length;
    let percentLegend = Object.keys(colorList).map(ele => {
        let color = colorList[ele];
        let percent = ((mapData.filter(el => el.group === ele).length/distCount)*100).toFixed(2);
        return `<span class="dot" style="background-color:${color}"></span>&nbsp;<span>${percent}%</span>&nbsp`
    }).join("\n");
    let percentHtml = `<span>Distribution of districts across groups</span><br>${percentLegend}`;

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2012");
}
