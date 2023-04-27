import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { PresentationDefinitionResponse } from '../../models/presentation-definition-response';
import { PresentationDefinitionService } from '../../services/presentation-definition.service';
import { Observable, tap } from 'rxjs';

declare let QRCode: any;
@Component({
	selector: 'vc-verifiable-credential',
	templateUrl: './verifiable-credential.component.html',
	styleUrls: ['./verifiable-credential.component.scss']
})
export class VerifiableCredentialComponent {

	constructor (
    private readonly presentationDefinitionService: PresentationDefinitionService,
    private readonly changeDetectorRef: ChangeDetectorRef
	) {}

  @Input() requestGenerate = false;
  @Input() set presentationDefinition$ (request: Observable<PresentationDefinitionResponse>) {
  	this.displayJWTObject = false;
  	this.displayButtonJWTObject = false;
  	if (request) {
  		request.
  			pipe(
  				tap((data: PresentationDefinitionResponse) => {
  					this.displayJWTObject = false;
  					this.displayButtonJWTObject = false;
  					this.presentationDefinition = data;
  					new QRCode(document.getElementById('qrcode'), data.request_uri);
  					this.changeDetectorRef.detectChanges();
  				})
  			).subscribe();
  	}
  }

  JwtObject!: string;
  displayJWTObject = false;
  displayButtonJWTObject = false;

  presentationDefinition!: PresentationDefinitionResponse;

  obtainCredential () {
  	this.displayButtonJWTObject = false;
  	this.presentationDefinitionService.requestCredentialByJWT(this.presentationDefinition.request_uri)
  		.subscribe((jwt) => {
  			this.displayButtonJWTObject = true;
  			this.JwtObject = JSON.stringify(jwt, null, 2);
  			this.changeDetectorRef.detectChanges();
  		// new QRCode(document.getElementById('qrcode'), JSON.stringify(jwt));
  	});
  }
  showJwtObject () {
  	this.displayJWTObject = true;
  }
}