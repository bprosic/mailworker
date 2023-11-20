const emailValidator = require('deep-email-validator'),
  { validate } = emailValidator;

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const validateFormData = async (obj) => {
  if (obj === undefined || obj === null) {
    console.log('no form data to validate, obj is null.');
    return false;
  }
  // obj { name: '', email: '', phone: '', message: '' }
  let keys = Object.keys(obj).sort((a, b) => a.localeCompare(b)); // lets say BOT has added another form field like url
  // then we should check that
  if (keys.length != 4) {
    return { valid: false, error: 'Field number count wrong.' };
  }
  // also are names really
  let allowedKeys = ['name', 'email', 'phone', 'message'].sort((a, b) =>
    a.localeCompare(b)
  );
  if (!arraysEqual(keys, allowedKeys)) {
    return { valid: false, error: 'Array keys not valid.' };
  }
  let { name, email, phone, message } = obj;
  name = name.trim();
  email = email.trim();
  message = message.trim();

  if (name.length === 0 || email.length === 0 || message.length === 0) {
    return { valid: false, error: 'Name/email/message length is zero.' };
  }
  // check if email valid
  let isMailValid = await validate({
    email: email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: false,
  });

  if (!isMailValid.valid) {
    return { valid: false, error: 'Email not valid.' };
  }

  // if everything was alright, then return true
  return { valid: true };
};
module.exports = { validateFormData };
