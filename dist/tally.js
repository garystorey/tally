/*! Tally - v0.5.0 - 2013-06-03
* Copyright (c) 2013 Gary Storey; Licensed MIT */
(function($) {
'use strict';
var Tally = function( elm, options ) {

	this.debug = false;
  this.el = elm;
	this.$el = $(elm);
	this.init( options );
};

Tally.prototype = {

  init : function ( options ) {

    this._setOptions ( options );
    this.$el.data('Tally', this);
    this._events = 'focusin.tally focusout.tally keyup.tally keydown.tally input.tally paste.tally',
    this._initialized = false;
    this._buildTallyObject();
    this._bindEvents();

    return this.$el;
  },

  _setOptions : function ( options ) {
    var isData = this.$el.data('tally');
    this.options = $.extend( true, {}, $.fn.tally.defaults, options );

    if ( isData ) {
      this.options = $.extend(true,{}, this.options , isData );
    }
    this.options.textfield.maxlength = (this.$el.attr("maxlength")) ? this.$el.attr("maxlength") : this.options.textfield.maxlength;

  },

  _bindEvents : function() {
    var self = this,
        opts = self.options,
        evts = self._events;
    
    self.$el.on( evts , function ( evt ) {
      switch( evt.type ) {

        case 'focusin':
          self.$tally.addClass( opts.tallyClass )
            .css({ 'position':'absolute', 'zIndex':opts.zIndex })
            .show()
            .find('.tallyText').text( self._buildText() );
          self._setXY();
          break;

        case 'focusout':
          self.$tally.removeClass( opts.tallyClass )
            .removeClass( opts.warningClass )
            .css({ 'position':'static', 'zIndex':'auto' })
            .hide()
            .find('.tallyText').text('');
          break;

        default:
         self.$tally.find('.tallyText').text( self._buildText() );
      }
      self._updateClasses( evt.target );
    });
  },

  _updateClasses : function ( el ) {
    if ( this.options.textfield.warnAt >= this._countChars() ) {
      if (!this.$tally.hasClass( this.options.warningClass )) {
        $(el).addClass( this.options.textfield.warningClass );
        this.$tally.addClass( this.options.warningClass );
        this.$el.trigger('tallyWarning');
      }

    } else {
      if (this.$tally.hasClass( this.options.warningClass )) {
        $(el).removeClass( this.options.textfield.warningClass );
        this.$tally.removeClass( this.options.warningClass );
        this.$el.trigger('tallyPass');
      }
    }
  },

  _buildText : function() {
      var pattern = this.options.tallyPattern,
          words = this._countWords(),
          count = this._pad( this._countChars() );
      return pattern.replace('{{c}}', count )
              .replace('{{m}}', this.options.textfield.maxlength)
              .replace('{{w}}', words)
              .replace('{{p}}', this._getPercentage( count, this.options.textfield.maxlength ));
  },

  _countChars : function () {
    return this.options.textfield.maxlength - this.$el.val().length;
  },

  _getPercentage: function (curr,max) {
    return 100 - ( parseInt( Math.floor( (curr / max) * 100 ) ,10 ) );
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
        $t = $('#' + opts.tallyID), //shortcut name
        div,span;

    if ( !this._initialized  && $t.length === 0 ) {

      div = $('<div/>', { 'id': opts.tallyID}).hide();
      span = $('<span/>', { 'class': opts.progressBarClass });
      span.appendTo(div);
      span= $('<span/>',{'class' : 'tallyText'}).appendTo(div);
      div.appendTo('body');
      this._initialized = true;
    } else {
        this.$tally = $t;
    }
  },

  destroy : function () {

    if ( this._initialized ) {
        this.$tally.remove();
        this.$tally = undefined;
        this.$el.off('.tally');
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

_pad : function ( num ) {
  var len = this.options.textfield.maxlength;
  len = len.length; num = num + '';
  while ( num.length < len ) { 
    num = '0'+ num; }
  return num;
}


};

jQuery.fn.tally = function( options ) {
  if ( typeof options !== 'string' ) {
    return this.each( function () {
      var obj = new Tally( $( this ), options );
      obj.init();
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
  tallyID : 'tallyID',
	tallyClass : 'tally',
  tallyPattern : '{{c}}/{{m}}',
  warningClass : 'warningClass',
  zIndex : 100,
  textfield : {
    warnAt : 10,
    maxlength : 256,
    warningClass : 'txtWarningClass'
  },
  position : {
    x : "right",
    y : "bottom",
    offsetX: 0,
    offsetY: 0
  }
};

}(jQuery));