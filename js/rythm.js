var vRythm = (function (w) {
    var verticalRythm = {

        initialize: function (el) {
            this.element = el;
            this.results = {};

            this.addEvents();
            this.setValues();
        },

        /**
         * Get and set the user values.
         * @public
         */
        setValues: function () {
            this.inputs = this.inputs ? this.inputs : this.elements = this.element.find('input');
            this.results = {}; // Clear the old values, if there are any

            // Create the results object.
            // Keys are the 'data-el' attributes and values the input's value.
            this.inputs.each($.proxy(function (i, el) {
                var obj = $(el).data('el');

                this.results[obj] = {};

                // We only need to store line-height, no need for calculations there.
                if (($(el).attr('name') === 'line_height')) {
                    this.results[obj]['height'] = el.value;
                } else {
                    this.results[obj]['sizes'] = parseInt(el.value, 10);
                }
            }, this));

            this.calculateValues(this.results); // Ready to calculate
        },

        /**
         * Listen for events.
         * @public
         */
        addEvents: function () {
            // If an input value changes, set the values again
            this.element.on('change', 'input', $.proxy(this.setValues, this));
            this.element.on('values_updated', this.calculateValues);
        },

        /**
         * Makes the calculations.
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         * @public
         */
        calculateValues: function (data) {
            // Line height will default to 1.5 (150%)
            var magicNumber = data.body.sizes * (data.line_height.height || 1.5),
                item = [],
                originalBodyTextSize = this.results['body']['sizes']; // The selected body size

            for (item in data) {
                if (item === 'body') {
                    // body em size is relative to the browser's 16px default
                    this.results['body']['emSize'] = this.results['body']['sizes'] / 16;
                } else if (item !== 'line_height') {
                    // h[x] / pixel value = size (em)
                    this.results[item]['emSize'] = (this.results[item]['sizes'] / 16);
                    this.results[item]['line'] = this.results[item]['margin'] = (magicNumber / this.results[item]['sizes']);
                }
            }

            this.setResults(this.results);
            this.showGrid(this.results.body.sizes, this.results.line_height.height);

        },

        /**
         * Display a vertical rythm grid to confirm the values.
         * @param  {[type]} size [description]
         * @public
         */
        showGrid: function (size, line) {
            var oldWrap = $('.wrapper'),
                options = {};

            if (oldWrap.length) {
                oldWrap.remove(); // Clear old lines, if any
            }

            options = {
                fontSize: size,
                lineHeight: line
            };

            // Create the lines.
            function heightLines(options) {
                var fontSize   = options.fontSize || 16,
                    lineHeight =  options.lineHeight || 1.5,
                    unit       = fontSize * lineHeight,
                    wrapper    = $('<div></div>')
                        .addClass('wrapper')
                        .prependTo('.dummy'),
                    rows       = $('.dummy').height() / unit,
                    i          = 0, grid;

                for (i; i < rows; i += 1) {
                    grid = $('<div></div>').css({
                        'height': fontSize / 16 + 'em',
                        'width': '100%',
                        'border-bottom': '1px solid #ccc',
                        'position': 'absolute',
                        'top': (unit * i) / 16 + 'em',
                        'content': ''
                    }).appendTo(wrapper);
                }
            }

            heightLines(options);
        },

        /**
         * Applies the results to the the sample.
         * @param  {[type]} data [description]
         * @public
         */
        setResults: function (data) {
            $('.body-gen').css({
                'font-size'    : data.body.emSize + 'em',
                'line-height'  : data.line_height.height,
                'margin-bottom': data.line_height.height + 'em'
            });

            this.generateTemplate(data);

            // Apply to all H(n) sizes
            for (var i = 1; i < 6; i += 1) {
                $('.dummy h' + i).css({
                    'font-size'    : data['h' + i].emSize + 'em',
                    'line-height'  : data['h' + i].line + 'em',
                    'margin-bottom': data['h' + i].margin + 'em'
                });
            }
        },

        /**
         * Create a CSS template to copy from.
         * @param  {[type]} data [description]
         * @public
         */
        generateTemplate: function (data) {
            var container = $('.css').empty();

            this._template = this._template ||
                $.ajax({
                'url': './tmpl.html',
                type: 'GET'
            });

            this._template.success(function (res) {
                var compiled = w._.template(res, data);
                $(compiled).appendTo($('.css'));
            });
        }
    };

    return verticalRythm;

}(window));