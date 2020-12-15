let footerSource = '';
if (window.location.href.endsWith('index.html') || window.location.href.endsWith('/')) {
  footerSource = 'src/';
}
let footer = `<footer class="home3 footer-bottom main-footer wf100 main_section mb-20" style="background: #0e7a39!important;padding:35px 20px;">
		    <div class="container-fluid">
		      <div class="row"> 
		        <div class="col-md-5 col-sm-6">
		          <div class="footer-widget">
		            <h6>About DLD</h6>
		            <ul class="text-white">
		              <li style="text-align:justify;"><span> The District Level Database (DLD) for Indian agriculture and allied sectors provides a comprehensive one-stop shop for data on rural sector that enables testing of key research hypotheses, identification of relevant districts / regions for technology dissemination, promoting rural pro-poor programs / development initiatives and identification of relevant representative districts for micro level assessment.</span></li>
		          </div>
		        </div>
		        <div class="col-md-2 col-sm-6">
		          <div class="footer-widget">
		            <h6>Important Links</h6>
		            <ul>
		              <li><a href="${footerSource}about-dld.html"> About DLD</a></li>
		              <li><a href="${footerSource}crops.html"> Apportioned data</a></li>
		              <li><a class="UnapportionedLink" href="${footerSource}crops.html"> Unapportioned data</a></li>
		              <li><a href="${footerSource}additional.html"> Additional data</a></li>
		              <li><a href="${footerSource}definition_standard.html"> Definitions and  
		              Standards</a></li>
		              <li><a href="${footerSource}support.html"> Support</a></li>
		            </ul>
		          </div>
		        </div>
		       <div class="col-md-5 col-sm-6">
		          <div class="footer-widget">
		            <h6>Contact Us</h6>
		            <ul class="text-white">
		              <li><span> S Nedumaran - Senior Scientist (Economics)</span></li>
		              <li><span>  Global Program on Innovation Systems for Drylands (ISD), ICRISAT </span></li>
		              <li><span> Address: Patancheru, Hyderabad, Telangana - 502324, India <br/>
					   Email: s.nedumaran@cgiar.org, Skype: s.nedumaran<br/>
					   Phone: +91 40 3071 3522, +91 9618800165,
					   Fax: +91 40 30713072 </span></li>
		            </ul>
		          </div>
		        </div>
		      </div>
		    </div>
		  </footer>

		<footer class="footer wf100" style="background: #615c5c!important;">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-12 col-sm-12">
						<p class="copyr text-center">Copyright © 2020 ICRISAT All Rights Reserved. </p>
					</div>
				</div>
			</div>
		</footer>`
		$('#pageFooter').html(footer);
		$('.UnapportionedLink').on('click', () => {
			sessionStorage.setItem('dataType', 'unapportioned');
		 });