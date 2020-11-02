export const blurClick = (f, e) => {
  const { currentTarget: target } = e
  f()
  target.blur()
}

export const objDiff = (keys, subtract, from) => Object.assign(
  ...keys.map(key => ({
    [key]: from[key] - subtract[key]
  }))
)

export const toNumbers = (obj) => (Object.assign(
  ...Object.keys(obj).map(key => ({
    [key]: Number(obj[key])
  }))
))

export const parsePosition = (position, {precision = 2, separator = ''}={}) => Object.keys(position).map(
  k => `${k.toUpperCase()}${position[k].toFixed(precision)}`
).join(separator)