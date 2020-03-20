import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as _ from 'lodash-es';
import { ProgramsService, UserService, FrameworkService, EnrollContributorService} from '@sunbird/core';
import { first, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enroll-contributor',
  templateUrl: './enroll-contributor.component.html',
  styleUrls: ['./enroll-contributor.component.scss'],
  providers: [DatePipe]
})
export class EnrollContributorComponent implements OnInit {
  public unsubscribe = new Subject<void>();
  public enrollAsOrg = false;
  public enrollDetails: any = {};
  public programScope = {};
  public enrolledDate: any;
  @ViewChild('modal') modal;
  frameworkdetails;
  formIsInvalid = false;
  contentType = { };

  options;
  disableSubmit = false;
  public contributeForm: FormGroup;
  public mapUserId: string;
  public mapOrgId: string;
  public frameworkFetched = false;
  @Output() close = new EventEmitter<any>();

  constructor(private programsService: ProgramsService, private tosterService: ToasterService,
    public userService: UserService, public frameworkService: FrameworkService,
    public toasterService: ToasterService, public formBuilder: FormBuilder,
    public http: HttpClient, public enrollContributorService: EnrollContributorService, public router: Router,
    public resourceService: ResourceService, private datePipe: DatePipe  ) {
  }

  ngOnInit(): void {
      this.fetchFrameWorkDetails();
      this.initializeFormFields();
      this.getProgramContentTypes();
      this.enrolledDate = new Date();
      this.enrolledDate = this.datePipe.transform(this.enrolledDate, 'yyyy-MM-dd');
  }

  fetchFrameWorkDetails() {
   const frameworkId = _.get(this.userService.userProfile.framework, 'id') ? _.get(this.userService.userProfile.framework, 'id')[0] : null;
   if (frameworkId) {
    this.frameworkService.getFrameworkCategories(frameworkId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data && _.get(data, 'result.framework.categories')) {
          this.frameworkdetails = _.get(data, 'result.framework.categories');

          this.frameworkdetails.forEach((element) => {
            this.enrollDetails[element['code']] = element['terms'];
          });
          this.frameworkFetched = true;
        }
      }, error => {
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching framework details failed');
        this.router.navigate(['']);
      });
   } else {
    this.frameworkService.initialize();
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkInfo: any) => {
      if (frameworkInfo && !frameworkInfo.err) {
        this.frameworkdetails  = frameworkInfo.frameworkdata.defaultFramework.categories;
        this.frameworkdetails.forEach((element) => {
          this.enrollDetails[element['code']] = element['terms'];
        });
        this.frameworkFetched = true;
      }
    });
   }
  }

  getProgramContentTypes () {
    const option = {
      url: 'program/v1/contenttypes/list',
    };

    this.programsService.get(option).subscribe(
      (res) => {
        this.contentType['contentType'] = res.result.contentType;
        },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching content types failed');
      }
    );
  }

  initializeFormFields(): void {
    this.contributeForm = this.formBuilder.group({
        board: ['', Validators.required],
        medium: ['', Validators.required],
        gradeLevel: ['', Validators.required],
        subject: ['', Validators.required],
        contentTypes: ['', Validators.required],
        name: [''],
        description: [''],
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        control.markAsTouched();
    });
}
  saveUser() {
    if (this.contributeForm.dirty && this.contributeForm.valid) {
          const User = {
            ...this.contributeForm.value
        };
          User['firstName'] =  this.userService.userProfile.firstName;
          User['lastName'] =  this.userService.userProfile.lastName || '';
          User['userId'] =  this.userService.userProfile.identifier;
          User['enrolledDate'] = this.enrolledDate;
          User['certificates'] =  '';
          User['channel'] = 'sunbird';
          this.enrollContributorService.enrolment({User: User}).pipe(
            switchMap((res1: any) => {
            this.mapUserId = res1.result.User.osid;
               if (this.enrollAsOrg === true) {
                const Org = {
                  ...this.contributeForm.value
               };
                Org['createdBy'] =  res1.result.User.osid;
                Org['code'] = this.contributeForm.controls['name'].value.toUpperCase();
                return this.enrollContributorService.enrolment({Org: Org});
               } else {
                 return of(res1);
               }
          }), switchMap((res2: any) => {
            if (this.enrollAsOrg === true) {
              this.mapOrgId = res2.result.Org.osid;
              const User_Org = {
                        userId: this.mapUserId,
                        orgId: this.mapOrgId,
                        roles: ['admin']
                      };
              return this.enrollContributorService.enrolment({User_Org: User_Org});
             } else {
               return of(res2);
             }
          }), catchError(err => throwError(err)))
          .subscribe((res3) => {
            this.contributeForm.reset();
            this.tosterService.success('Enrolment is succesfully done...');
            this.modal.deny();
          }, (err) => {
            this.tosterService.error('Failed! Please try later...');
          });
        }
}
  chnageEnrollStatus(status) {
    this.enrollAsOrg = status;
  }

  closeModal() {
    this.close.emit();
  }

}
