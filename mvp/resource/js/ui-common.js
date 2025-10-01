const NX_UI = function(nx){
  nx.init = function() {
    // nx.nav.init()
    nx.tab.init();
    nx.accordion.init();
    // nx.tab._settings();
    // nx.accordion._settings();
    // nx.svgThermometer.init();
    // nx.sortable.init();
    $(window).on('load', function(){
    nx.tab._settings();
    nx.accordion._settings();
    });
  }

  nx.tab = {
    init:function(){
      this._settings();
      this._clickEvent();
    },
    _settings:function(){
      var elem = '.tab-wrap';
      $(elem).each(function(i){
        var flag = $(this).find('.tabList>li.active').length;
        if(flag === 0) {
          var dataVal =  $(this).find('.tabList>li').eq(0).attr('data-controls');
          $(this).find('.tabList>li').eq(0).addClass('active');
          $(this).find('.tabCont-wrap').find('.tabCont' + '[data-controls="' + dataVal + '"').addClass('active');
        }
      })
    },
    _clickEvent:function(){
      var elem = '.tabList>li>a';
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
  nx.accordion = {
    init : function(){
      this._setEvent();
      this._settings();
    },
    _settings:function(){
      var toggleBtn = '.btn-acc';
      var This = this;
      $(toggleBtn).each(function(i){
        var $this = $(this);
        var isActive = $(this).hasClass('active');
       // var flag = $(this).closest('.accordion-wrap').attr('data-acc');
        if(isActive){
          This._slideDown($this); 
        }
      })
    },
    _setEvent:function(t, e){
      var toggleBtn = '.btn-acc';
      var This = this;
      $(document).off('click' ,toggleBtn).on('click', toggleBtn, function(e){
        var isActive = $(this).hasClass('active');
        //var flag = $(this).closest('.accordion-wrap').attr('data-acc');
        var $this = $(this);
        if(! isActive){
          This._slideDown($this); 
        }else{
          This._slideUp($this);
        }
      });
    },
    _slideDown:function(t){
      t.addClass('active');
      t.parents('.accordion-header').next('.accordion-conts').slideDown(300);
       t.closest('.accordion').addClass('active');
      // if(flag === 'button'){
      //   t.closest('.accordion').addClass('active');
      // }
    },
    _slideUp:function(t){
      t.removeClass('active');
      t.parents('.accordion-header').next('.accordion-conts').slideUp(300);
      t.closest('.accordion').removeClass('active');
      // if(flag === 'double'){
      //   t.closest('.accordion').find('.accordion-conts').slideUp(300);
      //   t.closest('.accordion').find(toggleBtn).removeClass('active');
      //   t.closest('.accordion').find('.accordion').removeClass('active');
      // }
      // if(flag === 'button'){
      //   t.closest('.accordion').removeClass('active');
      // }
    }
  },

  nx.init();
  return nx;
}(window.NX_UI || {}, jQuery);