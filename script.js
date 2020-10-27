const validation = {
  minLength: {
    length: 2,
    errorMessage: `At least ${this.length} characters`,
    validate: function (text) {
      return text.length >= this.length;
    },
  },
  notEmpty: {
    errorMessage: `A value is required`,
    validate: (text) => text && text !== "",
  },
  minValue: {
    value: 1,
    errorMessage: `Value is less than ${this.value}`,
    validate: function (value) {
      return value >= this.value;
    },
  },
};

function renderErrorMessages(target, errorMessages) {
  for (message of errorMessages) {
    target.insertAdjacentHTML("afterend", `<div class="errorMessage">${message}</div>`);
  }
}

function validatorHandler(target) {
  // If no validation rules for this target element.
  if (!target.dataset.validators) {
    return;
  }

  // Clear earlier messages
  target.parentElement.querySelectorAll(".errorMessage").forEach((e) => e.remove());
  target.classList.remove("error");

  const errorMessages = validate(target);
  if (errorMessages.length > 0) {
    target.classList.add("error");
    renderErrorMessages(target, errorMessages);
  }
  return errorMessages;
}

function validate(target) {
  const validators = target.dataset.validators.split(" ");
  const errorMessages = [];
  for (let validator of validators) {
    let isValid = true;
    isValid = validation[validator].validate(target.value);
    if (!isValid) {
      errorMessages.push(validation[validator].errorMessage);
    }
  }
  return errorMessages;
}

function submitForm(e) {
  e.preventDefault();
  let errorMessages = [];
  for (let i = 0; i < e.currentTarget.length; i++) {
    const messages = validatorHandler(e.target[i]);
    if (messages) errorMessages = errorMessages.concat(messages);
  }
  if (errorMessages.length > 0) {
    console.log("Do not send");
  } else {
    console.log("Sent!");
  }
}

function main() {
  document.querySelector("form").addEventListener("submit", submitForm);
  document.querySelectorAll(".text").forEach((elem) => {
    elem.addEventListener("keyup", (e) => validatorHandler(e.target));
  });
}

main();
