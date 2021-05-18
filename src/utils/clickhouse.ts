import { pipe, invoker } from "ramda";

export const formatISODate = pipe<Date, string, string>(
  invoker(0, 'toISOString'),
  (iso) => `${iso.substr(0, 10)}`
);
export const formatISODateTime = pipe<Date, string, string>(
  invoker(0, 'toISOString'),
  (iso) => `${iso.substr(0, 10)} ${iso.substr(11, 8)}`
);
