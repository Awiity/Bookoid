<script lang="ts">
	import {
		initFb2File,
		type Fb2File,
		type Fb2ProcessedChapter,
		type Fb2Spine
	} from '@lingo-reader/fb2-parser';
	import { fontSize } from '$lib/stores/fontStore.svelte';
	// let page = $state(0);
	let chapter_number = $state(0);
	let fb2: Fb2File | null = $state(null);
	let spine: Fb2Spine | null = $derived.by(() => fb2?.getSpine() ?? null);
	let curr_chapter: Fb2ProcessedChapter | undefined = $derived.by(() => {
		if (fb2 && spine) {
			return fb2.loadChapter(spine[chapter_number].id);
		}
		return undefined;
	});
	let chapterHtml = $derived.by(() => curr_chapter?.html ?? '');
	let isSettingsOpen = $state(false);

	$effect(() => {
		if (fb2) localStorage.setItem(fb2?.getFileInfo().fileName, chapter_number.toString());
	});

	function toggleSettings() {
		isSettingsOpen = !isSettingsOpen;
	}

	function handleFile(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			if (!localStorage.getItem(file.name)) {
				localStorage.setItem(file.name, '0');
			} else {
				chapter_number = Number(localStorage.getItem(file.name));
			}
			void initFb2(file);
		}
	}

	async function initFb2(file: File): Promise<void> {
		fb2 = await initFb2File(file);
		if (fb2) {
			if (curr_chapter) {
				chapterHtml = curr_chapter['html'];
			}
		}
	}

	function handleNextChapter(e: Event): void {
		if (spine && chapter_number < spine.length - 1) {
			document
				.getElementsByClassName('reading-container')[0]
				?.scrollIntoView({ behavior: 'instant', block: 'start' });
			chapter_number++;
		}
	}
	function handlePreviousChapter(e: Event) {
		document
			.getElementsByClassName('reading-container')[0]
			?.scrollIntoView({ behavior: 'instant', block: 'start' });

		if (spine && chapter_number > 0) chapter_number--;
	}
</script>

<div class="main">
	<div class="page-shell">
		<div class="content-column">
			<h1>Welcome to Bookoid</h1>
			<div class="input-container">
				<label for="book-file">Choose a profile picture:</label>

				<input type="file" id="book-file" name="book" accept=".fb2" onchange={handleFile} />
				<button type="button" onclick={() => document.getElementById('book-file')?.click()}
					>Submit</button
				>
			</div>
			{#if fb2}
				<div class="reading-container">
					<div class="chapter-control">
						<button
							id="prev-ch"
							class="ch-btn prev"
							aria-label="Previous chapter"
							onclick={handlePreviousChapter}
						>
							‹ Previous
						</button>
						<!-- ===========================================SETTINGS=========================================== -->
						<div class="settings-wrapper">
							<button id="settings-trigger" onclick={toggleSettings}>Settings</button>
							{#if isSettingsOpen}
								<div id="settings-menu" class="settings-content">
									<span>Font Size</span>
									<div class="button-group">
										<button onclick={() => fontSize.changeSize(-2)}>A-</button>
										<span class="size-display">{fontSize.size}px</span>
										<button onclick={() => fontSize.changeSize(2)}>A+</button>
									</div>
								</div>
							{/if}
						</div>
						<button
							id="next-ch"
							class="ch-btn next"
							aria-label="Next chapter"
							onclick={handleNextChapter}
						>
							Next ›
						</button>
					</div>
					<div class="text" style="font-size: {fontSize.size}px;">
						{@html chapterHtml}
					</div>
					<div class="chapter-control-bottom">
						<button class="ch-btn small prev" onclick={handlePreviousChapter} aria-label="Previous">
							◀
						</button>
						<button class="ch-btn small next" onclick={handleNextChapter} aria-label="Next">
							▶
						</button>
					</div>
				</div>
			{:else}
				<h2 style="display: flex; justify-content: center;">No book is loaded</h2>
			{/if}
		</div>
	</div>
</div>

<style>
	@import './styles.css';
	:global(body) {
		margin: 0;
		background: linear-gradient(135deg, #111827, #1f2937);
		color: #f9fafb;
		font-family: Georgia, 'Palatino', Times, serif;
	}
</style>
