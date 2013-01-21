/*
    jPopup.v0.1.js Tony Bispo Pinheiro aka Tony Pine
*/

(function($) {

    // methods and settings var
    var collection = [],
        methods = {

            init: function(options) {

                //defaults settings
                var settings = $.extend({
                    'linkClass': '.showpop',
                    'popupClass': '.jPopup',
                    'popEl': false,
                    'event': 'mouseover',
                    'top': 25,
                    'left': 0,
                    'delayTime': 2000,

                    'timeObj': '',
                    'state': true,
                    'inputFocus': true,

                    'popup': '',
                    'popInputs': '',
                    'link': ''
                }, options);

                return this.each(function() {

                    var $this = $(this);

                    $this.data(settings);
                    $this.data('popInputs', $this.find($this.data('popupClass')).find('input[type=text], input[type=password]'));

                    if ($this.data('popEl')) {
                        $this.data('popup', $($this.data('popEl')));
                        $this.data('popup').css({
                            display: 'none',
                            opacity: 0
                        });
                        $this.data('link', $this);
                    } else {
                        collection.push(this);
                        $this.data('popup', $this.find($this.data('popupClass')));
                        $this.data('link', $this.find($this.data('linkClass')));
                        $this.css({
                            position: 'relative',
                            zIndex: 10
                        });
                        $this.data('popup').css({
                            position: 'absolute',
                            top: $this.data('top'),
                            left: $this.data('left'),
                            zIndex: 999,
                            display: 'none',
                            opacity: 0
                        });
                    }

                    if ($this.data('event') == 'mouseover') {
                        $this.data('link').bind($this.data('event') + '.link', $.proxy(methods.showPopup, $this));
                        $this.data('popup').bind($this.data('event') + '.tooltip', $.proxy(methods.showPopup, $this));
                        $this.data('link').bind('mouseout.link', $.proxy(methods.mouseOut, $this));
                        $this.data('popup').bind('mouseout.tooltip', $.proxy(methods.mouseOut, $this));
                        $.each($this.data('popInputs'), function() {
                            $(this).bind('focus.tooltip', $.proxy(methods.focusIn, $this));
                            $(this).bind('blur.tooltip', $.proxy(methods.focusOut, $this));
                        });
                    } else {
                        $this.data('link').toggle($.proxy(methods.showPopup, $this), $.proxy(function() {
                            this.data('state', true);
                            methods.hidePopup.apply(this);
                        }, $this));
                    }
                    $(document).bind('click.tooltip', $.proxy(methods.hidePopup, $this));


                });
            },
            initTimeout: function() {
                var $this = this;
                this.data('timeObj', setTimeout(function() {
                    methods.resetState.apply($this);
                }, this.data('delayTime')));
            },
            stopTimeout: function() {
                if (this.data('timeObj')) {
                    clearTimeout(this.data('timeObj'));
                }
            },
            resetState: function() {
                methods.hidePopup.apply(this);
            },
            focusIn: function() {
                this.data('inputFocus', false);
            },
            focusOut: function() {
                this.data('inputFocus', true);
                methods.initTimeout.apply(this);
            },
            mouseOut: function() {
                this.data('state', true);
                methods.initTimeout.apply(this);
            },
            showPopup: function() {
                $.each(collection, function() {
                    $(this).data('popup').stop().animate({
                        opacity: 0
                    }, 200, $.proxy(function() {
                        this.css('display', 'none');
                    }, $(this).data('popup')));
                });
                this.data('popup').css('display', 'block').stop().animate({
                    opacity: 1
                }, 200);
                this.data('state', false);
                methods.stopTimeout.apply(this);
            },
            hidePopup: function() {
                if (this.data('state') && this.data('inputFocus')) {
                    this.data('popup').stop().animate({
                        opacity: 0
                    }, 200, $.proxy(function() {
                        this.css('display', 'none');
                    }, $(this).data('popup')));
                } else {
                    methods.stopTimeout.apply(this);
                }
            }
        };

    $.fn.jPopup = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.jPopup');
        }

    };

})(jQuery);