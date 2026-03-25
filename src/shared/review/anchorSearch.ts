import { CONTEXT_WINDOW_LENGTH } from '@/shared/constants';
import { normalizeComparableText } from '@/shared/review/markdown';
import type { TAnchorMatchStrategy, TCommentAnchor, TTextRange } from '@/shared/types';

type TCandidateRange = TTextRange & {
  score: number;
  strategy: TAnchorMatchStrategy;
  reliability: number;
};

type TComparableTextMap = {
  text: string;
  indexMap: number[];
};

const buildComparableTextMap = (value: string): TComparableTextMap => {
  let text = '';
  const indexMap: number[] = [];
  let pendingSpace: number | null = null;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (/\s/.test(character)) {
      if (text.length > 0 && pendingSpace === null) {
        pendingSpace = index;
      }

      continue;
    }

    if (pendingSpace !== null) {
      text += ' ';
      indexMap.push(pendingSpace);
      pendingSpace = null;
    }

    text += character.toLowerCase();
    indexMap.push(index);
  }

  return {
    text,
    indexMap,
  };
};

const getPrefixMatchLength = (expected: string, actual: string) => {
  const limit = Math.min(expected.length, actual.length);
  let matches = 0;

  for (let index = 0; index < limit; index += 1) {
    if (expected[index] !== actual[index]) {
      break;
    }

    matches += 1;
  }

  return matches;
};

const getSuffixMatchLength = (expected: string, actual: string) => {
  const limit = Math.min(expected.length, actual.length);
  let matches = 0;

  for (let index = 1; index <= limit; index += 1) {
    if (expected[expected.length - index] !== actual[actual.length - index]) {
      break;
    }

    matches += 1;
  }

  return matches;
};

const getContextScore = (
  text: string,
  range: TTextRange,
  prefixContext: string,
  suffixContext: string,
  previousStart: number | null,
) => {
  const expectedPrefix = normalizeComparableText(prefixContext);
  const expectedSuffix = normalizeComparableText(suffixContext);
  const actualPrefix = normalizeComparableText(
    text.slice(
      Math.max(0, range.start - prefixContext.length - CONTEXT_WINDOW_LENGTH),
      range.start,
    ),
  );
  const actualSuffix = normalizeComparableText(
    text.slice(
      range.end,
      Math.min(text.length, range.end + suffixContext.length + CONTEXT_WINDOW_LENGTH),
    ),
  );
  const prefixScore = getSuffixMatchLength(expectedPrefix, actualPrefix);
  const suffixScore = getPrefixMatchLength(expectedSuffix, actualSuffix);
  const distancePenalty =
    previousStart === null ? 0 : Math.min(Math.abs(range.start - previousStart) / 120, 1.5);

  return prefixScore + suffixScore - distancePenalty;
};

const findExactRanges = (text: string, selectedText: string) => {
  const ranges: TTextRange[] = [];
  let cursor = 0;

  while (cursor <= text.length - selectedText.length) {
    const nextIndex = text.indexOf(selectedText, cursor);

    if (nextIndex === -1) {
      break;
    }

    ranges.push({
      start: nextIndex,
      end: nextIndex + selectedText.length,
    });
    cursor = nextIndex + Math.max(selectedText.length, 1);
  }

  return ranges;
};

const findComparableRanges = (text: string, selectedText: string) => {
  const comparableText = buildComparableTextMap(text);
  const comparableSelection = buildComparableTextMap(selectedText);

  if (!comparableSelection.text) {
    return [];
  }

  const ranges: TTextRange[] = [];
  let cursor = 0;

  while (cursor <= comparableText.text.length - comparableSelection.text.length) {
    const nextIndex = comparableText.text.indexOf(comparableSelection.text, cursor);

    if (nextIndex === -1) {
      break;
    }

    const start = comparableText.indexMap[nextIndex];
    const endIndex = nextIndex + comparableSelection.text.length - 1;
    const end = comparableText.indexMap[endIndex] + 1;

    ranges.push({
      start,
      end,
    });
    cursor = nextIndex + Math.max(comparableSelection.text.length, 1);
  }

  return ranges.filter((range, index, collection) => {
    const previousRange = collection[index - 1];

    if (!previousRange) {
      return true;
    }

    return previousRange.start !== range.start || previousRange.end !== range.end;
  });
};

const rankRanges = (
  text: string,
  ranges: TTextRange[],
  anchor: TCommentAnchor,
  strategy: TAnchorMatchStrategy,
) => {
  const baseReliability =
    strategy === 'exact-text' ? 0.92 : strategy === 'context-match' ? 0.8 : 0.62;

  return ranges
    .map<TCandidateRange>((range) => ({
      ...range,
      score: getContextScore(
        text,
        range,
        anchor.prefixContext,
        anchor.suffixContext,
        anchor.textStart,
      ),
      strategy,
      reliability: baseReliability,
    }))
    .sort((left, right) => right.score - left.score);
};

const pickBestCandidate = (candidates: TCandidateRange[]) => {
  if (candidates.length === 0) {
    return null;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  const [bestCandidate, secondCandidate] = candidates;
  const scoreDifference = bestCandidate.score - secondCandidate.score;

  if (bestCandidate.strategy === 'fuzzy-context') {
    return scoreDifference > 0.35 ? bestCandidate : null;
  }

  if (scoreDifference > 0.2) {
    return bestCandidate;
  }

  if (bestCandidate.strategy === 'exact-text' && bestCandidate.score > secondCandidate.score) {
    return bestCandidate;
  }

  return null;
};

export const trimTextRange = (text: string, start: number, end: number) => {
  if (end <= start) {
    return null;
  }

  const selectedText = text.slice(start, end);
  const leadingWhitespaceLength = selectedText.length - selectedText.trimStart().length;
  const trailingWhitespaceLength = selectedText.length - selectedText.trimEnd().length;
  const trimmedStart = start + leadingWhitespaceLength;
  const trimmedEnd = end - trailingWhitespaceLength;

  if (trimmedEnd <= trimmedStart) {
    return null;
  }

  return {
    start: trimmedStart,
    end: trimmedEnd,
    selectedText: text.slice(trimmedStart, trimmedEnd),
  };
};

export const findBestResolvedRange = (text: string, anchor: TCommentAnchor) => {
  if (
    anchor.textStart !== null &&
    anchor.textEnd !== null &&
    anchor.textStart >= 0 &&
    anchor.textEnd <= text.length &&
    text.slice(anchor.textStart, anchor.textEnd) === anchor.selectedText
  ) {
    return {
      end: anchor.textEnd,
      reliability: 1,
      start: anchor.textStart,
      strategy: 'exact-range' as const,
    };
  }

  const exactRanges = findExactRanges(text, anchor.selectedText);

  if (exactRanges.length === 1) {
    return {
      ...exactRanges[0],
      strategy: 'exact-text' as const,
      reliability: 0.92,
    };
  }

  const exactMatch = pickBestCandidate(rankRanges(text, exactRanges, anchor, 'context-match'));

  if (exactMatch) {
    return exactMatch;
  }

  return pickBestCandidate(
    rankRanges(text, findComparableRanges(text, anchor.selectedText), anchor, 'fuzzy-context'),
  );
};
