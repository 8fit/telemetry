import * as Cache from "./pointCache";
import { stringifyPoints } from "./stringify";

if (!global.btoa) {
  global.btoa = require("base-64").encode;
}

let localConfig = null;
export let log = () => {};

/**
 * Configures Telemetry. Must be called before using any other Telemetry methods
 * @param {Object} userConfig - {
    influxUrl: 'http://someurl:8086/write?db=testdb',
    sendInterval: 10,
  }
 */
export function config(userConfig) {
  if (!userConfig) throw new Error("Must pass config object to Telemetry");
  if (!userConfig.influxUrl) throw new Error("Must pass a influxUrl config");
  if (userConfig.log) log = userConfig.log;
  localConfig = {
    sendInterval: 1, // Seconds
    defaultTags: {},
    basicAuth: null,
    ...userConfig
  };

  setInterval(() => {
    flush();
  }, localConfig.sendInterval * 1000);
}

/**
 * Adds a point to Telemetry.
 * @param {string} measurement
 * @param {Object} values - { value1: 10, value1: true, value3: false }
 * @param {Object} tags - { host: 'value1', cpu: 'value2' }
 */
export function point(measurement, values, tags) {
  if (!localConfig) throw new Error("Telemetry - point called before config");

  const timestamp = Date.now() * 1000000;

  Cache.addPoint(
    measurement,
    values,
    {
      ...localConfig.defaultTags,
      ...tags
    },
    timestamp
  );
}

/**
 * Forces all cached points to be sent to Influxdb
 */
export function flush() {
  if (!localConfig) throw new Error("Telemetry - flush called before config");

  const points = Cache.points();

  if (points.length === 0) {
    return; // No points to flush just return
  }

  const pointsSentCount = points.length;
  const stringifiedPoints = stringifyPoints(points);
  const headers = new Headers();
  if (localConfig.basicAuth) {
    headers.append("Authorization", "Basic " + btoa(localConfig.basicAuth));
  }

  const payload = {
    method: "POST",
    body: stringifiedPoints,
    headers
  };

  log(`Telemetry - Sending point(s):\n${stringifiedPoints}`);
  fetch(localConfig.influxUrl, payload)
    .then(() => {
      Cache.deletePointsFromStart(pointsSentCount);
    })
    .catch(error => {
      log("Telemetry - Failed to send points with error: ", error.message);
    });
}
