(function ($) {
    console.log($);
    $.fn.s8CircleInfoBox = function (options) {
        // set settings
        var settings = $.extend({
            autoSlide: false,             // true or fasle
            slideSpeed:5000,                // speed of auto slide
            notResponsive:false,             // not responsive
            action: "mouseover",             // mouseover, Click for each bubble
            responsive: true,            // true :rechange cyrcle shape with window resize or false:set with fix container
            breakpoint: 160,             // its a breakpoint size for breaking to simple list style calculate by PX
            hoverStyle:"circleSelect",     // Get Your Css class for hover Style
            spreadStyle: "all"            // the style of spreading the bubbles Top,lef,right,bottom
        }, options);
        var $container = $(this).find(".circleWrapper"),
            $fields = $container.find(".circleFeature"),
            fieldsLength = $fields.length,
            spreadStyle = settings.spreadStyle.toLowerCase(),
            underBreakPoint = true,  // by change of the size it will change
            $infoBox = $container.find(".circleBox");
            
        var current = -1,        // 当前默认第几个显示
            intervalRef = null;        // reference to the setInterval
        var radius;

        var pauseSlideShow = false;

        if(settings.notResponsive){
            $infoBox.addClass("noResponsive");
            $fields.addClass("noResponsive");
            $container.addClass("noResponsive");
        }
        // make the cyrcle
        var makeCircle = function () {
            var angle = 0;
            switch (spreadStyle){
                case "left":
                    angle=90;
                    break;
                case "top":
                    angle=180;
                    break;
                case "right":
                    angle= 270;
                    break;
                default:
                    angle=0;
                    break;
            }
            var step = (spreadStyle === "all")? 360/ fieldsLength : 180 / (fieldsLength-1);
            $container.css("height", $container.width());
            radius = $container.width() / 2;
            $fields.css("lineHeight", $fields.height() + "px");
            // spin around container by transform from center

            $fields.each(function () {
                var $this = $(this);
                $this.css({
                    'transform': 'rotate(' + angle + 'deg) translate(' + radius + 'px) rotate(' + (-1*angle) + 'deg)'
                })

                angle+=step;
            })
        };
        var boxId;
        // Pass in a jquery selection for which circle to inflate
        var inflate = function ($which) {
            $fields.removeClass(settings.hoverStyle);
            boxId = $which.attr("data-cyrcleBox");
            $which.addClass(settings.hoverStyle);
            $infoBox.filter("#" + boxId).fadeIn();
        };

        var deflate = function ($which) {
            $infoBox.fadeOut();
            $which.removeClass(settings.hoverStyle);
        };

        if (settings.autoSlide) {
            var intervalAnimation = function () {
                    return setInterval(function () {
                        if (!pauseSlideShow) {
                            deflate($($fields[current]));
                            current = ( current + 1 ) % fieldsLength;
                            inflate($($fields[current]));
                        }
                    }, settings.slideSpeed);
                },
                firstTimeKickOff = function () {
                    intervalRef = intervalAnimation();
                };
            // On hover over the container (not individual circles) then pause animation
            $container.hover(function (e) {
                pauseSlideShow = true;
            }, function () {
                if (!underBreakPoint)
                    pauseSlideShow = false;
            });
        }
        // On hover over particular circle
        $fields.on(settings.action,function () {
            // if (current != $(this).parent().index() && !underBreakPoint) {
            //     $infoBox.fadeOut();
            //     current = $(this).parent().index();
            // inflate($(this));
            // }
            if (current != !underBreakPoint) {
                $infoBox.fadeOut();
                current = $(this).parent().index();
            inflate($(this));
            }
        });


        // If they shrink the browser, pause the animation; else turn it back on.
        $(window).resize(function () {
            if(settings.responsive && !underBreakPoint){
                makeCircle();
            }

            if ($(window).width() < settings.breakpoint) {
                underBreakPoint = true;
                pauseSlideShow = true;
                $fields.removeClass(settings.hoverStyle);
                $container.css("height", "auto");
            }
            else {
                underBreakPoint = false;
                pauseSlideShow = false;
                if (intervalRef === null && settings.autoSlide) {
                    firstTimeKickOff();
                }
            }
        });
        if ($(window).width() >= settings.breakpoint ) {
            makeCircle();
            underBreakPoint = false;
            if(settings.autoSlide)
                firstTimeKickOff();
        }
    }
    $(".glyphicon-remove").click(function(){
        $(this).parents(".circleBox").hide();
    })
})(jQuery);

window.onload = function () {
    // var swiper = new Swiper('.swiper-container', {
    //     autoplay: false,
    //     speed: 1000,
    //     autoplayDisableOnInteraction: false,
    //     loop: true,
    //     centeredSlides: true,
    //     slidesPerView: 2,
    //     pagination: '.swiper-pagination',
    //     paginationClickable: true,
    //     breakpoints: {
    //         668: {
    //             slidesPerView: 1,
    //         }
    //     }
    // });



    var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: '2',
        centeredSlides: true,
        spaceBetween: 80,
        autoplayDisableOnInteraction: false,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        on: {
            slideChangeTransitionEnd: function () {
                if (this.activeIndex == 2 || this.activeIndex == 5) {
                    $(".rights-content>div").hide();
                    $(".rights-content").find(".content-1").show();
                } else if (this.activeIndex == 3) {
                    $(".rights-content>div").hide();
                    $(".rights-content").find(".content-2").show();
                     $(".inner-circle").removeClass("inner-animation");
                } else {
                    $(".rights-content>div").hide();
                    $(".rights-content").find(".content-3").show();
                    $(".inner-circle").removeClass("inner-animation");
                }
            },
        }, 
    });

}

$(".inner-circle").addClass("inner-animation");
$(".circle1").s8CircleInfoBox()
$(".circle2").s8CircleInfoBox({
    autoSlide: false,
    action: "click"
})
$(".circle3").s8CircleInfoBox({
    notResponsive: true,
    hoverStyle: "circleSelect3",
    slideSpeed: 500,
    breakpoint: 0

})



