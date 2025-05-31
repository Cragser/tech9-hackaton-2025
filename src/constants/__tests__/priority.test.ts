import PriorityEnum from '../priority';

describe('PriorityEnum', () => {
  it('should have correct LOW value', () => {
    expect(PriorityEnum.LOW).toBe('LOW');
  });

  it('should have correct MEDIUM value', () => {
    expect(PriorityEnum.MEDIUM).toBe('MEDIUM');
  });

  it('should have correct HIGH value', () => {
    expect(PriorityEnum.HIGH).toBe('HIGH');
  });

  it('should have all expected priority levels', () => {
    const expectedValues = ['LOW', 'MEDIUM', 'HIGH'];
    const actualValues = Object.values(PriorityEnum);
    
    expect(actualValues).toEqual(expect.arrayContaining(expectedValues));
    expect(actualValues).toHaveLength(3);
  });

  it('should be accessible by key', () => {
    expect(PriorityEnum['LOW']).toBe('LOW');
    expect(PriorityEnum['MEDIUM']).toBe('MEDIUM');
    expect(PriorityEnum['HIGH']).toBe('HIGH');
  });
}); 