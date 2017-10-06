import { AsyncStorage } from 'react-native';
import { log } from './telemetry';

const POINTS_KEY = '@Telemetry:points';

let memoryPointsCache = [];

export function addPoint(measurement, values, tags, timestamp) {
  memoryPointsCache.push({
    measurement,
    values,
    tags,
    timestamp,
  });
  _save();
}

export function points() {
  return memoryPointsCache;
}

export function deletePointsFromStart(count) {
  memoryPointsCache.splice(0, count);
  _save();
}

export function clear() {
  memoryPointsCache = [];
  _save();
}

function _save() {
  const points = JSON.stringify(memoryPointsCache);
  AsyncStorage.setItem(POINTS_KEY, points)
    .catch((error) => {
      log('Telemetry - Failed to save points to cache with error: ' + error);
      throw error;
    });
}
