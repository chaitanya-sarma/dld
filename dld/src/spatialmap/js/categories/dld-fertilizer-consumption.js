const fertilizerSubCategory = `<option value="fertilizer">Fertilizer Consumption</option>`;
const fertilizerNCAElement = `<option value="fertilizer nca">Per ha of NCA</option>`;
const fertilizerConsumptionItem = `<option value="total">Total</option>`;


const processFertilizer = (mapData) => {
    mapData.sort((a, b) => Object.values(a)[0] > Object.values(b)[0] ? 0 : -1);
    mapData.forEach(ele => {
        let tNca = Object.keys(ele)[0];
        if(ele[tNca] < 0){ele["group"] = "Unavailable";}
        else if(ele[tNca] >= 0 && ele[tNca] < 1){ele["group"] = "Negligible";}
        else if(ele[tNca] >= 1 && ele[tNca] < 50){ele["group"] = "group1";}
        else if(ele[tNca] >= 50 && ele[tNca] < 150){ele["group"] = "group2";}
        else if(ele[tNca] >= 150 && ele[tNca] < 225){ele["group"] = "group3";}
        else if(ele[tNca] >= 225){ele["group"] = "group4";}
    });

    let colorList = {"group1": "#F08080", "group2": "#FFFF00", "group3": "#ADFF2F", "group4": "#008000"};
    let units = "(Kg/ha)";
    let itemName = "Fertilizer Consumption";
    let elementName = "(Total of NCA)";
    let titleText = `
        <h4>Distribution of Fertilizer Consumption (NPK): 2014</h4>
    `;
    let scaleHtml = `
        <span>Kg/ha (NCA)</span><br>
        <small class="dot" style="background-color:#F08080"></small>&nbsp;<small>1 to 50</small><br>
        <small class="dot" style="background-color:#FFFF00"></small>&nbsp;<small>50 to 150</small><br>
        <small class="dot" style="background-color:#ADFF2F"></small>&nbsp;<small>150 to 225</small><br>
        <small class="dot" style="background-color:#008000"></small>&nbsp;<small>> 225</small><br>
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