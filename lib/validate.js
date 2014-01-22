var validator = require('validator');

var ValidateAble = module.exports = function () {

  this.validateFn = function () {};

  this.runValidate = function (cb) {
    var failed = false;
    var errors = [];

    var check_if = function(){
      var arr = arguments[0] instanceof Array;
      var func =  arr ? arguments[0][0] : arguments[0];
      var msg = arr ? arguments[0][1] : func + " of " + arguments[1] + " is not valid.";
      var valid = validator[func].apply(this, Array.prototype.slice.call(arguments, 1));
      if (valid) {
        return valid;
      } else {
        failed = true;
        errors.push(msg)
      };
    };

    try {
      this.validateFn && this.validateFn(check_if, this);
    } catch (e) {
    }

    if (errors.length > 0) {
      failed = true;
      process.nextTick(function () {
        cb(errors, null);
      });
    }

    return !failed
  };

};
