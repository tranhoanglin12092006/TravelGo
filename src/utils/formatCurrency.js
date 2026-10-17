export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 ₫';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
};

export const formatCurrencyShort = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.0', '') + 'tr ₫';
  }
  return formatCurrency(amount);
};
