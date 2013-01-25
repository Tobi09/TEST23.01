$('.navbar a').on('click', function(){
	$('section, nav a').removeClass('aktiv');
	$(this).addClass('aktiv');
	$($(this).attr('href')).addClass('aktiv');
	return false;	
});