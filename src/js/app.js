window.jQuery = $ = require('jquery');
var bootstrap = require('bootstrap/dist/js/bootstrap');
require('velocity-animate');

$('a.page-scroll').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var target = $(this).attr('href');
    $(target).velocity('scroll', {
        duration: 1250,
        easing: 'ease-in-out'
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 51
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').on('click', function () {
    $('.navbar-toggle:visible').click();
});

// Offset for Main Navigation
$('#mainNav').affix({
    offset: {
        top: 100
    }
});

// Scrolling Animations