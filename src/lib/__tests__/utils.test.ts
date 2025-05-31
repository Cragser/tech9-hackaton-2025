import { cn } from '../utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'hidden');
    expect(result).toBe('base conditional');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toBe('base valid');
  });

  it('should merge conflicting Tailwind classes correctly', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true
    });
    expect(result).toBe('class1 class3');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle complex Tailwind merge scenarios', () => {
    const result = cn('bg-red-500', 'bg-blue-500', 'text-white');
    expect(result).toBe('bg-blue-500 text-white');
  });
}); 