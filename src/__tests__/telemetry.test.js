import * as Telemetry from '../telemetry';
import * as Cache from '../pointCache';
import { stringifyPoints } from '../stringify'

jest.mock('../pointCache', () => ({
  addPoint: jest.fn(),
  points: jest.fn().mockImplementation(() => [1, 2]),
}));

jest.mock('../stringify', () => ({
  stringifyPoints: jest.fn().mockImplementation(() => 'stringifiedBaby'),
}));

global.Headers = function () {
  this.append = function (key, value) {
    this[key] = value;
  }
}

global.fetch = jest.fn(() => Promise.resolve());

const config = {
  influxUrl: 'http://10.0.0.162:8086/write?db=testdb',
  defaultTags: { defaultTag1: 'defaultTagValue1' },
};

Telemetry.config(config);

describe('Telementry', () => {
  describe('.point', () => {
    it('Adds a point to the point cache', () => {
      jest.spyOn(Date, 'now')
        .mockImplementation(() => 999);

      Telemetry.point(
        'test_measurement',
        { foo: 1 },
        {tag1: 'value1', tag2: 'value2'},
      );

      expect(Cache.addPoint).toBeCalledWith(
        'test_measurement',
        { foo: 1 },
        { tag1: 'value1', tag2: 'value2', defaultTag1: 'defaultTagValue1' },
        999000000,
      );
    });
  });

  describe('.flush', () => {
    it('calls fetch', () => {
      jest.spyOn(Date, 'now')
        .mockImplementation(() => 999);

      Telemetry.point('test_measurement', { foo: 1 });
      Telemetry.flush();
      expect(fetch).toBeCalledWith(config.influxUrl, expect.objectContaining({
        method: 'POST',
        headers: expect.any(Headers),
        body: 'stringifiedBaby',
      }));
    });
  });
});
