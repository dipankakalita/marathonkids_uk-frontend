import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MatDialog , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';
import { NotificationsFormDlgComponent } from './form/notifications-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

	dlgTitle = 'Notifications';

    form: FormGroup;
    submitted = false;
    formType;
    sourceData;
    loading = false;
    notices : [];
    options = Array("","BOTH","DTS","APP");    
    
    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,       
        private alertService: AlertService,
        public matDialog: MatDialog
    ) {
       
    }

    ngOnInit() {
		this.loadNotifications();
	}

	loadNotifications() { 
		const options: any = {     
			where: {
				deleted: false
			},
			by:{ created_at : "desc" }
		};
		this.loading = true;
		this.htcService.post('notification/search', options).subscribe((result) => {
		this.loading = false;
			result.data.forEach(function(obj, key){
				var temp = new Date(obj.expiry_date);
				temp.setDate(temp.getDate()-1);
				result.data[key].expiry_date = new Date(temp).toUTCString();
			});
			this.notices = result.data;
		}, (err) => {     
			console.log(err);
		});
	}

	onSubmit(event) {
		event.preventDefault();
		if (this.form.invalid) {
			alert('Please fill correct information');
			return;
		}
		this.loading = true;   
	}

	get controls() {
	  return this.form.controls;
	}

	isInvalid(field) {
		return ((this.submitted || this.form.get(field).touched) && this.form.get(field).errors);
	}
	  
	onAdd(): void {
		const dialogRef = this.matDialog.open(NotificationsFormDlgComponent, {
			width: '500px',
			data: {
				action: FormType.NEW
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && result.success) {
				this.loadNotifications();
			}
		});
	}

	onEdit(item): void {
		console.log(item);
		let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
			disableClose: false,
			maxWidth: '400px'
		});

		confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to edit?';
		confirmDialogRef.componentInstance.title = 'Important';
		
		confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				const dialogRef = this.matDialog.open(NotificationsFormDlgComponent, {
					width: '500px',
					data: {
						action: FormType.EDIT,
						data: item
					}
				});
		
				dialogRef.afterClosed().subscribe(result => {
					if (result && result.success) {
						this.loadNotifications();
					}
				});
			}

			confirmDialogRef = null;
		});
	}

	onDelete(id): void {
		let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
			disableClose: false,
			maxWidth: '400px'
		});

		confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

		confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.loading = true;
				this.htcService.delete('notification', id).subscribe((res) => {
					this.loading = false;
					this.loadNotifications();
				}, (err) => {
					this.loading = false;
					console.log(err);
				});
			}
			confirmDialogRef = null;
		});
	}
}