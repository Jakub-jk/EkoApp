import { Component, OnInit, NgZone } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  public searchTxt: string;
  private loaded: number = 0;
  private loader: HTMLIonLoadingElement;
  private codeWidth: any;
  constructor(private barcodeScanner: BarcodeScanner, private stor: Storage, private http: HTTP, private loadCtrl: LoadingController, private platform: Platform, private router: Router, private ngZone: NgZone) {
    //refreshData();
    this.codeWidth = platform.is("ios") ? 30 : 40;
   }

   scan()
   {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Umieść kod kreskowy w wyznaczonym obszarze',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8',
      orientation: 'landscape',
    };
    this.barcodeScanner.scan(options).then(async barcodeData => {
      console.log('Barcode data', barcodeData);
      if (!barcodeData.cancelled)
        this.searchTxt = barcodeData.text;
     }).catch(err => {
         console.log('Error', err);
     });
   }
   async loadData(ev)
   {
    await this.loadItems(20, ev);
    if (this.loaded >= await this.stor.length())
      ev.target.disabled = true;
   }

   loadTemp()
   {
    setTimeout(() => {
      if (this.loaded < 180)
      {
      for (let i = 0; i < 20; i++)
      {
        const el = document.createElement('ion-item');
        el.innerHTML = `
          <ion-label>
            <h2 style="text-overflow: ellipsis; overflow:hidden; white-space:nowrap;">${i}</h2>
            <p>Created ${(new Date()).toLocaleTimeString()}</p>
          </ion-label>
          <ion-label slot="end" style="text-align: end; max-width: ${this.codeWidth}%; font-family: monospace; margin-left: 0;">
            <p>1234567890123</p>
          </ion-label>
        `;
        if (i%2 == 1)
          el.setAttribute('style', '--background: linear-gradient(to right, #3498db -100%, white) !important;');
        if (i%2 == 0)
          el.setAttribute('style', '--background: linear-gradient(to right, #2ecc71 -100%, white) !important;');
        if (i%3 == 0)
          el.setAttribute('style', '--background: linear-gradient(to right, #8B4513 -100%, white) !important;');
        if (i%5 == 0)
          el.setAttribute('style', '--background: linear-gradient(to right, #f1c40f -100%, white 75%) !important;');
        document.querySelector('ion-list').appendChild(el);
      }
      this.loaded += 20;
      console.log('Done, loaded=' + this.loaded);
      
    }
    else
      document.querySelector('ion-infinite-scroll').disabled=true;

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      //if (ev.target.data.length == 1000) {
      //  ev.target.disabled = true;
      //}
    }, this.loaded == 0 ? 2000 : 500);
   }

  ngOnInit() {
    this.stor.ready().then(async () => 
    {
      if (await this.stor.length() == 0)
        await this.refreshData();
      else
        this.loadItems(20)
    });
  }

  async refreshData()
  {
    this.loader = await this.loadCtrl.create(
      {
        message: "Odświeżanie danych..."
      }
    );
    this.loader.present();
    this.http.get('http://sh202888.website.pl/hackheroes/recycle.php', {}, {})
  .then(async data => {
    let items = JSON.parse(data.data);
    console.log(data.status);
    console.log(items); // data received by server
    console.log(data.headers);
    await this.stor.clear();
    for (let i = 1; i <= items.length; i++)
    {
      let val = items[i-1];
      //console.log(`${val.Name} is ${val.CatName} with color #${val.Color}, given id ${i}`);
      await this.stor.set("rec_"+i, val);
    }
    this.reloadData();
    this.loader.dismiss();
  })
  .catch(error => {

    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);

  });
  }

  reloadData()
  {
    this.clearList();
    this.loaded = 0;
    this.loadItems(20);
  }

  clearList()
  {
    while (document.querySelector('ion-list').firstChild)
      document.querySelector('ion-list').removeChild(document.querySelector('ion-list').firstChild);
  }

  async loadItems(count: number, ev: any = undefined)
  {
      let actuallyLoaded: number = 0;
    await this.stor.forEach((val, key, num) => {
      console.log(`${val.Name} is ${val.CatName} with color #${val.Color}`);
      if (num > this.loaded && num < this.loaded + count)
      {
      let colors = val.Color.split(";");
      let double = colors.length == 2;
      if (colors.length == 1)
        colors.push("FFFFFF");
        console.log(this.hexToRgbA("#" + colors[1], 0.5));
      const el = document.createElement('ion-item');
        el.innerHTML = `
          <ion-label>
            <h2 style="text-overflow: ellipsis; overflow:hidden; white-space:nowrap;">${val.Name}</h2>
            <p>${val.CatName}</p>
          </ion-label>
          <ion-label slot="end" style="text-align: end; max-width: ${this.codeWidth}%; font-family: monospace; margin-left: 0;">
            <p>${val.Barcode}</p>
          </ion-label>
        `;
          //el.setAttribute('style', `--background: linear-gradient(to right, ${this.hexToRgbA(colors[0])} -75%, ${this.hexToRgbA(colors[1], 0.5)} ${double ? "200" : "75"}%) !important;`);
          el.setAttribute('style', `--background: linear-gradient(to right, ${this.hexToRgbA(colors[0])} -50%, rgba(255, 255, 255, 0) 75%), linear-gradient(to left, ${this.hexToRgbA(colors[1])} -50%, rgba(255, 255, 255, 0) 75%) !important;`);
          el.addEventListener('click', () => this.navigate(key));
        document.querySelector('ion-list').appendChild(el);
        actuallyLoaded++;
      }
    });
    this.loaded += actuallyLoaded;
    console.log("Loaded: " + this.loaded);
    
    if (ev !== undefined)
      ev.target.complete();
  }

  hexToRgbA(hex, a = 1){
    if (!hex.startsWith("#"))
      hex = "#" + hex;
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+a+')';
    }
    throw new Error('Bad Hex');
}

  async find()
  {
    console.log(this.searchTxt);
    if (this.searchTxt == "" || this.searchTxt == null)
    {
      this.reloadData();
      return;
    }
    this.clearList();
    await this.stor.forEach((val, key, num) => 
    {
      if (val.Barcode.includes(this.searchTxt) | val.Name.toLowerCase().includes(this.searchTxt.toLowerCase()))
        {
          let colors = val.Color.split(";");
      if (colors.length == 1)
        colors.push("FFFFFF");
        const el = document.createElement('ion-item');
        el.innerHTML = `
          <ion-label>
            <h2 style="text-overflow: ellipsis; overflow:hidden; white-space:nowrap;">${val.Name}</h2>
            <p>${val.CatName}</p>
          </ion-label>
          <ion-label slot="end" style="text-align: end; max-width: ${this.codeWidth}%; font-family: monospace; margin-left: 0;">
            <p>${val.Barcode}</p>
          </ion-label>
        `;
          //el.setAttribute('style', `--background: linear-gradient(to right, ${this.hexToRgbA(colors[0])} -75%, ${this.hexToRgbA(colors[1], 0.5)} ${double ? "200" : "75"}%) !important;`);
          el.setAttribute('style', `--background: linear-gradient(to right, ${this.hexToRgbA(colors[0])} -50%, rgba(255, 255, 255, 0) 75%), linear-gradient(to left, ${this.hexToRgbA(colors[1])} -50%, rgba(255, 255, 255, 0) 75%) !important;`);
          el.addEventListener('click', () => this.navigate(key));
        document.querySelector('ion-list').appendChild(el);
        }
    });
  }

  navigate(id:any)
  {
    //console.log(id);
    this.ngZone.run(() => this.router.navigate(['/recinfo'], { queryParams: {id: id}}));
  }
}
