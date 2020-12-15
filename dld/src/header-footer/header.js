let headerSource = '';
let indexSrc = '../';
if (window.location.href.endsWith('index.html') || window.location.href.endsWith('/')) {
  headerSource = 'src/';
  indexSrc = ''
}

const setNavItemActive = (paramUrl) => {
  return window.location.href.endsWith(paramUrl) ? 'active-nav' : '';
}

let headerHtml = `<header class="wf100">
      <div class="logo-nav-row header"  style="z-index: 999;padding:0px 20px;">
        <div class="container-fluid">
              <nav class="navbar">
                <div class="navbar-header">
                  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="${indexSrc}index.html"><img class="logo_height"  src="${headerSource}assets/images/logo1.png" alt=""></a>
                </div>
                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style="background: #f7f7f7;">
                  <ul class="nav navbar-nav text-right" style="float: right;">
                    <li> <a class="${setNavItemActive('index.html')}${setNavItemActive('/')}" href="${indexSrc}index.html">Home </a> </li>
                    <li><a class="${setNavItemActive('about-dld.html')}" href="${headerSource}about-dld.html">About DLD </a> </li>
                    <li><a class="${setNavItemActive('districtprofile.html')}" href="${headerSource}districtprofile.html">District Snapshots</a>
                    <li><a class="${setNavItemActive('Spatialmap.html')}" href="${headerSource}Spatialmap.html">Spatial maps</a> </li>
                    <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Data <span class="caret"></span></a>
                      <ul class="dropdown-menu">
                        <li><a href="${headerSource}crops.html">Apportioned</a></li>
                        <li><a class="UnapportionedLink" href="${headerSource}crops.html">Unapportioned</a></li>
                        <li><a href="${headerSource}additional.html">Additional Data</a></li>
                         <li><a href="${headerSource}visualization.html">Visualization</a></li>
                      </ul>
                    </li>
                    <li> <a class="${setNavItemActive('definition_standard.html')}" href="${headerSource}definition_standard.html">Definitions And Standards </a> </li>
                    <li> <a class="${setNavItemActive('support.html')}" href="${headerSource}support.html">Support </a> </li>
                  </ul>
                </div>
              </nav>
        </div>
      </div>
  </header>`


 $('#pageHeader').html(headerHtml);

 $('.UnapportionedLink').on('click', () => {
    sessionStorage.setItem('dataType', 'unapportioned');
 });

