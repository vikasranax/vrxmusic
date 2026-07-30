import { useStore } from './store';
import { CHANNEL_SCENE } from './scenes';
import { getChannel, FALLBACK_QUEUE } from './playlistData';

let player = null;
let ready = false;
let pending = null;
let queue = [];
let idx = 0;
let mode = 'video';

const S = () => useStore.getState();

function loadScript() {
  return new Promise((res) => {
    if (window.YT && window.YT.Player) return res();
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(tag, first);
    window.onYouTubeIframeAPIReady = () => res();
  });
}

function buildPlayer() {
  player = new window.YT.Player('yt-hidden-player', {
    height: '0', width: '0',
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1 },
    events: { onReady, onStateChange, onError },
  });
}

function onReady() {
  ready = true;
  const { volume, muted } = S();
  player.setVolume(muted ? 0 : volume);
  if (pending) { const fn = pending; pending = null; fn(); }
}

function onStateChange(e) {
  const st = e.data;
  if (st === window.YT.PlayerState.PLAYING) {
    S().setStatus('playing');
    const d = player.getVideoData ? player.getVideoData() : {};
    if (d && d.title) S().setCurrentTrack({ title: d.title, badge: 'Live Stream', videoId: d.video_id || null });
  } else if (st === window.YT.PlayerState.PAUSED) {
    S().setStatus('paused');
  } else if (st === window.YT.PlayerState.BUFFERING) {
    S().setStatus('loading');
  } else if (st === window.YT.PlayerState.ENDED) {
    next();
  }
}

function onError() {
  S().setToast('Track unavailable — skipping…');
  S().setStatus('error');
  setTimeout(next, 600);
}

function loadCurrent() {
  const run = () => { S().setStatus('loading'); player.loadVideoById(queue[idx]); };
  if (!ready) pending = run; else run();
}

export function parseUrl(url) {
  const video = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/v\/|shorts\/)([A-Za-z0-9_-]{11})/);
  const list = url.match(/[?&]list=([A-Za-z0-9_-]+)/);
  return { videoId: video ? video[1] : null, playlistId: list ? list[1] : null };
}

export async function init() {
  if (typeof window === 'undefined') return;
  if (!document.getElementById('yt-hidden-player')) {
    const div = document.createElement('div');
    div.id = 'yt-hidden-player';
    div.style.position = 'fixed'; div.style.width = '0'; div.style.height = '0'; div.style.opacity = '0'; div.style.pointerEvents = 'none';
    document.body.appendChild(div);
  }
  await loadScript();
  if (!player) buildPlayer();
}

export function playChannel(channelId) {
  const ch = getChannel(channelId);
  if (!ch) return;
  S().setCurrentChannelId(channelId);
  if (S().autoSync && CHANNEL_SCENE[channelId]) S().setSceneId(CHANNEL_SCENE[channelId]);

  if (ch.playlistId) {
    mode = 'playlist';
    const run = () => { S().setStatus('loading'); player.loadPlaylist({ list: ch.playlistId }); };
    if (!ready) pending = run; else run();
  } else {
    mode = 'video';
    queue = (ch.seed && ch.seed.length ? ch.seed : FALLBACK_QUEUE).slice();
    idx = 0;
    loadCurrent();
  }
}

export function playUrl(url) {
  const { videoId, playlistId } = parseUrl(url || '');
  if (playlistId) {
    mode = 'playlist';
    const run = () => { S().setStatus('loading'); player.loadPlaylist({ list: playlistId }); };
    if (!ready) pending = run; else run();
    S().setCurrentTrack({ title: 'YouTube playlist', badge: 'Live Stream', videoId: null });
  } else if (videoId) {
    mode = 'video'; queue = [videoId]; idx = 0; loadCurrent();
  } else {
    S().setToast('Invalid YouTube URL');
  }
}

export function togglePlay() {
  if (!player || !ready) return;
  const st = player.getPlayerState();
  if (st === window.YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
}

export function next() {
  if (!player || !ready) return;
  if (mode === 'playlist') { player.nextVideo(); return; }
  if (!queue.length) return;
  idx = (idx + 1) % queue.length;
  loadCurrent();
}

export function setVolume(v) { if (player && ready) { player.setVolume(v); if (v > 0) player.unMute(); } }
export function applyMute(m) { if (player && ready) { m ? player.mute() : player.unMute(); } }

const youtubeManager = { init, playChannel, playUrl, togglePlay, next, setVolume, applyMute, parseUrl };
export default youtubeManager;