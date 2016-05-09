var utils = utils || {
  isArray(d) {
    return d && d.constructor === Array && d instanceof Array;
  },

  isObject(d) {
    return d && d.constructor === Object && d instanceof Object;
  },
  
  isFunction(func){
     return func && {}.toString.call(func) === '[object Function]';
  },
  
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  
  isPercentage(n){
    let split = null;
    if(!n || typeof n !== 'string'){
      return false;
    }
    split =  n.split('%');
    return split.length === 2 
      && (+split[0] >= 0) 
      && (+split[0] <=100);
    
  },
  
  getNumberOfDifferentArrayKeys(array, field) {
    var keys = [];
    var element = null;

    if (!array || !array.length) {
      return 0;
    }

    for (let i = 0; i < array.length; i++) {
      element = field ? array[i][field] : array[i];
      if (element) {
        keys.push(element);
      }
    }
    return d3.set(keys).size();
  },

  sortBy(array, o) {
    var _toString = Object.prototype.toString;
    var _parser = (x) => { return x; };
    var _getItem = (x) => {
      return _parser((x !== null && typeof x === 'object' && x[o.prop]) || x);
    };

    if (!(array instanceof Array) || !array.length) {
      return [];
    }
    if (_toString.call(o) !== '[object Object]') {
      o = {};
    }
    if (typeof o.parser !== 'function') {
      o.parser = _parser;
    }
    o.desc = o.desc ? -1 : 1;
    return array.sort((a, b) => {
      a = _getItem.call(o, a);
      b = _getItem.call(o, b);
      return o.desc * (a < b ? -1 : +(a > b));
    });
  }
};