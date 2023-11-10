function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const validateFormData = (obj) => {
  if (obj === undefined || obj === null) {
    console.log('no form data to validate, obj is null.');
    return false;
  }
  // obj { name: '', email: '', phone: '', message: '' }
  let keys = Object.keys(obj).sort(); // lets say BOT has added another form field like url
  // then we should check that
  if (keys.length != 4) {
    return false;
  }
  // also are names really
  let allowedKeys = ['name', 'email', 'phone', 'message'].sort();
  if (!arraysEqual(keys, allowedKeys)) {
    return false;
  }
  console.log('continue checking');
};
module.exports = { validateFormData };
