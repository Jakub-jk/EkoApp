import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recinfo',
  templateUrl: './recinfo.page.html',
  styleUrls: ['./recinfo.page.scss'],
})
export class RecinfoPage implements OnInit {
  public data: any;
  constructor(private stor: Storage, private route: ActivatedRoute, private router: Router) 
  {
    this.route.queryParams.subscribe(async params =>
      {
        if (params && params.id)
        {
          this.data = await stor.get(params.id);
          let colors = this.data.Color.split(";");
          //console.log(this.data);
          document.getElementById("recInfo").setAttribute('style', `--background: none !important; background-image: linear-gradient(to bottom, #${colors[0]} -50%, rgba(255, 255, 255, 0) 75%), linear-gradient(to up, #${colors[1]} -50%, rgba(255, 255, 255, 0) 75%) !important;`);
          console.log(document.getElementById("recInfo").getAttribute("style"));
        }
      });
   }

  ngOnInit() {
  }

}
