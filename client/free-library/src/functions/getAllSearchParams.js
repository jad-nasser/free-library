//this function return all the search params in an object
const getAllSearchParams = (searchParams) => {
  let allParams = {};
  searchParams.forEach((value, key, parent) => {
    allParams[key] = value;
  });
  return allParams;
};
export default getAllSearchParams;
