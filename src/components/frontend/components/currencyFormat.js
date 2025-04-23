export const currencyFormat = (amount, decimal = 2, symbol = '$', position = 'before') => {
  if (isNaN(amount)) amount = 0;
  
  const formattedAmount = parseFloat(amount).toFixed(decimal).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  
  return position === 'before'
    ? `${symbol}${formattedAmount}`
    : `${formattedAmount}${symbol}`;
};