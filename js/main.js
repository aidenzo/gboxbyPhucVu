//toggle Nav
let nav = $('.nav');
let btnmenu = $('header .btnmenu');
let body = $('body');

btnmenu.click(function() {

    nav.toggleClass('clicked');
    $(this).toggleClass('clicked');
    body.toggleClass('stopscroll');
});
$(window).resize(function() {
    nav.removeClass('clicked');
    btnmenu.removeClass('clicked');

})

$(window).ready(function() {
    $(".loaderpage").fadeOut(function() {
        $(this).remove(); // Optional if it's going to only be used once.
    });
});

//nack to top
let backtoptop = $('.btnbtt')
backtoptop.click(function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
});


//tabs - WORKS
let tab = $(".works__tabs a");
tab.click(function(e) {
    e.preventDefault();
    let i = $(this).index();
    $(this).addClass("active").siblings().removeClass("active");
    $(".works__list").eq(i).addClass("active").siblings().removeClass("active")
});
/* 
$(".onstudiodetailpage .studiodetails__slider").flickity({
    cellAlign: 'left',
    contain: true,
    prevNextButtons: false
}) */

//slider in stuio details
var $carousel = $('.onstudiodetailpage .studiodetails__slider').flickity({
    cellAlign: 'left',
    contain: true,
    prevNextButtons: false,
    fullscreen: true
});


//carousel.flickity('next', true, true);
$('.btnslide-left').on('click', function() {
    $carousel.flickity('previous');
});

$('.btnslide-right').on('click', function() {
    $carousel.flickity('next');
});

//carousel.flickity('next', true, true);
$('.studio-btn--pre').on('click', function() {
    $carousel.flickity('previous');
});

$('.studio-btn--next').on('click', function() {
    $carousel.flickity('next');
});

$('.studio-full--btn').on('click', function() {
    $carousel.flickity('viewFullscreen');
});

//slider in cafe
var $carouselforcafe = $('.list__item').flickity({
    // contain: true,
    prevNextButtons: false,
});
$('.studio-btn--pre1').on('click', function() {
    $carouselforcafe.flickity('previous');
});

$('.studio-btn--next1').on('click', function() {
    $carouselforcafe.flickity('next');
});

//loader
$(window).on("load", () => {
    setTimeout(() => {
        $('.onloadpage').removeClass("display")
    }, 500);
});

//fixx header
$(window).scroll(function() {
    var header = $('header .outerhide'),
        scroll = $(window).scrollTop();
    console.log(scroll);
    if (scroll >= 150) header.removeClass('disshow');
    if (scroll <= 150) header.addClass('disshow');
})

//active rentalpage
$('.studiolist-item').on('click', function() {
    $(this).addClass("active").siblings().removeClass("active");
})



//photoswipe
var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if (figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};

$(window).on("load", () => {
    initPhotoSwipeFromDOM('.gallery__list');
})