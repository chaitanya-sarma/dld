let yearMapContainers;
let yearSVGContainers;

$("#compare").on("click", function (){
    $("#charts").empty();
    yearSVGContainers = [];
    $("#charts-wait").html(`<img src="img/spinner.gif"><br>`);

    let catVal = category.val();
    let subCatVal = subCategory.val();
    let eleVal = element.val();
    let itemVal = item.val();
    let yearsVal = $("#years").val();

    if (!catVal || !subCatVal || !eleVal || !itemVal || !yearsVal.length){
        $("#charts-wait").empty();
        alert("All fields are required");
    } else{
        
        let selectedYears = $("#years").val();
        switch(true){
            case (selectedYears.length == 1):
                $("#charts").empty().html(`
                    <div class="col-sm-4"></div>
                    <div id="chart_${selectedYears[0]}" class="col-sm-12 col-md-12 col-lg-4"></div>
                    <div class="col-sm-4"></div>
                `);
                
                break;
            case (selectedYears.length == 2):
                $("#charts").empty().html(`
                    <div class="col-sm-2"></div>
                    <div id="chart_${selectedYears[0]}" class="col-sm-12 col-md-12 col-lg-4"></div>
                    <div id="chart_${selectedYears[1]}" class="col-sm-12 col-md-12 col-lg-4"></div>
                    <div class="col-sm-2"></div>
                `);
                break;
            case (selectedYears.length == 3):
                $("#charts").empty().html(`
                    <div id="chart_${selectedYears[0]}" class="col-sm-12 col-md-12 col-lg-4"></div>
                    <div id="chart_${selectedYears[1]}" class="col-sm-12 col-md-12 col-lg-4"></div>
                    <div id="chart_${selectedYears[2]}" class="col-sm-12 col-md-12 col-lg-4"></div>
                `);
                break;
        }

        mapContainers = selectedYears.map(ele => `chart_${ele}`);
        mapContainers.forEach(ele => addSVG(ele));

        switch(true){
            case (catVal === "crops" && subCatVal === "area-production-yield"):
                // let cropAppData = JSON.parse(LZString.decompress(localStorage.getItem("cropAppData")));
                processCropAppCompare(cropAppData, eleVal, itemVal, yearsVal);
                yearMapContainers = yearsVal.map(ele => `chart_${ele}`);
                break;
            
            // INVALID SELECTION COMBINATIONS    
            default:
                $("#charts-wait").empty();
                alert("Invalid selection combinations");
                break;
        }
        
    }

});


const addSVG = (mapContainer) => {
    let svg = d3.select(`#${mapContainer}`)
                .append("svg:svg")
                .attr("viewBox", "0 0 600 600")
                .attr("height", 450)
                .attr("width", 450)
                .attr("id", mapContainer.replace('chart_', ''))
                .attr("preserveAspectRatio", "xMinYMin")
                .call(multiInitialize)
    let year = mapContainer.replace('chart_', '');
    yearSVGContainers.push({
        "svg": svg,
        "year": year
    });
}


function multiInitialize() {
    proj.scale(6700);
    proj.translate([-1240, 750]);
}

var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);



const compareMaps = (mapData, colorList, year, percentHtml, itemName, elementName, units, years) => {

    let currentSVG = yearSVGContainers.find(ele => ele.year === year).svg;
    yearSVGContainers.map(ele => ele.svg).forEach(ele => ele.selectAll("path").remove());
    let currentMap = currentSVG.append("svg:g").attr("id", `india_${year}`);

    d3.json("dummy.json", function (){
        geoJsonData = appGeoJsonData;
        
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

        colorList["Negligible"] = "#cccccc";
        colorList["Unavailable"] = "#ffffff";

        const appliedColor = colorList;

        currentMap.selectAll("path")
            .data(json.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", "#ffffff")
            .style("opacity", 1.0)
            .on('click', function (d, i) {
                d3.select(this).transition().duration(300).style("opacity", 1);
                div.transition().duration(300)
                  .style("opacity", 1)
                div.html(`
                    <div class="bg-white" style="border: thin solid black">
                        ${d.properties.STATE_UT}, ${d.properties.NAME_2016}: ${d.total} ${units}
                    </div>`)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 30) + "px");
              })
              .on('mouseleave', function (d, i) {
                d3.select(this).transition().duration(300).style("opacity", 1.0);
                div.transition().duration(300).style("opacity", 0);
                })
              .on('mouseenter', function (d, i) {
                d3.select(this).transition().duration(300).style("opacity", 0.5);
                div.transition().duration(300).style("opacity", 0);
              });

        currentMap.selectAll("path").transition().duration(1000)
            .style("fill", function (d) {
                return appliedColor[d.group];
            });
        
        delete colorList.Unavailable;
        delete colorList.Negligible;

        $(`#chart_${year}`).append(percentHtml);
        
        // DOWNLOAD
        let fileName = `${itemName.toLocaleLowerCase().replace(" ", "_")}_${elementName.toLocaleLowerCase()}_${units}`;
        // IMAGE
        $("#downloads").on("click", function (){
            $("g").css("stroke", "#101010").css("stroke-width", ".6");
            html2canvas(document.getElementById("maps-container")).then((canvas) => {
                dataSrc = canvas.toDataURL("image/png");
                dataSrc = dataSrc.replace("data:image/png;base64,","");
                $("#imgs-save").attr("href", 'data:application/octet-stream;base64,' + encodeURI(dataSrc)).attr("target", "_blank").attr("download", `${fileName}.jpeg`);
            });
        });

        // CSV
        let csv = `id, state, district, ${String(years)}\n`;
        compDownloadableData.forEach(function (row){
            csv += Object.values(row).join(",");
            csv += "\n";
        });
        csv += `
            \n\n
            District level Database (DLD) for India. International Crops Research Institute for the Semi-Arid Tropics (ICRISAT).
            http://data.icrisat.org/dld/            
            Retrieved on ${new Date()}
        `;
        $("#csvs-save").attr("href", 'data:text/csv;charset=utf-8,' + encodeURI(csv)).attr("target", "_blank").attr("download", `${fileName}.csv`);

        // EXCEL
        // let fileName = `${cropName.toLocaleLowerCase().replace(" ", "_")}_${cropProperty.toLocaleLowerCase()}_${units}`;
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet(`${fileName}`);
        let worksheetColumns = [
            {"header": "id", "key": "id", "width":32},
            {"header": "state", "key": "state", "width":32},
            {"header": "district", "key": "district", "width":32},
        ];
        years.forEach(yr => {
            worksheetColumns.push({"header": yr, "key": yr, "width": 32});
        });
        worksheet.columns = worksheetColumns;
        compDownloadableData.forEach(record => {
            let dataRow = {
                "id": record["id"],
                "state": record["state"],
                "district": record["district"]
            };
            years.forEach(yr => {
                dataRow[yr] = record[`y${yr}`];
            });
            worksheet.addRow(dataRow);
        });
        worksheet.addRow({"id": "\n"});
        worksheet.addRow({"id": "District level Database (DLD) for India. International Crops Research Institute for the Semi-Arid Tropics (ICRISAT)."});
        worksheet.addRow({"id": "http://data.icrisat.org/dld/ "});
        worksheet.addRow({"id": `Retrieved on ${new Date()}`});
        let xlsLogo = workbook.addImage({
            base64: logoBase64,
            extension: "png"
        })
        worksheet.addImage(xlsLogo, {
            tl: {col: 0, row: compDownloadableData.length + 5},
            br: {col: 1, row: compDownloadableData.length + 7},
            editAs: "absolute"
        });

        mapsExcelDownload(workbook, fileName);
    });
    $("#charts-wait").hide();
    $("#downloads").show();
}


const mapsExcelDownload = (workbook, fileName) => {
    $("#xls-save").on("click", function (){
        workbook.xlsx.writeBuffer().then(async (data) => {
            let blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, `${fileName}.xlsx`);
            await new Promise(setTimeout);
        })
    });
}