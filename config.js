module.exports = function() {
  var config = {
    source: './src/*.js',
    destination: './dist',
    testpage: './test/tally.html',
    rename: { suffix: '.min' }
  };
  return config;
};
