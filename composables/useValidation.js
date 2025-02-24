// composables/useValidation.js
import { ref, reactive } from "vue";

export default function useValidation(initialValues, validationSchema) {
  console.log('boombayah')
  const form = reactive({ ...initialValues });
  const touchedFields = reactive({});
  const errors = reactive({});

  // Initialize touchedFields and errors
  Object.keys(initialValues).forEach((field) => {
    console.log('testincomposable')
    console.log(field)
    touchedFields[field] = false;
    errors[field] = "";
  });

  console.log('Touch field');
  console.log(touchedFields)
  console.log('Errors')
  console.log(errors);
  console.log("-----------------------");
  

  const validateField = (field) => {
    const rule = validationSchema[field];
    if (rule) {
      errors[field] = rule(form[field]); // Apply validation function
    }
  };

  const markFieldTouched = (field) => {
    touchedFields[field] = true;
    validateField(field);
  };

  const shouldShowError = (field) => touchedFields[field] && errors[field];
  const getErrorMessage = (field) => errors[field];

  const validateAll = () => {
    Object.keys(validationSchema).forEach(validateField);
    return Object.values(errors).every((error) => !error);
  };

  return {
    form,
    touchedFields,
    errors,
    markFieldTouched,
    shouldShowError,
    getErrorMessage,
    validateAll,
  };
}
