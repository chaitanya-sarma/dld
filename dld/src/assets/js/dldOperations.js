// Create a variable to hold ionRangeSlider instance
var table = null, years = null,
	responseFromAPI = null,
	locationsData = null,
	containsString = false,
	selectedRow = {};
let isLoading = 0;
const setLoc = () => {
	let yLoc = window.scrollY + document.querySelector('#showdata-table').getBoundingClientRect().top;
	yLoc -= document.querySelector('nav').getBoundingClientRect().height;
	window.scroll(0, yLoc);
	setTimeout(ele => document.querySelector('.table tbody tr').click(), 500);

};
const setUnappotioned = () => {
	
if (sessionStorage.getItem('dataType') === 'unapportioned') {
	document.getElementsByClassName('datatype')[1].checked = true;
	sessionStorage.removeItem('dataType');
	}
}
const setSubCat = () => {
	const subcat = sessionStorage.getItem('subcategory');
	if (subcat) {
		$('.subcategory').val(subcat.replace(/\s+/g, '-').toLowerCase());
		sessionStorage.removeItem('subcategory');
		}
	}

const setState = () => {
	const state = sessionStorage.getItem('state');
	if (state && locationsData) {
		const stateData = locationsData.find(data => data.STNAME && data.STNAME.toUpperCase() === state);
		if (stateData && stateData.STCODE) {
			$('.states').val([stateData.STCODE.toString()]);
			$('.states').fSelect("reload");
			$('.states').change();
		}
	}
	sessionStorage.removeItem('state');
	}

const addLoader = () => {
	isLoading++;
	$('.main_section').addClass('hidden');
	$('.loader_body').removeClass('hidden')
}

const removeLoader = () => {
	isLoading--;
	if (isLoading <= 0) {
		isLoading = 0;
		$('.main_section').removeClass('hidden');
		$('.loader_body').addClass('hidden');
	}
}

$(document).ready(function () {
	setUnappotioned();
	// Initialise fSelect instances
	$('.states, .dists, .subcategory, .elements, .items, .yearList').fSelect({
		placeholder: 'Select some options',
		numDisplayed: 10,
		overflowText: '{n} selected',
		noResultsText: 'No results found',
		searchText: 'Search',
		showSearch: true
	});

	// Initialise range slider instance
	$(".years").ionRangeSlider({
		type: "double",
		min: 1990,
		max: new Date().getFullYear(),
		from: 1990,
		to: 1990,
		grid: true,
		grid_snap: true,
		from_fixed: false,  // fix position of FROM handle
		to_fixed: false     // fix position of TO handle
	});
	// Save instance to variable
	years = $(".years").data("ionRangeSlider");

	var category = getCategoryFromUrl();
	$('[name="category"]').val(category).trigger('change');
});

// Handle select all checkbox
$('body').on('change', '.selAllState', () => {
	// Select All States
	$('.states option').prop('selected', $('.selAllState').prop('checked'));
	$('.states').fSelect("reload");
	$('.states').change();
}).on('change', '.selAllDist', () => {
	// Select All Districts
	$('.dists option').prop('selected', $('.selAllDist').prop('checked'));
	$('.dists').fSelect("reload");
}).on('change', '.selAllEle', () => {
	// Select All Elements
	$('.elements option').prop('selected', $('.selAllEle').prop('checked'));
	$('.elements').fSelect("reload");
}).on('change', '.selAllItem', () => {
	// Select All Items
	$('.items option').prop('selected', $('.selAllItem').prop('checked'));
	$('.items').fSelect("reload");
}).on('change', '.selAllYears', () => {
	// Select All Items
	$('.yearList option').prop('selected', $('.selAllYears').prop('checked'));
	$('.yearList').fSelect("reload");
});

// Handle show-data btn click
$('body').on('click', '.show-data', function (event) {
	addLoader();
	setTimeout(ele => {
		$('.error').empty();
		var subcategory = $('.subcategory'),
			elements = $('.elements'),
			states = $('.states'),
			dists = $('.dists'),
			items = $('.items'),
			years = $('.years'),
			yearList = $('.yearList'),
			error = 0;

		if (table) {
			table.destroy();
			table = null;
		}
		$('.table').empty();
		var thead = `<thead><tr><th>Dist Code</th>
	<th>Year</th>
	<th>State Code</th>
	<th>State Name</th>
	<th>Dist Name</th></tr></thead>`,
			tbody = `<tbody><tr>
		<td colspan="5" class="text-center"><img src="images/spinner.gif" alt="Please wait... Loading Data."></td>
	</tr></tbody>`;
		$('.table').html(thead + tbody);

		if (!states.val()) {
			error++;
			states.closest('.form-group').find('.error').html('Please select atleast 1 state.');
		}
		if (!dists.val()) {
			error++;
			dists.closest('.form-group').find('.error').html('Please select atleast 1 district.');
		}
		if (!subcategory.val()) {
			error++;
			subcategory.closest('.form-group').find('.error').html('Please select a subcategory.');
		}
		if (!elements.val()) {
			error++;
			elements.closest('.form-group').find('.error').html('Please select atleast 1 element.');
		}
		if (!items.val()) {
			error++;
			items.closest('.form-group').find('.error').html('Please select atleast 1 item.');
		}
		if (!years.val() && !containsString) {
			error++;
			years.closest('.form-group').find('.error').html('Please select an year range.');
		}
		var allYears = [];
		if (!containsString) {
			const yearsType = $('.yearRadio:checked').val();
			if (yearsType === '1') {
				if (!Array.isArray(years.val())) {
					var yearValues = [];
					$.each(years.val().split(';'), function (i, el) {
						if ($.inArray(parseInt(el), yearValues) === -1) yearValues.push(parseInt(el));
					});
					for (var year = yearValues[0]; year <= yearValues[(yearValues.length - 1)]; year++) {
						allYears.push(year + '');
					}
				} else {
					allYears = years.val();
				}
			} else {
				if (!yearList.val() || yearList.val().length <= 0) {
					yearList.closest('.form-group').find('.error').html('Please select an year range.');
					error++;
				} else {
					allYears = yearList.val();
				}
			}
		}


		if (error > 0) {
			tbody = `<tbody><tr><td colspan="5">Please select all the above filters to show data.</td></tr></tbody>`;
			$('.table').html(thead + tbody);
			removeLoader();
			return false;
		}
		var search = [], header = [
			{ title: 'Dist Code' },
			{ title: 'Year' },
			{ title: 'State Code' },
			{ title: 'State Name' },
			{ title: 'Dist Name' }
		], body = [];

		for (var itemValue of items.val()) {
			for (var elemValue of elements.val()) {
				var headerText = itemValue + ' ' + elemValue;
				//Filter index from api header acc to headerText
				var index = responseFromAPI.headers.findIndex(body =>
					body.header === headerText
				), arr = responseFromAPI.headers[index];

				if (arr) {
					header.push({ title: `${headerText} (${responseFromAPI.headers[index].unit})` });
					search.push(index);
				}
			}
		}
		if (search.length > 0) {
			for (var locValue of dists.val()) {
				debugger;
				const filteredData = responseFromAPI.data.filter(fData => (fData[0] == locValue && (containsString || allYears.includes(fData[1])))
					, []);
				const filterData = filteredData.map(mData => {
					let tBodyData = [];
					tBodyData.push(mData[0]);
					tBodyData.push(mData[1]);
					tBodyData.push(mData[10]);
					tBodyData.push(mData[11]);
					tBodyData.push(mData[13]);
					tBodyData.push(...search.map(sData => `<td>${mData[sData]}</td>`, []))
					return tBodyData;
				}, []);
				body.push(...filterData);
			}
			removeLoader();
			$('.table').empty();
			// unapportioned
			const buttonsArr = [];
			if($('.datatype:checked').val() !== 'unapportioned'){
				buttonsArr.push({
					className: 'btn btn-sm visual',
					text: '<i class="fa fa-line-chart"></i> Visualization'
				});
			}
			buttonsArr.push({
				extend: 'csvHtml5',
				className: 'btn btn-sm export',
				text: '<i class="fa fa-download"></i> Export as CSV'
			});
			table = $('.table').DataTable({
				columns: header,
				data: body,
				scrollX: true,
				buttons: buttonsArr
			});
			table.buttons().container().appendTo('.exportDiv');
			table.on('draw', setLoc());
			table.on('tbdoy')
				.on('click', 'tr', (event) => {
					if ($(this).hasClass('selected')) {
						$(this).removeClass('selected');
					}
					else {
						table.$('tr.selected').removeClass('selected');
						event.currentTarget.classList.add('selected');
					}
					const selectedData = Array.from(event.currentTarget.children).map(data => data.innerText);
					selectedRow = {};
					if (selectedData && selectedData.length > 0) {
						selectedRow = { 'category': $('.category').val(), 'subcategory': $('.subcategory').val(), 'state': selectedData[2], 'dist': selectedData[0], 'items': $('.items').val()[0], 'elements': $('.elements').val()[0] }
					}
				});
		} else {
			removeLoader();
			tbody = `<tbody><tr><td colspan="5" class="text-danger" style="font-weight:bold;">No combination of items and elements possible. Please make another selection.</td></tr></tbody>`;
			$('.table').html(thead + tbody);
		}
	});


});

// Handle categry and datatype change
$('body').on('change', '.category, .datatype', function (event) {
	var elem = $(this),
		category = $('.category').val(),
		datatype = $('.datatype:checked').val(),
		categoryName = $('.category option:selected').html();
	$('.categoryName').html(categoryName);

	//Show description according to category
	if (elem.hasClass('category')) showDescription(elem);

	//Get locations data
	getLocations(datatype);
	//Get sub categories data
	 getSubCategories(category, datatype);
	//get Years List
	getYearsList(datatype);
});

$('body').on('click', '.visual', () => {
	sessionStorage.setItem('visual', btoa(JSON.stringify(selectedRow)));
	window.location.href = 'visualization.html'
})

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
	for (stCode of states) {
		//Filter index from api state ids
		var allDists = locationsData.filter((body, index) => {
			return body.STCODE === parseInt(stCode)
		});
		allDists = allDists.sort((data, data1) => data.DISTNAME > data1.DISTNAME ? 1 : -1);
		HTML += `<optgroup label="${allDists[0].STNAME}">`;
		for (dist of allDists) {
			HTML += `<option value="${dist.DIST}">${dist.DISTNAME}</option>`;
		}
		HTML += `</optgroup>`;
	}
	$('.dists').html(HTML);
	$('.dists').fSelect("reload");
});

// Handle sub category change
$('body').on('change', '.subcategory', function (event) {
	var elem = $(this),
		subcategory = elem.val(),
		datatype = $('.datatype:checked').val();
	elem.closest('.form-group').find('.error').empty();
	$("[type=checkbox]").prop('checked', false);
	$("[type=checkbox]").change();

	if (table) {
		table.destroy();
		table = null;
	}
	$('.table').empty();
	var thead = `<thead><tr><th>Dist Code</th>
	<th>Year</th>
	<th>State Code</th>
	<th>State Name</th>
	<th>Dist Name</th></tr></thead>`,
		tbody = `<tbody><tr>
	<td colspan="5">Please select all the above filters to show data.</td>
	</tr></tbody>`;
	$('.table').html(thead + tbody);

	$('.items').empty().val(null);
	$('.elements').empty().val(null);
	$('.items, .elements').fSelect("reload");
	$('.items, .elements').closest('.form-group').find('.error').empty();

	if (!subcategory || subcategory.length === 0) return false;
	
	addLoader();

	//Get elements, items, years
	$.ajax({
		url: 'http://data.icrisat.org/dldAPI/' + datatype + '/' + subcategory,
		type: 'GET',
		dataType: 'JSON',
		error: function () {
			removeLoader();
			elem.closest('.form-group').find('.error').html(`No data found under this sub category. Please try different filter settings.`);
		},
		success: function (response) {
			containsString = response.years.some(isNaN);
			if (!containsString) {
				var allYears = [];
				for (var yearValue of response.years) {
					allYears.push(parseInt(yearValue));
				}
				allYears.sort();
				response.years = allYears;
			}
			responseFromAPI = response;
			var HTML = ``;
			for (var element of response.elements) {
				HTML += `<option value="${element}">${element}</option>`;
			}
			$('.elements').html(HTML);
			$('.elements').fSelect("reload");

			HTML = ``;
			for (var item of response.items) {
				HTML += `<option value="${item}">${item}</option>`;
			}
			$('.items').html(HTML);
			$('.items').fSelect("reload");

			if (years) {
				years.destroy();
				years = null;
			}

			var rangeParentDiv = $("body").find(".years").closest('.col-sm-7');
			let yearDiv = $('.yearBlock');
			if (!containsString) {
				//Remove not applicable overlay
				rangeParentDiv.find('.overlay').remove();
				yearDiv.find('.overlay').remove();

				//Check the yearRadio with value="2"
				$('.yearRadio[value="1"]').prop('checked', true);

				//Show years as a slider
				$("body").find(".years").ionRangeSlider({
					type: "double",
					min: response.years[0],
					max: response.years[(response.years.length - 1)],
					grid: true,
					grid_snap: true,
					from_fixed: false,  // fix position of FROM handle
					to_fixed: false     // fix position of TO handle
				});
				years = $("body").find(".years").data("ionRangeSlider");
				years.update({
					from: response.years[0],
					to: response.years[(response.years.length - 1)]
				});
			} else {
				//Add not applicable overlay if not exists
				if (rangeParentDiv.find('.overlay').length === 0) {
					rangeParentDiv.prepend(`<div class="overlay"></div>`);
				}
				if (yearDiv.find('.overlay').length === 0) {
					yearDiv.prepend(`<div class="overlay"></div>`);
				}

				//Check the yearRadio with value="2"
				$('.yearRadio[value="2"]').prop('checked', true);

				//Show default years as a slider
				$("body").find(".years").ionRangeSlider({
					type: "double",
					min: 1990,
					max: new Date().getFullYear(),
					grid: true,
					grid_snap: true,
					from_fixed: false,  // fix position of FROM handle
					to_fixed: false     // fix position of TO handle
				});
				years = $("body").find(".years").data("ionRangeSlider");
				years.update({
					from: 1990,
					to: 1990
				});
			}

			//Update yearsList record
			var opt = ``;
			response.years.forEach(year => {
				opt += `<option value="${year}">${year}</option>`;
			});
			$('.yearList').val(null);
			$('.yearList').html(opt);
			$('.yearList').fSelect("reload");
			setState();
			removeLoader();
		}
	});
});

// Show and hide description content
$('body').on('click', '.description .viewLimmiter', function (event) {
	var elem = $(this),
		cat = $('.category').val(),
		currElem = $('.description').find('div.' + cat);

	elem.toggleClass("more less");
	elem.toggleClass("pull-right");
	// currElem.find('span').toggle('fast');
	if (elem.hasClass('more')) {
		elem.html('.....Read More');
		currElem.find('span').css('display', 'none');
	}
	if (elem.hasClass('less')) {
		elem.html('.....Read Less');
		currElem.find('span').css('display', 'inline');
	}
});

function showDescription(elem) {
	var cat = elem.val(),
		currElem = $('.description').find('div.' + cat);
	$('.description').find('div').addClass('hidden');
	currElem.removeClass('hidden');
	$('.description').find('a.viewLimmiter').remove();

	if (currElem.find('p').length > 0) {
		currElem.find('span').removeAttr('style');
		currElem.find('span').css('display', 'none');
		currElem.append(`<a href="javascript:void(0)" class="viewLimmiter more">.....Read More</a>`);
	}
}

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
	addLoader();
	$.ajax({
		url: 'http://data.icrisat.org/dldAPI/' + datatype + '/districts',
		type: 'GET',
		dataType: 'JSON',
		error: function () { },
		success: function (response) {
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
			states.fSelect("reload");
			removeLoader();
		}
	});
}

function getSubCategories(category, dtype) {
	var subcat = $('.subcategory');
	subcat.empty().val(null);
	subcat.fSelect("reload");
	subcat.trigger('change');
	subcat.closest('.form-group').find('.error').empty();

	$.ajax({
		url: 'http://data.icrisat.org/dldAPI/subCategories/?category=' + category + '&type=' + dtype,
		type: 'GET',
		dataType: 'JSON',
		error: function () { },
		success: function (response) {
			var HTML = ``;
			for (var cat of response) {
				HTML += `<option value="${cat.replace(/\s+/g, '-').toLowerCase()}">${cat}</option>`;
			}
			subcat.html(HTML);
			setSubCat();
			subcat.fSelect("reload");
			subcat.trigger('change');
		}
	});
}
function getYearsList(data) {
	let datatype = data;
	const startYear = datatype === 'apportioned' ? 1990 : 1966;
	const endYear = 2020;
	let opt = ``;
	for (let year = startYear; year <= endYear; year++) {
		opt += `<option value="${year}">${year}</option>`;
	}
	$('.yearList').html(opt);
	$('.yearList').fSelect("reload");
}