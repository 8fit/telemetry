import * as Cache from '../pointCache';
import { AsyncStorage } from 'react-native';

jest.mock('react-native', () => ({
  AsyncStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

describe('Cache', () => {
  describe('addPoint', () => {
    it('calls AsyncStorage.setItem', () => {
      jest.spyOn(AsyncStorage, 'setItem')
        .mockImplementation(() => Promise.resolve(true));
  
      Cache.clear();
  
      const testPoint1 = [{
        measurement: 'test_measurement1',
        values: { value: 1 },
        tags: { cpu: 50 },
        timestamp: 999,
      }];
  
      Cache.addPoint('test_measurement1', { value: 1 }, { cpu: 50 }, 999);
  
      expect(AsyncStorage.setItem).toBeCalledWith(
        '@Telemetry:points',
        JSON.stringify(testPoint1),
      )
    });
  
    it('adds points to the pointCache', async () => {
      Cache.clear();
      Cache.addPoint('test_measurement1', { value: 100 }, { cpu: 50 }, 999);
      Cache.addPoint('test_measurement2', { value: 10 }, { cpu: 50 }, 1000);
      Cache.addPoint('test_measurement3', { value: 1 }, { cpu: 50 }, 1500);
      const result = Cache.points();
  
      expect(result[0].measurement).toBe('test_measurement1');
      expect(result[0].values.value).toBe(100);
      expect(result[0].tags.cpu).toBe(50);
      expect(result[0].timestamp).toBe(999);
  
      expect(result[1].measurement).toBe('test_measurement2');
      expect(result[1].values.value).toBe(10);
      expect(result[1].tags.cpu).toBe(50);
      expect(result[1].timestamp).toBe(1000);
  
      expect(result[2].measurement).toBe('test_measurement3');
      expect(result[2].values.value).toBe(1);
      expect(result[2].tags.cpu).toBe(50);
      expect(result[2].timestamp).toBe(1500);
    });
  });

  describe('deletePointsBeforeIndex', () => {
    it('deletes entries from the cache before a given index', () => {
      Cache.clear();
      Cache.addPoint(0);
      Cache.addPoint(1);
      Cache.addPoint(2);
      Cache.addPoint(3);
      Cache.addPoint(4);

      Cache.deletePointsFromStart(2);

      expect(Cache.points().length).toBe(3);
      expect(Cache.points()[0].measurement).toBe(2);
      expect(Cache.points()[1].measurement).toBe(3);
      expect(Cache.points()[2].measurement).toBe(4);
    });
    it('Works even when deleting the entire array', () => {
      Cache.clear();
      Cache.addPoint(0);
      Cache.addPoint(1);
      Cache.addPoint(2);
      Cache.addPoint(3);
      Cache.addPoint(4);

      Cache.deletePointsFromStart(5);

      expect(Cache.points().length).toBe(0);
    });
  });
});
