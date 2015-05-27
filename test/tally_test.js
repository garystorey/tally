"use strict";


QUnit.test( "Testing TallyJS: ", function( assert ) {

  var elem1 = $( "#testTextArea" );
  var msg = " default has been set", txt = "changed", num = 999,
      txtString = "{{m}}/{{c}}={{r}} ({{w}}) {{p}}%";

  assert.ok( $.fn.tally, "should be available on the jquery object" );
  assert.ok( elem1.tally().addClass( "myTextCounter" ), "can be chained" );
  assert.strictEqual( elem1.hasClass( "myTextCounter" ), true, "class was added from chaining" );
  elem1.removeClass( "myTextCounter" );

  var defaults = $.fn.tally.defaults;
  var dclasses = defaults.classes;
  assert.ok( defaults, "defaults are available" );
  assert.strictEqual( defaults.id, "tally", "id" + msg );
  assert.strictEqual( defaults.pattern, "{{c}}/{{m}}", "pattern" + msg );
  assert.strictEqual( defaults.showProgressBar, true, "showProgressBar" + msg );
  assert.strictEqual( defaults.warnAt, 10, "warnAt" + msg );
  assert.strictEqual( defaults.maxlength, 256, "maxlength" + msg );
  assert.strictEqual( defaults.countDirection, "up", "countDirection" + msg );
  assert.strictEqual( dclasses.main, "tally", "classes.main" + msg );
  assert.strictEqual( dclasses.text, "tally-text", "tallyText" + msg );
  assert.strictEqual( dclasses.warning, "tally-warning", "classes.warning" + msg );
  assert.strictEqual( dclasses.progressBar, "tally-progressBar", "classes.progressBar" + msg );
  assert.strictEqual( dclasses.field, "tally-fieldWarning", "classes.field" + msg );
  assert.strictEqual( defaults.setPosition, true, "setPosition" + msg );
  assert.strictEqual( defaults.position.zIndex, 100, "position: zIndex" + msg );
  assert.strictEqual( defaults.position.x, "right", "position: x" + msg );
  assert.strictEqual( defaults.position.y, "bottom", "position: y" + msg );
  assert.strictEqual( defaults.position.offsetX, 0, "position: offsetX" + msg );
  assert.strictEqual( defaults.position.offsetY, 0, "position: offsetY" + msg );

  msg = " can be changed.";
  defaults.id = txt;
  assert.strictEqual( defaults.id, txt, "id" + msg );
  defaults.pattern = txt;
  assert.strictEqual( defaults.pattern, txt, "pattern" + msg );
  defaults.showProgressBar = false;
  assert.strictEqual( defaults.showProgressBar, false, "showProgressBar" + msg );
  defaults.warnAt = num;
  assert.strictEqual( defaults.warnAt, num, "warnAt" + msg );
  defaults.maxlength = num;
  assert.strictEqual( defaults.maxlength, num, "maxlength" + msg );
  defaults.countDirection = txt;
  assert.strictEqual( defaults.countDirection, txt, "countDirection" + msg );
  dclasses.main = txt;
  assert.strictEqual( dclasses.main, txt, "classes.main" + msg );
  dclasses.text = txt;
  assert.strictEqual( dclasses.text, txt, "classes.text" + msg );
  dclasses.progressBar = txt;
  assert.strictEqual( dclasses.progressBar, txt, "classes.progressBar" + msg );
  dclasses.warning = txt;
  assert.strictEqual( dclasses.warning, txt, "classes.warning" + msg );
  dclasses.field = txt;
  assert.strictEqual( dclasses.field, txt, "classes.field" + msg );
  defaults.setPosition = false;
  assert.strictEqual( defaults.setPosition, false, "setPosition" + msg );
  defaults.position.zIndex = num;
  assert.strictEqual( defaults.position.zIndex, num, "zIndex" + msg );
  defaults.position.x = txt;
  assert.strictEqual( defaults.position.x, txt, "position: x" + msg );
  defaults.position.offsetX = num;
  assert.strictEqual( defaults.position.offsetX, num, "position: offsetX" + msg );
  defaults.position.y = txt;
  assert.strictEqual( defaults.position.y, txt, "position: y" + msg );
  defaults.position.offsetY = num;
  assert.strictEqual( defaults.position.offsetY, num, "position: offsetY" + msg );

  msg = " can be overrriden with data attribute";

  //Need to test each property as it is added here
  var e1d = elem1.data( "Tally" ).options;

  assert.strictEqual( e1d.id, "tallyID2", "id" + msg );
  assert.strictEqual( e1d.pattern, txtString, "pattern" + msg );
  assert.strictEqual( e1d.warnAt, 5, "warnAt" + msg );
  assert.strictEqual( e1d.countDirection, "down", "countDirection" + msg );
  assert.strictEqual( e1d.classes.main, "datatally", "classes.main" + msg );
  assert.strictEqual( e1d.classes.text, "tallyTextClass", "classes.text" + msg );
  assert.strictEqual( e1d.classes.progressBar, "progressBar", "classes.progressBar" + msg );
  assert.strictEqual( e1d.classes.warning, "warningClass3", "classes.warning" + msg );
  assert.strictEqual( e1d.classes.field, "txtWarn", "classes.field" + msg );
  assert.strictEqual( e1d.setPosition, true, "setPosition" + msg );
  assert.strictEqual( e1d.position.zIndex, 150, "position: zIndex" + msg );
  assert.strictEqual( e1d.position.x, "left", "position: X" + msg );
  assert.strictEqual( e1d.position.offsetX, 2, "position: offsetX" + msg );
  assert.strictEqual( e1d.position.y, "top", "position: y" + msg );
  assert.strictEqual( e1d.position.offsetY, 2, "position: offsetY" + msg );
  assert.strictEqual( elem1.attr( "maxlength" ), "25", "maxlength can be overriden by attribute" );

  var elem2 = $( "#testTextArea2" );
  elem2.tally();
  var showProgress = elem2.data( "Tally" ).options.showProgressBar;
  assert.strictEqual( showProgress, false, "showProgressBar" + msg );

  txtString = "25/09=16 (4) 064%";
  elem1.trigger( "focusin.tally" );
  var tally = $( "#tallyID2" );
  var zindexForProgressBar = tally.find( ".progressBar" ).css( "z-index" );
  var tallyText = tally.find( ".tallyTextClass" );
  assert.strictEqual( tally.length, 1, "Tally object added" );
  assert.strictEqual( tally.css( "display" ), "block", "- is visible on focus" );
  assert.ok( tally.hasClass( "datatally" ), "- correct class on focus" );
  assert.strictEqual( tally.css( "z-index" ), "150", "- tally z-index correct on focus" );
  assert.strictEqual( zindexForProgressBar, "151", "- bar z-index correct" );
  assert.strictEqual( tallyText.css( "z-index" ), "152", "- text z-index correct" );
  assert.strictEqual( tallyText.text(), txtString, "- shows length" );

  elem1.trigger( "focusout.tally" );
  assert.strictEqual( tally.css( "display" ), "none", "Tally object is NOT visible on blur" );
  assert.ok( !tally.hasClass( "datatally" ), "Tally object does not have class on blur" );
  assert.strictEqual( tally.css( "z-index" ), "auto", "- default z-index correct on blur" );
  assert.strictEqual( tally.find( ".tallyTextClass" ).text(), "", "- no text on blur." );

  var top = 0;
  var left = 0;
  elem1.trigger( "focusin.tally" );
  top = elem1.offset().top - tally.outerHeight() - 8 + 2 + "px";
  left = elem1.offset().left + 2 + "px";
  assert.strictEqual( tally.css( "top" ), top, "Y coordinate is correct" );
  assert.strictEqual( tally.css( "left" ), left, "X coordinate is correct" );

  txtString = "25/04=21 (5) 084%";

  elem1.on( "tallyWarning", function() {
    assert.ok( true, "tallyWarning Event fired" );
  } ).on( "tallyPass", function() {
    assert.ok( true, "tallyPass Event fired" );
  } );

  elem1.text( "this is the text plus" ).trigger( "keyup.tally" );
  assert.strictEqual( tally.text(), txtString, "Text has been updated" );
  assert.ok( tally.hasClass( "warningClass3" ), "Tally Object has warning class" );
  assert.ok( elem1.hasClass( "txtWarn" ), "Textfield has warning class" );
  elem1.text( "remove" ).trigger( "keyup.tally" );
  assert.ok( !tally.hasClass( "warningClass3" ), "Tally Object warning class removed" );
  assert.ok( !elem1.hasClass( "txtWarn" ), "Textfield warning class removed" );
} );
