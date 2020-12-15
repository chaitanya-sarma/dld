let liveStockData = {};
let liveStockChart = null;
let liveStockResponseData = null;
generateLiveStockChart = (district) => {
    disposeLiveStockChart();
    if (liveStockResponseData) {
        setTimeout(() => getLiveStockData(district, liveStockResponseData));
    } else {
        get('unapportioned/livestock').then(response => {
            if (response) {
                liveStockResponseData = JSON.parse(response);
                getLiveStockData(district, liveStockResponseData);
            }
        });
    }
}
getLiveStockData = (district, response) => {
    $('#live-stock-spinner').hide();
    liveStockData = response;
    const headers = liveStockData.headers.map(data => data.header);
    const dataPolulation = [];
    const maxYear = Math.max(...liveStockData.years.map(data => parseInt(data))).toString();
    liveStockData.data.forEach(elements => {
        const result = {};
        elements.forEach((data, index) => {
            result[headers[index]] = data;
        });
        dataPolulation.push(result)
    });
    const distData = dataPolulation.find(data => data['Dist Code'] === district && data['Year'] === maxYear);
    const chartData = [];
    if (distData) {
        chartData.push({ 'animal': 'Cattle', value: distData['CATTLE TOTAL'] });
        chartData.push({ 'animal': 'Buffalo', value: distData['BUFFALO TOTAL'] });
        chartData.push({ 'animal': 'Sheep', value: distData['SHEEP TOTAL'] });
        chartData.push({ 'animal': 'Goats', value: distData['GOATS TOTAL'] });
    }

    if (chartData && chartData.length) {
        // livestock
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            liveStockChart = am4core.create("livestock", am4charts.XYChart);

            // Add data
            liveStockChart.data = chartData

            // Create axes
            let categoryAxis = liveStockChart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "animal";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;

            let valueAxis = liveStockChart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "000 Number";
            valueAxis.min = 0;

            // Create series
            let series = liveStockChart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "value";
            series.dataFields.categoryX = "animal";
            series.name = "value";
            series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
            series.columns.template.fillOpacity = .8;
            series.columns.template.width = am4core.percent(40);

            let columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;

            const subtitle = liveStockChart.titles.create();
            subtitle.text = `(${waterMarkText()})`;
            subtitle.fontSize = 15;
            subtitle.marginBottom = 10;

            const title = liveStockChart.titles.create();
            title.text = 'Large and small ruminant population: 2012 census';
            title.fontSize = 18;
            title.marginBottom = 10;

            liveStockChart.data.forEach(ele => {
                ele.district = $('#district option:selected').text();
                ele.state = $('#states option:selected').text();
                ele.units = valueAxis.title.text;
            });
            // Export
            liveStockChart.exporting.menu = new am4core.ExportMenu();
            liveStockChart.exporting.filePrefix = "livestock";
            liveStockChart.logo.disabled = true;
            liveStockChart.exporting.dataFields = {
                "state": "STATE",
                "district": "DISTRICT",
                "units": "UNITS",
                "animal": "ANIMAL",
                "value": "VALUE",
              }
        }); // end am4core.ready()
    } else {
        const html = `
            <h2 class="text-center mt-1">Large and small ruminant population: 2012 census</h2>
            <h2 class="w-100 text-center mt-12">No Data Found for Chart<h2>
        `;
        $('#livestock').html(html);
    }
}

const disposeLiveStockChart = () => {
    try {
        if (liveStockChart && liveStockChart.dispose) {
            liveStockChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Live Stock Chart');
    }
}
