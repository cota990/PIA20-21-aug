import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {

    //if (this.activatedRoute.snapshot.paramMap)
    console.log (this.activatedRoute);
    console.log (this.router.url);

    
  }

  static menuSelector: string = '';

  getMenuSelector () {
    return MenuComponent.menuSelector;
  }

}
