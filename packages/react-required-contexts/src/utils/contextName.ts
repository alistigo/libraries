import { Context } from 'react';

export default function contextName(context: Context<any>): string {
  if (context.displayName) {
    return context.displayName;
  }
  return typeof context;
}
