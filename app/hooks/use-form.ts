import { useCallback, useRef, useState } from "react";

export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const initialValuesRef = useRef(initialValues);
  const [values, setValues] = useState<T>(initialValues);

  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const setFormValues = useCallback((nextValues: T) => {
    setValues(nextValues);
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValuesRef.current);
  }, []);

  return {
    values,
    setValues: setFormValues,
    setFieldValue,
    resetForm,
  };
}
