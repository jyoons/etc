const NX_UI = function(nx){
  nx.init = function() {
    nx.countNum.init();
    nx.accordion._settings();
    nx.tab.init();
    nx.accordion.init();
    nx.nav.init();
  }
  nx.countNum = {
    init:function(){
      this.setEvent();
    },
    setEvent:function(){
      $('.counter').each(function(){
        var $targetNum = parseFloat($(this).attr('data-target-num'));
        var $decimal = parseInt($(this).attr('data-decimal')) || 0;
        var $target = $(this)
        var idx = $(this).index();
        var hasPercent = $target.find('em').text() === '%';
        setTimeout(function() {
          $({ countNum: 0 }).animate({ countNum: $targetNum },{
              duration: 1500,
              easing: 'swing',
              step: function(now) {
                if (hasPercent) {
                  $target.html(now.toFixed($decimal) + '<em>%</em>');
                } else {
                  $target.text(Math.floor(now).toLocaleString());
                }
              },
              complete: function() {
                if (hasPercent) {
                  $target.html($targetNum.toFixed($decimal) + '<em>%</em>');
                } else {
                  $target.text(Math.floor($targetNum).toLocaleString());
                }
              }
            }
          );
        }, (idx * 200));
      })
    }
  },
  nx.nav = {
    init:function(){
      this._setEvent();
    },
    _setEvent:function(){
      $(document).off('mouseenter mouseleave click', '.nav-btn, .nav').on('mouseenter mouseleave click', '.nav-btn, .nav', function(e){
        if(e.type === 'mouseenter') {
          console.log('mouseenter')
          $('.nav').addClass('active');
        }else if(e.type === 'mouseleave') {
          var flag =  e.target.className;
          if(flag.indexOf('nav-btn') < 0 ) {
            $('.nav').removeClass('active');
          }
        }else if(e.type === 'click') {
          $('.nav').hasClass('active') ? $('.nav').removeClass('active') : $('.nav').addClass('active');
        }
      });
    }
  },
  nx.accordion = {
    init : function(){
      this._setEvent();
      this._settings();
    },
    _settings:function(){
      var toggleBtn = '.accordion';
      var This = this;
      $(toggleBtn).each(function(i){
        var $this = $(this);
        var isActive = $(this).hasClass('active');
        if(isActive){
          This._slideDown($this); 
        }
      })
    },
    _setEvent:function(t, e){
      var toggleBtn = '.btn-acc';
      var This = this;
      $(document).off('click' ,toggleBtn).on('click', toggleBtn, function(e){
        var isActive = $(this).closest('.accordion').hasClass('active');
        var $this = $(this);
        if(! isActive){
          This._slideDown($this); 
        }else{
          This._slideUp($this);
        }
      });
    },
    _slideDown:function(t){
      t.closest('.accordion').addClass('active');
      t.closest('.accordion').find('.accordion-conts').slideDown(300);
    },
    _slideUp:function(t){
      t.closest('.accordion').removeClass('active');
      t.closest('.accordion').find('.accordion-conts').slideUp(300);
    }
  },
  nx.tab = {
    init:function(){
      this._settings();
      this._clickEvent();
    },
    _settings:function(){
      var elem = '.tab-wrap';
      $(elem).each(function(i){
        var flag = $(this).find('.tab-list>li.active').length;
        if(flag === 0) {
          var dataVal =  $(this).find('.tab-list>li').eq(0).attr('data-controls');
          $(this).find('.tab-list>li').eq(0).addClass('active');
          $(this).find('.tabCont-wrap').find('.tabCont' + '[data-controls="' + dataVal + '"').addClass('active');
        }
      })
    },
    _clickEvent:function(){
      var elem = '.tab-list>li>a';
      var target = '.tabCont-wrap .tabCont';
      $(document).on("click", elem, function(){
        var dataVal = $(this).parent('li').attr('data-controls');
        $(this).parent('li').siblings('li').removeClass('active');
        $(this).parent('li').addClass('active');
        $(target).removeClass('active');
        $(target + '[data-controls="' + dataVal + '"').addClass('active');
      });
    }
  },
  nx.init();
  return nx;
}(window.NX_UI || {}, jQuery);