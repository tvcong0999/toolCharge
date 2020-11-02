import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { ListSurchageService } from 'src/app/shared/service/list-surchage.service';

@Component({
  selector: 'app-surcharge-detail-upload',
  templateUrl: './surcharge-detail-upload.component.html',
  styleUrls: ['./surcharge-detail-upload.component.css']
})
export class SurchargeDetailUploadComponent implements OnInit {

  constructor(public listSurchageService: ListSurchageService) { }
  public surCharge;
  //
  @Output() public pictureTaken = new EventEmitter<WebcamImage>();
// toggle webcam on/off
public allowCameraSwitch = true;
public multipleWebcamsAvailable = false;
public deviceId: string;
public videoOptions: MediaTrackConstraints = {
// width: {ideal: 1024},
// height: {ideal: 576}
};
public errors: WebcamInitError[] = [];
// webcam snapshot trigger
private trigger: Subject<void> = new Subject<void>();
// switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>(); 
  //

  ngOnInit(): void {
    this.surCharge = this.listSurchageService.surcharge;
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
    this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
  }
  chooseSurcharge(){
    
  }
  public triggerSnapshot(): void {
    this.trigger.next();
    }
    public toggleWebcam(): void {
    this.listSurchageService.showWebcam = !this.listSurchageService.showWebcam;
    }
    public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    }
    public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
    }
    public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.pictureTaken.emit(webcamImage);
    }
    public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
    }
    public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
    }
    public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
    }
}
