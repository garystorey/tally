(function($) {
'use strict';
var Tally = function( elm, options ) {
  this.el = elm;
	this.$el = $(elm);
  this._initialized = false;
	this.init( options );
};

Tally.prototype = {

  init : function ( options ) {
    this.type = 'Tally';
    this._setOptions ( options );
    this.$el.data('Tally', this);
    this._events = 'focusin.tally focusout.tally keyup.tally keydown.tally input.tally paste.tally';
    this._buildTallyObject();
    this._bindEvents();
    return this.$el;
  },

  destroy : function () {
    if ( this._initialized ) {
        this.$tally.remove();
        this.$tally = undefined;
        this.$el.off('.tally');
    }
  },

  _setOptions : function ( options ) {
    var isData = this.$el.data('tally');
    this.options = $.extend( true, {}, $.fn.tally.defaults, options );
    if ( isData) { this.options = $.extend( true, {}, this.options , isData ); }
    this.options.maxlength = ( this.$el.attr('maxlength') ) ? this.$el.attr('maxlength') - 0 : this.options.maxlength - 0;
    this.options.countDirection = this.options.countDirection.toLowerCase();
    if ( 'updown'.indexOf( this.options.countDirection ) === -1 ) { this.options.countDirection = 'up'; }
  },

  _bindEvents : function() {
    var self = this,
        opts = self.options,
        evts = self._events;
    
    self.$el.on( evts , function ( evt ) {
      switch( evt.type ) {

        case 'focusin':

          self.$tallyText.text( self._buildText() );
          self.$tally.addClass( opts.classes.main );
          if ( opts.setPosition ) { 
            self.$tally.css({ 'position':'absolute', 'zIndex': opts.position.zIndex });
            self.$tallyBar.css({ 'position' : 'relative', 'zIndex' : opts.position.zIndex + 1 });
            self.$tallyText.css({ 'position' : 'relative', 'zIndex' : opts.position.zIndex + 2 });
            self._setXY(); 
          } 
          self.$tally.show();

          break;

        case 'focusout':
          self.$tally.removeClass( opts.classes.main + ' ' + opts.classes.warning ).hide();
          self.$tallyText.text('');

          if ( opts.setPosition ) { 
            self.$tally.css({ 'position':'static', 'zIndex':'auto' });
            self.$tallyText.css({ 'position':'static', 'zIndex':'auto' });
            self.$tallyBar.css({ 'position':'static', 'zIndex':'auto' });
          }

          break;

        default:
         self.$tallyText.text( self._buildText() );
      }

      self._updateClasses( evt );
      if ( opts.showProgressBar ) { self._updateProgressBar(); }

    });
  },

  _updateProgressBar : function () {
    this.$tallyBar.css('background-width', this._getPercentage()+'%');
  },

  _fireEvent : function ( type ) {
    var evt = ( type === 'warning') ? 'tallyWarning' : 'tallyPass';
    if ( this.$tally.hasClass( this.options.classes.warning )) {
        this.$el.trigger( evt );
    }
  },

  _hasWarning : function () {
    return (this.$tally.hasClass( this.options.classes.warning ));
  },

  _updateClasses : function ( event ) {

    var el = event.target, etype = event.type,
    warn = this.options.warnAt, dir = this.options.countDirection,
    count = this._countChars(), max = this.options.maxlength;

    if ( etype === 'focusout') {
      $(el).removeClass( this.options.classes.field );
    }

    if ( dir === 'up' && count < ( max - warn ) ) {
      if( this._hasWarning() ) { this._fireEvent('pass'); }
      $(el).removeClass( this.options.classes.field );
      this.$tally.removeClass( this.options.classes.warning );
      return;
    }

    if (dir === 'up' && count >= ( max - warn ) ) {
      if(! this._hasWarning() ){ this._fireEvent('warning'); }
      $(el).addClass( this.options.classes.field );
      this.$tally.addClass( this.options.classes.warning );
      return;
    }

    if ( dir === 'down' && count <= warn ) {
      if(! this._hasWarning() ){ this._fireEvent('warning'); }
      $(el).addClass( this.options.classes.field );
      this.$tally.addClass( this.options.classes.warning );
      return;
    }
    
    if (dir === 'down' && count >= warn ) {
      if( this._hasWarning() ) { this._fireEvent('pass'); }
      $(el).removeClass( this.options.classes.field );
      this.$tally.removeClass( this.options.classes.warning );
      return;
    }
  },

  _buildText : function() {
      var pattern = this.options.pattern,
          words = this._countWords(),
          count = this._pad( this._countChars() ),
          percent = this._getPercentage( count, this.options.maxlength );

      pattern = pattern.replace('{{c}}', count )
        .replace('{{m}}', this.options.maxlength)
        .replace('{{w}}', words)
        .replace('{{p}}', this._pad(percent,3));

      return pattern;
  },

  _countChars : function () {
    return (this.options.countDirection === 'down') ? this.options.maxlength - this.$el.val().length : this.$el.val().length;
  },

  _getPercentage: function (curr,max) {
    return (this.options.countDirection === 'down') ? 100 - ( parseInt( Math.floor( (curr / max) * 100 ) , 10 ) ) : parseInt( Math.floor( (curr / max) * 100 ) , 10 );
  },

  _countWords : function () {
    var txt = this.$el.val();
    if ( txt.match(/\S+/g) ) {
      return txt.match(/\S+/g).length;  
    }
    return (txt) ? 1 : 0;
  },

  _buildTallyObject : function () {
    var opts = this.options,
        $t = $('#' + opts.id), //shortcut name
        div,span;

    if ( !this._initialized  && $t.length === 0 ) {

      div = $('<div/>', { 'id': opts.id}).hide();
      this.$tally = div;

      span = $('<span/>', { 'class': opts.classes.progressBar, 'display':'block' });
      span.appendTo(div);
      this.$tallyBar = span;

      span= $('<span/>',{'class' : opts.classes.text, 'display':'block' }).appendTo(div);
      div.appendTo('body');
      this.$tallyText = span;

      this._initialized = true;

    } else {
      
      this.$tally = $t;
      this.$tallyText = $t.find('.'+ opts.classes.text);
      this.$tallyBar = $t.find('.'+ opts.classes.progressBar);

    }
  },

_setXY: function( ) {

  var x = 0, 
      y = 0,
      posX = this.options.position.x,
      posY = this.options.position.y,
      posXo = parseInt( this.options.position.offsetX, 10 ),
      posYo = parseInt( this.options.position.offsetY, 10 ),
      oLeft = this.$el.offset().left,
      oWidth = this.$el.width(),
      oTop = this.$el.offset().top,
      oHeight = this.$el.height(),
      tWidth = this.$tally.outerWidth(),
      tHeight = this.$tally.outerHeight();

  switch ( posX ) {   // Set X-axis coordinate
    case "left" :      // Set to the left side of object
      x = oLeft;
      break;
    case "center" :    // Set to the center of object
      x = oLeft + ( oWidth / 2 ) - ( tWidth / 2 );
      break;
    case "right" :    // Set to the right side of object
      x = oLeft + oWidth - tWidth + 6;
      break;
    default:     // Set to the given number
      x = parseInt( posX, 10 );
  }

  switch ( posY ) {     // Set Y-axis coordinate
    case "top" :    // Set to the top of object
      y = oTop - tHeight -8;
      break;        
    case "center" :    // Set to the center of object
      y = oTop + ( oHeight / 2 ) - ( tHeight / 2 );
      break;
    case "bottom" :    // Set to the bottom of object
      y = oTop + oHeight + 7;
      break;
    default:     // Set to the given number
      y = parseInt( posY, 10 );
} 

// Because these combinations will overlap the ends of the textbox 
// we will move to right outside of it
if ( posX === "left" && posY === "center" ) { x -= ( tWidth +13 ); }
if ( posX === "right" && posY === "center" ) { x += ( tWidth +12 ); }

if ( typeof posXo === "number" )     { x += parseInt( posXo, 10 ); }
if ( typeof posYo === "number" )     { y += parseInt( posYo, 10 ); }

//Set the coordinates
this.$tally.css( { top: y, left: x } );

},

_pad : function ( num, len, achar ) {
  var tmp = this.options.maxlength + '';
  len = len || tmp.length;
  achar = achar || '0';
  num = num + '';

  while ( num.length < len ) { 
    num = achar + num; 
  }
  return num;
}

};

jQuery.fn.tally = function( options ) {
  if ( typeof options !== 'string' ) {
    return this.each( function () {
      new Tally( $( this ), options );
    });
  } else {
    Tally = $(this).data('Tally');
    if (Tally !== null) {
      switch( options ) {
        case 'init':
          Tally.init();
          break;
        case 'destroy':
        Tally.destroy();
          break;
      }
    }
  }
};

jQuery.fn.tally.defaults = {

  id : 'tally',
  pattern : '{{c}}/{{m}}',
  showProgressBar : true,
  warnAt : 10,
  maxlength : 256,
  countDirection : 'up',

  classes : {
    main : 'tally',
    text : 'tally-text',
    progressBar : 'tally-progressBar',
    warning : 'tally-warning',
    field : 'tally-fieldWarning'
  },

  setPosition : true,
  position : {
    zIndex : 100,
    x : 'right',
    y : 'bottom',
    offsetX: 0,
    offsetY: 0
  }
};

}(jQuery));
