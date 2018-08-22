export default function dateParser(dt) {
  if (typeof dt === "number" || typeof dt === "string") {
    return new Date(Number(dt));
  } else {
    return dt;
  }
}
