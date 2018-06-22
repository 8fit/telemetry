// https://docs.influxdata.com/influxdb/v1.5/write_protocols/line_protocol_tutorial/#special-characters-and-keywords

export function stringifyPoints(points) {
  return points.map(_stringifyPoint).join("\n");
}

export function _stringifyPoint({ measurement, values, tags, timestamp }) {
  const tagsString = Object.entries(tags)
    .map(([key, value]) => {
      return `${escapeTag(key)}=${escapeTag(value)}`;
    })
    .join(",");

  const valuesString = Object.entries(values)
    .map(([key, value]) => {
      return `${escapeTag(key)}=${_formatValue(value)}`;
    })
    .join(",");

  return `${measurement},${tagsString} ${valuesString} ${timestamp}`;
}

const _formatValue = value => {
  if (typeof value === "string") {
    return `"${value.replace('"', '\\"')}"`;
  }
  return value;
};

const escapeTag = value => {
  if (typeof value === "string") {
    return value
      .replace(",", "\\,")
      .replace(" ", "\\ ")
      .replace("=", "\\=");
  }
  return value;
};
