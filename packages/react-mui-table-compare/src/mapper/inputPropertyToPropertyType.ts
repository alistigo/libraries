import { PropertyType } from '../types/data';
import { InputProperty } from '../types/input';

export default function inputPropertyToPropertyType(
  inputProperty: InputProperty
): PropertyType | undefined {
  const type = typeof inputProperty;

  switch (type) {
    case 'number':
      return 'number';

    case 'string':
      return 'string';

    case 'boolean':
      return 'boolean';

    case 'object': {
      if (
        Array.isArray(inputProperty) &&
        inputProperty.every((value) => typeof value === 'string')
      ) {
        return 'stringList';
      }
    }
  }

  return undefined;
}
