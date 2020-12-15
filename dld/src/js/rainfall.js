let annualrainfallChart = null;
let monthlyrainfallChart = null;
let annualChartData = [];
let monthlyChartData = [];
let annualYearChartData = [];
let rainFallResponseData = null;
const getRainFallData = (district) => {
    disposeRainFallChart();
    if (rainFallResponseData) {
        setTimeout(() => generateRainFallData(district, rainFallResponseData));
    } else {
        Promise.all([get('unapportioned/normal-rainfall'), get('unapportioned/monthly-rainfall')])
            .then(response => {
                if (response) {
                    rainFallResponseData = [];
                    if (response[0]) {
                        rainFallResponseData.push(JSON.parse(response[0]));
                    }
                    if (response[1]) {
                        rainFallResponseData.push(JSON.parse(response[1]));
                    }
                    generateRainFallData(district, rainFallResponseData);
                }
            });
    }
}

const generateRainFallData = (district, response) => {
    $('#rainfall-spinner').hide();
    if (response) {
        annualChartData = generateAnualRainFallChart(response[0], district);
        monthlyChartData = generateMonthlyRainFallChart(response[1], district);
        let selectHtml = '';
        JSON.parse(JSON.stringify(monthlyChartData.years)).reverse().forEach(data => selectHtml += `<option value="${data}">${data}</option>\n`);
        $('#monthlyRainFall-select').html(selectHtml);
        const annualRainData = monthlyChartData.yearWiseData.map(data => {
            return { 'year': data.year, 'value': data.data[12].value }
        });
        const yearsOrder = monthlyChartData.years;
        yearsOrder.sort((d1, d2) => parseInt(d1) - parseInt(d2));
        annualYearChartData = yearsOrder.map(data => annualRainData.find(fData => fData.year === data));
        const annualValue = annualChartData.find(data => data.month === 'ANNUAL').value;
        annualYearChartData.forEach(data => data['annual'] = annualValue);
        if (annualYearChartData.some(data => data && data.value)) {
            annualChart(annualYearChartData);
        } else {
            const html = `
                <h2 class="text-center mt-1">Annual Rainfall</h2>
                <h2 class="w-100 text-center mt-12">No Data Found for Chart<h2>
            `;
            $('#annualrainfall').html(html)
        }
        $("#monthlyRainFall-select").trigger("change");
    }
}


const generateAnualRainFallChart = (response, district) => {
    const anualRainfallData = response;
    const considerHeader = [];
    anualRainfallData.items.forEach(data => {
        anualRainfallData.elements.forEach(ele => {
            considerHeader.push(`${data} ${ele}`);
        });
    });
    const headers = anualRainfallData.headers.map(data => data.header);
    const indexs = considerHeader.map(data => headers.indexOf(data)).filter(data => data > 0);
    const chartFilterData = anualRainfallData.data.filter(data => data[0] === district);
    const indexData = indexs.map((data, index) => {
        const monthVal = chartFilterData && chartFilterData.length > 0 ? chartFilterData[0][data] : 0;
        return { 'month': anualRainfallData.items[index], 'value': monthVal };
    });
    return indexData;
}

const generateMonthlyRainFallChart = (response, district) => {
    const monthlyRainfallData = response;
    const considerHeader = [];
    monthlyRainfallData.items.forEach(data => {
        monthlyRainfallData.elements.forEach(ele => {
            considerHeader.push(`${data} ${ele}`);
        });
    });
    const headers = monthlyRainfallData.headers.map(data => data.header);
    const indexs = considerHeader.map(data => headers.indexOf(data)).filter(data => data > 0);
    const chartFilterData = monthlyRainfallData.data.filter(data => data[0] === district);
    const yearWiseData = monthlyRainfallData.years.map(data => {
        const yearData = chartFilterData.filter(fData => fData[1] === data);
        const indexData = indexs.map((idata, index) => {
            return { 'month': monthlyRainfallData.items[index], 'value': yearData[0] ? yearData[0][idata] : '' };
        });
        return { 'year': data, 'data': indexData };
    })
    return { 'yearWiseData': yearWiseData, 'years': monthlyRainfallData.years };

}

const annualChart = (chartData) => {
    // annualrainfall
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        annualrainfallChart = am4core.create("annualrainfall", am4charts.XYChart);

        // Export
        annualrainfallChart.exporting.menu = new am4core.ExportMenu();
        annualrainfallChart.exporting.filePrefix = "annual_rainfall";

        // Data for both series
        let data = chartData

        /* Create axes */
        let categoryAxis = annualrainfallChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.labels.template.rotation = -90;

        const subtitle = annualrainfallChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = annualrainfallChart.titles.create();
        title.text = 'Annual Rainfall';
        title.fontSize = 18;
        title.marginBottom = 10;

        /* Create value axis */
        let valueAxis = annualrainfallChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Millimeters";
        valueAxis.renderer.minLabelPosition = 0.01;

        /* Create series */
        let columnSeries = annualrainfallChart.series.push(new am4charts.ColumnSeries());
        columnSeries.name = "Actual";
        columnSeries.dataFields.valueY = "value";
        columnSeries.dataFields.categoryX = "year";

        columnSeries.columns.template.tooltipText = "[#fff font-size: 15px] Actual Annual Rainfall in {categoryX}:\n[/][#fff font-size: 20px]{valueY} (Millimeters)[/] [#fff]{additional}[/]"
        columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
        columnSeries.columns.template.propertyFields.stroke = "stroke";
        columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
        columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
        columnSeries.tooltip.label.textAlign = "middle";

        if (chartData.some(data => data.annual > 0)) {
            let lineSeries = annualrainfallChart.series.push(new am4charts.LineSeries());
            lineSeries.name = "Normal";
            lineSeries.dataFields.valueY = "annual";
            lineSeries.dataFields.categoryX = "year";

            lineSeries.stroke = am4core.color("#fdd400");
            lineSeries.strokeWidth = 3;
            lineSeries.propertyFields.strokeDasharray = "lineDash";
            lineSeries.tooltip.label.textAlign = "middle";

            let bullet = lineSeries.bullets.push(new am4charts.Bullet());
            bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
            bullet.tooltipText = "[#fff font-size: 15px]Normal Annual Rainfall in {categoryX}:\n[/][#fff font-size: 20px]{valueY} (Millimeters)[/] [#fff]{additional}[/]"
            let circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.fill = am4core.color("#fff");
            circle.strokeWidth = 3;
        }

        data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = valueAxis.title.text;
        });

        annualrainfallChart.data = data;
        annualrainfallChart.legend = new am4charts.Legend();

        annualrainfallChart.exporting.dataFields = {
            "state": "STATE",
            "district": "DISTRICT",
            "units": "UNITS",
            "year": "YEAR",
            "value": "ACTUAL",
            "annual": "NORMAL"
          }

        annualrainfallChart.logo.disabled = true;

    }); // end am4core.ready()

}

const monthlyChart = (chartData) => {
    // normalrainfall
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        monthlyrainfallChart = am4core.create("normalrainfall", am4charts.XYChart);

        // Export
        monthlyrainfallChart.exporting.menu = new am4core.ExportMenu();
        monthlyrainfallChart.exporting.filePrefix = "monthly_rainfall";

        // Data for both series
        let data = chartData

        /* Create axes */
        let categoryAxis = monthlyrainfallChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "month";
        categoryAxis.renderer.minGridDistance = 1;
        categoryAxis.renderer.labels.template.rotation = -90;

        const subtitle = monthlyrainfallChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = monthlyrainfallChart.titles.create();
        title.text = 'Monthly Rainfall';
        title.fontSize = 18;
        title.marginBottom = 10;

        /* Create value axis */
        let valueAxis = monthlyrainfallChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Millimeters";
        valueAxis.renderer.minLabelPosition = 0.01;

        /* Create series */
        let columnSeries = monthlyrainfallChart.series.push(new am4charts.ColumnSeries());
        columnSeries.name = "Actual";
        columnSeries.dataFields.valueY = "value";
        columnSeries.dataFields.categoryX = "month";

        columnSeries.columns.template.tooltipText = "[#fff font-size: 15px] Actual Monthly Rainfall in {categoryX}:\n[/][#fff font-size: 20px]{valueY} (Millimeters)[/] [#fff]{additional}[/]"
        columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
        columnSeries.columns.template.propertyFields.stroke = "stroke";
        columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
        columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
        columnSeries.tooltip.label.textAlign = "middle";

        if (chartData.some(data => data.annual > 0)) {
            let lineSeries = monthlyrainfallChart.series.push(new am4charts.LineSeries());
            lineSeries.name = "Normal";
            lineSeries.dataFields.valueY = "annual";
            lineSeries.dataFields.categoryX = "month";

            lineSeries.stroke = am4core.color("#fdd400");
            lineSeries.strokeWidth = 3;
            lineSeries.propertyFields.strokeDasharray = "lineDash";
            lineSeries.tooltip.label.textAlign = "middle";

            let bullet = lineSeries.bullets.push(new am4charts.Bullet());
            bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
            bullet.tooltipText = "[#fff font-size: 15px]Normal Monthly Rainfall in {categoryX}:\n[/][#fff font-size: 20px]{valueY} (Millimeters)[/] [#fff]{additional}[/]"
            let circle = bullet.createChild(am4core.Circle);
            circle.radius = 4;
            circle.fill = am4core.color("#fff");
            circle.strokeWidth = 3;
        }

        data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = valueAxis.title.text;
            ele.year = $('#monthlyRainFall-select').val();
        });

        
        monthlyrainfallChart.data = data;
        monthlyrainfallChart.legend = new am4charts.Legend();
        monthlyrainfallChart.logo.disabled = true;
        monthlyrainfallChart.exporting.dataFields = {
            "state": "STATE",
            "district": "DISTRICT",
            "units": "UNITS",
            "year": "YEAR",
            "month": "MONTH",
            "value": "ACTUAL",
            "annual": "NORMAL"
          }


    }); // end am4core.ready()
}

var selectList = $('#monthlyRainFall-select option');
selectList.sort(function (a, b) {
    a = a.value;
    b = b.value;
    return a - b;
});

console.log(selectList);

$('#monthlyRainFall-select').html(selectList);

$('#monthlyRainFall-select').on('change', () => {
    const year = $('#monthlyRainFall-select').val();
    const chartMonthData = monthlyChartData.yearWiseData.filter(data => data.year === year);
    const annualMonthData = JSON.parse(JSON.stringify(annualChartData));
    chartMonthData[0].data.pop();
    const chartData = chartMonthData[0].data;
    chartData.forEach(data => {
        const annualMonth = annualMonthData.find(fData => data.month === fData.month);
        if (annualMonth) {
            data['annual'] = annualMonth.value;
        }
    });
    if (chartData.some(data => data && data.value)) {
        monthlyChart(chartData);
    } else {
        const html = `
            <h2 class="text-center mt-1">Monthly Rainfall</h2>
            <h2 class="w-100 text-center mt-12">No Data Found for Chart<h2>
        `;
        $('#normalrainfall').html(html);
    }

});


const disposeRainFallChart = () => {
    $('#monthlyRainFall-select').html('');
    try {
        if (annualrainfallChart && annualrainfallChart.dispose) {
            annualrainfallChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Annual Rainfall Chart');
    }
    try {
        if (monthlyrainfallChart && monthlyrainfallChart.dispose) {
            monthlyrainfallChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Monthly Rainfall Chart');
    }
}


