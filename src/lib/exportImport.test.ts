import { describe, expect, it } from 'vitest';
import { buildExportPayload, exportPayloadToJson, parseImportPayload } from './exportImport';
import type { UserStats } from '../types';

const sampleStats: UserStats = {
  totalAnswers: 4,
  correctAnswers: 3,
  questionStats: {
    lp_ks_01: {
      timesAnswered: 4,
      timesCorrect: 3,
      timesWrong: 1,
      lastResult: true,
      lastAnsweredAt: 1700000000000,
    },
  },
};

describe('buildExportPayload', () => {
  it('wraps the stats with app/version/exportedAt metadata', () => {
    const payload = buildExportPayload(sampleStats);
    expect(payload.app).toBe('fp3-study-app');
    expect(payload.version).toBe(1);
    expect(payload.stats).toEqual(sampleStats);
    expect(() => new Date(payload.exportedAt).toISOString()).not.toThrow();
  });
});

describe('parseImportPayload', () => {
  it('accepts a payload produced by exportPayloadToJson (round-trip)', () => {
    const json = exportPayloadToJson(sampleStats);
    const result = parseImportPayload(json);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stats).toEqual(sampleStats);
      expect(result.exportedAt).not.toBeNull();
    }
  });

  it('accepts a legacy bare UserStats JSON for backward compatibility', () => {
    const result = parseImportPayload(JSON.stringify(sampleStats));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stats).toEqual(sampleStats);
      expect(result.exportedAt).toBeNull();
    }
  });

  it('rejects invalid JSON', () => {
    const result = parseImportPayload('{not valid json');
    expect(result.ok).toBe(false);
  });

  it('rejects JSON that is not an object', () => {
    const result = parseImportPayload('42');
    expect(result.ok).toBe(false);
  });

  it('rejects a wrapped payload whose stats field has the wrong shape', () => {
    const result = parseImportPayload(JSON.stringify({ app: 'fp3-study-app', stats: { foo: 1 } }));
    expect(result.ok).toBe(false);
  });

  it('rejects an object that is neither a wrapped payload nor a valid UserStats', () => {
    const result = parseImportPayload(JSON.stringify({ hello: 'world' }));
    expect(result.ok).toBe(false);
  });
});
