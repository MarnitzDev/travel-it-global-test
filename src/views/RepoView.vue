<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGithubStore } from '../stores/github';
import type { Commit } from '../types';
import dayjs from 'dayjs';

const route = useRoute();
const store = useGithubStore();

const username = computed(() => route.params.username as string);
const selectedRepo = ref<string>('');
const selectedCommit = ref<string>('');
const sortOrder = ref<'newest' | 'oldest'>('newest');
const page = ref(1);
const perPage = 10;

onMounted(async () => {
  await store.fetchRepos(username.value);
});

async function fetchCommits() {
  if (selectedRepo.value) {
    await store.fetchCommits(username.value, selectedRepo.value, page.value, perPage);
  }
}

async function fetchCommitDetails(sha: string) {
  selectedCommit.value = sha;
  await store.fetchCommitDetails(username.value, selectedRepo.value, sha);
}

function toggleFavorite(commit: Commit, repoName?: string) {
	if (store.favorites.some((f) => f.sha === commit.sha)) {
		store.removeFavorite(commit.sha);
	} else {
		store.addFavorite(commit, repoName);
	}
}

function formatDate(date: string) {
  return dayjs(date).format('MMMM D, YYYY h:mm A');
}
</script>

<template>
	<div class="repo-view">
		<h1>Repositories for <span class="username">{{ username }}</span></h1>
		<div class="main-content">
			<section class="repos">
				<h2 class="repos-title">Repositories</h2>
				<ul v-if="store.repos.length" class="repos-list">
					<li v-for="repo in store.repos" :key="repo.name" :class="['repo-card', { selected: selectedRepo === repo.name }]">
						<div class="repo-header">
							<span class="repo-name">{{ repo.name }}</span>
							<button class="repo-btn btn-primary ml-2" @click="selectedRepo === repo.name ? selectedRepo = '' : (selectedRepo = repo.name, fetchCommits())">
								{{ selectedRepo === repo.name ? 'Hide Commits' : 'Show Commits' }}
							</button>
						</div>
						<p class="repo-desc">{{ repo.description || 'No description' }}</p>
						<div v-if="selectedRepo === repo.name" class="repo-commits mt-2">
							<div class="commits-controls mb-2">
								<label for="sortOrder">Sort:</label>
								<select id="sortOrder" v-model="sortOrder">
									<option value="newest">Newest First</option>
									<option value="oldest">Oldest First</option>
								</select>
							</div>
							<ul v-if="store.commits.length" class="commit-list">
								<li v-for="commit in store.sortedCommits(sortOrder)" :key="commit.sha" class="commit-item">
									<div class="commit-message">{{ commit.commit.message }}</div>
									<div class="commit-meta">
										<span class="commit-author">{{ commit.author?.login || commit.commit.author.name }}</span>
										<span class="commit-date">{{ formatDate(commit.commit.author.date) }}</span>
									</div>
									<div class="mt-3">
										<button @click="toggleFavorite(commit, selectedRepo)" class="btn-success">
											{{ store.favorites.some(f => f.sha === commit.sha) ? 'Unfavorite' : 'Favorite' }}
										</button>
										<button @click="selectedCommit === commit.sha ? selectedCommit = '' : fetchCommitDetails(commit.sha)" class="btn-primary ml-3">
											{{ selectedCommit === commit.sha ? 'Hide Details' : 'View Details' }}
										</button>
									</div>
									<div v-if="selectedCommit === commit.sha && store.commitDetails && store.commitDetails[commit.sha]" class="commit-details mt-4">
										<h3>Commit Details</h3>
										<div>
											<strong>SHA:</strong> {{ commit.sha }}<br />
											<strong>Author:</strong> {{ store.commitDetails[commit.sha]?.commit.author.name }}<br />
											<strong>Date:</strong> {{ formatDate(store.commitDetails[commit.sha]?.commit.author.date || '') }}<br />
											<strong>Message:</strong> {{ store.commitDetails[commit.sha]?.commit.message }}<br />
											<div v-if="store.commitDetails[commit.sha]?.stats">
												<strong>Stats: </strong>
												<span>Additions: {{ store.commitDetails[commit.sha].stats.additions }}</span>,
												<span>Deletions: {{ store.commitDetails[commit.sha].stats.deletions }}</span>
											</div>
											<div v-if="store.commitDetails[commit.sha]?.files">
												<strong>Files Changed:</strong>
												<ul class="files-list">
													<li v-for="file in store.commitDetails[commit.sha]?.files" :key="file.filename">
														{{ file.filename }} ({{ file.changes }} changes)
													</li>
												</ul>
											</div>
										</div>
									</div>
								</li>
							</ul>
							<p v-else class="no-commits">No commits found.</p>
                            <div class="pagination">
                                <button @click="page--; fetchCommits()" :disabled="page <= 1">Previous</button>
                                <span>Page {{ page }}</span>
                                <button @click="page++; fetchCommits()">Next</button>
                            </div>
						</div>
					</li>
				</ul>
				<p v-else class="no-repos">No repositories found.</p>
			</section>

			<section class="favorites">
				<h2>Favorite Commits</h2>
				<ul v-if="store.favorites.length" class="favorites-list">
                    <li v-for="commit in store.favorites" :key="commit.sha" class="favorite-item">
                        <div class="favorite-message">{{ commit.commit.message }}</div>
                        <div class="favorite-meta">
                            <span><strong>Author:</strong> {{ commit.author?.login || commit.commit.author.name }}</span><br />
                            <span><strong>Date:</strong> {{ formatDate(commit.commit.author.date) }}</span>
                            <span v-if="commit.repository?.name"><br /><strong>Repo:</strong> {{ commit.repository.name }}</span>
                        </div>
                        <button @click="store.removeFavorite(commit.sha)" class="btn-danger remove-btn">Delete</button>
					</li>
				</ul>
				<p v-else>No favorites yet.</p>
			</section>

		</div>
	</div>
</template>

<style scoped>
.repo-view {
    max-width: 1200px;
    margin: 2rem auto;
}
.repo-view h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
}
.username {
    color: #1976d2;
}
.main-content {
    display: flex;
    gap: 2rem;
}
/* --- Repos Section Styling --- */
.repos {
	flex: 30%;
	border-right: 1px solid #eee;
	padding-right: 2rem;
}
.repos-title {
	font-size: 1.3rem;
	font-weight: 600;
	margin-bottom: 1.2rem;
	color: #1976d2;
	letter-spacing: 0.5px;
}
.repos-list {
	list-style: none;
	padding: 0;
	margin: 0;
}
.repo-card {
	background: #f8fafd;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(25, 118, 210, 0.04);
	margin-bottom: 1.5rem;
	padding: 1.2rem 1.2rem 1rem 1.2rem;
	border: 1px solid #e3eaf2;
	transition: box-shadow 0.2s, border 0.2s;
}
.repo-card.selected {
	border: 2px solid #1976d2;
	box-shadow: 0 2px 8px rgba(25, 118, 210, 0.10);
}
.repo-header {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	margin-bottom: 0.3rem;
}
.repo-name {
	font-size: 1.1rem;
	font-weight: 600;
	color: #1976d2;
	letter-spacing: 0.2px;
}
.repo-btn {
	font-size: 0.95rem;
	padding: 0.2rem 0.7rem;
}
.repo-desc {
	color: #666;
	font-size: 0.97rem;
	margin-bottom: 0.5rem;
}
.repo-meta {
	font-size: 0.93rem;
	color: #888;
	margin-bottom: 0.5rem;
	display: flex;
	gap: 1.2rem;
}
.repo-lang {
	background: #e3eaf2;
	color: #1976d2;
	border-radius: 4px;
	padding: 0.1rem 0.5rem;
	font-size: 0.92rem;
}
.repo-stars, .repo-forks {
	font-size: 0.92rem;
	color: #bfa700;
	background: #fffbe6;
	border-radius: 4px;
	padding: 0.1rem 0.5rem;
}
.no-repos {
	color: #b71c1c;
	margin-top: 1rem;
}
.commits {
    flex: 70%;
    padding-left: 2rem;
}
.commits-controls {
    margin-bottom: 1rem;
}
.commit-list {
    list-style: none;
    padding: 0;
}
.commit-item {
    margin-bottom: 1.2rem;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 6px;
}
.commit-message {
    font-weight: 500;
    margin-bottom: 0.5rem;
}
.commit-meta {
    font-size: 0.92rem;
    color: #666;
    display: flex;
    gap: 1.5rem;
}
.repo-selected {
    color: #1976d2;
}
.no-commits {
    color: #b71c1c;
    margin-top: 1rem;
}
.favorites {
    flex: 30%;
    border-left: 1px solid #eee;
    padding-left: 2rem;
    min-width: 260px;
    max-width: 350px;
}
.favorites-list {
	list-style: none;
	padding: 0;
	margin: 0;
}
.favorite-item {
	background: #ffffff;
	border-radius: 6px;
	box-shadow: 0 1px 2px rgba(0,0,0,0.04);
	margin-bottom: 1.2rem;
	padding: 1rem 1rem 0.7rem 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.favorite-meta {
	font-size: 0.97rem;
	color: #666;
	margin-bottom: 0.2rem;
	line-height: 1.5;
}
.remove-btn {
	align-self: flex-start;
	margin-top: 0.2rem;
}
.repo-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.repo-commits {
    background: #f8fafd;
    border-radius: 6px;
    padding: 1rem;
    margin-top: 0.5rem;
}

.pagination { 
    display: flex; 
    justify-content: center;
    align-items: center; 
}
.pagination button { 
    margin: 0 1em; 
}
</style>