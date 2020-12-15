let nutritionAndHealthResponse = null;
let anemicChart = null;
let childrenHealthChart = null;
let bmiHealthChart = null;

const getNutritionAndData = async (district) => {
    disposeHealthChart();
    if (!nutritionAndHealthResponse) {
        get('other/nutrition').then(response => {
            if (response) {
                nutritionAndHealthResponse = JSON.parse(response);
                generateNutritionAndHealthChart(nutritionAndHealthResponse, district);
            }
        });
    } else {
        generateNutritionAndHealthChart(nutritionAndHealthResponse, district);
    }
}

generateNutritionAndHealthChart = async (response, district) => {
    const headers = response.headers.map(data => data.header);
    const nutriAndHealthJsonData = [];
    response.data.forEach(elements => {
        const result = {};
        elements.forEach((data, index) => {
            result[headers[index]] = data;
        });
        nutriAndHealthJsonData.push(result)
    });
    const districtData = nutriAndHealthJsonData.find(data => data['Dist Code'] === district);
    if (districtData) {
        const anaemicChartData = [];
        const animicWomen = districtData['WOMEN ANAEMIC 15-49 YEARS'];
        const nonAnimicWomen = (100 - parseFloat(animicWomen));
        anaemicChartData.push({ 'label': 'Anaemic', 'value': animicWomen });
        anaemicChartData.push({ 'label': 'Non - Anaemic', 'value': nonAnimicWomen });

        const childrenHealthChartData = [
            { 'category': 'Children', 'stunted': districtData['CHILDREN UNDER 5-YRS STUNTED'], 'type': 'Stunted', 'value':  districtData['CHILDREN UNDER 5-YRS STUNTED']},
            { 'category': 'Children', 'wasting': districtData['CHILDREN UNDER 5-YRS WASTING'], 'type': 'Wasting', 'value': districtData['CHILDREN UNDER 5-YRS WASTING']},
        ];
        const bmiChartData = [
            { 'category': 'Men', 'overWeight': districtData['MEN BMI OVERWEIGHT'], 'type': 'Over Weight Men', 'value': districtData['MEN BMI OVERWEIGHT'] },
            { 'category': 'Men', 'underWeight': districtData['MEN BMI BELOW NORMAL'], 'type': 'Under Weight Men', 'value': districtData['MEN BMI BELOW NORMAL'] },
            { 'category': 'Women', 'overWeight': districtData['WOMEN BMI OVERWEIGHT'], 'type': 'Over Weight Women', 'value': districtData['WOMEN BMI OVERWEIGHT'], },
            { 'category': 'Women', 'underWeight': districtData['WOMEN BMI BELOW NORMAL'], 'type': 'Under Weight Women', 'value': districtData['WOMEN BMI BELOW NORMAL'] },
        ];

        generatechildrenHealthChart(childrenHealthChartData);
        generateAnemicPieChart(anaemicChartData);
        generateBMIHealthChart(bmiChartData);
    } else {
        const html = `<h2 class="w-100 text-center mt-12">No Data Found for Chart<h2>`;
        $('#nutrition1').html(`<h2 class="text-center mt-1">Nutritional status of children</h2>  ${html}`);
        $('#nutrition2').html(`<h2 class="text-center mt-1">Anaemia status of women</h2>  ${html}`);
        $('#nutrition3').html(`<h2 class="text-center mt-1">Health status of adults (based on BMI)</h2>  ${html}`);
    }
    $('#nutrition-health-spinner').hide();
}




const generatechildrenHealthChart = async (chartData) => {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        childrenHealthChart = am4core.create("nutrition1", am4charts.XYChart);

        // Add data
        childrenHealthChart.data = chartData;

        // Create axes
        var categoryAxis = childrenHealthChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.title.text = "";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;

        var valueAxis = childrenHealthChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.title.text = "Stunted / Wasting (%)";

        const subtitle = childrenHealthChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = childrenHealthChart.titles.create();
        title.text = 'Nutritional status of children';
        title.fontSize = 18;
        title.marginBottom = 10;

        // Create series
        function createSeries(field, name, stacked) {
            var series = childrenHealthChart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "category";
            series.name = name;
            series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
            series.stacked = stacked;
            series.columns.template.width = am4core.percent(40);
        }

        createSeries("stunted", "Stunted", false);
        createSeries("wasting", "Wasting", false);

        childrenHealthChart.data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = valueAxis.title.text;
        });

        // Add legend
        childrenHealthChart.legend = new am4charts.Legend();
        childrenHealthChart.exporting.menu = new am4core.ExportMenu();
        childrenHealthChart.exporting.filePrefix = "children_nutrition";
        childrenHealthChart.exporting.dataFields = {
            "state": "STATE",
            "district": "DISTRICT",
            "units": "UNITS",
            "type": "CHILDERN",
            "value": "VALUE",
          }
    }); // end am4core.ready()
}


const generateAnemicPieChart = async (chartData) => {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        anemicChart = am4core.create("nutrition2", am4charts.PieChart);

        // Add data
        anemicChart.data = chartData

        // Add and configure Series
        let pieSeries = anemicChart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "label";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.slices.template.tooltipText = '{category}: [bold]{value}%';

        const subtitle = anemicChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = anemicChart.titles.create();
        title.text = `Anaemia status of women`;
        title.fontSize = 18;
        title.marginBottom = 10;
        

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        pieSeries.hiddenState.properties.fontSize = 10;

        anemicChart.data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = "%";
        });

        // Export
        anemicChart.exporting.menu = new am4core.ExportMenu();
        anemicChart.exporting.filePrefix = "women_anemic_status";
        anemicChart.logo.disabled = true;

        anemicChart.exporting.dataFields = {
            "state": "STATE",
            "district": "DISTRICT",
            "units": "UNITS",
            "label": "WOMEN",
            "value": "VALUE",
          }
    }); // end am4core.ready()
}

const generateBMIHealthChart = async (chartData) => {
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        bmiHealthChart = am4core.create("nutrition3", am4charts.XYChart);

        // Add data
        bmiHealthChart.data = chartData;

        const subtitle = bmiHealthChart.titles.create();
        subtitle.text = `(${waterMarkText()})`;
        subtitle.fontSize = 15;
        subtitle.marginBottom = 10;

        const title = bmiHealthChart.titles.create();
        title.text = `Health status of adults (based on BMI)`;
        title.fontSize = 18;
        title.marginBottom = 10;

        // Create axes
        var categoryAxis = bmiHealthChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.title.text = "";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;

        var valueAxis = bmiHealthChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.title.text = "Men / Women (%)";

        // Create series
        function createSeries(field, name, stacked) {
            var series = bmiHealthChart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "category";
            series.name = name;
            series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
            series.stacked = stacked;
            series.columns.template.width = am4core.percent(40);
        }

        createSeries("overWeight", "Over Weight", false);
        createSeries("underWeight", "Under Weight", false);

        bmiHealthChart.data.forEach(ele => {
            ele.district = $('#district option:selected').text();
            ele.state = $('#states option:selected').text();
            ele.units = valueAxis.title.text;
        });

        // Add legend
        bmiHealthChart.legend = new am4charts.Legend();
        bmiHealthChart.exporting.menu = new am4core.ExportMenu();
        bmiHealthChart.exporting.filePrefix = "adult_health_bmi";
        bmiHealthChart.logo.disabled = true;

        bmiHealthChart.exporting.dataFields = {
            "state": "STATE",
            "district": "DISTRICT",
            "units": "UNITS",
            "type": "BMI",
            "value": "VALUE",
          }

    }); // end am4core.ready()
}

const disposeHealthChart = async () => {
    try {
        if (childrenHealthChart && childrenHealthChart.dispose) {
            childrenHealthChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose GDP PIE Chart');
    }
    try {
        if (anemicChart && anemicChart.dispose) {
            anemicChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose Childern Chart');
    }
    try {
        if (bmiHealthChart && bmiHealthChart.dispose) {
            bmiHealthChart.dispose();
        }
    } catch (e) {
        console.warn('Unable to dispose BMI Chart');
    }
}