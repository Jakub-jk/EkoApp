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
  public col1: string;
  public col2: string = "rgba(255, 255, 255, 0)";
  constructor(private stor: Storage, private route: ActivatedRoute, private router: Router) 
  {
    this.route.queryParams.subscribe(async params =>
      {
        if (params && params.id)
        {
          this.data = await stor.get(params.id);
          let colors = this.data.Color.split(";");
          this.col1 = colors[0];
          this.col2 = colors.length > 1 ? colors[1] : this.col2;
          console.log(colors);
          //document.getElementById("recInfo").style.setProperty('--background', 'none', 'important'); 
          //document.getElementById("recInfo").style.setProperty('background', `linear-gradient(180deg, #${colors[0]} -50%, rgba(255, 255, 255, 0) 75%), linear-gradient(to up, #${colors[1]} -50%, rgba(255, 255, 255, 0) 75%)`, 'important');
          document.getElementById("recInfo").style.setProperty("--col1", "#" + colors[0]);
          if (colors[1])
          document.getElementById("recInfo").style.setProperty("--col2", "#" + colors[1]);
          console.log(document.getElementById("recInfo").style.getPropertyValue("background"));
        }
      });
   }

  ngOnInit() {
  }

}
