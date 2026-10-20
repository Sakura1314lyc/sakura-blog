<script lang="ts">
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import { musicPlayerStore } from "../../../stores/musicPlayerStore";
import { LOCAL_PLAYLIST } from "../../widgets/music-player/constants";
import { musicPlayerConfig } from "../../../config";
import { url } from "../../../utils/url-utils";

let state = $state(musicPlayerStore.getState());
const song = $derived(state.playlist.length ? state.currentSong : musicPlayerConfig.mode === "local" ? LOCAL_PLAYLIST[0] : null);
const cover = $derived(song?.cover ? (/^(https?:)?\//.test(song.cover) ? song.cover : url(`/${song.cover}`)) : "");
const formatTime = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;

onMount(() => {
	const unsubscribe = musicPlayerStore.subscribe(value => { state = value; });
	void musicPlayerStore.initialize();
	return unsubscribe;
});
</script>

<div class="glass-music">
	<div class="glass-tile-heading"><span><Icon icon="material-symbols:graphic-eq-rounded" />此刻，听点什么</span><span class="glass-music-status">{state.isPlaying ? "PLAYING" : "MY PLAYLIST"}</span></div>
	<div class="glass-music-body">
		<div class:playing={state.isPlaying} class="glass-record">{#if cover}<img src={cover} alt={`${song?.title} 专辑封面`} width="120" height="120" />{/if}<span></span></div>
		<div class="glass-song-info"><h2>{song?.title || "音乐加载中"}</h2><p>{song?.artist || "稍等一会儿"}</p>
			<div class="glass-playback">
				<button type="button" aria-label="上一首" onclick={() => musicPlayerStore.prev()}><Icon icon="material-symbols:skip-previous-rounded" /></button>
				<button type="button" class="glass-play-button" aria-label={state.isPlaying ? "暂停音乐" : "播放音乐"} onclick={() => musicPlayerStore.toggle()}><Icon icon={state.isPlaying ? "material-symbols:pause-rounded" : "material-symbols:play-arrow-rounded"} /></button>
				<button type="button" aria-label="下一首" onclick={() => musicPlayerStore.next()}><Icon icon="material-symbols:skip-next-rounded" /></button>
			</div>
		</div>
	</div>
	<div class="glass-music-progress"><span>{formatTime(state.currentTime)}</span><input type="range" aria-label="音乐播放进度" min="0" max={state.duration || 1} step="1" value={state.currentTime} disabled={!state.duration} oninput={event => musicPlayerStore.seek(Number(event.currentTarget.value))} /><span>{formatTime(state.duration)}</span></div>
	{#if state.showError}<p class="glass-music-error" role="status">{state.errorMessage}</p>{/if}
</div>
