export const validPrice = price => price === null || +price < 0.1 ? 'no data' : `${(+price).toFixed((+price % 1) === 0 ? 0 : 2)}$`;
