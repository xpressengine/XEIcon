(function($){
    $(function(){
        /*
        var pbs = $('.pbs');
        var mls = $('.mls');
        var inputValue = $('input.talign-right');
        
        for(var i=0;i<pbs.length;i++){
            $('.glyph').eq(i).append('<code>&lt;i class="' + mls.eq(i).text().trim() + '"&gt&lt;/i&gt</code>');
        }
       */
        
        // Scroll to top
        var scrollToTop = function() {
            var link = $('.btn_top');
            var windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
            $(window).scroll(function() {
                if (($(this).scrollTop() > 150) && (windowW > 1000)) {
                    link.fadeIn(100);
                } else {
                    link.fadeOut(100);
                }
            });
    
            link.click(function() {
                $('html, body').animate({scrollTop: 0}, 400);
                return false;
            });
        };
        scrollToTop();
        
        // GA Event
        $('.ga-action').on('click', function() {
            var $this = $(this);
            var data = $this.data();
            var ga_event = data.gaEvent;
            var template = data.template;

            var arg1 = null, arg2 = null, arg3 = null;
            switch(ga_event) {
                // Icon
                case 'icon-view':
                case 'icon-download':
                    arg1 = 'Icon';
                    arg2 = (ga_event == 'icon-view') ? 'View' : 'Download';
                    break
            }

            if(typeof(ga) != 'undefined') ga('send', 'event', arg1, arg2);
        });
    })
})(jQuery);
