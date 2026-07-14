import moment from "moment";

export function DateFormatter(inputDate:string) {
  if (!inputDate) return null;
  const time = moment.utc(inputDate).format("DD MMM YYYY  hh:mm:ss a");
  return time;
}
export function DateFormatterWithShortMonth(inputDate:string) {
  const time = moment.utc(inputDate).format("DD MMM YYYY");
  return time;
}
export function extractTimeFromTimestamp(timestamp:string) {
  if (!timestamp) return "";
  const match = timestamp.match(/\d{2}:\d{2}:\d{2}/);
  return match ? match[0] : "";
}
export function DateFormatterOnlyDate(inputDate:string) {
  const time = moment.utc(inputDate).format("DD MMMM YYYY");
  return time;
}
export function DateFormatterInputDate(inputDate:string) {
  const time = moment.utc(inputDate).format("YYYY-MM-DD");
  return time;
}
export function getSysDate(separator = "-") {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${date < 10 ? `0${date}` : `${date}`}`;
}
