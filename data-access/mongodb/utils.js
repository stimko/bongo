exports.bind = function(fn, context) {
  return function() {
    fn.apply(context, arguments);
  };
};
