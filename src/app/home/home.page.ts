import { AlertController } from '@ionic/angular';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { async } from '@angular/core/testing';
/*import { Plugins } from '@capacitor/core';
const { BarcodeScanner } = Plugins;*/

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnDestroy {

  result = null;
  scanActive = false;

  constructor(private alertController: AlertController) { }

  ngAfterViewInit(): void {
    BarcodeScanner.prepare();
  }

  ngOnDestroy(): void {
    BarcodeScanner.stopScan();
  }

  async startScan() {

    console.log('primeiro');
    
    // caso precise, habilitar novamente
    //BarcodeScanner.hideBackground(); // make background of WebView transparent
    
    const allowed = await this.checkPermission();
    if(allowed){
      this.scanActive = true;
      const result = await BarcodeScanner.startScan(); 
      console.log(`confirmando : ${result}`);
      if (result.hasContent) {
        //alert('chegou aqui');
        console.log(result.content); // log the raw scanned content
  
        this.result = result.content;
        this.scanActive = false;
      }
    }
    
    

    /*this.checkPermission();
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    console.log(`confirmando : ${result}`);

    
    // if the result has content
    if (result.hasContent) {
      alert('chegou aqui');
      console.log(result.content); // log the raw scanned content

      this.result = result.content;
      this.scanActive = false;
    }*/

  }

  /*async startScanner() {
    await this.checkPermission();
    const result = await BarcodeScanner.starScanner();
    console.log(result);
  }*/

  async checkPermission() {
    //const status = await BarcodeScanner.checkPermission({ force: true });
    console.log(status);
    //return status.granted;
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'No permission',
          message: 'Please allow camera',
          buttons: [{
            text: 'No',
            role: 'cancel'
          }, {
            text: 'Open Settings',
            handler: () => {
              BarcodeScanner.openAppSettings();
              resolve(false);
            }
          }]
        })

      } else {
        resolve(false);
      }
    });
  }

  stopScanner(){
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

}
