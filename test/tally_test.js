(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#tally', {
    // This will run before each test in this module.
    setup: function() {
      this.elem1 = $('#testTextArea');
      this.elem2 = $('#testTextArea2');
      this.tally = $('#tallyID2');
    }
  });

  test('Is available?',1, function() {
    ok($.fn.tally, 'should be available on the jquery object');
  });

 test('Is chainable?', function(){
    ok(this.elem1.tally().addClass('myTextCounter'), 'can be chained');
    strictEqual(this.elem1.hasClass('myTextCounter'), true, 'class was added correctly from chaining');
    this.elem1.removeClass('myTextCounter');
  });


  test('Has defaults?', function(){
    ok($.fn.tally.defaults, 'defaults are available');
  });
  
  test('defaults are set?', function() {
    var msg = ' default has been set';

    strictEqual($.fn.tally.defaults.tallyClass,'tally', 'tallyClass' + msg);
    strictEqual($.fn.tally.defaults.warningClass,'tally-warningClass', 'warningClass' + msg);
    strictEqual($.fn.tally.defaults.tallyID,'tallyID', 'tallyID' + msg);
    strictEqual($.fn.tally.defaults.tallyPattern,'{{c}}/{{m}}', 'tallyPattern' + msg);
    strictEqual($.fn.tally.defaults.textClass,'tally-text', 'tallyText' + msg);

    strictEqual($.fn.tally.defaults.showProgressBar,true, 'showProgressBar' + msg);
    strictEqual($.fn.tally.defaults.progressBarClass,'tally-progressBar', 'progressBarClass' + msg);

    strictEqual($.fn.tally.defaults.textfield.warnAt,10, 'textfield: warnAt' + msg);
    strictEqual($.fn.tally.defaults.textfield.maxlength,256, 'textfield: maxlength' + msg);
    strictEqual($.fn.tally.defaults.textfield.warningClass,'tally-txtWarningClass', 'textfield: warningClass' + msg);

    strictEqual($.fn.tally.defaults.setPosition, true, 'setPosition' + msg);

    strictEqual($.fn.tally.defaults.position.zIndex,100, 'position: zIndex' + msg);
    strictEqual($.fn.tally.defaults.position.x,'right', 'position: x' + msg);
    strictEqual($.fn.tally.defaults.position.y,'bottom', 'position: y' + msg);
    strictEqual($.fn.tally.defaults.position.offsetX,0, 'position: offsetX' + msg);
    strictEqual($.fn.tally.defaults.position.offsetY,0, 'position: offsetY' + msg);

  });

  test('defaults can be changed?', function() {
    var msg = ' can be changed.';

    $.fn.tally.defaults.tallyClass = 'tally2';
    strictEqual($.fn.tally.defaults.tallyClass, 'tally2', 'tallyClass' + msg);

    $.fn.tally.defaults.warningClass = 'warningClass2';
    strictEqual($.fn.tally.defaults.warningClass, 'warningClass2', 'warningClass' + msg);

    $.fn.tally.defaults.tallyID = 'tally2';
    strictEqual($.fn.tally.defaults.tallyID, 'tally2', 'tallyID' + msg);

    $.fn.tally.defaults.tallyPattern = '{{m}}';
    strictEqual($.fn.tally.defaults.tallyPattern, '{{m}}', 'tallyPattern' + msg);

    $.fn.tally.defaults.textClass = 'txt-tally';
    strictEqual($.fn.tally.defaults.textClass, 'txt-tally', 'textClass' + msg);

    $.fn.tally.defaults.showProgressBar = false;
    strictEqual($.fn.tally.defaults.showProgressBar, false, 'showProgressBar' + msg);

    $.fn.tally.defaults.progressBarClass = 'pb';
    strictEqual($.fn.tally.defaults.progressBarClass, 'pb', 'progressBarClass' + msg);

    $.fn.tally.defaults.textfield.warnAt = 15;
    strictEqual($.fn.tally.defaults.textfield.warnAt, 15, 'textfield: warnAt' + msg);

    $.fn.tally.defaults.textfield.maxlength = 50;
    strictEqual($.fn.tally.defaults.textfield.maxlength, 50, 'textfield: maxlength' + msg);

    $.fn.tally.defaults.textfield.warningClass = 'textfieldWarning';
    strictEqual($.fn.tally.defaults.textfield.warningClass, 'textfieldWarning', 'textfield: warningClass' + msg);

    $.fn.tally.defaults.setPosition = false;
    strictEqual($.fn.tally.defaults.setPosition, false, 'setPosition' + msg);

    $.fn.tally.defaults.position.zIndex = 50;
    strictEqual($.fn.tally.defaults.position.zIndex, 50, 'zIndex' + msg);

    $.fn.tally.defaults.position.x = 'center';
    strictEqual($.fn.tally.defaults.position.x, 'center', 'position: x' + msg);

    $.fn.tally.defaults.position.offsetX = 1;
    strictEqual($.fn.tally.defaults.position.offsetX, 1, 'position: offsetX' + msg);

    $.fn.tally.defaults.position.y = 'middle';
    strictEqual($.fn.tally.defaults.position.y, 'middle', 'position: y' + msg);

    $.fn.tally.defaults.position.offsetY = 1;
    strictEqual($.fn.tally.defaults.position.offsetY, 1, 'position: offsetY' + msg);

  });

  test('Data elements override defaults?', function() {
    var msg = ' can be overrriden with data attribute',
        txtString = '{{m}}/{{c}} ({{w}}) {{p}}%';

    this.elem1.tally();
    this.elem2.tally();

    //Need to test each property as it is added here

    strictEqual(this.elem1.data('Tally').options.tallyClass, 'datatally','tallyClass' + msg);
    strictEqual(this.elem1.data('Tally').options.tallyID, 'tallyID2','tallyID' + msg);
    strictEqual(this.elem1.data('Tally').options.warningClass, 'warningClass3','warningClass' + msg);
    strictEqual(this.elem1.data('Tally').options.tallyPattern, txtString,'tallyPattern' + msg);
    strictEqual(this.elem1.data('Tally').options.textClass, 'tallyTextClass','textClass' + msg);

    strictEqual(this.elem2.data('Tally').options.showProgressBar, false,'showProgressBar' + msg);
    strictEqual(this.elem1.data('Tally').options.progressBarClass, 'progressBar','progressBarClass' + msg);

    strictEqual(this.elem1.data('Tally').options.textfield.warnAt, 5,'textfield: warnAt' + msg);
    strictEqual(this.elem1.data('Tally').options.textfield.warningClass, 'txtWarn','textfield: warningClass' + msg);

    strictEqual(this.elem1.data('Tally').options.setPosition, true,'setPosition' + msg);
    strictEqual(this.elem1.data('Tally').options.position.zIndex, 150,'position: zIndex' + msg);
    strictEqual(this.elem1.data('Tally').options.position.x, 'left','position: X' + msg);
    strictEqual(this.elem1.data('Tally').options.position.offsetX, 2,'position: offsetX' + msg);
    strictEqual(this.elem1.data('Tally').options.position.y, 'top','position: y' + msg);
    strictEqual(this.elem1.data('Tally').options.position.offsetY, 2,'position: offsetY' + msg);

  });

  test('Maxlength attribute overrides default?', function() {
    strictEqual(this.elem1.attr('maxlength'), '25','maxlength can be overriden by attribute');
  });

  test('Tally div added?', function() {
    this.elem1.tally();
    strictEqual(this.tally.length,1,'Tally object added');
  });

  test('On focus?', function() {
    var txtString = '25/09 (4) 064%';
    this.elem1.tally().trigger('focusin.tally');
    strictEqual(this.tally.css('display'), 'block', 'Tally object is visible on focus');
    ok(this.tally.hasClass('datatally'), 'Tally object has correct class on focus');
    strictEqual(this.tally.css('z-index'),'150', 'Tally object has z-index set correctly on focus');
    strictEqual(this.tally.find('.progressBar').css('z-index'), '151', 'Tally Progress Bar has z-index set correctly')  ;
    strictEqual(this.tally.find('.tallyTextClass').css('z-index'), '152', 'Tally text has z-index set correctly')  ;
    strictEqual(this.tally.find('.tallyTextClass').text(), txtString, 'Tally shows length of textarea')  ;
  });    

  test('On blur?', function() {
    this.elem1.tally().trigger('focusout.tally');
    strictEqual(this.tally.css('display'),'none', 'Tally object is NOT visible on blur');
    ok(!this.tally.hasClass('datatally'), 'Tally object does not have class on blur');
    strictEqual(this.tally.css('z-index'),'auto', 'Tally object has default z-index set correctly on blur');
    strictEqual(this.tally.find('.tallyTextClass').text(),'','Tally no longer shows length of textarea on blur.')  ;
  });

  test('Is positioned?', function() {
    var top = 0, left = 0 ,el=$("#tallyID2");
    this.elem1.tally().trigger('focusin.tally');
    top = this.elem1.offset().top - el.outerHeight() -8 + 2 +'px';
    left = this.elem1.offset().left + 2 +'px';
    strictEqual( el.css("top"), top , 'Y coordinate is correct');
    strictEqual( el.css("left"), left , 'X coordinate is correct');
  });

  test('Tally updates correctly?', function() {
    var txtString = '25/04 (5) 084%';
    this.elem1.on('tallyWarning', function(){ ok(true,'tallyWarning Event fired'); })
      .on('tallyPass', function(){ ok(true,'tallyPass Event fired'); });

    this.elem1.tally().text('this is the text plus').trigger('keyup.tally');
    strictEqual( this.tally.text(), txtString, 'Text has been updated' );
    ok(this.tally.hasClass('warningClass3'),'Tally Object has warning class');
    ok(this.elem1.hasClass('txtWarn'),'Textfield has warning class');
    this.elem1.text('remove').trigger('keyup.tally');
    ok(!this.tally.hasClass('warningClass3'),'Tally Object warning class removed');
    ok(!this.elem1.hasClass('txtWarn'),'Textfield warning class removed');

  });

 }(jQuery));
