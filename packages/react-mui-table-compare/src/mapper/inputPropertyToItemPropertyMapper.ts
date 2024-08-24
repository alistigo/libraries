import { ItemProperty } from '../types/data';
import { InputProperty } from '../types/input';
import inputPropertyToPropertyType from './inputPropertyToPropertyType';

export default function inputPropertyToItemPropertyMapper(
  inputProperty: InputProperty,
  propertyName: string,
  itemId: string
): ItemProperty | undefined {
  const type = inputPropertyToPropertyType(inputProperty);

  if (!type) {
    return undefined;
  }

  return {
    id: propertyName,
    name: propertyName,
    type,
    itemId,
    value: inputProperty,
  };
}
