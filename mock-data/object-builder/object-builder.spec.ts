import objectBuilder from './object-builder';
describe('objectBuilder', () => {
  test('should merge default and override parameters for shallow objects', () => {
    const defaultParameters = { foo: 'default foo', bar: 'default bar' };
    const overrideParameters = { foo: 'override foo' };

    const builder = objectBuilder(defaultParameters);
    const result = builder(overrideParameters);

    expect(result).toEqual({ foo: 'override foo', bar: 'default bar' });
  });

  test('should merge default and override parameters for deeply nested objects', () => {
    const defaultParameters = {
      foo: 'default foo',
      bar: 'default bar',
      nested: {
        baz: 'default baz',
        qux: 'default qux',
      },
    };
    const overrideParameters = {
      foo: 'override foo',
      nested: {
        baz: 'override baz',
      },
    };

    const builder = objectBuilder(defaultParameters);
    const result = builder(overrideParameters);

    expect(result).toEqual({
      foo: 'override foo',
      bar: 'default bar',
      nested: {
        baz: 'override baz',
        qux: 'default qux',
      },
    });
  });

  test('should merge default and override parameters for very deeply nested objects', () => {
    const defaultParameters = {
      name: 'John Doe',
      address: { city: 'New York' },
      nested: {
        subNestedOne: {
          subNestedTwo: {
            subNestedThree: {
              subNestedFour: {
                propOne: 'default propOne',
                propTwo: 'default propTwo',
              },
            },
          },
        },
      },
    };

    const overrideParameters = {
      name: 'Jack Smith',
      address: { city: 'San Francisco' },
      nested: {
        subNestedOne: {
          subNestedTwo: {
            subNestedThree: {
              subNestedFour: {
                propOne: 'modified propOne',
              },
            },
          },
        },
      },
    };

    const builder = objectBuilder(defaultParameters);
    const result = builder(overrideParameters);

    expect(result).toEqual({
      name: 'Jack Smith',
      address: { city: 'San Francisco' },
      nested: {
        subNestedOne: {
          subNestedTwo: {
            subNestedThree: {
              subNestedFour: {
                propOne: 'modified propOne',
                propTwo: 'default propTwo',
              },
            },
          },
        },
      },
    });
  });

  test('should create separate instances for each call', () => {
    const defaultParameters = { foo: 'default foo' };

    const builder = objectBuilder(defaultParameters);
    const resultOne = builder();
    const resultTwo = builder();

    expect(resultOne).toEqual({ foo: 'default foo' });
    expect(resultTwo).toEqual({ foo: 'default foo' });
    expect(resultOne).not.toBe(resultTwo);
  });

  test('should deeply clone the object during merging', () => {
    const defaultParameters = { nested: { foo: 'default foo' } };
    const overrideParameters = { nested: { foo: 'modified foo' } };

    const builder = objectBuilder(defaultParameters);
    const result = builder(overrideParameters);

    expect(result).toEqual({ nested: { foo: 'modified foo' } });

    result.nested.foo = 'changed foo';
    expect(defaultParameters.nested.foo).toBe('default foo');
    expect(overrideParameters.nested.foo).toBe('modified foo');
  });

  test('should handle null values in overrideParameters', () => {
    const defaultParameters = { foo: 'default foo', bar: 'default bar' };
    const overrideParameters = null;

    const builder = objectBuilder(defaultParameters);
    const result = builder(overrideParameters);

    expect(result).toEqual({ foo: 'default foo', bar: 'default bar' });
  });

  test('should handle an empty overrideParameters object', () => {
    const defaultParameters = {
      name: 'John Doe',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'New York',
      },
    };
    const overrideParameters = {};

    const builder = objectBuilder(defaultParameters);
    const result = builder(overrideParameters);

    expect(result).toEqual(defaultParameters);
  });

  test('should handle undefined overrideParameters object', () => {
    const defaultParameters = {
      name: 'John Doe',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'New York',
      },
    };

    const builder = objectBuilder(defaultParameters);
    const result = builder();

    expect(result).toEqual(defaultParameters);
  });
});
