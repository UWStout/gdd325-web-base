export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const sequentialNumArray = (first, last) => {
  let newArray = []
  for (var i = first; i <= last; i++) {
    newArray.push(i)
  }
  return newArray
}
