const carouselHtml = `  <div id="home-slider" class="owl-carousel owl-theme">
<div class="item item_pad">
  <div class="slider-caption caption_data">
    <div class="container"> <strong>District Level Data for India (DLD)</strong>
      <p class="text-white">Open access data for 571 districts in 20 states of India on socio-economic, environment, nutrition and  health indicators from 1966 to 2015.</p>
    </div>
  </div>
  <img src="src/assets/images/banner1.jpg" alt="">
</div>
<div class="item item_pad">
  <div class="slider-caption caption_data">
    <div class="container"> <strong>DLD Database - An ICRISAT and TCI initiative</strong>
      <p><img src="src/assets/images/logos.jpg" style="height:60px;" /> </p>
    </div>
  </div>
  <img src="src/assets/images/banner2.jpg" alt="">
</div>
<div class="item item_pad">
  <div class="slider-caption caption_data">
    <div class="container"> <strong>One stop overview of the Indian districts based on select key indicators.</strong>
    </div>
  </div>
  <img src="src/assets/images/banner7.jpg" alt="">
</div>
<div class="item item_pad">
  <div class="slider-caption caption_data caption_hide">
    <div class="container">
      <!-- <strong>District Level Data for India</strong> -->
      <a href="#">
        <ul class="text-center text-black" style="list-style-type: none;">
          <li>
            <div class="facts-icon"><img src="src/assets/images/dataset.png" style="height: 30px;"></div>
            <strong>
              <div id="shiva"><i class="count">74</i></div>
            </strong>
            <span class="text-black">Datasets</span>
          </li>
        </ul>
      </a>
      <a href="#">
        <ul class="text-center text-black" style="list-style-type: none;">
          <li>
            <div class="facts-icon"><img src="src/assets/images/india.png" style="height: 30px;"></div>
            <strong>
              <div id="shiva"><i class="count">571</i></div>
            </strong>
            <span class="text-black">Districts</span>
          </li>
        </ul>
      </a>
      <a href="#">
        <ul class="text-center text-black" style="list-style-type: none;">
          <li>
            <div class="facts-icon"><img src="src/assets/images/datapoints.png" style="height: 30px;"></div>
            <strong>
              <div id="shiva"><i class="count">11</i> <i>M+</i></div>
            </strong>
            <span class="text-black">Datapoints</span>
          </li>
        </ul>
      </a>
      <a href="#">
        <ul class="text-center text-black" style="list-style-type: none;">
          <li>
            <div class="facts-icon"><img src="src/assets/images/formula.png" style="height: 30px;"></div>
            <strong>
              <div id="shiva"><i class="count">1030</i></div>
            </strong>
            <span class="text-black">Variables</span>
          </li>
        </ul>
      </a>
    </div>
  </div>
  <img src="src/assets/images/banner3.jpg" alt="">
</div>

<div class="item item_pad">
  <div class="slider-caption caption_data">
    <div class="container"> <strong>District Level Data is a link between country-level macro data and
        household-level micro data</strong>
    </div>
  </div>
  <img src="src/assets/images/banner5.jpg" alt="">
</div>
</div>`;
$('#carousel-slider').html(carouselHtml);
