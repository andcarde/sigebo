
// container.js
'use strict';

$(document).ready(function() {
    // Set container properties
    const $container = $('.container');
    $container.css({
        'background-color': '#ffffff',
        'box-shadow': '0 0 10px rgba(0, 0, 0, 0.1)',
        'border-radius': '8px'
    });
    
    // Set container margins
    const marginTop = 30;
    $container.css('margin-top', `${marginTop}px`);
    const pageHeight = $(window).height();
    const containerHeight = $container.height();
    let marginBottom = pageHeight - containerHeight - marginTop - 48;
    if (marginBottom < 0)
        marginBottom = 0;
    $container.css('margin-bottom', `${marginBottom}px`);
});