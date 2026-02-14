import axios from "axios";
import { GitHubSignals } from "../types";

function getMockData(): GitHubSignals {
    console.log("[githubService] Using mock data (GitHub API failed)");
    return {
        repoCount: 12,
        stars: 8,
        languages: ["JavaScript", "TypeScript", "Python"],
        activityScore: 6,
        projectDepthScore: 5,
    };
}

export async function analyzeGithub(username: string): Promise<GitHubSignals> {
    try {
        console.log(`[githubService] Fetching repos for: ${username}`);

        const { data: repos } = await axios.get(
            `https://api.github.com/users/${username}/repos`,
            {
                params: { per_page: 100, sort: "updated" },
                headers: { Accept: "application/vnd.github.v3+json" },
            }
        );

        const repoCount = repos.length;

        const stars = repos.reduce(
            (sum: number, r: any) => sum + (r.stargazers_count || 0),
            0
        );

        // Collect unique languages
        const langSet = new Set<string>();
        repos.forEach((r: any) => {
            if (r.language) langSet.add(r.language);
        });
        const languages = Array.from(langSet);

        // Activity score: based on how recently repos were pushed (0-10)
        const now = Date.now();
        const recentPushes = repos.filter((r: any) => {
            const pushed = new Date(r.pushed_at).getTime();
            const daysSince = (now - pushed) / (1000 * 60 * 60 * 24);
            return daysSince < 90; // active in last 90 days
        }).length;
        const activityScore = Math.min(10, Math.round((recentPushes / Math.max(repoCount, 1)) * 10));

        // Project depth score: repos with description + homepage or has_pages (0-10)
        const deepRepos = repos.filter(
            (r: any) => r.description && (r.homepage || r.has_pages || !r.fork)
        ).length;
        const projectDepthScore = Math.min(10, Math.round((deepRepos / Math.max(repoCount, 1)) * 10));

        console.log(`[githubService] Done — ${repoCount} repos, ${stars} stars, ${languages.length} langs`);

        return { repoCount, stars, languages, activityScore, projectDepthScore };
    } catch (err: any) {
        console.warn(`[githubService] GitHub API error: ${err.message}`);
        return getMockData();
    }
}
