import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/auth/session.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.session.logout();
  }

}
