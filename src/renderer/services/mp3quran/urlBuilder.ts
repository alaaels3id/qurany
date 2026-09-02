/**
 * AudioUrlBuilder
 * Encapsulates the rules for building audio stream URLs for MP3Quran
 */
export class AudioUrlBuilder {
  /**
   * Constructs an audio stream URL given a server base URL and surah number
   * @param server Base server URL from Moshaf model (e.g. "https://server8.mp3quran.net/afs")
   * @param surahId Surah number from 1 to 114
   */
  static buildSurahUrl(server: string, surahId: number): string {
    if (!server) return '';
    // Strip trailing slash if present
    const cleanServer = server.endsWith('/') ? server.slice(0, -1) : server;
    // Format surah number to 3 digits (e.g. 1 -> 001, 114 -> 114)
    const paddedSurahId = String(surahId).padStart(3, '0');
    return `${cleanServer}/${paddedSurahId}.mp3`;
  }

  /**
   * Formats a raw radio stream URL
   */
  static buildRadioUrl(radioUrl: string): string {
    return radioUrl || '';
  }
}
