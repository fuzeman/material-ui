const React = require('react');

function isEqual(a, b) {
  let typeA = typeof a,
      typeB = typeof b;

  if(typeA !== typeB) {
    return false;
  }

  if(a === null) {
    return true;
  }

  if(typeA === 'object') {
    if(Array.isArray(a) || Array.isArray(b)) {
      return isArraysEqual(a, b);
    } else if(React.isValidElement(a) || React.isValidElement(b)) {
      return isElementsEqual(a, b);
    } else {
      return isObjectsEqual(a, b);
    }
  }

  // Fallback to basic item comparison
  return a === b;
}

function isArraysEqual(a, b) {
  if(!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  // Compare length
  if(a.length !== b.length) {
    return false;
  }

  // Compare items
  for(let i = 0; i < a.length; ++i) {
    // Check items match between `a` and `b`
    if(!isEqual(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

function isElementsEqual(a, b) {
  if(!React.isValidElement(a) || !React.isValidElement(b)) {
    return false;
  }

  let stateA = a.state,
      stateB = b.state;

  // Compare element states
  if((stateA !== 'undefined' || stateB !== 'undefined') && !isObjectsEqual(stateA, stateB)) {
    return false;
  }

  // Compare element properties
  return isObjectsEqual(a.props, b.props);
}

function isObjectsEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  let keysA = Object.keys(a),
    keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  let bHasOwnProperty = hasOwnProperty.bind(b);

  for (let i = 0; i < keysA.length; i++) {
    if(!bHasOwnProperty(keysA[i])) {
      return false;
    }

    let key = keysA[i];

    if(!isEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

module.exports = {
  shouldComponentUpdate: function (nextProps, nextState) {
    return (
      !isObjectsEqual(this.props, nextProps) ||
      !isObjectsEqual(this.state, nextState)
    );
  },
};
