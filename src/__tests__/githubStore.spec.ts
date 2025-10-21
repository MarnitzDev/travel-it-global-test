import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGithubStore } from '../stores/github';
import type { Repo, Commit, CommitDetail } from '../types';

// Mock localStorage for persistence testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock the fetch API
global.fetch = vi.fn();

describe('GitHub Store', () => {
  let store: ReturnType<typeof useGithubStore>;

  // Generic mock data
  const mockRepos: Repo[] = [
    {
      id: 1,
      name: 'travel-it-global-test',
      full_name: 'MarnitzDev/travel-it-global-test',
      description: null,
    },
  ];

  const mockCommits: Commit[] = [
    {
      sha: 'abc123',
      commit: {
        author: { date: '2023-10-01T10:00:00Z', name: 'Author', email: 'author@example.com' },
        message: 'Initial commit',
        tree: { sha: 'tree-sha-abc123', url: 'https://example.com/tree-abc123' },
      },
      author: { login: 'author' },
    },
    {
      sha: 'def456',
      commit: {
        author: { date: '2023-10-02T10:00:00Z', name: 'Author', email: 'author@example.com' },
        message: 'Second commit',
        tree: { sha: 'tree-sha-def456', url: 'https://example.com/tree-def456' },
      },
      author: { login: 'author' },
    },
  ];

  const mockCommitDetail: CommitDetail = {
    sha: 'abc123',
    commit: {
      author: { date: '2023-10-01T10:00:00Z', name: 'Author', email: 'author@example.com' },
      message: 'Initial commit',
      tree: { sha: 'tree-sha-abc123', url: 'https://example.com/tree-abc123' },
    },
    files: [
      {
        filename: 'file.txt',
        patch: '+added line',
        additions: 1,
        deletions: 0,
        changes: 1,
        status: 'modified',
      },
    ],
    stats: {
      total: 1,
      additions: 1,
      deletions: 0,
    },
  };

  beforeEach(() => {
    // Reset Pinia, mocks, and localStorage before each test
    setActivePinia(createPinia());
    store = useGithubStore();
    vi.resetAllMocks();
    localStorageMock.clear();
    // Clear store state
    store.repos = [];
    store.commits = [];
    store.favorites = [];
    store.commitDetails = {};
    store.error = null;
    store.loading = false;
  });

  describe('fetchRepos', () => {
    it('updates repos state on successful fetch', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      } as Response);

      await store.fetchRepos('MarnitzDev');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/MarnitzDev/repos'),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
      expect(store.repos).toEqual(mockRepos);
      expect(store.repos[0]?.name).toBe('travel-it-global-test');
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('handles 404 error for invalid user', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'User not found' }),
      } as Response);

      await store.fetchRepos('invalidUser');

      expect(store.error).toBe('User not found');
      expect(store.repos).toEqual([]);
      expect(store.loading).toBe(false);
    });

    it('handles 403 rate limit error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ message: 'API rate limit exceeded' }),
      } as Response);

      await store.fetchRepos('MarnitzDev');

      expect(store.error).toBe('API rate limit exceeded');
      expect(store.repos).toEqual([]);
      expect(store.loading).toBe(false);
    });

    it('handles general fetch error', async () => {
      const mockError = new Error('Network error');
      vi.mocked(fetch).mockRejectedValueOnce(mockError);

      await store.fetchRepos('MarnitzDev');

      expect(store.error).toBe('Network error');
      expect(store.repos).toEqual([]);
      expect(store.loading).toBe(false);
    });
  });

  describe('fetchCommits', () => {
    it('updates commits state for valid repo', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCommits,
      } as Response);

      await store.fetchCommits('MarnitzDev', 'travel-it-global-test', 1, 10);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/repos/MarnitzDev/travel-it-global-test/commits?page=1&per_page=10'
        ),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
      expect(store.commits).toEqual(mockCommits);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('handles 404 for nonexistent repo', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response);

      await store.fetchCommits('MarnitzDev', 'no-repo', 1, 10);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/repos/MarnitzDev/no-repo/commits?page=1&per_page=10'),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
      expect(store.error).toBe('Failed to fetch commits');
      expect(store.commits).toEqual([]);
      expect(store.loading).toBe(false);
    });

    it('handles 403 rate limit error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ message: 'API rate limit exceeded' }),
      } as Response);

      await store.fetchCommits('MarnitzDev', 'travel-it-global-test', 1, 10);

      expect(store.error).toBe('API rate limit exceeded');
      expect(store.commits).toEqual([]);
      expect(store.loading).toBe(false);
    });

    it('handles general fetch error', async () => {
      const mockError = new Error('Network error');
      vi.mocked(fetch).mockRejectedValueOnce(mockError);

      await store.fetchCommits('MarnitzDev', 'travel-it-global-test', 1, 10);

      expect(store.error).toBe('Network error');
      expect(store.commits).toEqual([]);
      expect(store.loading).toBe(false);
    });
  });

  describe('fetchCommitDetails', () => {
    it('updates commitDetails state for valid commit', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCommitDetail,
      } as Response);

      await store.fetchCommitDetails('MarnitzDev', 'travel-it-global-test', 'abc123');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/MarnitzDev/travel-it-global-test/commits/abc123',
        expect.objectContaining({ headers: expect.any(Object) })
      );
      expect(store.commitDetails['abc123']).toEqual(mockCommitDetail);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('handles 404 for invalid commit in valid repo', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Failed to fetch commit details' }),
      } as Response);

      await store.fetchCommitDetails('MarnitzDev', 'travel-it-global-test', 'invalid-sha');

      expect(store.error).toBe('Failed to fetch commit details');
      expect(store.commitDetails['invalid-sha']).toBeUndefined();
      expect(store.loading).toBe(false);
    });

    it('handles 404 for nonexistent repo', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Failed to fetch commit details' }),
      } as Response);

      await store.fetchCommitDetails('MarnitzDev', 'no-repo', 'abc123');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/MarnitzDev/no-repo/commits/abc123',
        expect.objectContaining({ headers: expect.any(Object) })
      );
      expect(store.error).toBe('Failed to fetch commit details');
      expect(store.commitDetails['abc123']).toBeUndefined();
      expect(store.loading).toBe(false);
    });

    it('handles 403 rate limit error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ message: 'API rate limit exceeded' }),
      } as Response);

      await store.fetchCommitDetails('MarnitzDev', 'travel-it-global-test', 'abc123');

      expect(store.error).toBe('API rate limit exceeded');
      expect(store.commitDetails['abc123']).toBeUndefined();
      expect(store.loading).toBe(false);
    });

    it('handles general fetch error', async () => {
      const mockError = new Error('Network error');
      vi.mocked(fetch).mockRejectedValueOnce(mockError);

      await store.fetchCommitDetails('MarnitzDev', 'travel-it-global-test', 'abc123');

      expect(store.error).toBe('Network error');
      expect(store.commitDetails['abc123']).toBeUndefined();
      expect(store.loading).toBe(false);
    });
  });

  describe('sortedCommits', () => {
    beforeEach(() => {
      store.commits = [...mockCommits];
    });

    it('sorts commits by newest first by default', () => {
      const sorted = store.sortedCommits();
      expect(sorted).toHaveLength(2);
      expect(sorted[0]?.sha).toBe('def456'); // Newer date
      expect(sorted[1]?.sha).toBe('abc123');
    });

    it('sorts commits by oldest first', () => {
      const sorted = store.sortedCommits('oldest');
      expect(sorted).toHaveLength(2);
      expect(sorted[0]?.sha).toBe('abc123'); // Older date
      expect(sorted[1]?.sha).toBe('def456');
    });

    it('returns empty array when no commits', () => {
      store.commits = [];
      const sorted = store.sortedCommits();
      expect(sorted).toEqual([]);
    });
  });

  describe('addFavorite and removeFavorite', () => {
    const sampleCommit = mockCommits[0];
    if (!sampleCommit) throw new Error('No sample commit');
    const repoName = 'travel-it-global-test';

    it('adds a new favorite commit', () => {
      expect(store.favorites).toHaveLength(0);
      store.addFavorite(sampleCommit, repoName);
      expect(store.favorites).toHaveLength(1);
      expect(store.favorites[0]?.sha).toBe(sampleCommit.sha);
      expect(store.favorites[0]?.repository.name).toBe(repoName);
    });

    it('adds favorite for nonexistent repo', () => {
      const fakeRepoName = 'no-repo';
      store.addFavorite(sampleCommit, fakeRepoName);
      expect(store.favorites).toHaveLength(1);
      expect(store.favorites[0]?.sha).toBe(sampleCommit.sha);
      expect(store.favorites[0]?.repository.name).toBe(fakeRepoName);
    });

    it('does not add duplicate favorite commit', () => {
      store.addFavorite(sampleCommit, repoName);
      expect(store.favorites).toHaveLength(1);
      store.addFavorite(sampleCommit, repoName);
      expect(store.favorites).toHaveLength(1);
    });

    it('removes a favorite commit', () => {
      store.addFavorite(sampleCommit, repoName);
      expect(store.favorites).toHaveLength(1);
      store.removeFavorite(sampleCommit.sha);
      expect(store.favorites).toHaveLength(0);
    });

    it('handles remove for non-existent favorite', () => {
      store.addFavorite(sampleCommit, repoName);
      expect(store.favorites).toHaveLength(1);
      store.removeFavorite('non-existent-sha');
      expect(store.favorites).toHaveLength(1);
    });
  });

  describe('loading and error states', () => {
    it('sets loading to true during fetchRepos and false after', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      } as Response);

      const promise = store.fetchRepos('MarnitzDev');
      expect(store.loading).toBe(true);
      await promise;
      expect(store.loading).toBe(false);
    });

    it('sets loading to true during fetchCommits and false after', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCommits,
      } as Response);

      const promise = store.fetchCommits('MarnitzDev', 'travel-it-global-test', 1, 10);
      expect(store.loading).toBe(true);
      await promise;
      expect(store.loading).toBe(false);
    });

    it('sets loading to true during fetchCommitDetails and false after', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCommitDetail,
      } as Response);

      const promise = store.fetchCommitDetails('MarnitzDev', 'travel-it-global-test', 'abc123');
      expect(store.loading).toBe(true);
      await promise;
      expect(store.loading).toBe(false);
    });

    it('clears error on successful fetch', async () => {
      store.error = 'Previous error';
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      } as Response);

      await store.fetchRepos('MarnitzDev');
      expect(store.error).toBe(null);
    });

    it('sets error on failed fetch', async () => {
      store.error = null;
      const mockError = new Error('Test error');
      vi.mocked(fetch).mockRejectedValueOnce(mockError);

      await store.fetchRepos('MarnitzDev');
      expect(store.error).toBe('Test error');
    });
  });
});
