let category = $("#category")
let subCategory = $("#sub-category");
let element = $("#element");
let item = $("#item");

let categoryError = $("#category-error");
let subCategoryError = $("#sub-category-error");
let elementError = $("#element-error");
let itemError = $("#item-error");

let nullSelect = `<option value="">---------</option>`;

const singlePanelCategory = `
    <option value="">---------</option>
    <option value="crops">Crops</option>
    <option value="biophysical">Biophysical</option>
    <option value="inputs">Inputs</option>
    <option value="census">Census</option>
    <option value="nutrition and health">Nutrition and Health</option>
`;

const multiplePanelCategory = `
    <option value="">---------</option>
    <option value="crops">Crops</option>
`;

$("#single-panel-pill").on("click", function (){
    category.html(singlePanelCategory);
    [subCategory, element, item].forEach(ele => ele.empty());
});
$("#multiple-panel-pill").on("click", function (){
    category.html(multiplePanelCategory);
    [subCategory, element, item].forEach(ele => ele.empty());
});

let apportionedButton = $("input[type=radio][value=apportioned]");
let unapportionedButton = $("input[type=radio][value=unapportioned]");
let toggleApportionedButton = (cVal) => {
    if(cVal === "crops"){
        apportionedButton.prop("disabled", false);
        unapportionedButton.prop("checked", true);
    } else{
        apportionedButton.prop("disabled", true);
        unapportionedButton.prop("checked", true);
        $("#range").css("background", "#CCCCCC").prop("disabled", true);
    }
}

category.on("change", function (){
    [subCategory, element, item].forEach(ele => ele.empty());
    let cVal = $(this).val();
    switch(true){
        case (cVal === ""):
            toggleApportionedButton(cVal); [subCategory, element, item].forEach(ele => ele.html(nullSelect));
            [categoryError, subCategoryError, elementError, itemError].forEach(ele => ele.html("Required"));
            setUnappYear("2015"); break;
        case (cVal === "crops"):
            toggleApportionedButton(cVal); categoryError.empty(); subCategory.html(nullSelect + cropSubCategory); setUnappYear("2015"); break;
        case (cVal === "biophysical"):
            toggleApportionedButton(cVal); categoryError.empty(); subCategory.html(nullSelect + rainfallSubCategory + landuseSubCategory); setUnappYear("2015"); break;
        case (cVal === "inputs"):
            toggleApportionedButton(cVal); categoryError.empty(); subCategory.html(nullSelect + fertilizerSubCategory); setUnappYear("2015"); break;
        case (cVal === "census"):
            toggleApportionedButton(cVal); categoryError.empty(); subCategory.html(nullSelect + populationSubCategory + livestockSubCategory); setUnappYear("2015"); break;
        case (cVal === "nutrition and health"):
            toggleApportionedButton(cVal); categoryError.empty(); subCategory.html(nullSelect + nutritionSubCategory); setUnappYear("2015"); break;
    }
});

let setUnappYear = (unappYear) => {
    $("#range").css("background", "#CCCCCC");
    $("#range").val(unappYear);
    $("#year").html(unappYear);
    $("#range").prop("disabled", true);
    $("#up-year, #down-year").hide();
}

$("#range").on("change", function (){
    $("#year").html($(this).val());
});
  
$("#down-year").on("click", function() {
    var newVal = parseInt($("#range").val()) - 1;
    if(newVal < 1966){newVal = 1966;}
    $("#range").val(newVal);
    updateLabel(newVal);
});

$("#up-year").on("click", function() {
    var newVal = parseInt($("#range").val()) + 1;
    if(newVal > 2015){newVal = 2015;}
    $("#range").val(newVal);
    updateLabel(newVal);
});

let updateLabel = (num) => {
    $("#year").html(num);
}

$("input[type=radio][name=dataset]").on("input", function (){
    let dataSet = $(this).val();
    switch(true){
        case (dataSet === "apportioned"):
            $("#range").removeAttr("disabled");
            $("#range").css("background", "#28A745");
            $("#up-year, #down-year").show();
            break;
        case (dataSet === "unapportioned"):
            $("#range").css("background", "#CCCCCC");
            $("#range").val("2015");
            $("#year").html("2015");
            $("#range").prop("disabled", true);
            $("#up-year, #down-year").hide();
            break;
    }
});

subCategory.on("change", function (){
    [element, item].forEach(ele => ele.empty());
    let cVal = category.val();
    let scVal = $(this).val();
    switch(true){
        case (scVal === ""):
            [element, item].forEach(ele => ele.html(nullSelect));
            [subCategoryError, elementError, itemError].forEach(ele => ele.html("Required")); setUnappYear("2015"); break;
        case (cVal === "crops" && scVal === "area-production-yield"):
            subCategoryError.empty(); element.html(nullSelect + cropElement); 
            break;
        case (cVal === "biophysical" && scVal === "rainfall"):
            subCategoryError.empty(); element.html(nullSelect + rainfallElement); setUnappYear("2015"); break;
        case (cVal === "biophysical" && scVal === "landuse"):
            subCategoryError.empty(); element.html(nullSelect + intensityElement + areaElement); setUnappYear("2014"); break;
        case (cVal === "inputs" && scVal === "fertilizer"):
            subCategoryError.empty(); element.html(nullSelect + fertilizerNCAElement); setUnappYear("2014"); break;
        case (cVal === "census" && scVal === "population"):
            subCategoryError.empty(); element.html(nullSelect + populationElement); setUnappYear("2011"); break;
        case (cVal === "census" && scVal === "livestock"):
            subCategoryError.empty(); element.html(nullSelect + smallRuminantElement + largeRuminantElement); setUnappYear("2012"); break;
        case (cVal === "nutrition and health" && scVal === "nutrition"):
            subCategoryError.empty(); element.html(nullSelect + womenElement + childrenElement); setUnappYear("2015"); break;
    }
});

element.on("change", function (){
    item.empty();
    let cVal = category.val();
    let scVal = subCategory.val();
    let eVal = $(this).val();
    switch(true){
        case (eVal === ""):
            item.html(nullSelect);
            [elementError, itemError].forEach(ele => ele.html("Required")); break;
        case (cVal === "crops" && scVal === "area-production-yield" && (eVal === "area" || eVal === "production" || eVal === "yield")):
            elementError.empty(); item.html(nullSelect + cropItem); break;
        case (cVal === "biophysical" && scVal === "rainfall" && eVal === "rainfall"):
            elementError.empty(); item.html(nullSelect + rainfallItem); break;
        case (cVal === "biophysical" && scVal === "landuse" && eVal === "intensity"):
            elementError.empty(); item.html(nullSelect + croppingItem); break;
        case (cVal === "biophysical" && scVal === "landuse" && eVal === "area"):
            elementError.empty(); item.html(nullSelect + ncaPercentItem); break;
        case (cVal === "inputs" && scVal === "fertilizer" && eVal === "fertilizer nca"):
            elementError.empty(); item.html(nullSelect + fertilizerConsumptionItem); break;
        case (cVal === "census" && scVal === "population" && eVal === "population"):
            elementError.empty(); item.html(nullSelect + populationItem); break;
        case (cVal === "census" && scVal === "livestock" && eVal === "small ruminant"):
            elementError.empty(); item.html(nullSelect + smallRuminantItem); break;
        case (cVal === "census" && scVal === "livestock" && eVal === "large ruminant"):
            elementError.empty(); item.html(nullSelect + largeRuminantItem); break;
        case (cVal === "nutrition and health" && scVal === "nutrition" && eVal === "women"):
            elementError.empty(); item.html(nullSelect + womenItem); break;
        case (cVal === "nutrition and health" && scVal === "nutrition" && eVal === "children"):
            elementError.empty(); item.html(nullSelect + childrenItem); break;
    }
});

item.on("change", function (){
    let iVal = $(this).val();
    switch(true){
        case (iVal === ""):
            itemError.html("Required"); break;
        case (iVal !== ""):
            itemError.empty(); break;
    }
});

const toTitleCase = (string) => {
    return string.split(" ").map(ele => {
      let word = !["and", "or"].includes(ele) ? ele[0].toLocaleUpperCase() + ele.slice(1,).toLocaleLowerCase() : ele;
      return word;
    }).join(" ");
}


$("#years").fSelect({
    placeholder: "Select upto 3 years",
}).on("change", function (){
    let selCount = $(this).val().length;
    let checkBoxes = $(".fs-options").find("div.fs-option.g0").not(".selected");
    (selCount >= 3) ? checkBoxes.addClass("disabled") : checkBoxes.removeClass("disabled");
    (selCount === 0) ? $("#years-error").html("Required") : $("#years-error").empty();
});

$("#clear-years").on("click", function (){
    $(".fs-label").empty().html("Select upto 3 years");
    $(".fs-options").find("div.fs-option.g0").not(".selected").removeClass("disabled");
    $(".fs-options").find("div.fs-option.g0.selected").removeClass("selected");
    $("#years-error").html("Required");
});


