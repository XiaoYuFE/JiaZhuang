(function($){
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active  a')
    var hideEvent = $.Event('hidetab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('showtab', {
      relatedTarget: $previous[0]
    })



    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hiddentab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'showntab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab= Plugin
  $.fn.tab.Constructor = Tab
  // TAB NO CONFLICT
  // ===============
})(Zepto)


;(function($, window, document, undefined) {
    var Dialog = (function() {
        function Dialog(element, options) {
            this.$element = $(element);
            this.opts = $.extend({}, $.fn.dialogs.defaults, options);
        }
        Dialog.prototype = {
            test: 100,
            _init: function() {
               var _this=this;
               this.$element.on("touchmove", function(event) {
                    event.stopPropagation();
                    return false;
                });
               this.$element.find("[data-roler='close']").on("click",function(e){
                    e.preventDefault();
                    _this.hide();
               })
            },
            _shadeShow: function() {
                this.$shadow = $('<div class="designer-dialog-shadow in"></div>');
                this.$shadow.appendTo($("body"));
                this._shadeEvent();
            },
            _shadeHide:function() {
                var _this=this;
                this.$shadow.removeClass("in").addClass('out');
                this._mainHide();
                this.$shadow.animationEnd(function(){
                    _this.$shadow.remove();
                })
            },
            _shadeEvent:function(){
                var _this=this;
                if(!!this.opts.shadeClose){
                    this.$shadow.on("click",function(){
                       _this._shadeHide();
                    }).on("touchstart touchmove", function(event) {
                        _this._shadeHide();
                        event.stopPropagation();
                        return false;
                    })
                }else{
                    this.$shadow.on("touchstart touchmove", function(event) {
                        event.stopPropagation();
                        return false;
                    })
                }
            },
            _mainShow: function(fn) {
                var _this=this;
                !!this.opts.beforeShow && this.opts.beforeShow.call(this);
                this.$element.addClass('dia-in').transitionEnd(function(){
                    _this.opts.afterShow && _this.opts.afterShow.call(this);
                    !!fn && setTimeout(fn, 0);
                });
            },
            _mainHide: function(fn) {
                var _this = this;
                this.opts.beforeHide && this.opts.beforeHide.call(this);
                this.$element.removeClass('dia-in').transitionEnd(function(){
                    _this.opts.afterHide && _this.opts.afterHide.call(this);
                    !!fn && setTimeout(fn, 0);
                })
            },
            show: function(fn) {
                if(this.opts.shade){
                    this._shadeShow();
                }
                this._mainShow(fn);
            },
            hide: function(fn) {
                if (this.opts.shade) {
                    this._shadeHide();
                }
                this._mainHide(fn);

            }
        }
        return Dialog;
    })();

    $.fn.dialogs = function(options) {
        var self = this;
        return this.each(function() {
            var $this = $(this),
                instance = $this.data("dialog");
            if (!instance) {
                var instance = new Dialog(this, options);
                instance._init();
                $this.data('dialog', instance);
            }
            self.hide = function(fn) {
                instance.hide(fn);
            };
            self.show = function(fn) {
                instance.show(fn);
            };
        })
    };

    $.fn.dialogs.defaults = {
        shade: true,
        shadeClose: true,
        beforeShow: function(){},
        afterShow: function(){},
        beforeHide: function(){},
        afterHide: function() {}
    }
})(window.jQuery || window.Zepto, window, document)