export enum ResponseMessage {
  ERROR500 = "Oops!, có vấn đề xảy ra. Vui lòng thử lại!",

  //auth
  LOGIN_ERROR = "Đăng nhập thất bại vui lòng thử lại!",
  REGISTER_ERROR = "Đăng ký thất bại vui lòng thử lại!",
  REPASSWORD_INCORRECT = "Nhập lại mật khẩu không đúng, vui lòng thử lại!",

  //DATA INPUT
  DATA_INPUT_ERROR = "Dữ liệu đã nhập không hợp lệ, vui lòng kiểm tra lại!",
  EMAIL_INCORRECT = "Email đã nhập không hợp lệ, vui lòng kiểm tra lại!",
}
