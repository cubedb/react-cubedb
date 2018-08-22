import dateParser from "./dateParser";

export default function roundDate(date, timeUnit) {
  const unixDate = date / 1000;
  const x = Math.round(unixDate / timeUnit);
  return dateParser(x * timeUnit);
}
