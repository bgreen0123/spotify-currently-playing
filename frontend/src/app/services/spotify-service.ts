import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentTrack } from '../models/current-track';

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {
    private httpClient = inject(HttpClient);

    private readonly currentTrackUri = "/v1/api/current-track";

    public getCurrentTrack(): Observable<CurrentTrack> {
        return this.httpClient.get<CurrentTrack>(this.currentTrackUri);
    }
}
