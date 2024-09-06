;(function($){
  
  // Start 
  const Components = {
    Header:function($scope){   
        let headerWrap = $scope;

      // Mobile Menu Script
      let ToggleIcon = `<button class="btn-transparent sub-toggle"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M44 108a3.988 3.988 0 0 1-2.828-1.172 3.997 3.997 0 0 1 0-5.656L78.344 64 41.172 26.828c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l40 40a3.997 3.997 0 0 1 0 5.656l-40 40A3.988 3.988 0 0 1 44 108z" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg></button>`;
      let fadeItem = [".mobile-menu-content .sm-menu > .menu-item", ".mobile-menu-content .fadeIn"]; 
      let SubMenus = $scope.find(".mobile-menu-content .sm-menu li .sub-menu");
      // Add Toggle Button
      SubMenus.closest('li').append(ToggleIcon);    

      let MobileMenu = $scope.find('.mobile-menu-wrapper');

      // Open Menu
      const openMenu = ()=>{ 
        let MHeight = MobileMenu.hasClass('menu-y-full') ? ( window.innerHeight - headerWrap.find(".navbar-lg").innerHeight())+"px" : "auto";
        SubMenus.each(function(){$(this).closest('.menu-item').css('--lh',$(this).closest('.menu-item').find("> a").innerHeight()+"px")});
        SubMenus.each(function(){$(this).closest('.menu-item').css('--lw',$(this).closest('.menu-item').find("> a").innerWidth()+"px")});  
        gsap.set(fadeItem, {
          opacity:0,
          y:20 
        })
        gsap.to(MobileMenu, {
          'height':MHeight,
          ease:'expo.out',
          duration:.6
        });
        gsap.to(fadeItem, {
          opacity:1,
          y:0,
          ease:"expo.out", 
          duration:1,
          stagger:0.1
        })
      }
      // Close Menu
      const openClose = ()=>{     
        gsap.to(MobileMenu, {
          'height':0,
          ease:'expo.out'
        });
        gsap.to(fadeItem, {
          opacity:0,
          y:20
        })
      }
      $('.header-btn-toggle').click(function(){
        $(this).toggleClass("open"); 
        if($(this).hasClass('open')){   
          openMenu();
        }else{
          openClose();  
        }
      });
      // Mobile Menu Script End

      MobileMenu.find('.sub-toggle').click(function(){
        $(this).closest("li").find('> .sub-menu').slideToggle(300); 
        $(this).toggleClass("open");
      });

    },
    initGallery:function(){
      $('[data-fancybox^="gallery-"]').each(function(){
        var area = $(this).attr('data-fancybox');  
        Fancybox.bind('[data-fancybox="'+area+'"]', {
            contentClick: "toggleCover",
            Images: {
              Panzoom: {
                panMode: "mousemove",
                mouseMoveFactor: 1.1,
                mouseMoveFriction: 0.12,
              },
            }        
        }); 
      })
    },
    initSlide:function($scope){  
      var Settings = $scope.attr("data-settings") && $scope.attr("data-settings") != "" ? eval('('+$scope.attr("data-settings")+')') : false;  
      var slide = $scope.find(".swiper");
      var lg = Settings.lg !== undefined && Settings.lg != "" ? Settings.lg : false;
      var md = Settings.md !== undefined && Settings.md != "" ? Settings.md : false;
      var sm = Settings.sm !== undefined && Settings.sm != "" ? Settings.sm : false;   
      var autoPlay = Settings.autoPlay !== undefined && Settings.autoPlay != "" ? Settings.autoPlay : false;     
      var _pagination = $scope.find(".slide-pagination").length ? {
        pagination:{
            el:$scope.find(".slide-pagination")[0],
            clickable:true
        }
      }:{};
      var _navigation = $scope.find(".slide-nav").length ? {   
        navigation: {
          nextEl: ".slide-next",
          prevEl: ".slide-prev",
        }
      }:{};

      let SwiperSlide = new Swiper(slide[0], {   
        slidesPerView:lg ? lg : 1, 
        loop:false, 
        autoplay:Settings.autoplay ? {       
            delay:2
        } : false, 
        speed:600,  
        ..._pagination,
        ..._navigation,
        on:{
            touchEnd:function(swiper, event){
                if(Settings.autoplay){  
                    setTimeout(()=>{
                        swiper.autoplay.start(); 
                    },100); 
                }
            },
            init:function(swiper){ 
                if(Settings.autoplay){
                    slide.hover(function(){  
                        swiper.autoplay.stop();
                    }, function(){    
                        swiper.autoplay.start();
                    });  
                }  
            }
        }, 
        breakpoints:{   
            0:{
                slidesPerView:sm ? sm : 1,
                spaceBetween:13
            },
            768:{
                slidesPerView:md ? md : 1,
                spaceBetween:15
            },
            991:{
                slidesPerView:lg ? lg : 1,
                spaceBetween:25
            }
        }
      }); 
    },
    sizeSlide(){
      var slideWrap = $('.size-guide');
      var slide = $('.size-guide .swiper'); 
      var btnsTitle = [];
      slideWrap.find('.swiper-slide').each(function(){
        btnsTitle.push($(this).attr('data-title')); 
      });
      new Swiper(slide[0], {   
        slidesPerView:1, 
        loop:false, 
        autoplay:false, 
        speed:600,  
        navigation: {
          nextEl: slideWrap.find('.slide-next')[0], 
          prevEl: slideWrap.find('.slide-prev')[0]     
        },
        pagination: {
          el: slideWrap.find('.slide-pagination-btn')[0], 
          clickable: true,
          renderBullet: function (index, className) {  
            return (`<button class="${className}">${btnsTitle[index]}</button>`);
          }
        }
      }); 
    },
    initPrallax(){  
      $('.prallax__bg').each(function(){
        var $scope = $(this);
        gsap.to($scope, {   
          'background-position-y':"100%",
          ease:"none",
          scrollTrigger:{   
              trigger:$scope,
              // markers:true, 
              start:$scope.hasClass("prallax__top") ? `top ${$scope.offset().top}` : `top 80%`,
              end:"bottom 10%",
              scrub:true
          }
      }) 
      });
    },
    GalleryFilter($scope){  
      var btns = $scope.find('.gallery__filter-btns .btn');
      var items = $scope.find('.js-filter-wrap > div');  
      btns.on('click', function(){
        var state = Flip.getState(items.toArray()); 
        var getItems = $(this).attr('data-filter') === 'all' ? items : $($(this).attr('data-filter'));    
        var hideItems = items.not(getItems);
        btns.removeClass('active');
        $(this).addClass('active');
        gsap.set(hideItems, {
          'display':'none'
        })
        gsap.set(getItems, {
          'display':'block'
        });    
      })
    },
    Accordion:function($scope){ 
        if($scope.find(".sk-accordion-wrapper").hasClass("use-as-toggle")){
            $scope.find(".sk-accordion-wrapper .title").click(function(){
                if($(".sk-accordion-wrapper").hasClass("responsive__accourdion")){ 
                    if($(window).innerWidth() < 991){
                        $(this).closest('.accordion-item').find('.accordion-body').slideToggle(150);
                        $(this).closest('.accordion-item').toggleClass("active"); 
                    }
                }else{ 
                    $(this).closest('.accordion-item').find('.accordion-body').slideToggle(150);
                    $(this).closest('.accordion-item').toggleClass("active"); 
                }
            });
        }else{
            $scope.find('.sk-accordion-wrapper .accordion-item:eq(0) .title').addClass('active');      
            $scope.find('.sk-accordion-wrapper .accordion-item:eq(0) .accordion-body').slideDown();  

            $scope.find('.sk-accordion-wrapper .title').click(function(j) { 
                var dropDown = $(this).closest('.accordion-item').find('.accordion-body');
        
                $(this).closest('.sk-accordion-wrapper').find('.accordion-body').not(dropDown).slideUp(150);
        
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).closest('.sk-accordion-wrapper').find('.title.active').removeClass('active');
                    $(this).addClass('active');
                }
        
                dropDown.stop(false, true).slideToggle(150);
        
                j.preventDefault();
            });
        }
    },
    toSectionLink:function(links, offsetTop = ''){  
      let offsetTopV = offsetTop; 
      if(offsetTop === ''){    
          offsetTopV = ($('.sticky__header').length ? $('.sticky__header').innerHeight() : 200) + 80;      
      }
      links.on('click', function(event) { 
          event.preventDefault();
          var $section = $($(this).attr('href'));
          if($section.length){
              if($section){
                  gsap.to(window, {
                      scrollTo:{
                          y:$section.offset().top - (offsetTopV - 10)
                      },
                      ease:"power3.out"
                  })
              } 
          }
          
          gsap.set('html', { 
              'scroll-behavior': 'initial'
          })  
      });
      links.each(function(){
          var _this = $(this);
          var $section = $($(this).attr('href'));
          if($section.length){ 
              if($section){
                  ScrollTrigger.create({ 
                      trigger:$section,
                      start:`top +=${offsetTopV}`,  
                      end:`bottom +=${offsetTopV}`,
                      onLeaveBack(){
                          links.removeClass("active");
                          links.removeClass("active-done");  
                          $section.removeClass("active");
                      },  
                      onEnter(){
                          links.removeClass("active");
                          links.removeClass("active-done");
                          _this.addClass("active");
                          $section.addClass("active");
                          _this.prevAll().addClass("active-done");
                      },
                      onEnterBack(){
                          links.removeClass("active");
                          links.removeClass("active-done");  
                          _this.addClass("active");
                          _this.prevAll().addClass("active-done");
                          // $section.removeClass("active");  
                      }
                  })
              } 
          }
      });
    } 
  }

  // Iniit
  Components.initGallery(); 
  Components.initPrallax();  
  Components.sizeSlide();  
  Components.Header($(".header__area")); 
  Components.GalleryFilter($(".gallery__filter_sec"));  
  Components.toSectionLink($(".scroll__btns .btn"));  
  $(".init-slide").each(function(){
    Components.initSlide($(this));  
  })
  $(".accordion__wrap").each(function(){ 
    Components.Accordion($(this));  
  })

  $('.footer-sm-accordion .footer-title').click(function(){
    if($(window).innerWidth() < 991){
      $(this).closest('.footer-sm-accordion').find('.accourdion-body').slideToggle(200);    
      $(this).closest('.footer-sm-accordion').toggleClass('opened');    
    }
  })
  $('.btn-back-to-top').click(function(){    
    $('html, body').animate({
        scrollTop:0   
    }, 350); 
  })

  $('[data-toggle-open]').click(function() {
    var target = $($(this).attr('data-toggle-open'));
    if (target.hasClass('open')) {
        target.removeClass('open');
    } else {
        $('[data-toggle-open]').each(function() { 
            $($(this).attr('data-toggle-open')).removeClass('open');
        });
        target.addClass('open');
    }
  });  
  $(".text-toggle .togglebtn").click(function(){
    $(this).closest(".text-toggle").find("> .toggle-body").slideToggle(); 
    $(this).toggleClass('open'); 
  });

  $(".toggle-card > .btn").on("click", function(){
      var card = $(this).closest('.toggle-card');
      card.find('.toggle-body').slideToggle('fast');  
      card.toggleClass('active');
  });

  $('.tab-nav li a').click(function(e){
    e.preventDefault(); 
    var Id = $($(this).attr('href')); 
    var ActiveItem = $(this).closest('.tab__wrapper').find('.tab-item.active');    
    var navs = $(this).closest('.tab__wrapper').find('.tab-nav li a'); 
    var nav = $(this);

    navs.removeClass('active');
    ActiveItem.removeClass('active');
    Id.addClass('active'); 
    nav.addClass('active'); 

  }); 

  $('.video-banner .play-btn').on('click', function(){
    var wrap = $(this).closest('.video-banner');
    var video = $($(this).attr('data-video')); 
    wrap.toggleClass("played");
    playPause(video[0]); 
    video[0].addEventListener('ended', function() {
      video[0].currentTime = 0;
      video[0].pause();   
      wrap.removeClass("played");
      console.log("Ended");
      
    });
  });
  $('.video-banner').hover(function(){
    $(this).addClass('hover-on-video');
  }, function(){ 
    $(this).removeClass('hover-on-video');
  })
  function playPause (video) {
    if (video.paused) 
      video.play(); 
    else 
      video.pause();
  }


})(jQuery); 