(function ($) {
	var defaults = {
		'easing': 'ease',		/* move-style: ease-in, ease-out, linear */
		'duration': 1000,
		'status': true,
		'loop': true,
		'keyboard': true,
		'vertical': true
	}

	var win = $(window),		/* window object */
		box,
		container,				/* page container */
		page_collections,
		page_width,
		page_height,
		handle,
		length,
		page_status,

		options,
		
		index = 1,				
		isScroll = false,		/* status */

		pageCache = [];			/* cache for pages */


	$.fn.pageSwitch = function (option) {
		options = $.extend(defaults, option || {});

		// container = $(options.render);
		// pages = container.find()

		// return this.each(function () {
			
		// })
		/* pageSwitch-box */
		box = this;
		/* pageSwitch-container */
		container = box.find('.pageSwitch-container');
		/* pageSwitch-container ul */
		handle = container.find('ul');
		/* pageSwitch-container ul li */
		page_collections = handle.find('li');
		/* pageSwitch-container ul li width */
		page_width = container.width();
		/* pageSwitch-container ul li height */
		page_height = container.height();
		/* pageSwitch-container ul li length */
		length = page_collections.length;


		/* pageSwitch-status */
		if (options.status) {
			var html = [];
			html.push('<div><img src="" alt="" /></div>')
			html.push('<ul>>')
			for(var i = 0; i < length; i++) {
				html.push('<li class="pageSwitch-' + (i + 1) + '"></li>')
				// pageSwitch-1
			}
			html.push('</ul>')
			$('.pageSwitch-status').append('<div class="pageSwitch-' + (i + 1) + '"><div/>')
			html.push('<div><img src="" alt="" /></div>')
		}

		options.vertical || box.addClass('horizontal');
		
		resize();

		/* window mousesheel event */
		win.on('mousewheel DOMMouseScroll', function (e) {
			var _deriction = e.originalEvent.wheelDelta || -e.originalEvent.detail;
			if (_deriction > 0) {
				/* pre */
				pagePre();
			} else {
				/* next */
				pageNext();
			}
			e.preventDefault();
		})
		/* window keyboard event */
		win.on('keyup', function (e) {
			switch (e.keyCode) {
				case 37:
					options.vertical || pagePre();
					break;
				case 39:
					options.vertical || pageNext();
					break;
				case 38:
					options.vertical && pagePre();
					break;
				case 40:
					options.vertical && pageNext();
					break;
				default:
					e.preventDefault();
					break;
			}
		})

		/* window resize event */
		win.on('resize', function (e) {
			page_width = container.width();
			page_height = container.height();
			resize();
		})

		function resize () {
			if (options.vertical) {
				handle.height(length * page_height);
				page_collections.height(page_height);
			} else {
				handle.width(length * page_width);
				page_collections.width(page_width);
			}
			setTimeout(function () {
				handle.css(options.vertical ? 'margin-top' : 'margin-left', -(index - 1) * (options.vertical ? page_height : page_width));
				handle.css('transition', 'all 0s');
			}, 300)
		}

		/* up or left */
		function pagePre (e) {
			// options.vertical
			if (!isScroll && index > 1) {
				index --;
				pageChange();
			}
		}

		/* down or right */
		function pageNext (e) {
			if (!isScroll && index < length) {
				index ++;
				pageChange();
			}
		}

		/* pageChange */
		function pageChange () {
			isScroll = true;
			handle.css(options.vertical ? 'margin-top' : 'margin-left', -(index - 1) * (options.vertical ? page_height : page_width));
			handle.css('transition', 'all ' + options.duration/1000 + 's');
			handle.on('webkitTransitionEnd msTransitionend mozTransitionend transitionend',function(){
				isScroll = false;
			});
		}


	}
})(jQuery)