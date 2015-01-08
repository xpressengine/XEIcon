(function($){
    $(function(){
        // Search
        var searchInput = $('input#search');
        searchInput.quicksearch('.glyph');
        $('.btn_close').click(function(){
            searchInput.val('');
            searchInput.quicksearch('.glyph');
            return false;
        })
        
        searchInput.bind("keyup keypress", function(e) {
            var code = e.keyCode || e.which; 
            if (code  == 13) {               
                e.preventDefault();
                return false;
            }
        });
    })
})(jQuery);   