import { Injectable } from '@angular/core';
import * as aws4 from 'ngx-aws4';
import { environment } from 'src/environments/environment';
// import * as crypto from 'crypto-js';
// declare var crypto: any;
@Injectable({
  providedIn: 'root'
})
export class IamService {
  accessKey = 'AKIAYANXDQ22E6GPFKOB';
  secretKey = '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';
  region = environment.REGION;
  constructor() { }

  generateSignature = (method: string, host: string, requestParameters: string, body?) => {
    const region = this.region;
    const accessKeyId = this.accessKey;
    const secretAccessKey = this.secretKey;

    const opts: any = { method, host, path: requestParameters, service: 'execute-api', region };
    if (body) {
      opts.body = JSON.stringify(body);
      opts.headers = {
        'Content-Type': 'application/json'
      };
    }
    // aws4.sign() will sign and modify these options, ready to pass to http.request
    aws4.sign(opts, { accessKeyId, secretAccessKey });
    return opts.headers;
  }
}
