( function() {
	var mobIcon = jQuery('#mobMenuBtn');
	var closeBtn = jQuery('#mobMenuClose');
	var menu = jQuery('#site-navigation .nav-items');

	mobIcon.click(function() {
		toggleMenu();
	});

	closeBtn.click(function() {
		toggleMenu();
	});

	function toggleMenu() {
		if (menu.hasClass('mob-closed')) {
			menu.removeClass('mob-closed'); 
		} else {
			menu.addClass('mob-closed'); 
		}
	};
} )();
