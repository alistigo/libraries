import {
  CompareData,
  ItemCollection,
  ItemsPropertyCollection,
} from '../types/data';
import { InputItemCollection } from '../types/input';
import inputItemToItemMapper from './inputItemToItemMapper';
import inputPropertyToItemPropertyMapper from './inputPropertyToItemPropertyMapper';

export default function inputItemCollectionToCompareDataMapper(
  input: InputItemCollection
): CompareData {
  const items: ItemCollection = {};
  const properties: ItemsPropertyCollection = {};

  if (!input || input.length < 0) {
    return { items, properties };
  }

  input.forEach((inputItem) => {
    const item = inputItemToItemMapper(inputItem);
    items[item.id] = item;

    Object.keys(inputItem.properties).forEach((propertyName) => {
      const propertyValue = inputItem.properties[propertyName];
      const itemProperty = inputPropertyToItemPropertyMapper(
        propertyValue,
        propertyName,
        item.id
      );

      if (itemProperty) {
        if (!properties[propertyName]) {
          properties[propertyName] = {
            id: propertyName,
            name: propertyName,
            type: itemProperty.type,
            valuesByItemId: {},
          };
        }

        properties[propertyName].valuesByItemId[item.id] = itemProperty;
      }
    });
  });

  return { items, properties };
}
