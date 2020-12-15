let allStates = [];
/*
Tabs to change contents
*/
$('.spinner-img').hide();
$(document).on('click', '.map-point-sm', function () {
    let show = $(this).data('show');
    $(show).removeClass("hide").siblings().addClass("hide");
    const mapId = $(this).attr('id');
    const distVal = $('#district').val();
    if (distVal) {
        if (mapId === 'land-use') {
            $('#land-use-spinner').show();
            getLangUseChart(distVal);
        } else if (mapId === 'gdp') {
            getGdpChartAndData(distVal);
        } else if (mapId === 'rain-fall') {
            getRainFallData(distVal);
        } else if (mapId === 'area-production') {
            getGetAreaProductionCharts(distVal);
        } else if (mapId === 'population') {
            generatePopulationChart(distVal);
        } else if (mapId === 'live-stock') {
            generateLiveStockChart(distVal);
        }  else {
            getNutritionAndData(distVal)
        }
    }
});


/* Tab get active or deative */
let header = document.getElementById("myDIV");
let btns = header.getElementsByClassName("map-point-sm");
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}


get('unapportioned/districts').then(response => {
    if (response) {
        allStates = response;
        let stateHtml = '<option value="" selected="selected"> Select State </option>\n'
        stateHtml += Array.from(new Set(allStates.map(data => data.STNAME))).sort().map(data => `<option value="${data}">${data}</option>`).join('\n');
        $('#states').html(stateHtml);
        $('#states').attr('disabled', false);
    }
});

$('#states').on('change', () => {
    $('#district').val(null);
    clear();
    getDistrictHtml($('#states').val())
    disposeLandChart();
    disposeGdpChart();
    disposeRainFallChart();
    disposeAreaProductionCharts();
    disposePopulationChart();
    disposeLiveStockChart();
    disposeHealthChart();
});

const getDistrictHtml = (state) => {
    if (state) {
        let distHtml = `<option value="" selected="selected"> Select Districts </option>
        <optgroup label="${state}">
        `;
        distHtml += allStates.filter(data => data.STNAME === state).sort((d1, d2) => d1['DISTNAME'] < d2['DISTNAME'] ? -1 : 0).map(data => {
            return `<option value="${data.DIST}">${data.DISTNAME}</option>`
        });
        distHtml += '</optgroup>'
        $('#district').html(distHtml);
        $('#district').attr('disabled', false);
    } else {
        $('#district').html('');
        $('#district').attr('disabled', true);
    }
}

$('#district').on('change', () => {
    const distVal = $('#district').val();
    clear();
    const distData = allStates.find(data => data.DIST === parseInt(distVal));
    if (distData) {
        $('#district-name').text(distData.DISTNAME);
        $('.spinner-img').show();
        getLangUseChart(distVal);
        getRainFallData(distVal);
        generatePopulationChart(distVal);
        generateLiveStockChart(distVal);
        getGdpChartAndData(distVal);
        getGetAreaProductionCharts(distVal);
        // getGeographicalArea(distVal)
        getNutritionAndData(distVal);
    }
});

const clear = () => {
        $('#district-name').text('');
        $('#crop-area').text('0.00');
        $('#irrigated-area').text('0.00');
        $('#urban-population').text('0.00');
        $('#rural-population').text('0.00');
        $('.censas').text('');
        $('#geoAreaYear').html('');
        $('#ncaYear').html('');
        $('#niaYear').html('');
}

const waterMarkText = () => {
    return $('#states option:selected').text() + ": " + $('#district option:selected').text();
}

const titleCase = (param) => param.split(' ').map(data => `${data.charAt(0).toUpperCase()}${data.slice(1).toLowerCase()}`).join(' ');