/**
 * Returns the financial year whose Apr–Mar range contains today.
 * Falls back to the last item if none matches.
 * @param {Array} years - array of { id, financial_Year } objects
 * @returns {string} id as string
 */
export function getCurrentFinYearId(years) {
  if (!years?.length) return "";
  const now = new Date();
  const match = years.find(y => {
    const parts = y.financial_Year?.split("-");
    if (!parts || parts.length < 3) return false;
    const startYear = parseInt(parts[1]);
    const endYear   = 2000 + parseInt(parts[2]);
    return now >= new Date(startYear, 3, 1) && now <= new Date(endYear, 2, 31);
  });
  return String((match ?? years[years.length - 1]).id);
}
