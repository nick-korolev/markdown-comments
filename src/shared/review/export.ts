import { getCommentSnippet, getCommentStatus } from '@/shared/review/comments';
import { quoteExportText } from '@/shared/review/markdown';
import type { TComment, TExportMode, TReviewDocument } from '@/shared/types';

const buildTitleHeading = (document: TReviewDocument) => {
  const title = document.meta.title.trim();

  if (!title) {
    return '';
  }

  const heading = `# ${title}`;

  if (document.markdown.trimStart().startsWith(heading)) {
    return '';
  }

  return `${heading}\n\n`;
};

export const buildMarkdownOnlyExport = (document: TReviewDocument) => document.markdown;

export const buildCommentsOnlyExport = (comments: TComment[]) => {
  const commentLines = comments.map((comment, index) => {
    const status = getCommentStatus(comment);
    const targetLabel = status === 'detached' ? 'Original target' : 'Target';

    return `${index + 1}. [${status}] ${targetLabel}: "${quoteExportText(comment.anchor.selectedText)}"\n   Comment: ${comment.body.trim()}`;
  });
  const commentSection =
    commentLines.length > 0
      ? commentLines.join('\n\n')
      : '1. [open] Target: "No comments yet"\n   Comment: No review comments were added.';

  return `## Review Comments\n\n${commentSection}`;
};

export const buildMarkdownWithReviewExport = (document: TReviewDocument, comments: TComment[]) => {
  const markdownBlock = document.markdown.trimEnd();
  const titleHeading = buildTitleHeading(document);
  const commentSection = buildCommentsOnlyExport(comments);

  return `${titleHeading}${markdownBlock}\n\n---\n\n${commentSection}`.trim();
};

export const buildJsonExport = (document: TReviewDocument, comments: TComment[]) =>
  JSON.stringify(
    {
      meta: document.meta,
      markdown: document.markdown,
      comments,
    },
    null,
    2,
  );

export const buildExportPayload = (
  mode: TExportMode,
  document: TReviewDocument,
  comments: TComment[],
) => {
  if (mode === 'markdown') {
    return buildMarkdownOnlyExport(document);
  }

  if (mode === 'review') {
    return buildMarkdownWithReviewExport(document, comments);
  }

  return buildJsonExport(document, comments);
};

export const getExportFileName = (document: TReviewDocument, mode: TExportMode) => {
  const title = getCommentSnippet(document.meta.title || 'markdown-review', 40)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (mode === 'json') {
    return `${title || 'markdown-review'}.json`;
  }

  return `${title || 'markdown-review'}.md`;
};
