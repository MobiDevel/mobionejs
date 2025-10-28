import {greeting} from './index';

describe('greeting', () => {
  it('should return the name passed to it', () => {
    const name = 'John';
    const result = greeting(name);
    expect(result).toBe(name);
  });

  it('should handle an empty string', () => {
    const name = '';
    const result = greeting(name);
    expect(result).toBe(name);
  });
});
