function formatCost(cost: number) {
  let formattedCost = "";
  let updatedCost = 0,
    suffix = "",
    updatedCostUpper = 0;
  if (!cost) {
    return 0;
  }
  if (cost < 1000) {
    updatedCost = Math.round(cost);
  } else if (cost > 1000 && cost < 100000) {
    updatedCost = Math.round((cost / 1000) * 10) / 10;
    suffix = "K";
  } else if (cost >= 100000 && cost < 10000000) {
    updatedCost = Math.round((cost / 100000) * 10) / 10;
    suffix = "L";
  }
  const upperCost = Math.round(updatedCost * 1.1 * 10) / 10;
  return `₹${suffix == "L" ? updatedCost : Math.round(updatedCost)}-${suffix == "L" ? upperCost : Math.round(upperCost)} ${suffix}`;
}

function getMockImg(url: string) {
  var mockImage = document.createElement("img");
  var src = url;
  mockImage.src = src;
  return mockImage;
}

export { formatCost, getMockImg };
