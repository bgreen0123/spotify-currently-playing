import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SpotifyService } from './services/spotify-service';
import { CurrentTrack } from './models/current-track';
import { interval, startWith, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  private spotifyService = inject(SpotifyService);

  currentTrack = signal<CurrentTrack | null>(null);
  errorMessage = signal<string>('');
  progressMs = signal<number>(0);
  private sub?: Subscription;
  private progressSub?: Subscription;

  progressPercentage = computed(() => {
    const song = this.currentTrack()?.track;

    if (!song || song.durationMs <= 0) {
      return 0;
    }

    return Math.min((this.progressMs() / song.durationMs) * 100, 100);
  });
  timeLeftMs = computed(() => {
    const duration = this.currentTrack()?.track?.durationMs ?? 0;

    return Math.max(duration - this.progressMs(), 0);
  });

  ngOnInit(): void {
    this.sub = interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.spotifyService.getCurrentTrack()),
      )
      .subscribe({
        next: (data) => {
          console.log('Spotify data:', data);

          const previousTrack = this.currentTrack();
          const isNewTrack = previousTrack?.track?.id !== data.track?.id;

          this.currentTrack.set(data);

          const spotifyProgress = data.progress_ms ?? 0;
          const localProgress = this.progressMs();

          // Synchronize when the track changes or progress differs significantly
          if (isNewTrack || Math.abs(spotifyProgress - localProgress) > 1500) {
            this.progressMs.set(spotifyProgress);
          }
        },
        error: (err) => {
          console.error('Failed to get current track from Spotify', err);
          this.errorMessage.set('Unable to get current track');
        },
      });

    this.progressSub = interval(100).subscribe(() => {
      const currentSong = this.currentTrack();

      if (!currentSong?.isPlaying || !currentSong?.track) {
        return;
      }

      this.progressMs.update((p) => Math.min(p + 100, currentSong.track!.durationMs));
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.progressSub?.unsubscribe();
  }

  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
