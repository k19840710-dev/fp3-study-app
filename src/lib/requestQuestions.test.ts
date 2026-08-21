import { describe, expect, it } from 'vitest';
import { buildRequestIssueUrl, REQUEST_ISSUE_TITLE_PREFIX } from './requestQuestions';

describe('buildRequestIssueUrl', () => {
  it('points at the correct repo new-issue endpoint', () => {
    const url = new URL(buildRequestIssueUrl());
    expect(url.origin + url.pathname).toBe(
      'https://github.com/k19840710-dev/fp3-study-app/issues/new',
    );
  });

  it('pre-fills a title starting with the polling marker', () => {
    const url = new URL(buildRequestIssueUrl());
    const title = url.searchParams.get('title');
    expect(title).not.toBeNull();
    expect(title!.startsWith(REQUEST_ISSUE_TITLE_PREFIX)).toBe(true);
  });

  it('pre-fills a non-empty body with instructions', () => {
    const url = new URL(buildRequestIssueUrl());
    const body = url.searchParams.get('body');
    expect(body).not.toBeNull();
    expect(body!.length).toBeGreaterThan(0);
  });
});
