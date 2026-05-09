import * as UtilitiesTypes from '../types/utilities.types.ts';

export function dataCheck( arr: UtilitiesTypes.CheckDataArr[] ): boolean {
  for ( const item of arr ) {
    if ( typeof item[0] !== item[1] ) {
      return false;
    };
  };

  return true;
};