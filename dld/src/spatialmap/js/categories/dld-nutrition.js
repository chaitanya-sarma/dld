const nutritionSubCategory = `<option value="nutrition">Nutrition</option>`;

const womenElement = `<option value="women">Women</option>`;
const childrenElement = `<option value="children">Children</option>`;

const womenItem = `<option value="anemic">Anemic</option>`;
const childrenItem = `
    <option value="underweight">Underweight</option>
    <option value="stunted">Stunted</option>
`;


const processAnemic = (mapData) => {
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let an = Object.keys(ele)[0];
        if(ele[an] < 0){ele["group"] = "Unavailable";}
        else if(ele[an] >= 20 && ele[an] < 40){ele["group"] = "group1";}
        else if(ele[an] >= 40 && ele[an] < 60){ele["group"] = "group2";}
        else if(ele[an] >= 60){ele["group"] = "group3";}
    });

    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#008000"};
    let units = "(%)";
    let itemName = "Anemic Share";
    let elementName = "in Women";
    let titleText = `
        <h4>Distribution of Share of Anemic Women in Total: 2015</h4>
    `;

    let scaleHtml = `
        <span>Share (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>20 to 40</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>40 to 60</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small>> 60</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small>&nbsp;<small>Data Not Available</small><br>
    `;

    let distCount = mapData.filter(ele => (ele.group !== "Unavailable" && ele.group !== "Negligible")).length;
    let percentLegend = Object.keys(colorList).map(ele => {
        let color = colorList[ele];
        let percent = ((mapData.filter(el => el.group === ele).length/distCount)*100).toFixed(2);
        return `<span class="dot" style="background-color:${color}"></span>&nbsp;<span>${percent}%</span>&nbsp`
    }).join("\n");
    let percentHtml = `<span>Distribution of districts across groups</span><br>${percentLegend}`;

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2015");

}


const processUnderweight = (mapData) => {
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let uw = Object.keys(ele)[0];
        if(ele[uw] < 0){ele["group"] = "Unavailable";}
        else if(ele[uw] >= 0 && ele[uw] < 25){ele["group"] = "group1";}
        else if(ele[uw] >= 25 && ele[uw] < 40){ele["group"] = "group2";}
        else if(ele[uw] >= 40){ele["group"] = "group3";}
    });
    
    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#008000"};
    let units = "(%)";
    let itemName = "Underweight Share";
    let elementName = "in Children";
    let titleText = `
        <h4>Distribution of Share of Underweight Children in Total: 2015</h4>
    `;

    let scaleHtml = `
        <span>Share (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>< 25</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>25 to 40</small><br>
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

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2015");
}


const processStunted = (mapData) => {
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let wa = Object.keys(ele)[0];
        if(ele[wa] < 0){ele["group"] = "Unavailable";}
        else if(ele[wa] >= 0 && ele[wa] < 30){ele["group"] = "group1";}
        else if(ele[wa] >= 30 && ele[wa] < 45){ele["group"] = "group2";}
        else if(ele[wa] >= 45){ele["group"] = "group3";}
    });
    
    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#008000"};
    let units = "(%)";
    let itemName = "Stunted Share";
    let elementName = "in Children";
    let titleText = `
        <h4>Distribution of Share of Stunted Children in Total: 2015</h4>
    `;

    let scaleHtml = `
        <span>Share (%)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small><30</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>30 to 45</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small>> 45</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small>&nbsp;<small>Data Not Available</small><br>
    `;

    let distCount = mapData.filter(ele => (ele.group !== "Unavailable" && ele.group !== "Negligible")).length;
    let percentLegend = Object.keys(colorList).map(ele => {
        let color = colorList[ele];
        let percent = ((mapData.filter(el => el.group === ele).length/distCount)*100).toFixed(2);
        return `<span class="dot" style="background-color:${color}"></span>&nbsp;<span>${percent}%</span>&nbsp`
    }).join("\n");
    let percentHtml = `<span>Distribution of districts across groups</span><br>${percentLegend}`;

    generateMap(mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, "unapportioned", "2015");
}