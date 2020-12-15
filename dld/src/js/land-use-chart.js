
let landUseData = {};
let landUseChart = {};
let landUseResponseData = null;
let landUseGcaChart = null;
const getLangUseChart = (district) => {
    disposeLandChart();
    if (landUseResponseData) {
        setTimeout(() => generateLandUserData(district));
    } else {
        Promise.all([get('unapportioned/landuse'), get('unapportioned/sourcewise-irrigated-area'), get('unapportioned/fertilizer-consumption')])
            .then(response => {
                if (response) {
                    landUseResponseData = [];
                    if (response[0]) {
                        landUseResponseData.push(JSON.parse(response[0]));
                    }
                    if (response[1]) {
                        landUseResponseData.push(JSON.parse(response[1]));
                    }
                    if (response[2]) {
                        landUseResponseData.push(JSON.parse(response[2]));
                    }
                    generateLandUserData(district)
                }
            });
    }

}

const generateLandUserData = (district) => {

    ncaData = generateNcaData(landUseResponseData[0], district)
    niaData = generateNiaData(landUseResponseData[1], district);
    gcaData = generateGcaData(landUseResponseData[2], district);

    if (ncaData && ncaData.data && ncaData.data.length) {
        const ncaMaxYear = Math.max(...ncaData.data.map(data => data.year)).toString();
        $('#ncaYear').html(` (${ncaMaxYear})`);
        $('#crop-area').text(ncaData.data[ncaData.data.length - 1].nca.toFixed(1) + ' (000 Ha)');
        $('#urban-population').text(parseFloat(ncaData['geoData']).toFixed(1) + ' (000 Ha)');
        $('#geoAreaYear').html(` (${ncaMaxYear})`);
    } else {
        $('#ncaYear').html(``);
        $('#crop-area').text('0 (000 Ha)');
        $('#urban-population').text('0 (000 Ha)');
    }

    if (niaData && niaData.data && niaData.data.length) {
        const niaMaxYear = Math.max(...niaData.data.map(data => data.year)).toString();
        $('#niaYear').html(` (${niaMaxYear})`);
        $('#irrigated-area').text(niaData.data[niaData.data.length - 1].nia.toFixed(1) + ' (000 Ha)');
    } else {
        $('#niaYear').html(``);
        $('#irrigated-area').text('0 (000 Ha)');
    }

    const chartData = [];

    if (ncaData.data.length || niaData.data.length) {
        for (let year = 1990; year <= 2015; year++) {
            const result = { 'year': year.toString() }
            nca = ncaData.data.find(data => data.year === result.year);
            nia = niaData.data.find(data => data.year === result.year);
            result['nca'] = nca && (nca.nca || nca.nca === 0) && nca.nca >= 0 ? nca.nca : null;
            result['nia'] = nia && (nia.nia || nia.nia === 0) && nia.nia >= 0 ? nia.nia : null;
            chartData.push(result);
        }


        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            landUseChart = am4core.create("ncaline", am4charts.XYChart);

            // Add data
            
            landUseChart.data = chartData;
            
            const subtitle = landUseChart.titles.create();
            subtitle.text = `(${waterMarkText()})`;
            subtitle.fontSize = 15;
            subtitle.marginBottom = 10;
            
            const title = landUseChart.titles.create();
            title.text = "Cropped and irrigated area";
            title.fontSize = 18;
            title.marginBottom = 10;

            // Create category axis
            let categoryAxis = landUseChart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";

            // Create value axis
            let valueAxis = landUseChart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "Area (000 Ha)";
            valueAxis.min = 0;

            const series1 = landUseChart.series.push(new am4charts.LineSeries());
            series1.dataFields.valueY = 'nca';
            series1.dataFields.categoryX = "year";
            series1.name = 'Net Crop Area';
            series1.strokeWidth = 1;
            series1.bullets.push(new am4charts.CircleBullet());
            series1.tooltipText = "{name} {categoryX}: {valueY}";
            series1.legendSettings.valueText = "{valueY}";
            series1.visible = false;

            const series2 = landUseChart.series.push(new am4charts.LineSeries());
            series2.dataFields.valueY = 'nia';
            series2.dataFields.categoryX = "year";
            series2.name = 'Net Irrigated Area';
            series2.strokeWidth = 1;
            series2.bullets.push(new am4charts.CircleBullet());
            series2.tooltipText = "{name} {categoryX}: {valueY}";
            series2.legendSettings.valueText = "{valueY}";
            series2.visible = false;

            // Add chart cursor
            landUseChart.cursor = new am4charts.XYCursor();
            landUseChart.cursor.behavior = "zoomY";

            // Add legend
            landUseChart.legend = new am4charts.Legend();
            landUseChart.legend.labels.template.wrap = true;
            landUseChart.legend.maxWidth = 300;
            landUseChart.exporting.menu = new am4core.ExportMenu();
            landUseChart.exporting.filePrefix = "land_use";

            landUseChart.data.forEach(ele => {
                ele.district = $('#district option:selected').text();
                ele.state = $('#states option:selected').text();
                ele.units = valueAxis.title.text;
            });
            // let watermark = new am4core.Label();
            // watermark.text =  waterMarkText();

            landUseChart.logo.disabled = true;
            landUseChart.exporting.dataFields = {
                "state": "STATE",
                "district": "DISTRICT",
                "units": "UNITS",
                "year": "SECTOR",
                "nca": "NCA",
                "nia": "NIA",
            }
            // watermark.fontSize = 10;
            // // Enable watermark on export
            // landUseChart.exporting.events.on("exportstarted", function (ev) {
            //     watermark.disabled = false;
            //     // title.disabled = false;
            // });
            // // Disable watermark when export finishes
            // landUseChart.exporting.events.on("exportfinished", function (ev) {
            //     watermark.disabled = true;
            //     // title.disabled = false;
            // });

        }); // end am4core.ready()
    } else {
        const html = `
        <h2 class="text-center mt-1">Cropped and irrigated area</h2>
        <h2 class="w-100 text-center mt-12">No Data Found for Chart<h2>
        `;
        $('#ncaline').html(html);
    }

    if (gcaData && gcaData.length) {
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            landUseGcaChart = am4core.create("landusegca", am4charts.XYChart);

            // Add data
            landUseGcaChart.data = gcaData;
            const subtitle = landUseGcaChart.titles.create();
            subtitle.text = `(${waterMarkText()})`;
            subtitle.fontSize = 15;
            subtitle.marginBottom = 10;
            
            const title = landUseGcaChart.titles.create();
            title.text = 'Fertilizer consumption';
            title.fontSize = 18;
            title.marginBottom = 10;

            // Create axes
            let categoryAxis = landUseGcaChart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.title.text = "";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 20;
            categoryAxis.renderer.cellStartLocation = 0.1;
            categoryAxis.renderer.cellEndLocation = 0.9;

            let valueAxis = landUseGcaChart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.title.text = "Kg / ha of total cropped area";

            // Create series
            function createSeries(field, name, stacked) {
                let series = landUseGcaChart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = field;
                series.dataFields.categoryX = "year";
                series.name = titleCase(name);
                series.columns.template.tooltipText = "{name} PER HA OF GCA: [bold]{valueY}[/]";
                series.stacked = stacked;
                series.columns.template.width = am4core.percent(40);
            }

            createSeries("NITROGEN PER HA OF GCA", "NITROGEN", false);
            createSeries("PHOSPHATE PER HA OF GCA", "PHOSPHATE", false);
            createSeries("POTASH PER HA OF GCA", "POTASH", false);

            // Add legend
            landUseGcaChart.data.forEach(ele => {
                ele.district = $('#district option:selected').text();
                ele.state = $('#states option:selected').text();
                ele.units = valueAxis.title.text;
            });
            landUseGcaChart.legend = new am4charts.Legend();
            

            // Export
            landUseGcaChart.exporting.menu = new am4core.ExportMenu();
            landUseGcaChart.exporting.filePrefix = "fertilizer_use";
            landUseGcaChart.logo.disabled = true;
            landUseGcaChart.exporting.dataFields = {
                "state": "STATE",
                "district": "DISTRICT",
                "units": "UNITS",
                "year": "SECTOR",
                "NITROGEN PER HA OF GCA": "NITROGEN PER HA OF GCA",
                "PHOSPHATE PER HA OF GCA": "PHOSPHATE PER HA OF GCA",
                "POTASH PER HA OF GCA": "POTASH PER HA OF GCA",
            }


        }); // end am4core.ready()

    } else {
        const html = `
        <h2 class="text-center mt-1">Fertilizer consumption</h2>
        <h2 class="w-100 text-center  mt-12">No Data Found for Chart<h2>
        `;
        $('#landusegca').html(html);
    }



    $('#land-use-spinner').hide();
}

const generateLandUseChartData = (response, district) => {
    landUseData = response;
    const yearRange = `Range: ${landUseData.years[0]} to ${landUseData.years[landUseData.years.length - 1]}`
    const considerHeader = [];
    landUseData.items.forEach(data => {
        landUseData.elements.forEach(ele => {
            considerHeader.push(`${data} ${ele}`);
        });
    });
    const headers = landUseData.headers.map(data => data.header);
    const chartFilterData = landUseData.data.filter(data => data[0] === district);
    const indexs = considerHeader.map(data => headers.indexOf(data)).filter(data => data > 0);
    const total = chartFilterData.map((data) => {
        return data.filter((fData, index) => indexs.includes(index)).reduce((d1, d2) => parseFloat(d1) + parseFloat(d2));
    });
    return { 'data': total, 'range': yearRange, startYear: landUseData.years[0] };
}

const generateNcaData = (response, district) => {
    const headers = response.headers.map(data => data.header);
    const ncaJsonData = [];
    response.data.forEach(elements => {
        const result = {};
        elements.forEach((data, index) => {
            result[headers[index]] = data;
        });
        ncaJsonData.push(result)
    });
    const districtData = ncaJsonData.filter(data => data['Dist Code'] === district);
    const result = {};
    const maxYear = Math.max(...districtData.map(mData => mData.Year)).toString();
    result['data'] = districtData.map(data => {
        return { 'year': data.Year, 'nca': parseInt(data['NET CROPPED AREA']) }
    });
    const geoData = districtData.find(fData => fData.Year === maxYear);
    if (geoData) {
        result['maxYear'] = maxYear;
        result['geoData'] = geoData['TOTAL AREA'];
    }
    result['range'] = `Range: ${response.years[0]} to ${response.years[response.years.length - 1]}`
    result['startYear'] = response.years[0];
    return result
}

const generateNiaData = (response, district) => {
    const headers = response.headers.map(data => data.header);
    const niaJsonData = [];
    response.data.forEach(elements => {
        const result = {};
        elements.forEach((data, index) => {
            result[headers[index]] = data;
        });
        niaJsonData.push(result)
    });
    const districtData = niaJsonData.filter(data => data['Dist Code'] === district);
    const result = {};
    result['data'] = districtData.map(data => {
        return { 'year': data.Year, 'nia': parseInt(data['NET AREA']) }
    });
    result['range'] = `Range: ${response.years[0]} to ${response.years[response.years.length - 1]}`;
    result['startYear'] = response.years[0];
    return result
}

const generateGcaData = (response, district) => {
    const headers = response.headers.map(data => data.header);
    const gcaJsonData = [];
    response.data.forEach(elements => {
        const result = {};
        elements.forEach((data, index) => {
            result[headers[index]] = data;
        });
        gcaJsonData.push(result)
    });
    const year = ['Gujarat', 'Himachal Pradesh', 'Uttar Pradesh'].includes($('#states').val()) ? '2014' : '2015';
    const result = gcaJsonData.filter(data => data['Dist Code'] === district && data['Year'] === year).map(data => {
        return {
            'year': data['Year'], 'NITROGEN PER HA OF GCA': data['NITROGEN PER HA OF GCA'],
            'PHOSPHATE PER HA OF GCA': data['PHOSPHATE PER HA OF GCA'],
            'POTASH PER HA OF GCA': data['POTASH PER HA OF GCA']
        };
    });
    return result
}

const disposeLandChart = () => {
    try {
        if (landUseChart && landUseChart.dispose) {
            landUseChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Land Use Chart');
    }

    try {
        if (landUseGcaChart && landUseGcaChart.dispose) {
            landUseGcaChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Land Use Chart');
    }
}
