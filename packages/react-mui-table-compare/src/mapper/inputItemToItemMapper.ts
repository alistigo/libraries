import { Item } from '../types/data';
import { InputItem } from '../types/input';

export default function inputItemToItemMapper(input: InputItem): Item {
  return { id: input.name, name: input.name };
}
