const populationSubCategory = `<option value="population">Population</option>`;
const populationElement = `<option value="population">Population</option>`;
const populationItem = `
    <option value="urban percent">Urban Population (%)</option>
    <option value="rural literacy percent">Rural Literacy (%)</option>
`;


const processUrbanPop = (mapData) => {
    mapData.forEach(ele => {
        let urbanPercent = Number(((Object.values(ele)[0][0]/Object.values(ele)[0][1])*100).toFixed(2))
        ele[Object.keys(ele)[0]] =  (isNaN(urbanPercent)) ? -1 : urbanPercent;
    });
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let uP = Object.keys(ele)[0];
        if(ele[uP] < 0){ele["group"] = "Unavailable";}
        else if(ele[uP] >=0 && ele[uP] < 10){ele["group"] = "group1";} 
        else if(ele[uP] >=10 && ele[uP] < 25){ele["group"] = "group2";} 
        else if(ele[uP] >=25 && ele[uP] < 40){ele["group"] = "group3";} 
        else if(ele[uP] >=40){ele["group"] = "group4";} 
    });
    
    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#ADFF2F", "group4": "#008000"};
    let units = "(%)";
    let itemName = "Urban";
    let elementName = "Population Share";
    let titleText = `
        <h4>Distribution of Share of Urban Population in Total: 2011 census </h4>
    `;
    let scaleHtml = `
        <span>Population Share (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>0 to 10</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>10 to 25</small><br>
        <small class="dot" style="background-color:#ADFF2F"></small>&nbsp;<small>25 to 40</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small>> 40</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small>&nbsp;<small>Data Not Available</small><br>
    `;
    let distCount = mapData.filter(ele => (ele.group !== "Unavailable" && ele.group !== "Negligible")).length;
    let percentLegend = Object.keys(colorList).map(ele => {
        let color = colorList[ele];
        let percent = ((mapData.filter(el => el.group === ele).length/distCount)*100).toFixed(2);
        return `<span class="dot" style="background-color:${color}"></span>&nbsp;<span>${percent}%</span>&nbsp`
    }).join("\n");
    let percentHtml = `<span>Distribution of districts across groups</span><br>${percentLegend}`;

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2011");
    
}


const processRuralLit = (mapData) => {
    mapData.forEach(ele => {
        let litPercent = Number(((Object.values(ele)[0][0]/Object.values(ele)[0][1])*100).toFixed(2));
        ele[Object.keys(ele)[0]] =  (isNaN(litPercent)) ? -1 : litPercent;
    });
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let rL = Object.keys(ele)[0];
        if(ele[rL] < 0){ele["group"] = "Unavailable";}
        else if(ele[rL] >=25 && ele[rL] < 50){ele["group"] = "group1";} 
        else if(ele[rL] >=50 && ele[rL] < 65){ele["group"] = "group2";} 
        else if(ele[rL] >=65){ele["group"] = "group3";} 
    });

    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#008000"};
    let units = "(%)";
    let itemName = "Rural";
    let elementName = "Literacy Share";
    let titleText = `
        <h4>Distribution of Share of Rural Literacy in Total Rural Population: 2011 census</h4>
    `;

    let scaleHtml = `
        <span>Literacy (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>25 to 50</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>50 to 65</small><br>
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

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2011");
}
