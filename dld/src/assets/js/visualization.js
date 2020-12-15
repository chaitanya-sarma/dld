// Create a variable to hold ionRangeSlider instance
var responseFromAPI = null,
    locationsData = null,
    containsString = false, isLoading = 0, chart = null;
const selectedRow = sessionStorage.getItem('visual') ? JSON.parse(atob(sessionStorage.getItem('visual'))) : null;

let listOfYear = [];
// In your Javascript (external .js resource or <script> tag)
$(document).ready(function () {
    // Initialise fSelect instances
    if (selectedRow) {
        sessionStorage.removeItem('visual')
    }
    $('.states, .dists, .subcategory, .elements, .items').fSelect({
        placeholder: 'Select some options',
        numDisplayed: 10,
        overflowText: '{n} selected',
        noResultsText: 'No results found',
        searchText: 'Search',
        showSearch: true
    });


    $('.loader_body').addClass('hidden');
    if (selectedRow) {
        $('.category').val(selectedRow.category);
    } else {
        $('.category').val($('.category option').val());
    }
    $('.category').change();
});


// Handle show-data btn click
$('body').on('click', '.show-data', function (event) {
    $('.error').empty();
    $('#chartError').html('');
    $('#chartdiv').html('');
    var subcategory = $('.subcategory'),
        elements = $('.elements'),
        states = $('.states'),
        dists = $('.dists'),
        items = $('.items'),
        years = $('.year'),
        error = 0;
    if (!states.val()) {
        error++;
        states.closest('.form-group').find('.error').html('Please select atleast a state.');
    }
    if (!dists.val()) {
        error++;
        dists.closest('.form-group').find('.error').html('Please select atleast a district.');
    }
    if (!subcategory.val()) {
        error++;
        subcategory.closest('.form-group').find('.error').html('Please select a subcategory.');
    }
    if (!elements.val()) {
        error++;
        elements.closest('.form-group').find('.error').html('Please select atleast a element.');
    }
    if (!items.val()) {
        error++;
        items.closest('.form-group').find('.error').html('Please select atleast a item.');
    }

    if (error > 0) return false;

    const itemElement = `${items.val()} ${elements.val()}`;
    const itemElementIndex = responseFromAPI.headers.map(data => data.header).indexOf(itemElement);
    const searchData = responseFromAPI.data.filter(d => {
        return dists.val().includes(d[0]) && states.val().includes(d[10]) && (Number(d[1]) >= Number(years.val()) || containsString);
    });

    if (searchData && searchData.length > 0 && itemElementIndex >= 0) {
        const titleData = searchData[0];
        const title = `${itemElement}`;
        const vTitle = responseFromAPI.headers[itemElementIndex].unit;
        const chartData = searchData.map(data => {
            return { 'year': data[1], 'value': data[itemElementIndex] > 0 ? data[itemElementIndex] : null, distNo: data[0], series: `${data[11]} - ${data[13]}` };
        });
        const validYear = !chartData.map(data => String(data.year).replace(/[() ]/g, ''), []).some(isNaN);
        const validValue = !chartData.map(data => data.value).some(isNaN);

        if (validValue & validYear) {
            $('#chartdiv').css({ "height": "500px", "width": "100%" });
            const totYears = Array.from(new Set(chartData.map(data => Number(data.year)))).sort().map(data => String(data));
            const totDist = Array.from(new Set(chartData.map(data => data.distNo)));
            const seriesMap = new Map();
            chartData.forEach(data => seriesMap.set(data.distNo, data.series));
            let totSeries = totYears.map((data) => {
                const series = 'value', returnData = {};
                returnData['year'] = Number(data);
                totDist.forEach((distData, index) => {
                    const rtnVAlue = chartData.find(chtData => (chtData.year === data && chtData.distNo === distData), {});
                    returnData[seriesMap.get(distData)] = rtnVAlue ? rtnVAlue.value : null;
                });
                return returnData;
            });
            totSeries = totSeries.sort((data, nxtData) => Number(data.year) > Number(nxtData.year) ? 1 : 0);
            initChart(totSeries, title, vTitle);
        } else {
            const errMsg = 'No combination of items and elements possible. Please make another selection.'
            $('#chartError').html(errMsg)
            $('#chartdiv').css({ "height": "auto", "width": "auto" });
        }
    } else {
        const errMsg = 'No combination of items and elements possible. Please make another selection.'
        $('#chartError').html(errMsg)
        $('#chartdiv').css({ "height": "auto", "width": "auto" });
    }


});

// Handle categry and datatype change
$('body').on('change', '.category', function (event) {
    $('.subcategory').change();
    var category = $('.category').val(),
        datatype = $('.datatype:checked').val(),
        categoryName = $('.category option:selected').html();
    $('.categoryName').html(categoryName);
    $('#chartError').html('');
    $('#chartdiv').html('');

    if (category) {
        //Get sub categories data
        getSubCategories(category, datatype);
        //Get locations data
        getLocations(datatype);
    } else {
        $('.main_section').removeClass('hidden');
    }

});

// Handle select all checkbox
$('body').on('change', '.selAllState', () => {
    // Select All States
    $('.states option').prop('selected', $('.selAllState').prop('checked'));
    $('.states').fSelect("reload");
    $('.states').change();
});
$('body').on('change', '.selAllDist', () => {
    // Select All Districts
    if ($('.selAllDist').prop('checked')) {
        Array.from($('.dists option')).forEach(ele => {
            if (!$('.dists').val() || $('.dists').val().length < 5) {
                ele.selected = true;
            } else {
                if (!ele.selected) {
                    ele.disabled = true;
                }
            }
        })
    } else {
        $('.dists option').prop('selected', $('.selAllDist').prop('checked'));
        $('.dists option').prop('disabled', $('.selAllDist').prop('checked'));
    }
    $('.dists').fSelect("reload");
});
$('body').on('change', '.dists', () => {
    if (!$('.dists').val() || $('.dists').val().length < 5) {
        Array.from($('.dists option')).forEach(ele => ele.disabled = false);
    } else {
        Array.from($('.dists option')).forEach(ele => ele.disabled = !ele.selected);
    }
    $('.dists').fSelect("reload");
});
// Handle state change
$('body').on('change', '.states', function (event) {
    var elem = $(this),
        states = elem.val();
    $('.dists').empty();
    $('.dists').fSelect("reload");
    $('.dists').closest('.form-group').find('.error').empty();
    if (!states) return false;


    //Get districts data
    HTML = ``;
    let firstDist = '';
    for (stCode of states) {
        //Filter index from api state ids
        var allDists = locationsData.filter((body, index) => {
            return body.STCODE === parseInt(stCode)
        });
        allDists = allDists.sort((data, data1) => data.DISTNAME > data1.DISTNAME ? 1 : -1);
        HTML += `<optgroup label="${allDists[0].STNAME}">`;
        for (dist of allDists) {
            if (allDists.indexOf(dist) === 0 && states.indexOf(stCode) === 0){
                firstDist = dist.DIST;
            }
            HTML += `<option value="${dist.DIST}">${dist.DISTNAME}</option>`;
        }
        HTML += `</optgroup>`;
    }
    $('.dists').html(HTML);
    if (selectedRow) {
        $('.dists').val([selectedRow.dist]);
    } else {
        $('.dists').val([firstDist]);
    }
    $('.dists').fSelect("reload");


});

// Handle sub category change
$('body').on('change', '.subcategory', function (event) {
    var elem = $(this),
        subcategory = elem.val(),
        datatype = $('.datatype:checked').val();
    elem.closest('.form-group').find('.error').empty();

    var thead = `<tr><th>Dist Code</th>
<th>Year</th>
<th>State Code</th>
<th>State Name</th>
<th>Dist Name</th></tr>`,
        tbody = `<tr>
<td colspan="5">Please select all the above filters to show data.</td>
</tr>`;

    $('.items').empty().val(null);
    $('.elements').empty().val(null);
    $('.items, .elements').fSelect("reload");
    $('.items, .elements').closest('.form-group').find('.error').empty();

    if (!subcategory || subcategory.length === 0) return false;
    isLoading++;
    $('.main_section').addClass('hidden');
    $('.loader_body').removeClass('hidden');
    //Get elements, items, years
    $.ajax({
        url: 'http://data.icrisat.org/dldAPI/apportioned/' + subcategory,
        type: 'GET',
        dataType: 'JSON',
        error: function () {
            isLoading--;
            if (!this.isLoading) {
                $('.main_section').removeClass('hidden');
                $('.loader_body').addClass('hidden');
            }
            elem.closest('.form-group').find('.error').html(`No data found under this sub category. Please try different filter settings.`);
        },
        success: function (response) {
            isLoading--
            containsString = response.years.some(isNaN);

            for (yearValue of response.years) {
                if (isNaN(yearValue)) containsString = true;
            }
            if (!containsString) {
                var allYears = [];
                for (var yearValue of response.years) {
                    allYears.push(parseInt(yearValue));
                }
                allYears.sort();
                response.years = allYears;
                getYears(allYears);
            }
            responseFromAPI = response;

            var HTML = ``;
            for (var element of response.elements) {
                HTML += `<option value="${element}">${element}</option>`;
            }
            $('.elements').html(HTML);
            if (selectedRow) {
                $('.elements').val(selectedRow.elements);
            }
            $('.elements').fSelect("reload");

            HTML = ``;
            for (var item of response.items) {
                HTML += `<option value="${item}">${item}</option>`;
            }
            $('.items').html(HTML);
            if (selectedRow) {
                $('.items').val(selectedRow.items);
            }
            $('.items').fSelect("reload");
            if (!this.isLoading) {
                $('.main_section').removeClass('hidden');
                $('.loader_body').addClass('hidden');
            }
            $('#chartError').html('');
            $('#chartdiv').html('');
            if ($('.year').val() && $('.elements').val() && $('.items').val()) {
                $('.show-data').click();
            }
        }
    });
});

function getCategoryFromUrl() {
    var url = window.location.href;
    var n = url.lastIndexOf('/');
    var filename = url.substring(n + 1);
    var category = filename.split('.')[0];

    return category;
}

function getLocations(datatype) {
    locationsData = null;
    var states = $('.states');
    states.empty().val(null);
    states.fSelect("reload");
    states.trigger('change');
    states.closest('.form-group').find('.error').empty();
    isLoading++;
    $.ajax({
        url: 'http://data.icrisat.org/dldAPI/' + datatype + '/districts',
        type: 'GET',
        dataType: 'JSON',
        error: function () { isLoading--; },
        success: function (response) {
            isLoading--;
            locationsData = response;
            var HTML = ``, statesArr = [];
            let totalStates = [];
            totalStates = Array.from(new Set(locationsData.map(ele => ele.STCODE))).map(ele => locationsData.find(fele => ele === fele.STCODE));
            totalStates = totalStates.sort((data, data1) => data.STNAME > data1.STNAME ? 1 : -1);
            for (var state of totalStates) {
                statesArr.push(state.STCODE);
                HTML += `<option value="${state.STCODE}">${state.STNAME}</option>`;
            }
            states.html(HTML);
            if (selectedRow) {
                states.val([selectedRow.state]);
            } else {
                states.val([statesArr[0]]);
            }
            states.fSelect("reload");
            states.change();
            if (!isLoading) {
                $('.main_section').removeClass('hidden');
                $('.loader_body').addClass('hidden');
            }

        }
    });
}

function getSubCategories(category, dtype) {
    var subcat = $('.subcategory');
    subcat.empty().val(null);
    subcat.fSelect("reload");
    subcat.trigger('change');
    subcat.closest('.form-group').find('.error').empty();
    isLoading++;
    $.ajax({
        url: 'http://data.icrisat.org/dldAPI/subCategories/?category=' + category + '&type=apportioned',
        type: 'GET',
        dataType: 'JSON',
        error: function () { },
        success: function (response) {
            var HTML = ``;
            for (var cat of response) {
                HTML += `<option value="${cat.replace(/\s+/g, '-').toLowerCase()}">${cat}</option>`;
            }
            if (selectedRow) {
                subcat.html(HTML).val(selectedRow.subcategory);
            } else {
                subcat.html(HTML).val(response[0].replace(/\s+/g, '-').toLowerCase());
            }

            subcat.fSelect("reload");
            subcat.trigger('change');
        }
    });
}
function getYears(years) {
    const numYear = years.sort((numOne, numTwo) => Number(numOne) > Number(numTwo) ? 1 : 0);
    if (years && Array.isArray(numYear)) {
        const options = years.map(year => `<option value="${year}">${year}</option>`, []).join('\n');
        $('.year').html(options);
    }
}

function initChart(chartData, cTitle, vTitle) {
    chartData.forEach(ele => ele.year = String(ele.year));
    const colorMap = new Map();
    colorMap.set(0, '#1870BF');
    colorMap.set(1, '#49BF18');
    colorMap.set(2, '#BF1832');
    colorMap.set(3, '#B8BF18');
    colorMap.set(4, '#000000');
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_frozen);
        // Themes end

        if (chart) {
            chart.dispose();
        }

        // Create chart instance
        chart = am4core.create("chartdiv", am4charts.XYChart);

        // Add chart title
        var title = chart.titles.create();
        title.text = cTitle;
        title.fontSize = 25;
        title.marginBottom = 20;
        // Add data
        chart.data = chartData;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        valueAxis.strictMinMax = false;

        valueAxis.title.text = vTitle;
        valueAxis.title.fontWeight = "bold";

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 50;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.logarithmic = true;
        valueAxis.renderer.minGridDistance = 20;

        // Create series
        totSeries = [];
        Object.keys(chartData[0]).filter(data => !String(data).startsWith('year'), []).forEach((val, index) => {
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = val;
            series.name = val;
            series.data = chart.data;
            series.dataFields.dateX = "year";
            series.tensionX = 0.8;
            series.strokeWidth = 3;
            series.stroke = am4core.color(colorMap.get(index));;
            series.connect = false;
            series.tooltipText = `[bold]${val} \n Year:\t {year} \n value:\t{valueY}`;
            series.tooltip.background.filters.clear();
            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.fill = am4core.color("#fff");
            bullet.circle.strokeWidth = 2;
        });

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.fullWidthLineX = true;
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineX.strokeWidth = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        // Add scrollbar
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.thumb.background.states.getKey('hover').properties.fill = am4core.color("#017acd");
        chart.scrollbarX.background.fill = am4core.color("#017acd");
        chart.scrollbarX.thumb.background.fill = am4core.color("#017acd");
        chart.scrollbarX.startGrip.background.fill = am4core.color("#017acd");
        chart.scrollbarX.endGrip.background.fill = am4core.color("#017acd");
        chart.scrollbarX.stroke = am4core.color("#017acd");

        // Enable export
        chart.exporting.menu = new am4core.ExportMenu();
        chart.legend = new am4charts.Legend();
    }); // end am4core.ready()
}