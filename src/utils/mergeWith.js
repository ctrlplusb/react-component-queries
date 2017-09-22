// :: (Object, Object, (any, any) => any) => Object
const mergeWith = (x, y, fn) => {
  const result = Object.assign({}, x)

  Object.keys(y).forEach(key => {
    if (x[key] && y[key]) {
      result[key] = fn(x[key], y[key], key)
    } else {
      result[key] = y[key]
    }
  })

  return result
}

export default mergeWith
