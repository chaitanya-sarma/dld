const apportHtml = ``

$.ajax({
  "type": "GET",
  "url": "src/assets/data/apportioned-map.txt",
  "beforeSend": function (){
  },
  "success":  function(response){
   $('#ApporMap').html(response);
  },
  "error": function (e){
   alert("File not found for map");
  }
});

const toolTip = $('.svgToolTip');
setTimeout(ele => {
  
  $('.first-map').on('mouseover', 'path', (event) => {
    if (event && event.target && event.target.id) {
      const id = event.target.id;
      if (id === '1') {
        toolTip.css({ 'display': 'none' });
      } else {
        const apporState = apporStates.find(ele => ele.id === id || ele.dists.includes(id));
        if (apporState && !apporState.disable) {
          toolTip.css({ 'display': 'block', 'left': event.pageX + 'px', 'top': event.pageY + 'px' });
          toolTip.text(apporState.name);
        } else {
          toolTip.text('');
        }
      }
    }
  });

  let appDistId = null;

  $('.first-map').on('mouseout', 'path', (event) => {
    if (event && event.target && event.target.id) {
      const id = event.target.id;
      toolTip.css({ 'display': 'none' });
    }

    $('.first-map').on('click', 'path', (event) => {
      if (event && event.target && event.target.id && event.target.id != appDistId) {
        const id = event.target.id;
        const apporState = apporStates.find(ele => ele.id === id || ele.dists.includes(id));
        if (apporState && !apporState.disable) {
          dataType = 'apportioned';
          state = apporState.name;
          $('#model-btn').click();
        }
        appDistId = id;
      }
    });

  });
}, 1000);


