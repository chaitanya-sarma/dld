let dataType = null;
let state = null;


$('.category').val(null);
$('.subcategory').val(null);

$('.count').each(function () {
    $(this).prop('Counter',0).animate({
        Counter: $(this).text()
    }, {
        duration: 4000,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
});

const categoryChanged = () => {
    const category = $('.category').val();
    const subcategory = $('.subcategory');
    
    $.ajax({
        url: `http://data.icrisat.org/dldAPI/subCategories/?category=${category}&type=${dataType}`,
        type: 'GET',
        dataType: 'JSON',
        error:  () => {},
        success:  (response) => {
            if (response && Array.isArray(response)) {
                let subCatHtml = ``;
                response.forEach(data => {
                    subCatHtml += `<option value="${data}">${data}</option>`;
                }); 
                subcategory.html(subCatHtml);
                $('.subcategory').val(null);
            }
            // alert('Hello World');
        }});
    
}

$('.category').on('change', () => {
    categoryChanged();
});

$('.submit-btn').on('click', () => {
    // const svgData = {'category': $('.category').val(), 'dataType': dataType, 'stateName': state, 'subcategory': $('.subcategory').val()};
    sessionStorage.setItem('dataType', dataType);
    sessionStorage.setItem('subcategory', $('.subcategory').val());
    sessionStorage.setItem('state', state);
    window.location.href = `src/${$('.category').val()}.html`;
});

