export const removeFromArray = (array, valueToRemove) => {
  if (typeof valueToRemove === "function") {
    for (let i = 0; i < array.length; i++) {
      if (valueToRemove(array[i])) {
        let newArray = [...array];
        newArray.splice(i, 1);
        return newArray;
      }
    }
    return array;
  } else {
    let index = array.indexOf(valueToRemove);
    if (index > -1) {
      let newArray = [...array];
      newArray.splice(index, 1);
      return newArray;
    } else return array;
  }
};
