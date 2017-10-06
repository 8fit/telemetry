import * as Telemetry from '../telemetry';
import * as Cache from '../pointCache';
import { stringifyPoints } from '../stringify'

const testConfig = {
  influxUrl: 'http://10.0.0.162:8086/write?db=testdb'
};

jest.mock('../pointCache', () => ({
  addPoint: jest.fn(),
  points: jest.fn().mockImplementation(() => [1, 2]),
}));

jest.mock('../stringify', () => ({
  stringifyPoints: jest.fn().mockImplementation(() => 'stringifiedBaby'),
}));

describe('Telementry', () => {
  describe('.point', () => {
    it('Adds a point to the point cache', () => {
      jest.spyOn(Date, 'now')
        .mockImplementation(() => 999);

      Telemetry.config(testConfig);
      Telemetry.point(
        'test_measurement',
        42,
        {tag1: 'value1', tag2: 'value2'},
      );

      expect(Cache.addPoint).toBeCalledWith(
        'test_measurement',
        42,
        {tag1: 'value1', tag2: 'value2'},
        999000000,
      );
    });
  });
});