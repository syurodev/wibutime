/**
 * Thu thập thông tin thiết bị cho mục đích xác thực
 * @returns Đối tượng chứa thông tin về thiết bị
 */
export const collectDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      deviceId: 'server-side',
      deviceName: 'Server',
      deviceType: 'server',
      deviceOs: 'Server OS',
      browserInfo: 'Server Browser',
    };
  }

  // Hàm tạo ID thiết bị
  const generateDeviceId = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNum}`;
  };

  // Kiểm tra và lấy device ID từ localStorage
  let deviceId;
  try {
    deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = generateDeviceId();
      localStorage.setItem('device_id', deviceId);
    }
  } catch (e) {
    deviceId = generateDeviceId();
  }

  // Xác định loại thiết bị
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

  let deviceType = 'desktop';
  if (isTablet) deviceType = 'tablet';
  else if (isMobile) deviceType = 'mobile';

  // Xác định hệ điều hành
  let deviceOs = 'Unknown';
  const userAgent = navigator.userAgent;

  if (/Windows/.test(userAgent)) deviceOs = 'Windows';
  else if (/Macintosh|Mac OS X/.test(userAgent)) deviceOs = 'macOS';
  else if (/Linux/.test(userAgent)) deviceOs = 'Linux';
  else if (/Android/.test(userAgent)) deviceOs = 'Android';
  else if (/iPhone|iPad|iPod/.test(userAgent)) deviceOs = 'iOS';

  // Xác định tên thiết bị
  let deviceName = navigator.platform || 'Unknown Device';

  // Thu thập thông tin trình duyệt
  const browserRegexes = [
    { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
    { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
    { name: 'Safari', regex: /Version\/([0-9.]+).*Safari/ },
    { name: 'Edge', regex: /Edg(e)?\/([0-9.]+)/ },
    { name: 'Opera', regex: /OPR\/([0-9.]+)/ },
    { name: 'IE', regex: /Trident\/([0-9.]+)/ },
  ];

  let browserInfo = 'Unknown Browser';
  for (const browser of browserRegexes) {
    const match = userAgent.match(browser.regex);
    if (match) {
      const version = match[1] || match[2] || '';
      browserInfo = `${browser.name} ${version}`;
      break;
    }
  }

  return {
    deviceId,
    deviceName,
    deviceType,
    deviceOs,
    browserInfo,
  };
};
