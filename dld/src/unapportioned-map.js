const unApporHtml = ``;
  //  const toolTip = $('.svgToolTip');

   $.ajax({
     "type": "GET",
     "url": "src/assets/data/unapportioned-map.txt",
     "beforeSend": function (){
     },
     "success":  function(response){
      $('#upApporMap').html(response);
     },
     "error": function (e){
      alert("File not found for map");
     }
   });
   
   setTimeout(ele => {
     $('.second-map').on('mouseover', 'path', (event) => {
      if (event && event.target && event.target.id) {
          const id = event.target.id;
          
          if (id === 'u-1') {
             toolTip.css({'display':'none'});
          } else {
            const unApporState = unApporStates.find(ele => ele.id === id || ele.dists.includes(id));
            if (unApporState && !unApporState.disable) {
              toolTip.css({'display':'block', 'left': event.pageX + 'px', 'top': event.pageY + 'px'});
              toolTip.text(unApporState.name); 
            } else {
              toolTip.text('');
            }
          }
      }
  });
  let appDistId = null; 
  $('.second-map').on('mouseout', 'path', (event) => {
      if (event && event.target && event.target.id) {
          const id = event.target.id;
             toolTip.css({'display':'none'});
  }
  
  $('.second-map').on('click','path', (event) => {
    if (event && event.target && event.target.id && event.target.id != appDistId) {
        const id = event.target.id;
        const unApporState = unApporStates.find(ele => ele.id === id || ele.dists.includes(id));
        if (unApporState && !unApporState.disable) {
          dataType = 'unapportioned';
          state = unApporState.name; 
            $('#model-btn').click();
          }
          appDistId = id;
    }
});
  
  });
   }, 600)