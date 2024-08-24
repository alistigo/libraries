import {
  formatFiles,
  generateFiles,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { MuiComponentGeneratorSchema } from './schema';

export async function muiComponentGenerator(
  tree: Tree,
  options: MuiComponentGeneratorSchema
) {
  const libraryRoot = readProjectConfiguration(
    tree,
    options.library
  ).sourceRoot;
  const projectRoot =
    options.module && options.module.length > 0
      ? `${libraryRoot}/${options.module}/components`
      : `${libraryRoot}/components`;
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    overwriteStrategy: 'ThrowIfExisting',
  });
  await formatFiles(tree);
}

export default muiComponentGenerator;
