export const validateFieldsProfile = (lValues, bValidateAll) => {
  var lErrors = {
    showUsernameError: false,
    showEmailError: false,
    showPasswordError: false,
    showConfirmPasswordError: false,
    showNameError: false,
    showAgeError: false,
    showSexError: false,
    showLevelError: false,
    messageError: "",
    haveError: false,
  };
  //USERNAME
  if ("" === lValues.username || lValues.username.length < 7) {
    lErrors.showUsernameError = true;
    lErrors.haveError = true;
    if (lValues.username.length < 7) {
      lErrors.messageError = "The username must have more than 6 characters";
    }
  }
  //EMAIL
  if ("" === lValues.email) {
    lErrors.showEmailError = true;
  }
  if (lValues.showPassword) {
    //PASSWORD
    if ("" === lValues.password || lValues.password.length < 7) {
      lErrors.showPasswordError = true;
      lErrors.haveError = true;
      if (lValues.password.length < 7) {
        if (lValues.password.length < 7 && "" !== lErrors.messageError) {
          lErrors.messageError =
            "The username and password must have more than 6 characters";
        } else {
          lErrors.messageError =
            "The password must have more than 6 characters";
        }
      }
    }
    //CONFIRM PASSWORD
    if (
      "" === lValues.confirmPassword ||
      lValues.confirmPassword !== lValues.password
    ) {
      lErrors.showConfirmPasswordError = true;
      lErrors.haveError = true;
    }
  }
  //NAME
  if ("" === lValues.name) {
    lErrors.showNameError = true;
    lErrors.haveError = true;
  }
  //AGE
  if (null === lValues.age) {
    lErrors.showAgeError = true;
    lErrors.haveError = true;
  }
  //SEX
  if (null === lValues.sex) {
    lErrors.showSexError = true;
    lErrors.haveError = true;
  }
  //LEVEL
  if (null === lValues.level) {
    lErrors.showLevelError = true;
    lErrors.haveError = true;
  }
  if (bValidateAll) {
    lErrors = {
      ...lErrors,
      messageError: "",
      showWeightError: false,
      showActivitiesError: false,
    };
    //ACTIVITIES
    if (!lValues.activities.length > 0) {
      lErrors.showActivitiesError = true;
      lErrors.messageError = "Please choose activities";
      lErrors.haveError = true;
    }
    //WEIGHT
    if ("" === lValues.weight || null === lValues.weight) {
      lErrors.showWeightError = true;
      lErrors.messageError = "Please enter a valid weight";
      lErrors.haveError = true;
    }
    //AMBOS
    if (
      !lValues.activities.length > 0 &&
      ("" === lValues.weight || null === lValues.weight)
    ) {
      lErrors.messageError =
        "Please choose activities and enter a valid weight";
      lErrors.haveError = true;
    }
  }
  return lErrors;
};

export const validateCharacters = (value) => {
  return value.replace(/&#39;/g, "'");
};
/**
 * Global function that castes user fitness level values.
 *
 * @param {string} sFitnessLevel Fitness Level, values can be 'B' as Beginner, 'M' as Intermediate or 'A' as Advance.
 *
 * @author Leandro Curbelo
 */
export const getFitnnesLevel = (sFitnessLevel) => {
  switch (sFitnessLevel) {
    case "B":
      return "Beginner";
    case "M":
      return "Intermediate";
    case "A":
      return "Advance";
    default:
      return "Beginner";
  }
};
