export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Vui lòng nhập họ tên';
  }
  if (name.trim().length < 2) {
    return 'Họ tên phải có ít nhất 2 ký tự';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || phone.trim().length === 0) {
    return 'Vui lòng nhập số điện thoại';
  }
  const vnPhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  if (!vnPhoneRegex.test(phone.trim())) {
    return 'Số điện thoại không hợp lệ (VD: 0912345678)';
  }
  return null;
};

export const validateDate = (dateString) => {
  if (!dateString || dateString.trim().length === 0) {
    return 'Vui lòng chọn ngày khởi hành';
  }
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return 'Ngày không đúng định dạng (DD/MM/YYYY)';
  }
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) {
    return 'Ngày không hợp lệ';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return 'Ngày khởi hành không được nằm trong quá khứ';
  }
  return null;
};

export const validateGuests = (guests) => {
  if (!guests || guests.toString().trim().length === 0) {
    return 'Vui lòng nhập số người';
  }
  const num = parseInt(guests, 10);
  if (isNaN(num) || num !== parseFloat(guests)) {
    return 'Số người phải là số nguyên';
  }
  if (num < 1) {
    return 'Số người phải ít nhất là 1';
  }
  if (num > 50) {
    return 'Số người không được vượt quá 50';
  }
  return null;
};

export const generateBookingId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TG-${timestamp}-${random}`;
};
