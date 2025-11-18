// Generic type for any JSON-serializable data
type StorageValue = string | number | boolean | object | null;

// Storage utility object with all localStorage operations
const storage = {
	/**
	 * Save data to localStorage
	 * @param key - The storage key
	 * @param value - The value to store (will be JSON stringified)
	 */
	set: <T extends StorageValue>(key: string, value: T): void => {
		// Convert value to JSON string
		const serialized = JSON.stringify(value);
		// Save to localStorage
		localStorage.setItem(key, serialized);
	},

	/**
	 * Get data from localStorage
	 * @param key - The storage key
	 * @returns The parsed value or null if not found
	 */
	get: <T extends StorageValue>(key: string): T | null => {
		try {
			// Get the string from localStorage
			const item = localStorage.getItem(key);

			// If nothing found, return null
			if (item === null) {
				return null;
			}

			// Parse the JSON string back to original type
			return JSON.parse(item) as T;
		} catch (error) {
			return null;
		}
	},

	/**
	 * Remove data from localStorage
	 * @param key - The storage key to remove
	 */
	remove: (key: string): void => {
		localStorage.removeItem(key);
	},

	/**
	 * Clear all data from localStorage
	 */
	clear: (): void => {
		localStorage.clear();
	},

	/**
	 * Check if a key exists in localStorage
	 * @param key - The storage key to check
	 * @returns true if key exists, false otherwise
	 */
	has: (key: string): boolean => {
		return localStorage.getItem(key) !== null;
	},
};

export const { set, get, remove, clear, has } = storage;
export default storage;
