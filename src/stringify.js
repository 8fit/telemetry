export function stringifyPoints(points) {
  return points
    .map(_stringifyPoint)
    .join('\n');
}

export function _stringifyPoint({ measurement, values, tags, timestamp }) {
  const tagsString = Object.keys(tags)
    .map(key => `${key}=${tags[key]}`)
    .join();
  
  const valuesString = Object.keys(values)
    .map(key => `${key}=${_formatValue(values[key])}`)
    .join();

  return `${measurement},${tagsString} ${valuesString} ${timestamp}`;
}

const _formatValue = (value) => {
  if (typeof value === 'string') { 
    return `"${value}"`;
  }
  return value;
};