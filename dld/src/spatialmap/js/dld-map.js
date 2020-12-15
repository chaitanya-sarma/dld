$("#generate").on("click", function (){

    $("#map-container, #download").hide();
    $("#chart-wait").html(`<img src="img/spinner.gif"><br>`);
    map.selectAll('path').remove();
    $("#district-value, #chart-legend, #map-title, #range-distribution").empty();
    
    let catVal = category.val();
    let subCatVal = subCategory.val();
    let eleVal = element.val();
    let itemVal = item.val();
    let yearVal = $("#range").val();
    let datasetVal = $("input[type=radio][name=dataset]:checked").val();

    if (!catVal || !subCatVal || !eleVal || !itemVal){
        $("#chart-wait").empty();
        alert("All fields are required");
    } else{
        switch(true){

            // CROPS
            case (catVal === "crops" && subCatVal === "area-production-yield"):
                if(datasetVal === "apportioned"){
                    // let cropAppData = JSON.parse(LZString.decompress(localStorage.getItem("cropAppData")));
                    processCropApp(cropAppData, eleVal, itemVal, yearVal);
                } else if(datasetVal === "unapportioned"){
                    // let cropUnappData = JSON.parse(LZString.decompress(localStorage.getItem("cropUnappData")));
                    processCropUnapp(cropUnappData, eleVal, itemVal);
                }
                break;

            // BIOPHYSICAL
            case (catVal === "biophysical" && datasetVal === "unapportioned"):
                if(subCatVal === "rainfall" && eleVal === "rainfall" && itemVal === "annual"){
                    // let rainData = JSON.parse(LZString.decompress(localStorage.getItem("rainData")));
                    processRain(rainData);
                } else if(subCatVal === "landuse"){
                    // let landuseData = JSON.parse(LZString.decompress(localStorage.getItem("landuseData")));
                    if(eleVal === "intensity" && itemVal === "cropping"){
                        let cropIntData = landuseData.map(ele => {return {[ele.id]: ele.crInt}});
                        processLanduseIntensity(cropIntData);
                    } else if(eleVal === "area" && itemVal === "ncap"){
                        let ncaData = landuseData.map(ele => {return {[ele.id]: [ele.ta, ele.nca]}});
                        processLanduseNCA(ncaData);
                    }
                }
                break;

            // INPUTS
            case (catVal === "inputs" && subCatVal === "fertilizer" && eleVal === "fertilizer nca" && itemVal === "total" && datasetVal === "unapportioned"):
                // let fertilizerData = JSON.parse(LZString.decompress(localStorage.getItem("fertilizerData")));
                let fertData = fertilizerData.map(ele => {return {[ele.id]: ele.tNca};});
                processFertilizer(fertData);
                break;


            // CENSUS
            case (catVal === "census" && datasetVal === "unapportioned"):
                if(subCatVal === "population" && eleVal === "population"){
                    // let populationData = JSON.parse(LZString.decompress(localStorage.getItem("populationData")));
                    if(itemVal === "urban percent"){
                        let urbanPopData = populationData.map(ele => {return {[ele.id]: [ele.uPop, ele.tPop]}});
                        processUrbanPop(urbanPopData);
                    } else if(itemVal === "rural literacy percent"){
                        let ruralLitData = populationData.map(ele => {return {[ele.id]: [ele.rLit, ele.rPop]}});
                        processRuralLit(ruralLitData);
                    }
                } else if(subCatVal === "livestock"){
                    // let livestockData = JSON.parse(LZString.decompress(localStorage.getItem("livestockData")));
                    if(eleVal === "small ruminant" && itemVal === "goat"){
                        let goatData = livestockData.map(ele => {return {[ele.id]: ele.gSh}});
                        processSmallRuminant(goatData);
                    } else if(eleVal === "large ruminant" && itemVal === "buffalo"){
                        let buffaloData = livestockData.map(ele => {return {[ele.id]: ele.bSh}});
                        processLargeRuminant(buffaloData);
                    }
                }
                break;
            
            // NUTRITION AND HEALTH
            case (catVal === "nutrition and health" && subCatVal === "nutrition" && datasetVal === "unapportioned"):
                // let nutritionData = JSON.parse(LZString.decompress(localStorage.getItem("nutritionData")));
                if(eleVal === "women" && itemVal === "anemic"){
                    anemicData = nutritionData.map(ele => {return {[ele.id]: ele.wAN}});
                    processAnemic(anemicData);
                } else if(eleVal === "children"){
                    if(itemVal === "underweight"){
                        underweightData = nutritionData.map(ele => {return {[ele.id]: ele.cUW}});
                        processUnderweight(underweightData);
                    } else if(itemVal === "stunted"){
                        stuntedData = nutritionData.map(ele => {return {[ele.id]: ele.cST}});
                        processStunted(stuntedData);
                    }
                }
                break;

            // INVALID SELECTION COMBINATIONS    
            default:
                $("#chart-wait").empty();
                alert("Invalid selection combinations");
                break;
        }
    }
});


var proj = d3.geo.mercator();
var path = d3.geo.path().projection(proj);

var map = d3.select("#chart")
    .append("svg:svg")
    .attr("height", 650)
    .attr("width", 650)
    .attr("preserveAspectRatio", "xMinYMin")
    .call(initialize);

function initialize() {
    proj.scale(6700);
    proj.translate([-1240, 750]);
}


const generateMap = (mapData, titleText, scaleHtml, percentHtml, colorList, itemName, elementName, units, dataset, year) => {
    
    var india = map.append("svg:g").attr("id", "india");
    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    

    d3.json("dummy.json", function (){
        geoJsonData = (dataset === "apportioned") ? appGeoJsonData : unappGeoJsonData;
        
        json = JSON.parse(JSON.stringify(geoJsonData));
        
        json.features.forEach(dist => {
            dist.total = "N/A";
            dist.group = "Unavailable";
        })
        
        mapData.forEach(dld => {
            json.features.filter(dist => dist.properties.ID !== 0).forEach(dist => {
                let distID = String(dist.properties.ID);
                if(distID === Object.keys(dld)[0]){
                    dist.total = Object.values(dld)[0];
                    if(dist.total === -1){ dist.total = "N/A";}
                    dist.group = dld.group;
                }
            });
        });

        let downloadableData = [];
        json.features.filter(dist => dist.group !== "Unavailable").forEach(dist => {
            downloadableData.push({
                "id": dist.properties["ID"],
                "state": dist.properties["STATE_UT"],
                "district": dist.properties["NAME_2016"],
                [`${itemName} ${elementName} ${units} (${year})`]: dist.total,
            });
        });
        downloadableData.sort((a, b) => a.state > b.state ? 0 : -1);

        colorList["Negligible"] = "#cccccc";
        colorList["Unavailable"] = "#ffffff";
        const appliedColor = colorList;

        india.selectAll("path")
            .data(json.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", "#ffffff")
            .style("opacity", 1.0)
            .on('click', function (d, i) {
                $("#district-value").empty().html(`<br>
                    <small>
                    <table class="table table-bordered table-condensed table-sm">
                        <tr><th>State</th><td>${d.properties.STATE_UT}</td></tr>
                        <tr><th>District</th><td>${d.properties.NAME_2016}</td></tr>
                        <tr><th>${itemName}<br></th><td>${d.total}<small class="pull-right">${units}</small></td></tr>
                    </table>
                    </small>
                `);
                d3.select(this).transition().duration(300).style("opacity", 1);
                div.transition().duration(300).style("opacity", 1);
            })
            .on('mouseleave', function (d, i) {
                d3.select(this).transition().duration(300).style("opacity", 1.0);
                div.transition().duration(300).style("opacity", 0);
            })
            .on('mouseenter', function (d, i) {
                d3.select(this).transition().duration(300).style("opacity", 0.5);
                div.transition().duration(300).style("opacity", 0);
            });

        india.selectAll("path").transition().duration(1000)
            .style("fill", function (d) {
                return appliedColor[d.group];
            });

        delete colorList.Unavailable;
        delete colorList.Negligible;

        $("#map-title").empty().html(titleText);  
        $("#map-citation").empty().html(`
            <small class="text-muted">District level Database (DLD) for India. International Crops Research Institute for the Semi-Arid Tropics (ICRISAT).<br>
            <a href="http://data.icrisat.org/dld/" target="blank_">http://data.icrisat.org/dld/</a></small>
        `);
        $("#map-logo").empty().html(`<img src="img/logo1.png" width="180" height="50">`);
        $("#chart-legend").empty().html(scaleHtml);
        $("#range-distribution").empty().html(percentHtml);
        
        // Download
        let fileName = `${itemName.toLocaleLowerCase().replace(" ", "_")}_${elementName.toLocaleLowerCase()}_${dataset}_${year}`;
        // CSV
        let csv = `id, state, district, ${itemName} ${elementName} ${units}\n`
        downloadableData.forEach(function (row){
            csv += Object.values(row).join(",");
            csv += "\n";
        });
        csv += `
            \n\n
            District level Database (DLD) for India. International Crops Research Institute for the Semi-Arid Tropics (ICRISAT).
            http://data.icrisat.org/dld/            
            Retrieved on ${new Date()}
        `;
        $("#csv-save").attr("href", 'data:text/csv;charset=utf-8,' + encodeURI(csv)).attr("target", "_blank").attr("download", `${fileName}.csv`);

        // Excel
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet(`${fileName}`);
        worksheet.columns = [
            {"header": "id", "key": "id", "width":32},
            {"header": "state", "key": "state", "width":32},
            {"header": "district", "key": "district", "width":32},
            {"header": `${itemName} ${elementName} ${units} (${year})`, "key": `${itemName} ${elementName} ${units} (${year})`, "width":64}
        ]
        downloadableData.forEach(record => {
            worksheet.addRow({
                "id": record["id"],
                "state": record["state"],
                "district": record["district"],
                [`${itemName} ${elementName} ${units} (${year})`]: record[`${itemName} ${elementName} ${units} (${year})`]
            });
        });
        worksheet.addRow({"id": "\n"});
        worksheet.addRow({"id": "District level Database (DLD) for India. International Crops Research Institute for the Semi-Arid Tropics (ICRISAT)."});
        worksheet.addRow({"id": "http://data.icrisat.org/dld/ "});
        worksheet.addRow({"id": `Retrieved on ${new Date()}`});
        let xlLogo = workbook.addImage({
            base64: logoBase64,
            extension: "png"
        })
        worksheet.addImage(xlLogo, {
            tl: {col: 0, row: downloadableData.length + 5},
            br: {col: 1, row: downloadableData.length + 7},
            editAs: "absolute"
        })
        
        $("#xl-save").on("click", function (){
            mapExcelDownload(workbook, fileName);
        })

        // IMAGE
        $("#download").on("click", function (){
            $("g").css("stroke", "#101010").css("stroke-width", ".6");
            html2canvas(document.getElementById("map-container")).then((canvas) => {
                dataSrc = canvas.toDataURL("image/png");
                dataSrc = dataSrc.replace("data:image/png;base64,","");
                $("#img-save").attr("href", 'data:application/octet-stream;base64,' + encodeURI(dataSrc)).attr("target", "_blank").attr("download", `${fileName}.jpeg`);
            });
        });

        $("#chart-wait").empty();
        $("#map-container, #download").show();
    });
}


const mapExcelDownload = (workbook, fileName) => {
    workbook.xlsx.writeBuffer().then(data => {
        var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        saveAs(blob, `${fileName}.xlsx`);
    })
}