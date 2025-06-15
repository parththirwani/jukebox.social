// YouTube URL regex - matches various formats
export const YT_REGEX = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})([?&][^#\s]*)*$/;

// Spotify URL regex - matches track sharing links
export const SPOTIFY_REGEX = /^https?:\/\/(open\.)?spotify\.com\/track\/([a-zA-Z0-9]{22})(\?[^#\s]*)?$/;