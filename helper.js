$(function() {
  
  var options = {};

  /* serialize object

  $.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};
$('form').serializeObject() */

	$('form').on('keyup', 'input', function() {
		//serialize();
		var self = $(this).closest('form');

		values = {
			font_size : parseInt(self.find('#font_size').val(), 10),
			h1 : parseInt(self.find('#h1_size').val(), 10),
			h2 : parseInt(self.find('#h2_size').val(), 10),
			h3 : parseInt(self.find('#h3_size').val(), 10),
			h4 : parseInt(self.find('#h4_size').val(), 10),
			h5 : parseInt(self.find('#h5_size').val(), 10)
		}

		setOptions(values.font_size, 0, values.h1, values.h2, values.h3, values.h4, values.h5);
	});
  
  setOptions();
  
  function setOptions(size, line, h1, h2, h3, h4, h5, grid) {
    // get options and set some defaults
    options.size = size ? size : 16;
    options.line = line ? line : options.size * 1.5;
    options.magic = options.size * 1.5;
    options.h1 = h1 ? h1 : 26;
    options.h2 = h2 ? h2 : 24;
    options.h3 = h3 ? h3 : 22;
	options.h4 = h4 ? h4 : 18;
	options.h5 = h5 ? h5 : 18;

	options.show_grid = grid ? 1 : 1;
	showData(options);  
  }
  
  // Do the actual math and return the results
  function calculate(values) {
    
	// Namespace the result object
    var results = {
    	body : {
    		size : '',
    		line: '',
    		magic: values.magic
    	},
		h1 : {
			size : '',
			line : '',
			margin : ''
			},
		h2 : {
			size : '',
			line : '',
			margin : ''
		},
		h3 : {
			size : '',
			line : '',
			margin : ''
		},
		h4 : {
			size : '',
			line : '',
			margin : ''
		},
		h5 : {
			size: '',
			line : '',
			margin : ''
		},
		p : {
			marginBottom : '',
			marginTop : 0
		},
		headers : {}
	}

    results.h1.size = Math.round((values.h1 / 16)*100)/100;
    results.h2.size = Math.round((values.h2 / 16)*100)/100;
    results.h3.size = Math.round((values.h3 / 16)*100)/100;
	results.h4.size = Math.round((values.h4 / 16)*100)/100;
	results.h5.size = Math.round((values.h5 / 16)*100)/100;

    results.h1.margin = Math.round((values.magic / values.h1)*100)/100;
    results.h2.margin = Math.round((values.magic / values.h2)*100)/100;
    results.h3.margin = Math.round((values.magic / values.h3)*100)/100;
	results.h4.margin = Math.round((values.magic / values.h4)*100)/100;
	results.h5.margin = Math.round((values.magic / values.h5)*100)/100;
    
    results.h1.line = Math.round((values.magic / values.h1)*100)/100;
    console.warn(results.h1.line)
    results.h2.line = Math.round((values.magic / values.h2)*100)/100;
    results.h3.line = Math.round((values.magic / values.h3)*100)/100;
	results.h4.line = Math.round((values.magic / values.h4)*100)/100;
	results.h5.line = Math.round((values.magic / values.h5)*100)/100;

	results.body.size = values.size / 16;
	results.body.line = values.line;
	results.p.marginBottom = values.magic / values.size;
    
    return results;
  }
  
  // Display the results
  function showData(data) {
    var results = calculate(data);
	
	if (results) {
	
		// Get the main objects (h1, h2, p, etc)
		var headers = [];
		
		for (var k in results) {
			if (results.hasOwnProperty(k)) {
				headers.push(k);
				if (k != 'headers' && k != 'body') results.headers[k] = k; /* TODO: not how its done, fix this */
			}
		};
			
		var $container = $('.results'),
			template = _.template($('#header-template').html());
			
		$container.html(template(results));
		$container[0].style.display = "block"; // Show the template, hidden by default
		
		if (options.show_grid) {
			showGrid(options.size, options.line);
		}
	}

	setStyle(results);
  }

  function setStyle(results) {

  	$('.right p').css({
  		'font-size': results.body.size + 'em',
  		'line-height': results.p.marginBottom + "em",
  		'margin-bottom': results.p.marginBottom + "em"
  	});

  	$('.right h1').css({
  		'font-size': results.h1.size + 'em',
  		'line-height': results.h1.line + 'em',
  		'margin-bottom': results.h1.margin + 'em'
  	});

  	$('.right h2').css({
  		'font-size': results.h2.size + 'em',
  		'line-height': results.h2.line + 'em',
  		'margin-bottom': results.h2.margin + 'em'
  	});

  	$('h3').css({
  		'font-size': results.h3.size + 'em',
  		'line-height': results.h3.line + 'em',
  		'margin-bottom': results.h3.margin + 'em'
  	});

  	$('h4').css({
  		'font-size': results.h4.size + 'em',
  		'line-height': results.h4.line + 'em',
  		'margin-bottom': results.h4.margin + 'em'
  	});

  	$('h5').css({
  		'font-size': results.h5.size + 'em',
  		'line-height': results.h5.line + 'em',
  		'margin-bottom': results.h5.margin + 'em'
  	});
  }
  
  /* Display a vertical rythm grid to confirm the values */
  function showGrid(size, line) {
	var oldWrap = $('.wrapper');

	if (oldWrap.length) oldWrap.remove();

	this.options = {
			fontSize: size,
			lineHeight: line
	}

	heightLines(this.options);

	function heightLines(options) {

		var fontSize = options.fontSize || 16,
			lineHeight =  options.lineHeight / options.fontSize || 1.5,
			unit = fontSize * lineHeight,
			wrapper = $('<div></div>')
			.addClass('wrapper')
			.appendTo('.right'),
			rows = ($('.right').height()) / unit;

		for (var i = 0; i < rows; i++) {

			var grid = $('<div></div>').css({
				'height': unit,
				'width': '90%',
				'border-bottom': '1px solid #ccc',
				'position': 'absolute',
				'top': unit * i,
				'content': ''
			}).appendTo('.wrapper');
		}
	}
  } 
});