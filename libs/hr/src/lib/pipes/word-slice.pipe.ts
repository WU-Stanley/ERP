import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordSlice',
})
export class WordSlicePipe implements PipeTransform {
  /**
   * Transforms a string by slicing it to a specified number of words and appending a trailing string if truncated.
   * @param value The input string to slice.
   * @param limit The maximum number of words to include (default: 10).
   * @param trail The string to append if the input is truncated (default: '...').
   * @returns The sliced string with optional trailing characters.
   */
  transform(value: string, limit = 10, trail = '...'): string {
    if (!value) return '';

    const words = value.trim().replace(/\s+/g, ' ').split(' ');
    if (words.length <= limit) {
      return value;
    }

    return words.slice(0, limit).join(' ') + trail;
  }
}
