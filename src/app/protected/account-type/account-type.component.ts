import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent implements OnInit {

    isMainAdmin = false;
	constructor(private router: Router, private authService: AuthService) {
		this.isMainAdmin = this.authService.isMainAdmin();
		if(this.isMainAdmin === false){
			this.router.navigate(['/dashboard/summary']);
		}
	}

	ngOnInit(): void {}
	
	showData(type){
		this.authService.setAccountType(type);
		this.router.navigate(['/dashboard/summary']);
		// if(type=='parks' && this.isMainAdmin == true){ }		
	}
}
