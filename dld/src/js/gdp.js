let gdpData = null;
let gdpPieChart = null;
let gdpLineChart = null;

const getGdpChartAndData = (district) => {
    disposeGdpChart();
    if (gdpData) {
        setTimeout(() => getGdpChart(district));
    } else {
        get('unapportioned/gdp').then(response => {
            if (response) {
                gdpData = JSON.parse(response);
                getGdpChart(district);
            }
        });
    }

}

const getGdpChart = (district) => {
    $('#gdp-spinner').hide();
    const headers = gdpData.headers.map(data => data.header);
    const gdpJsonData = [];
    const maxYear = Math.max(...gdpData.years.map(data => parseInt(data))).toString();
    const maxYearTitle = gdpData.years.find(data => parseInt(data).toString() === maxYear);
    gdpData.data.forEach(elements => {
        const result = {};
        elements.forEach((data, index) => {
            result[headers[index]] = data;
        });
        gdpJsonData.push(result)
    });
    const districtData = gdpJsonData.filter(data => data['Dist Code'] === district);
    const primary = districtData.filter(data => parseInt(data['Year']).toString() === maxYear).map(data => data['PRIMARY SECTOR CURRENT PRICES']).reduce((d1, d2) => parseInt(d1) + parseInt(d2), 0);
    const secondary = districtData.filter(data => parseInt(data['Year']).toString() === maxYear).map(data => data['SECONDARY SECTOR CURRENT PRICES']).reduce((d1, d2) => parseInt(d1) + parseInt(d2), 0);
    const tertiary = districtData.filter(data => parseInt(data['Year']).toString() === maxYear).map(data => data['TERTIARY SECTOR CURRENT PRICES']).reduce((d1, d2) => parseInt(d1) + parseInt(d2), 0);
    const pieChartData = [];
    pieChartData.push({ 'sector': 'Primary', 'value': primary });
    pieChartData.push({ 'sector': 'Secondary', 'value': secondary });
    pieChartData.push({ 'sector': 'Tertiary', 'value': tertiary });
    const gdpSectorData = districtData.map(data => {
        const primaryValue = parseFloat(data['PRIMARY SECTOR CURRENT PRICES']);
        const secondaryValue = parseFloat(data['SECONDARY SECTOR CURRENT PRICES']);
        const tertiaryValue = parseFloat(data['TERTIARY SECTOR CURRENT PRICES']);
        const total = primaryValue + secondaryValue + tertiaryValue;
        const percentage = (primaryValue / total) * 100;
        return { 'year': data['Year'], 'value': Number(percentage.toFixed(1)) };
    });
    if (pieChartData && pieChartData.some(data => data && data.value)) {
        generateGdpPieChart(pieChartData, maxYearTitle);
    } else  {
        const html = `
        <h2 class="text-center mt-1">Sector wise share of GDP: ${maxYearTitle.replace('(2004)', '')}</h2>
        <h2 class="w-100 text-center  mt-12">No Data Found for Chart<h2>`;

        $('#GDP2').html(html);
    }
    if (gdpSectorData && gdpSectorData.length) {
        generateLineChart(gdpSectorData);
    } else {
        const html = `
        <h2 class="text-center mt-1">Share of Agriculture in GDP</h2>
        <h2 class="w-100 text-center  mt-12">No Data Found for Chart<h2>`;
        $('#GDP1').html(html);
    }

}

const generateGdpPieChart = (chartData, maxYear) => {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        gdpPieChart = am4core.create("GDP2", am4charts.PieChart);

        // Add data
        gdpPieChart.data = chartData

        // Add and configure Series
        let pieSeries = gdpPieChart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "sector";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        // Disable ticks and labels
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;

        const subtitle = gdpPieChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;
        
        const title = gdpPieChart.titles.create();
        title.text = `Sector wise share of GDP: ${maxYear.replace('(2004)', '')}`;
        title.fontSize = 18;
        title.marginBottom = 10;

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        pieSeries.hiddenState.properties.fontSize = 10;

        gdpPieChart.legend = new am4charts.Legend();
        gdpPieChart.legend.labels.template.wrap = true;

        // Export
        gdpPieChart.data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = "Millions in Rs";
        });
        gdpPieChart.exporting.menu = new am4core.ExportMenu();
        gdpPieChart.exporting.filePrefix = "sector_wise_GDP";
        gdpPieChart.logo.disabled = true;
        gdpPieChart.exporting.dataFields = {
            "state": "STATE",
            "district": "DISTRICT",
            "units": "UNITS",
            "sector": "SECTOR",
            "value": "VALUE",
        }

    }); // end am4core.ready()
}

const generateLineChart = (chartData) => {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        gdpLineChart = am4core.create("GDP1", am4charts.XYChart);

        // Add data
        gdpLineChart.data = chartData;

        // Create category axis
        let categoryAxis = gdpLineChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";

        // Create value axis
        let valueAxis = gdpLineChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Percentage";
        valueAxis.min = 0;

        // Create series
        let series1 = gdpLineChart.series.push(new am4charts.LineSeries());
        series1.dataFields.valueY = "value";
        series1.dataFields.categoryX = "year";
        series1.name = "Primary (2004 constant prices)";
        series1.strokeWidth = 3;
        series1.bullets.push(new am4charts.CircleBullet());
        series1.tooltipText = "{categoryX}: {valueY}%";
        series1.legendSettings.valueText = "{valueY}";
        series1.visible = false;

        const subtitle = gdpLineChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;
        
        const title = gdpLineChart.titles.create();
        title.text = `Share of Agriculture in GDP`;
        title.fontSize = 18;
        title.marginBottom = 10;


        // Add chart cursor
        gdpLineChart.cursor = new am4charts.XYCursor();
        gdpLineChart.cursor.behavior = "zoomY";

        // Add legend
        gdpLineChart.data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = "Primary sector% of agri GDP";
        });
        gdpLineChart.legend = new am4charts.Legend();
        gdpLineChart.legend.maxWidth = 300;
        // Export
        gdpLineChart.exporting.menu = new am4core.ExportMenu();
        gdpLineChart.exporting.filePrefix = "agriculture_share_GDP";
        let watermark = new am4core.Label();
        gdpLineChart.logo.disabled = true;
        gdpLineChart.exporting.dataFields = {
            "state": "STATE",
            "district": "DISTRICT",
            "units": "UNITS",
            "year": "YEAR",
            "value": "VALUE",
        }


    }); // end am4core.ready()
}

const disposeGdpChart = () => {
    try {
        if (gdpPieChart && gdpPieChart.dispose) {
            gdpPieChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose GDP PIE Chart');
    }
    try {
        if (gdpLineChart && gdpLineChart.dispose) {
            gdpLineChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose GDP PIE Chart');
    }
}