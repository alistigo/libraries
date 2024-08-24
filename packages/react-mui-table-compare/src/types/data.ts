import { InputProperty } from './input';

export interface Element {
  id: string;
  name: string;
}

export type Item = Element;

export type PropertyType = 'string' | 'boolean' | 'number' | 'stringList';

export interface ItemProperty extends Element {
  itemId: string;
  type: PropertyType;
  value: InputProperty;
}

export interface Property extends Element {
  type: PropertyType;
  valuesByItemId: {
    [itemId: string]: ItemProperty;
  };
}

export type ItemCollection = {
  [itemId: string]: Item;
};

export type ItemsPropertyCollection = {
  [propertyId: string]: Property;
};

export interface CompareData {
  items: ItemCollection;
  properties: ItemsPropertyCollection;
}
