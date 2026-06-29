<script lang="ts">
	import { initFb2File } from '@lingo-reader/fb2-parser';
	import type { Fb2File, Fb2Spine } from '@lingo-reader/fb2-parser';

	let chapterHtml = $state('');
    let page = $state(0);

	function handleFile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			void initFb2(file);
		}
	}

	async function initFb2(file: File) {
		const fb2: Fb2File = await initFb2File(file);
		// Get the spine (chapter list)
		const spine: Fb2Spine = fb2.getSpine();
		const curr_chapter = fb2.loadChapter(spine[0].id);

		if (curr_chapter) {
			chapterHtml += curr_chapter['html'];
		}
	}

    function handleChapterChange(e: Event) {
        
    }
</script>

<div class="main">
	<h1>Welcome to SvelteKit</h1>
	<div class="input-container">
		<label for="book-file">Choose a profile picture:</label>

		<input type="file" id="book-file" name="book" accept=".fb2" onchange={handleFile} />
		<button type="button" onclick={() => document.getElementById('book-file')?.click()}
			>Submit</button
		>
	</div>
	<div class="reading-container">
        <button onclick={() => {
            if (page !== 0) page--;
        }}>&lt;</button>
        <button >&gt;</button>
        {@html chapterHtml}
    </div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: linear-gradient(135deg, #111827, #1f2937);
		color: #f9fafb;
		font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
	}

	.main {
		min-height: 100vh;
		padding: 2rem;
		box-sizing: border-box;
		background: linear-gradient(135deg, #333333, #000000);
		color: #f9fafb;
	}

	h1 {
		margin: 0 0 1rem;
		font-size: 2rem;
	}

	.input-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 0.75rem;
		backdrop-filter: blur(8px);
	}

	input[type='file'] {
		color: #f9fafb;
	}

	button {
		padding: 0.6rem 1rem;
		border: none;
		border-radius: 0.5rem;
		background: #3b82f6;
		color: white;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	button:hover {
		background: #2563eb;
	}

	.reading-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 1.5rem;
		background: #444444;
		color: white;
		border-radius: 1rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
		line-height: 1.7;
	}

	.reading-container :global(p) {
		margin: 0 0 1rem;
	}

	.reading-container :global(h2),
	.reading-container :global(h3) {
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}
</style>
