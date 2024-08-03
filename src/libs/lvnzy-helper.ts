
function formatCost(cost: number) {
    let formattedCost = "";
    if (!cost) {
      return 0;
    }
    if (cost < 1000) {
        formattedCost = `${Math.round(cost)}`;
    }
    else if (cost > 1000 && cost < 100000) {
        formattedCost = `${Math.round((cost/1000) * 10) / 10}K`;
    } else if (cost >= 100000 && cost < 10000000) {
        formattedCost = `${Math.round((cost/100000) * 10) / 10}L`;
    }
    return `₹${formattedCost}`;
  }
  
  export { formatCost };
  