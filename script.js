const state = {
  formData: {
    fname: {
      touched: false,
      value: '',
      validate() {
        const text = this.value.trim();
        if (text === '') return 'Full name is mandatory';
        if (text.length < 2)
          return 'Full name must be at least 2 characters long';
        else return null;
      }
    },
    email: {
      touched: false,
      value: '',
      validate() {
        const text = this.value.trim();
        const emailRegEx =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/; //Email regex which accepts unicode.

        if (text === '') return 'Full name is mandatory';
        if (!emailRegEx.test(text)) return 'Invalid email address';
        return null;
      }
    },
    gender: {
      touched: false,
      value: 0,
      validate() {
        const selectedIndex = this.value;
        if (selectedIndex === 0) return 'Must choose gender';
        return null;
      }
    },
    tac: {
      touched: false,
      value: false,
      validate() {
        const checked = this.value;
        if (!checked) return 'You must accept the terms and conditions';
        return null;
      }
    }
  },
  errors: []
};

/** @type {HTMLFormElement} */
const formElem = document.getElementById('registerForm');
formElem.addEventListener('submit', handleSubmit);
formElem.addEventListener('input', handleInput); // Triggered on every input, Works with all input elements and select element.
formElem.addEventListener('focusout', handleFocusOut); // FocusOut event propagates.

/**
 *
 * @param {SubmitEvent} evt
 */
function handleSubmit(evt) {
  evt.preventDefault();

  const { formData } = state;
  formElem.querySelectorAll('input,select').forEach((elem) => {
    formData[elem.name].touched = true;
  });

  doUpdate();

  const notValid = state.errors.some((error) => error.message !== null);

  if (notValid) {
    console.log('Fix errors before submitting the form');
  } else {
    console.log('Submitted');
  }
}

/**
 *
 * @param {InputEvent} evt
 */
function handleInput(evt) {
  doUpdate();
}

/**
 *
 * @param {FocusEvent} evt
 */
function handleFocusOut(evt) {
  const elem = evt.target;
  const { formData } = state;

  if (elem.name in formData) {
    formData[elem.name].touched = true;
    doUpdate();
  }
}

function doUpdate() {
  const { fname, email, gender, tac } = state.formData;
  fname.value = formElem['fname'].value;
  email.value = formElem['email'].value;
  gender.value = formElem['gender'].selectedIndex;
  tac.value = formElem['tac'].checked;

  validateFormData();
}

function validateFormData() {
  let { formData } = state;
  const errors = [];
  Object.keys(formData).forEach((prop) => {
    if (!formData[prop].touched) return;
    const errMessage = formData[prop].validate();
    errors.push({ elemName: prop, message: errMessage });
  });

  state.errors = [...errors];
  renderErrors();
}

function renderErrors() {
  const { errors } = state;

  errors.forEach((errorInfo) => {
    const errorElem = formElem.querySelector(`#${errorInfo.elemName}-error`);
    if (errorInfo.message) {
      errorElem.innerText = errorInfo.message;
      errorElem.classList.remove('d-none');
      errorElem.classList.add('invalid');
    } else {
      errorElem.classList.add('d-none');
      errorElem.classList.remove('invalid');
    }
  });
}
