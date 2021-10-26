import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()

export class ChapterComponentsService {
 
  constructor(public httpClient: HttpClient) {}

  getDynamicHeaders(configUrl) {
    const req: string = `https://dockstorage.blob.core.windows.net/content-service/schemas/collection/1.0/schema.json`
    return this.httpClient.get(req).pipe(map(res => {    
      return res;
    }));
  }
}
