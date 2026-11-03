import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.spotifyService.getCurrentTrack()),
      )
      .subscribe({
        next: (data) => {
          console.log('Spotify data:', data);
          this.currentTrack.set(data);
        },
        error: (err) => {
          console.error('Failed to get current track from Spotify', err);
          this.errorMessage.set('Unable to get current track');
        },
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
