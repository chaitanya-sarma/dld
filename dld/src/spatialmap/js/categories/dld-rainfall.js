const rainfallSubCategory = `<option value="rainfall">Monthly Rainfall</option>`;
const rainfallElement = `<option value="rainfall">Rainfall</option>`;
const rainfallItem = `<option value="annual">Annual</option>`;



const processRain = (rainData) => {
    rainData.sort((a, b) => a.ann > b.ann ? 0 : -1);
    let mapData = rainData.map(ele => {return {[ele.id]: ele.ann};});
    mapData.forEach(ele => {
        let mm = Object.keys(ele)[0];
        if(ele[mm] < 0){ele["group"] = "Unavailable";}
        else if(ele[mm]>0 &&+ ele[mm]<=600){ele["group"] = "group1";}
        else if(ele[mm]>600 && ele[mm]<=1000){ele["group"] = "group2";}
        else if(ele[mm]>1000 && ele[mm]<=1500){ele["group"] = "group3";}
        else if(ele[mm]>1500){ele["group"] = "group4";}
    });


    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#ADFF2F", "group4": "#008000"};
    let units = "(mm)";
    let itemName = "Annual";
    let elementName = "Rainfall";
    let titleText = `
        <h4>Distribution of ${itemName} ${elementName}: 2015</h4>
    `;
    let scaleHtml = `
        <span>Rainfall (mm)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small> < 600</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>600 to 1000</small><br>
        <small class="dot" style="background-color:#ADFF2F"></small>&nbsp;<small>1000 to 1500</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small> > 1500</small><br>
        <small class="dot" style="background-color:#FFFFFF"></small>&nbsp;<small> Data Not Available</small><br>
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
