/*global jQuery */
( function( $ ) {

  "use strict";

  var Tally = function( elm, options ) {
    this.el = elm;
    this.$el = $( elm );
    this._initialized = false;
    this.init( options );
  };

  Tally.prototype = {

  init: function( options ) {
    this.type = "Tally";
    this._setOptions ( options );
    this.$el.data( "Tally", this );
    this._events = "focusin.tally focusout.tally keyup.tally keydown.tally input.tally paste.tally";
    this._buildTallyObject();
    this._bindEvents();
    return this.$el;
  },

  destroy: function() {
    if ( this._initialized ) {
      this.$tally.remove();
      this.$tally = undefined;
      this.$el.off( ".tally" );
    }
  },

  _setOptions: function( options ) {
    var isData = this.$el.data( "tally" ),
        max = this.$el.attr( "maxlength" ),
        opts;

    this.options = $.extend( true, {}, $.fn.tally.defaults, options );
    if ( isData ) {
      this.options = $.extend( true, {}, this.options, isData );
    }
    opts = this.options;
    this.options.maxlength = ( max ) ? max - 0 : opts.maxlength - 0;
    this.options.countDirection = opts.countDirection.toLowerCase();
    if ( "updown".indexOf( opts.countDirection ) === -1 ) { this.options.countDirection = "up"; }
  },

  _updateTally: function( event ) {
    var opts = this.options;
    var pos = ( event === "focusout" ) ? "static" : "relative";
    var pos2 = ( event === "focusout" ) ? "static" : "absolute";
    this.$tally.css( { "position": pos2, "zIndex": opts.position.zIndex } );
    this.$tallyBar.css( { "position": pos, "zIndex": opts.position.zIndex + 1 } );
    this.$tallyText.css( { "position": pos, "zIndex": opts.position.zIndex + 2 } );
    this._setXY();
  },

  _bindEvents: function() {
    var self = this,
        opts = self.options,
        evts = self._events,
        $t = self.$tally,
        $tt = self.$tallyText;

    self.$el.on( evts, function( evt ) {

      switch ( evt.type ) {

        case "focusin":
          $t.addClass( opts.classes.main ).show();
          $tt.text( self._buildText() );
          break;

        case "focusout":
          $t.removeClass( opts.classes.main + " " + opts.classes.warning ).hide();
          $tt.text( "" );
          break;

        default:
          $tt.text( self._buildText() );
      }

      self._updateClasses( evt );
      if ( opts.showProgressBar ) { self._updateProgressBar(); }
      if ( opts.setPosition ) { self._updateTally( evt.type ); }

    } );
  },

  _updateProgressBar: function() {
    this.$tallyBar.css( "background-width", this._getPercentage() + "%" );
  },

  _fireEvent: function( type ) {
    this.$el.trigger( ( type === "warning" ) ? "tallyWarning" : "tallyPass" );
  },

  _hasWarning: function() {
    return ( this.$tally.hasClass( this.options.classes.warning ) );
  },

  _updateClasses: function( event ) {

    var $el = $( event.target ), etype = event.type, opts = this.options,
    warn = opts.warnAt, dir = opts.countDirection, fld = opts.classes.field,
    count = this._countChars(), max = opts.maxlength, check;

    if ( etype === "focusout" ) { $el.removeClass( fld ); }

    this._fireEvent( ( this._hasWarning() ) ? "pass" : "warning" );

    check = ( dir === "up" ) ? ( count < ( max - warn ) ) : ( count > warn );
    this._setClasses( $el, ( check ) ? "remove" : "add" );
    return;
  },

  _setClasses: function( el, method ) {
    var opts = this.options.classes;
    method = ( method === "add" ) ? "addClass" : "removeClass";
    el[method]( opts.field );
    this.$tally[method]( opts.warning );
  },

  _buildText: function() {
    var opts = this.options,
        pattern = opts.pattern,
        max = opts.maxlength,
        words = this._countWords(),
        count = this._pad( this._countChars() ),
        percent = this._getPercentage( count, max );
    pattern = pattern.replace( "{{c}}", count )
      .replace( "{{m}}", max )
      .replace( "{{w}}", words )
      .replace( "{{p}}", this._pad( percent, 3 ) );

    return pattern;
  },

  _countChars: function() {
    var chars = this.$el.val().length, opts = this.options;
    return ( opts.countDirection === "down" ) ? opts.maxlength - chars : chars;
  },

  _getPercentage: function( curr, max ) {
    var num = parseInt( Math.floor( ( curr / max ) * 100 ), 10 );
    return ( this.options.countDirection === "down" ) ? 100 - num : num;
  },

  _countWords: function() {
    var txt = this.$el.val();
    if ( txt.match( /\S+/g ) ) {
      return txt.match( /\S+/g ).length;
    }
    return ( txt ) ? 1 : 0;
  },

  _buildTallyObject: function() {
    var opts = this.options,
        $t = $( "#" + opts.id ), //shortcut name
        div, span;

    if ( !this._initialized  && $t.length === 0 ) {

      div = $( "<div/>", { "id": opts.id } ).hide();
      this.$tally = div;

      span = $( "<span/>", { "class": opts.classes.progressBar, "display":"block" } );
      span.appendTo( div );
      this.$tallyBar = span;

      span = $( "<span/>", { "class": opts.classes.text, "display":"block" } ).appendTo( div );
      div.appendTo( "body" );
      this.$tallyText = span;

      this._initialized = true;

    } else {

      this.$tally = $t;
      this.$tallyText = $t.find( "." + opts.classes.text );
      this.$tallyBar = $t.find( "." + opts.classes.progressBar );

    }
  },

  _setXY: function() {

    var x = 0,
        y = 0,
        pos = this.options.position,
        posX = pos.x,
        posY = pos.y,
        posXo = parseInt( pos.offsetX, 10 ),
        posYo = parseInt( pos.offsetY, 10 ),
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
        y = oTop - tHeight - 8;
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
    if ( posX === "left" && posY === "center" ) { x -= ( tWidth + 13 ); }
    if ( posX === "right" && posY === "center" ) { x += ( tWidth + 12 ); }

    if ( typeof posXo === "number" )     { x += parseInt( posXo, 10 ); }
    if ( typeof posYo === "number" )     { y += parseInt( posYo, 10 ); }

      //Set the coordinates
    this.$tally.css( { top: y, left: x } );

  },

  _pad: function( num, len, achar ) {
    var tmp = this.options.maxlength + "";
      len = len || tmp.length;
      achar = achar || "0";
      num = num + "";

    while ( num.length < len ) {
      num = achar + num;
    }
    return num;
  }

};

  jQuery.fn.tally = function( options ) {
  if ( typeof options !== "string" ) {
    return this.each( function() {
      new Tally( $( this ), options );
    } );
  } else {
    Tally = $( this ).data( "Tally" );
    if ( Tally !== null ) {
      switch ( options ) {
        case "init":
          Tally.init();
          break;
        case "destroy":
          Tally.destroy();
          break;
      }
    }
  }
};

  jQuery.fn.tally.defaults = {

    id: "tally",
    pattern: "{{c}}/{{m}}",
    showProgressBar: true,
    warnAt: 10,
    maxlength: 256,
    countDirection: "up",

    classes: {
      main: "tally",
      text: "tally-text",
      progressBar: "tally-progressBar",
      warning: "tally-warning",
      field: "tally-fieldWarning"
    },

    setPosition: true,
    position: {
      zIndex: 100,
      x: "right",
      y: "bottom",
      offsetX: 0,
      offsetY: 0
    }
  };

}( jQuery ) );
