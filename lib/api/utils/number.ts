/**
 * Rút gọn số lớn thành chuỗi với hậu tố K, M, B (ví dụ: 100000 -> 100K)
 * @param num Số cần rút gọn
 * @param decimalPlaces Số chữ số thập phân tối đa muốn hiển thị (mặc định là 1)
 * @returns Chuỗi định dạng
 */
export const formatNumberAbbreviated = (
  num: number,
  decimalPlaces: number = 1
): string => {
  if (num === null || num === undefined) return "0";

  // Xử lý số âm
  const sign = Math.sign(num);
  const absoluteNum = Math.abs(num);

  const units = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" }, // Billion
    { value: 1e6, symbol: "M" }, // Million
    { value: 1e3, symbol: "K" }, // Thousand
  ];

  const unit = units.find((u) => absoluteNum >= u.value);

  if (unit) {
    const abbreviated = (absoluteNum / unit.value)
      .toFixed(decimalPlaces)
      .replace(/\.0+$/, "");
    return `${sign < 0 ? "-" : ""}${abbreviated}${unit.symbol}`;
  }

  // Giữ nguyên số nếu nhỏ hơn 1000
  return `${sign < 0 ? "-" : ""}${absoluteNum.toLocaleString("en-US")}`;
};

// Ví dụ sử dụng:
// formatNumberAbbreviated(123456)   // Output: "123.5K" (hoặc "123.5K" tùy locale)
// formatNumberAbbreviated(9876543)  // Output: "9.9M"
// formatNumberAbbreviated(500)      // Output: "500"
