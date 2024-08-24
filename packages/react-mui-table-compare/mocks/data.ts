import { InputItem, InputItemCollection } from '../src';

export const carTwingo: InputItem = {
  name: 'Twingo',
  properties: {
    size: 150,
    height: 200,
    color: 'red',
    price: 20.25,
    options: ['clim', 'radio', 'aluminium', '4wheels'],
    withBooster: true,
  },
};

export const carR5: InputItem = {
  name: 'R5',
  properties: {
    size: 100,
    height: 250,
    color: 'blue',
    price: 10,
    options: ['aluminium', '4wheels', 'jump'],
    withBooster: false,
  },
};

export const carMultipla: InputItem = {
  name: 'Multipla',
  properties: {
    size: 300,
    height: 200,
    color: 'red',
    price: 100.25,
    options: ['jump', 'clim', 'radio'],
    withBooster: true,
    rating: 5,
  },
};

export const cars: InputItemCollection = [carMultipla, carR5, carTwingo];
