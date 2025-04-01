import { COOKIE_KEYS } from "../constants/cookie.enum";

export default class CookieUtils {
  /**
   * Lấy cookie theo tên
   */
  static getCookie<T = string>(name: string): T | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith(nameEQ)) {
        const cookieValue = trimmedCookie.substring(nameEQ.length);
        try {
          // Giải mã giá trị cookie trước khi parse
          const decodedValue = decodeURIComponent(cookieValue);
          return JSON.parse(decodedValue) as T;
        } catch (error) {
          console.error("Error parsing cookie:", error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Xóa cookie theo tên
   */
  static eraseCookie(name: string): void {
    // Đặt thời gian sống âm để xóa cookie
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  }

  /**
   * Đặt cookie với các tùy chọn bổ sung
   */
  static setCookie(name: string, value: string, hours: number = 12): void {
    const expires = `max-age=${hours * 60 * 60}`; // Tính thời gian hết hạn theo giờ
    // Mã hóa giá trị cookie để tránh lỗi ký tự đặc biệt
    const encodedValue = encodeURIComponent(value);
    const cookie = `${name}=${encodedValue}; ${expires}; path=/`;

    // // Safari yêu cầu cụ thể hóa chính sách SameSite và Secure nếu có
    // if (location.protocol === "https:") {
    //   cookie += "; Secure"; // Chỉ cho phép cookie gửi qua HTTPS
    // }
    // cookie += "; SameSite=Lax"; // SameSite mặc định là Lax để hỗ trợ Safari tốt hơn

    document.cookie = cookie;
  }

  /**
   * Lấy thông tin người dùng hiện tại từ cookie
   */
  static getCurrentUser(): any {
    const user = this.getCookie<any>(COOKIE_KEYS.USER);
    return user ?? {};
  }
}
