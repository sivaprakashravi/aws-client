import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoadingService } from '../services/loading.service';
import { HttpClient } from '@angular/common/http';
declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  key = 'AIzaSyBQqNcM3WSmeuiquqEjpdIol1dr2GsV1nA';
  url = `${environment.URL + environment.MASTER}/master-data`;
  type = environment.production ? 'https' : 'http';
  private scripts: any = [
    { name: 'map', loaded: false, src: `${this.type}://maps.googleapis.com/maps/api/js?key=${this.key}&libraries=places` },
    {
      name: 'mapcluster',
      // https://developers.google.com/maps/documentation
      // tslint:disable-next-line:max-line-length
      loaded: false, src: `https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclustererplus@4.0.1.min.js`
    }
  ];

  constructor(private http: HttpClient, private loadingService: LoadingService) {
  }

  load(name) {
    const promises: any[] = [];
    const toLoad = this.scripts.find(s => s.name === name);
    promises.push(this.loadScript(toLoad));
    // this.scripts.forEach((script) => promises.push(this.loadScript(script.name)));
    return Promise.all(promises);
  }

  loadScript(toLoad) {
    const self = this;
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (toLoad.loaded || toLoad.inProgress || document.getElementById(`dynamic-${toLoad.name}`)) {
        resolve({ script: toLoad.name, loaded: true, status: 'Already Loaded' });
      } else {
        // load script
        toLoad.inProgress = true;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = toLoad.src;
        script.id = `dynamic-${toLoad.name}`;
        if (script.readyState) {  // IE
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              toLoad.loaded = true;
              resolve({ script: toLoad.name, loaded: true, inProgress: false, status: 'Loaded' });
            }
          };
        } else {  // Others
          script.onload = (ee) => {
            toLoad.loaded = true;
            resolve({ script: toLoad.name, loaded: true, inProgress: false, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) => resolve({ script: toLoad.name, loaded: false, inProgress: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
  geoCoder(place) {
    if (place) {
      const url = `${environment.GEOCODER}${this.key}&address=${place}`;
      const request = this.http.get(url);
      const response = this.loadingService.get(request);
      return response;
    }
  }
}
