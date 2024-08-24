export type InputProperty = number | boolean | string | Array<string>;

export interface InputItem {
  name: string;
  properties: {
    [key: string]: InputProperty;
  };
}

export type InputItemCollection = Array<InputItem>;
