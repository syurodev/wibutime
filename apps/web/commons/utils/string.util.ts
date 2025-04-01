export class StringUtil {
  string: string;

  constructor(string?: string) {
    this.string = string ?? "";
  }

  public truncate(length: number) {
    if (this.string.length > length) {
      return this.string.substring(0, length) + "...";
    }
    return this.string;
  }

  public isEmpty() {
    return this.string.length === 0;
  }

  public isNotEmpty() {
    return this.string.length > 0;
  }

  public isBlank() {
    return this.string.trim().length === 0;
  }

  public isNotBlank() {
    return this.string.trim().length > 0;
  }

  public isNumber() {
    return !isNaN(Number(this.string));
  }

  public isNotNumber() {
    return isNaN(Number(this.string));
  }

  public isEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.string);
  }

  public isNotEmail() {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.string);
  }

  public isUrl() {
    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
      this.string
    );
  }

  public isNotUrl() {
    return !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(
      this.string
    );
  }

  public isPhone() {
    return /^[0-9]{10}$/.test(this.string);
  }

  public isNotPhone() {
    return !/^[0-9]{10}$/.test(this.string);
  }

  public imageWithDefault() {
    return this.string || "/images/image.jpg";
  }
}
