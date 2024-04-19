export function numberFormat(num: number): string {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(1) + "q";
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "b";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 10000) {
    return (num / 1000).toFixed(0) + "k";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  }
}
