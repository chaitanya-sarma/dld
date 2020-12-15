let geographicalAreaResponse = null;
const getGeographicalArea = (district) => {
    if (geographicalAreaResponse) {
        setTimeout(() => {
            getGeographicalkData(district,geographicalAreaResponse);
        });
    } else {
        get('unapportioned/operational-holdings').then(response => {
            if (response) {
                geographicalAreaResponse = JSON.parse(response);
                getGeographicalkData(district,geographicalAreaResponse);
            }
        });
    }
}

const getGeographicalkData  = (district, response) => {
 const headers = response.headers.map(data => data.header);
 const geoArea = [];
 response.data.forEach(elements => {
    const result = {};
    elements.forEach((data, index) => {
        result[headers[index]] = data;
    });
    geoArea.push(result)
});
const finalGeoArea = geoArea.filter(data => data['Dist Code'] === district)
if (finalGeoArea && finalGeoArea.length) {
    const maxYear = Math.max(...finalGeoArea.map(data => data['Year']).map(data => parseInt(data))).toString();
    const totGeoArea = finalGeoArea.find(data => data['Year'] === maxYear);
    $('#geoAreaYear').html(` (${maxYear})`);
    $('#urban-population').text(parseFloat(totGeoArea['TOTAL AREA']).toFixed(1) + ' (000 Ha)');
} else {
    $('#geoAreaYear').html(``);
    $('#urban-population').text('00 (000 Ha)');
}
}