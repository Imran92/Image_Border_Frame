(function($) {
	$.fn.extend({
	imranImageFrame: function(param)
	{
        var interval = typeof param !== 'undefined' && typeof param.interval !== 'undefined' ? param.interval : 1000;
        var duration = typeof param !== 'undefined' && typeof param.duration !== 'undefined' ? param.duration : 500;
		return this.each(function(index, v) {
				imageFrame($(v), interval, duration);
			});
		}
	});
})(jQuery);

function imageFrame(v, interval, duration){
    var allImages = v.find('li');
    var allImagesCount = allImages.length;
    v.find('ul').css({
        "list-style-type":"none",
        "margin":"0",
        "padding":"0",
        "overflow": "hidden"
    })
    v.find('li').css({
        "display":"list-item"
    })
    v.siblings('.header-content').css({
        "height":"auto"
    });
    v.find('li').remove();
    var visibleImages = [];
    renderImageBorder();
    function swapTimer(interval, duration) {
        setInterval (
            function(){ 
                imageSwap(duration); 
        }, interval);
    }
    swapTimer(interval, duration);
    $(window).resize(function () {renderImageBorder()});
    function renderImageBorder(){
        var imgColumnNumber = 10;
        var imgWidth = v.width()/imgColumnNumber;
        var headerContentItem = v.siblings('.header-content');
        var contentHeight = headerContentItem.height() + parseInt(headerContentItem.css('padding-top'));
        var contentSetHeightMultiplier = Math.floor(contentHeight / imgWidth) + 1;
        var newHeight = contentSetHeightMultiplier * imgWidth;
        var imageNumber = imgColumnNumber * 2 + contentSetHeightMultiplier * 2;
        var imageRowNumber = contentSetHeightMultiplier + 2;
        if(visibleImages.length < imageNumber){
            var arrayLen = visibleImages.length;
            for(var i = 0; i < imageNumber - arrayLen; i++){
                visibleImages.push($(allImages[ (arrayLen % allImagesCount) + i]).clone());
            }
        } else {
            v.find('ul').find('li').remove();
            visibleImages = visibleImages.splice(0, imageNumber);
        }
        v.find('ul').append(visibleImages);
        var listItems = v.find('ul').find('li');
        var count = 0;

        var bottomPadding = parseInt(headerContentItem.css('padding-bottom')) + newHeight - Math.ceil(headerContentItem.innerHeight());
        headerContentItem.css({
            "margin": imgWidth + "px", //"0 " + imgWidth + "px" + " " + imgWidth + "px"+ " " + imgWidth + "px",
            "padding-bottom": bottomPadding + "px"
        });
        
        v.parent('.header-container').css({
            "height":imageRowNumber * imgWidth
        })
        for(var i = 0; i < imageRowNumber; i++){
            for(var j = 0; j < imgColumnNumber; j++){
                if(i == 0 || i == imageRowNumber -1){
                    listItems.eq(count).css({
                    "position":"absolute",
                    "top": i * imgWidth + "px",
                    "left": j * imgWidth + "px"
                    });
                    count++;
                } else if(j == 0 || j == imgColumnNumber - 1){
                    listItems.eq(count).css({
                    "position":"absolute",
                    "top": i * imgWidth + "px",
                    "left": j * imgWidth + "px"
                    });
                    count++;
                }
                
            }
        }
        v.find('img').attr({"width": imgWidth + "px"});
        
    }
    function imageSwap(interval){
        var imageList = v.find('ul').find('li');
        var randomNumber = Math.floor((Math.random() * imageList.length) + 1);
        var imageItem = imageList.eq(randomNumber);
        imageList.each(function(index){
            if(index != randomNumber){
                var verticalDistance = Math.floor(parseInt($(this).css('top')) - parseInt(imageItem.css('top')));
                var horizontalDistance = Math.floor(parseInt($(this).css('left')) - parseInt(imageItem.css('left')));
                var imageWidth = Math.floor(imageItem.width());
                if((verticalDistance == 0 || horizontalDistance == 0) && (verticalDistance == imageWidth || horizontalDistance == imageWidth)){
                    var thisLeft = $(this).css('left');
                    var thisTop = $(this).css('top');
                    $(this).animate({
                        left : imageItem.css('left'),
                        top : imageItem.css('top')
                    }, duration)
                    imageItem.animate({
                        left : thisLeft,
                        top : thisTop
                    })
                    return false;
                }
            }
        })
    }
}