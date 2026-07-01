import { browser } from '$app/environment';

// Default font size in pixels or rem
const DEFAULT_SIZE = 18;

// Get initial value from localStorage if available
const initialSize = browser 
	? Number(localStorage.getItem('book-font-size')) || DEFAULT_SIZE 
	: DEFAULT_SIZE;

// Svelte 5 Runes approach
interface IFontManager {
	size: number;
	changeSize(delta: number): void;
};

class FontManager implements IFontManager {
	size = $state(initialSize);

	changeSize(delta: number): void {
		this.size = Math.max(12, Math.min(32, this.size + delta)); // Clamp between 12px and 32px
		if (browser) {
			localStorage.setItem('book-font-size', String(this.size));
		}
	}
}

export const fontSize: FontManager = new FontManager();