import { 
  _stringifyPoint,
  stringifyPoints,
} from '../stringify';

describe('_stringifyPoint', () => {
  it('Returns a string version of a point (measurement, value, tags, timestamp)', () => {
    const measurement = 'payment';
    const values = {
      billed: 33,
      licenses: '3i',
    }

    const tags = {
      device: 'mobile',
      product: 'Notepad',
      method: 'credit',
    };
    const timestamp = '1434067467100293230';

    const result = _stringifyPoint({
      measurement,
      values,
      tags,
      timestamp,
    });

    expect(result).toBe(
      'payment,device=mobile,product=Notepad,method=credit billed=33,licenses="3i" 1434067467100293230'
    );
  });
});

describe('stringifyPoints', () => {
  it('returns a influxdb compatible string with 1 or more points', () => {
    const point1 = {
      measurement: 'test_measurement1',
      values: {
        value1: 42,
        value2: true,
        value3: 'string',
      },
      tags: {
        host: 'test_host',
        region: 'us-west',
      },
      timestamp: 999,
    }

    const point2 = {
      measurement: 'test_measurement2',
      values: {
        value1: 'test',
      },
      tags: {
        host: 'test_host',
        region: 'us-west',
      },
      timestamp: 1500,
    }

    const result = stringifyPoints([point1, point2]);
    
    expect(result).toBe(
      'test_measurement1,host=test_host,region=us-west value1=42,value2=true,value3="string" 999' +
      '\n' +
      'test_measurement2,host=test_host,region=us-west value1="test" 1500'
    );
  });
});