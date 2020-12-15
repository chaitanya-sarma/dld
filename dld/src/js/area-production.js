let areaChart = null;
let prodChart = null;
let topFiveChart = null;
let areaProdResponse = null;
let topSevenChart = null;

const getGetAreaProductionCharts = (district) => {
    disposeAreaProductionCharts();
    if (areaProdResponse) {
        setTimeout(() => generateAreaCropGroup(areaProdResponse, district));
    } else {
        get('unapportioned/area-production-yield').then(response => {
            if (response) {
                areaProdResponse = JSON.parse(response);
                generateAreaCropGroup(areaProdResponse, district);
            }
        });
    }

}

const generateAreaCropGroup = (areaProductionYeild, district) => {
    const areaProductionJsonData = []
    const headers = areaProductionYeild.headers.map(data => data.header);
    areaProductionYeild.data.forEach(elements => {
        const result = {};
        elements.forEach((data, index) => {
            result[headers[index]] = data;
        });
        areaProductionJsonData.push(result)
    });
    const areaHeader = [
        "CEREALS AREA",
        "PULSES AREA",
        "OILSEEDS AREA",
        // "RICE AREA",
        // "WHEAT AREA"
    ];
    const prodHeader = [
        "CEREALS PRODUCTION",
        "PULSES PRODUCTION",
        "OILSEEDS PRODUCTION",
        // "RICE PRODUCTION",
        // "WHEAT PRODUCTION"
    ];
    const noProdHeader = [
        "CEREALS PRODUCTION",
        "PULSES PRODUCTION",
        "OILSEEDS PRODUCTION",
    ];
    const noAreaHeader = [
        "FRUITS AREA",
        "VEGETABLES AREA",
        "FRUITS AND VEGETABLES AREA",
        "POTATOES AREA",
        "ONION AREA",
        "FODDER AREA",
        "CEREALS AREA",
        "PULSES AREA",
        "OILSEEDS AREA",
    ];
    const cropProdHeaders = headers.filter(data => data.endsWith(' PRODUCTION') && !noProdHeader.includes(data));
    const cropAreaHeaders = headers.filter(data => data.endsWith(' AREA') && !noAreaHeader.includes(data));
    const maxThreeYears = ['1993', '2003', '2015'];
    const maxThreeYearsCrops = areaProductionJsonData.filter(data => maxThreeYears.includes(data.Year)
        && data['Dist Code'] === district).map(data => {
            const cropData = { 'year': data.Year };
            cropProdHeaders.forEach(ele => cropData[ele] = data[ele]);
            return cropData;
        });
    const selectedYearsCropsArea = areaProductionJsonData.filter(data => maxThreeYears.includes(data.Year)
        && data['Dist Code'] === district).map(data => {
            const cropData = { 'year': data.Year };
            cropAreaHeaders.forEach(ele => cropData[ele] = data[ele]);
            return cropData;
        });
    const topFiveCrop = maxThreeYearsCrops.map(maxThree => {
        const allKeys = Object.keys(maxThree).filter(data => data !== 'year');
        const allValues = allKeys.map(data => parseInt(maxThree[data]));
        const topFiveValue = { 'YEAR': maxThree.year };
        JSON.parse(JSON.stringify(allValues)).sort((d1, d2) => d2 - d1).filter((data, index) => index < 7)
            .map(data => {
                const index = allValues.indexOf(data);
                topFiveValue[allKeys[index]] = data;
            });
        return topFiveValue;
    });
    const topSevenCropArea = selectedYearsCropsArea.map(maxThree => {
        const allKeys = Object.keys(maxThree).filter(data => data !== 'year');
        const allValues = allKeys.map(data => parseInt(maxThree[data]));
        const topFiveValue = { 'YEAR': maxThree.year };
        JSON.parse(JSON.stringify(allValues)).sort((d1, d2) => d2 - d1).filter((data, index) => index < 7)
            .map(data => {
                const index = allValues.indexOf(data);
                topFiveValue[allKeys[index]] = data;
            });
        return topFiveValue;
    });
    // const areaData = areaProductionJsonData.filter(data => data['Dist Code'] === district).map(element => {
    //     const data = {};
    //     data['year'] = element['Year'];
    //     areaHeader.forEach(headerEle => data[headerEle] = ((element[headerEle] || element[headerEle] === 0) && element[headerEle] >= 0) ? element[headerEle] : null);
    //     return data;
    // });
    // const prodData = areaProductionJsonData.filter(data => data['Dist Code'] === district).map(element => {
    //     const data = {};
    //     data['year'] = element['Year'];
    //     prodHeader.forEach(headerEle => data[headerEle] = ((element[headerEle] || element[headerEle] === 0) && element[headerEle] >= 0) ? element[headerEle] : null);
    //     return data;
    // });
    const html = `<h2 class="w-100 text-center mt-12">No Data Found for Chart<h2>`;
    // if (areaData && areaData.length) {
    //     generateAreaChart(areaData, areaHeader);
    // } else {
    //     let titleAppend = `<h2 class="text-center mt-1">Area: cereals, pulses and oilseeds</h2> ${html}`;
    //     $('#areaproduction').html(titleAppend);
    // }
    // if (prodData && prodData.length) {
    //     generateProductionChart(prodData, prodHeader);
    // } else {
    //     let titleAppend = `<h2 class="text-center mt-1">Production: cereals, pulses and oilseeds</h2> ${html}`;
    //     $('#production').html(titleAppend);
    // }
    if (topFiveCrop && topFiveCrop.length) {
        generateTopCropsChart(topFiveCrop);
    } else {
        let titleAppend = `<h2 class="text-center mt-1">Crop Production (major field crops)</h2> ${html}`;
        $('#top5crops').html(titleAppend);
    }
    if (topSevenCropArea && topSevenCropArea.length) {
        generateTopSevenCropsAreaChart(topSevenCropArea)
    } else {
        let titleAppend = `<h2 class="text-center mt-1">Crop Area (major field crops)</h2> ${html}`;
        $('#top7CropsArea').html(titleAppend);
    }
    $('#area-production-spinner').hide();
}

const generateAreaChart = (data, headers) => {

    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        areaChart = am4core.create("areaproduction", am4charts.XYChart);

        // Add data
        console.log(data);
        areaChart.data = data

        const subtitle = areaChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = areaChart.titles.create();
        title.text = 'Area: cereals, pulses and oilseeds';
        title.fontSize = 18;
        title.marginBottom = 10;

        areaChart.colors.list = [
            am4core.color("#845EC2"),
            am4core.color("#D65DB1"),
            am4core.color("#FF6F91"),
            am4core.color("#FF9671"),
            am4core.color("#FFC75F"),
            am4core.color("#F9F871"),
        ];

        // Create category axis
        let categoryAxis = areaChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";

        // Create value axis
        let valueAxis = areaChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Area (000 Ha)";
        valueAxis.min = 0;

        headers.forEach(element => {
            const series = areaChart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = element;
            series.dataFields.categoryX = "year";
            series.name = element.replace(' AREA', '');
            series.strokeWidth = 1;
            series.bullets.push(new am4charts.CircleBullet());
            series.tooltipText = "{name} {categoryX}: {valueY}";
            series.legendSettings.valueText = "{valueY}";
            series.visible = false;
            // if(element === "CEREALS AREA"){
            //     series.stroke = am4core.color('#FF0000');
            //     let bullet = series.bullets.push(new am4charts.CircleBullet());
            //     bullet.circle.fill = am4core.color('#FF0000');
            //     bullet.circle.stroke = am4core.color('#FF0000');
            //     bullet.circle.strokeWidth = 2;
            // }
        });

        // Add chart cursor
        areaChart.cursor = new am4charts.XYCursor();
        areaChart.cursor.behavior = "zoomY";


        areaChart.data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = valueAxis.title.text;
        });
        // Add legend
        areaChart.legend = new am4charts.Legend();
        areaChart.exporting.menu = new am4core.ExportMenu();
        areaChart.exporting.filePrefix = "crop_area";
        areaChart.logo.disabled = true;


    }); // end am4core.ready()

}

const generateProductionChart = (data, headers) => {

    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        prodChart = am4core.create("production", am4charts.XYChart);

        // Add data
        prodChart.data = data

        const subtitle = prodChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = prodChart.titles.create();
        title.text = 'Production: cereals, pulses and oilseeds';
        title.fontSize = 18;
        title.marginBottom = 10;

        prodChart.colors.list = [
            am4core.color("#845EC2"),
            am4core.color("#D65DB1"),
            am4core.color("#FF6F91"),
            am4core.color("#FF9671"),
            am4core.color("#FFC75F"),
            am4core.color("#F9F871"),
        ];

        // Create category axis
        let categoryAxis = prodChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";

        // Create value axis
        let valueAxis = prodChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Production (000 Tons)";
        valueAxis.min = 0;

        headers.forEach(element => {
            const series = prodChart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = element;
            series.dataFields.categoryX = "year";
            series.name = element.replace(' PRODUCTION', '');;
            series.strokeWidth = 1;
            series.bullets.push(new am4charts.CircleBullet());
            series.tooltipText = "{name} {categoryX}: {valueY}";
            series.legendSettings.valueText = "{valueY}";
            series.visible = false;
        });

        // Add chart cursor
        prodChart.cursor = new am4charts.XYCursor();
        prodChart.cursor.behavior = "zoomY";


        prodChart.data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = valueAxis.title.text;
        });
        // Add legend
        prodChart.legend = new am4charts.Legend();
        prodChart.exporting.menu = new am4core.ExportMenu();
        prodChart.exporting.filePrefix = "crop_production";
        prodChart.logo.disabled = true;

    }); // end am4core.ready()

}
const generateTopCropsChart = (data) => {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        topFiveChart = am4core.create('top5crops', am4charts.XYChart)
        topFiveChart.colors.step = 2;

        topFiveChart.legend = new am4charts.Legend()
        topFiveChart.legend.position = 'top'
        topFiveChart.legend.paddingBottom = 20

        const subtitle = topFiveChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = topFiveChart.titles.create();
        title.text = `Crop production (major field crops)`;
        title.fontSize = 18;
        title.marginBottom = 10;


        topFiveChart.exporting.menu = new am4core.ExportMenu();
        topFiveChart.exporting.filePrefix = "crop_production";

        let xAxis = topFiveChart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'YEAR'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;

        let yAxis = topFiveChart.yAxes.push(new am4charts.ValueAxis());
        yAxis.title.text = "Production (000 Tons)";
        yAxis.min = 0;

        function createSeries(value, name) {
            let series = topFiveChart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'YEAR'
            series.name = titleCase(name);
            series.columns.template.fill = am4core.color(columnColors[name]);
            series.columns.template.stroke = am4core.color(columnColors[name]);
            series.data = topFiveChart.data;
            series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]"

            series.events.on("hidden", arrangeColumns);
            series.events.on("shown", arrangeColumns);

            let bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            bullet.label.fill = am4core.color('#ffffff')

            return series;
        }

        topFiveChart.data = data;
        const keys = Array.from(new Set(data.map(ele => Object.keys(ele).join('\t'))
            .join('\t').split('\t'))).filter(ele => ele !== 'YEAR');
        keys.forEach(element => {
            createSeries(element, element.replace(' PRODUCTION', ''));
        });

        function arrangeColumns() {

            let series = topFiveChart.series.getIndex(0);

            let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
            if (series.dataItems.length > 1) {
                let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
                let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
                let delta = ((x1 - x0) / topFiveChart.series.length) * w;
                if (am4core.isNumber(delta)) {
                    let middle = topFiveChart.series.length / 2;

                    let newIndex = 0;
                    topFiveChart.series.each(function (series) {
                        if (!series.isHidden && !series.isHiding) {
                            series.dummyData = newIndex;
                            newIndex++;
                        }
                        else {
                            series.dummyData = topFiveChart.series.indexOf(series);
                        }
                    })
                    let visibleCount = newIndex;
                    let newMiddle = visibleCount / 2;

                    topFiveChart.series.each(function (series) {
                        let trueIndex = topFiveChart.series.indexOf(series);
                        let newIndex = series.dummyData;

                        let dx = (newIndex - trueIndex + middle - newMiddle) * delta

                        series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                        series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                    })
                }
            }
        }
        const apkeys = Object.keys(topFiveChart.data[0]);
        apkeys.unshift('UNITS');
        apkeys.unshift('DISTRICT');
        apkeys.unshift('STATE');
        // .sort((v1,v2) => {
        //     if (v1 === 'STATE') {return -3};
        //     if (v1 === 'DISTRICT') {return -2};
        //     if (v1 === 'UNITS') {return -1}
        //     return 1;
        //     });
        topFiveChart.data.forEach(ele => {
            ele.DISTRICT = $('#district option:selected').text();
            ele.STATE = $('#states option:selected').text();
            ele.UNITS = yAxis.title.text;
        });
        topFiveChart.data = topFiveChart.data.map(cData => {
            const allKeys = apkeys.map(key => {
                const obj = {}
                obj[key] = cData[key]
                return obj;
            });
            return Object.assign({}, ...allKeys);
        });
        topFiveChart.exporting.getFormatOptions("pdfdata").pageOrientation = 'landscape';;

        topFiveChart.logo.disabled = true;

    }); // end am4core.ready()
}

const generateTopSevenCropsAreaChart = (data) => {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        topSevenChart = am4core.create('top7CropsArea', am4charts.XYChart)
        topSevenChart.colors.step = 2;

        topSevenChart.legend = new am4charts.Legend()
        topSevenChart.legend.position = 'top'
        topSevenChart.legend.paddingBottom = 20

        // topSevenChart.colors.list = [
        //     am4core.color("#845EC2"),
        //     am4core.color("#D65DB1"),
        //     am4core.color("#FF6F91"),
        //     am4core.color("#FF9671"),
        //     am4core.color("#FFC75F"),
        //     am4core.color("#F9F871"),
        //     am4core.color("#F45EC2"),
        //   ];

        topSevenChart.exporting.menu = new am4core.ExportMenu();
        topSevenChart.exporting.filePrefix = "crop_area";

        const subtitle = topSevenChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = topSevenChart.titles.create();
        title.text = `Crop area (major field crops)`;
        title.fontSize = 18;
        title.marginBottom = 10;

        let xAxis = topSevenChart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'YEAR'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;

        let yAxis = topSevenChart.yAxes.push(new am4charts.ValueAxis());
        yAxis.title.text = "Area (000 Ha)";
        yAxis.min = 0;

        function createSeries(value, name) {
            let series = topSevenChart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'YEAR'
            series.name = titleCase(name);
            series.columns.template.fill = am4core.color(columnColors[name]);
            series.columns.template.stroke = am4core.color(columnColors[name]);
            series.data = topSevenChart.data;
            series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]"

            series.events.on("hidden", arrangeColumns);
            series.events.on("shown", arrangeColumns);

            let bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            bullet.label.fill = am4core.color('#ffffff')

            return series;
        }

        topSevenChart.data = data;
        const keys = Array.from(new Set(data.map(ele => Object.keys(ele).join('\t'))
            .join('\t').split('\t'))).filter(ele => ele !== 'YEAR');
        keys.forEach(element => {
            createSeries(element, element.replace(' AREA', ''));
        });

        function arrangeColumns() {

            let series = topSevenChart.series.getIndex(0);

            let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
            if (series.dataItems.length > 1) {
                let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
                let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
                let delta = ((x1 - x0) / topSevenChart.series.length) * w;
                if (am4core.isNumber(delta)) {
                    let middle = topSevenChart.series.length / 2;

                    let newIndex = 0;
                    topSevenChart.series.each(function (series) {
                        if (!series.isHidden && !series.isHiding) {
                            series.dummyData = newIndex;
                            newIndex++;
                        }
                        else {
                            series.dummyData = topSevenChart.series.indexOf(series);
                        }
                    })
                    let visibleCount = newIndex;
                    let newMiddle = visibleCount / 2;

                    topSevenChart.series.each(function (series) {
                        let trueIndex = topSevenChart.series.indexOf(series);
                        let newIndex = series.dummyData;

                        let dx = (newIndex - trueIndex + middle - newMiddle) * delta

                        series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                        series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                    })
                }
            }
        }

        const apkeys = Object.keys(topSevenChart.data[0]);
        apkeys.unshift('UNITS');
        apkeys.unshift('DISTRICT');
        apkeys.unshift('STATE');

        topSevenChart.data.forEach(ele => {
            ele.DISTRICT = $('#district option:selected').text();
            ele.STATE = $('#states option:selected').text();
            ele.UNITS = yAxis.title.text;
        });
        topSevenChart.data = topSevenChart.data.map(cData => {
            const allKeys = apkeys.map(key => {
                const obj = {}
                obj[key] = cData[key]
                return obj;
            });
            return Object.assign({}, ...allKeys);
        });

        topSevenChart.logo.disabled = true;
        topSevenChart.exporting.getFormatOptions("pdfdata").pageOrientation = 'landscape';

    }); // end am4core.ready()
}

const disposeAreaProductionCharts = () => {
    try {
        if (areaChart && areaChart.dispose) {
            areaChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Area Chart');
    }
    try {
        if (prodChart && prodChart.dispose) {
            prodChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Production Chart');
    }
    try {
        if (topFiveChart && topFiveChart.dispose) {
            topFiveChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose To Five Crop Chart');
    }
    try {
        if (topSevenChart && topSevenChart.dispose) {
            topSevenChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose To Five Crop Chart');
    }
};

