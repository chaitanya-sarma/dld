let populationData = {};
let populationChart = null;
let populationResponseData = null;
const generatePopulationChart = (district) => {
    disposePopulationChart();
    if (populationResponseData) {
        setTimeout(() => generatePopulationData(populationResponseData, district));
    } else {
        get('unapportioned/population').then(response => {
            if (response) {
                populationResponseData = JSON.parse(response);
                generatePopulationData(populationResponseData, district);
            }
        });
    }
}

const generatePopulationData = (response, district) => {
    $('#population-spinner').hide();
    populationData = response;
    const headers = populationData.headers.map(data => data.header);
    const maxYear = Math.max(...populationData.years.map(data => parseInt(data))).toString();
    $('.censas').text(`(${maxYear})`);
    const dataPolulation = [];
    populationData.data.forEach(elements => {
        const result = {};
        elements.forEach((data, index) => {
            result[headers[index]] = data;
        });
        dataPolulation.push(result)
    });
    const distData = dataPolulation.filter(data => data['Dist Code'] === district);
    const chartData = populationData.years.map(data => {
        const resut = distData.find(fData => fData['Year'] === data);
        if (resut) {
            const output = { 'year': data };
            if (resut['TOTAL RURAL POPULATION'] && parseInt(resut['TOTAL RURAL POPULATION']) >= 0) {
                output['rural'] = resut['TOTAL RURAL POPULATION'];
            }
            if (resut['TOTAL URBAN POPULATION'] && parseInt(resut['TOTAL URBAN POPULATION']) >= 0) {
                output['urban'] = resut['TOTAL URBAN POPULATION']
            }
            return output;
        } else {
            return null;
        }
    }).filter(data => data && (data.urban || data.rural));
    chartData.forEach(data => {
        if (data.rural) {
            data.rural = parseFloat(data.rural).toFixed(1);
        }
        if (data.urban) {
            data.urban = parseFloat(data.urban).toFixed(1);
        }
    });
    const maxYearData = distData.find(data => data.Year === maxYear);
    if (maxYearData) {
        const tot = maxYearData['TOTAL POPULATION'];
        $('#rural-population').text(`${parseFloat(tot).toFixed(1)} (000 Number)`);
    }
    if (chartData && chartData.length) {
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            populationChart = am4core.create("rural", am4charts.XYChart);

            // Add data
            populationChart.data = chartData;

            // Create axes
            let categoryAxis = populationChart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.title.text = "";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 20;
            categoryAxis.renderer.cellStartLocation = 0.1;
            categoryAxis.renderer.cellEndLocation = 0.9;

            const subtitle = populationChart.titles.create();
            subtitle.text = `(${waterMarkText()})`;
            subtitle.fontSize = 15;
            subtitle.marginBottom = 10;

            const title = populationChart.titles.create();
            title.text = 'Rural and urban population (census data)';
            title.fontSize = 18;
            title.marginBottom = 10;

            let valueAxis = populationChart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.extraMax = 0.1;
            valueAxis.title.text = "Population (000 numbers)";

            // Create series
            function createSeries(field, name, stacked) {
                let series = populationChart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = field;
                series.dataFields.categoryX = "year";
                series.name = name;
                series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
                series.stacked = stacked;
                series.columns.template.width = am4core.percent(60);
                let labelBullet = series.bullets.push(new am4charts.LabelBullet());
                labelBullet.label.verticalCenter = "bottom";
                labelBullet.label.dy = -10;
                labelBullet.label.text = "[bold]{valueY}";
            }

            createSeries("rural", "Rural", false);
            createSeries("urban", "Urban", false);
            populationChart.data.forEach(ele => {
                ele.district = $('#district option:selected').text();
                ele.state = $('#states option:selected').text();
                ele.units = valueAxis.title.text;
            });

            // Add legend
            populationChart.legend = new am4charts.Legend();

            // Export
            populationChart.exporting.menu = new am4core.ExportMenu();
            populationChart.exporting.filePrefix = "population";

            populationChart.logo.disabled = true;
            populationChart.exporting.dataFields = {
                "state": "STATE",
                "district": "DISTRICT",
                "units": "UNITS",
                "year": "YEAR",
                "rural": "RURAL",
                "urban": "URBAN",
            }
        }); // end am4core.ready()
    } else {
        const html = `
            <h2 class="text-center mt-1">Rural and urban population (census data)</h2>
            <h2 class="w-100 text-center mt-12">No Data Found for Chart<h2>
        `;
        $('#rural').html(html);
    }

}

const disposePopulationChart = () => {
    try {
        if (populationChart && populationChart.dispose) {
            populationChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Population Chart');
    }
}
