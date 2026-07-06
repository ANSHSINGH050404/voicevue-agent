export function extractGitHubUsername(url: string): string | null {
  const trimmed = url.trim().replace(/\/$/, "");
  const match = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)(?:\/.*)?$/
  );
  return match ? match[1] : null;
}

export interface GitHubUserData {
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  topLanguages: string[];
  repos: GitHubRepo[];
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
}

export async function fetchGitHubData(
  username: string
): Promise<GitHubUserData | null> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      ),
    ]);

    if (!userRes.ok) return null;
    if (!reposRes.ok) return null;

    const user = await userRes.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repos: any[] = await reposRes.json();

    const langCount = new Map<string, number>();
    const repoList: GitHubRepo[] = repos.map((repo) => {
      if (repo.language) {
        langCount.set(repo.language, (langCount.get(repo.language) || 0) + 1);
      }
      return {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
      };
    });

    const topLanguages = [...langCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);

    return {
      username: user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      topLanguages,
      repos: repoList,
    };
  } catch {
    return null;
  }
}
