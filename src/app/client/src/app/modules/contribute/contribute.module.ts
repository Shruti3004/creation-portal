import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContributeRoutingModule } from './contibute-routing.module';
import { ListAllProgramsComponent } from './components';
import { ProgramComponent } from './components/program/program.component';
import { OnboardPopupComponent } from './components/onboard-popup/onboard-popup.component';
import { ProgramHeaderComponent } from './components/program-header/program-header.component';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { CbseProgramModule } from '../../modules/cbse-program/cbse-program.module';
import { CollectionComponent, DashboardComponent } from '../cbse-program';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption';
import { ListAllMyProgramsComponent } from './components/list-all-my-programs/list-all-my-programs.component';
import { ListNominatedTextbooksComponent} from './components/list-nominated-textbooks/list-nominated-textbooks.component';
import { ProgramListComponent} from '../shared-feature/components/program-list/program-list.component';
import { DaysToGoPipe } from '../shared-feature/pipe/days-to-go.pipe';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { OrgContriAdminComponent } from './components/org-contri-admin/org-contri-admin.component';
import { ContriDashboardComponent } from './components/dashboard/dashboard.component';
// import { MyProgramComponent} from './components/my-program/my-program.component';
import { DummyComponent } from  './components/dummy/dummy.component';
import { TextbookListComponent } from '../shared-feature';
import { SharedFeatureModule } from '../shared-feature/shared-feature.module'
@NgModule({
  
  declarations: [ListAllProgramsComponent, ProgramComponent, OnboardPopupComponent, ProgramHeaderComponent, ListAllMyProgramsComponent, ListNominatedTextbooksComponent, DummyComponent ],
  imports: [
    SuiModule,
    CommonModule,
    ContributeRoutingModule,
    CommonConsumptionModule,
    SlickModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    NgInviewModule,
    TelemetryModule,
    CbseProgramModule,
    SharedFeatureModule,
    DynamicModule.withComponents([CollectionComponent, DashboardComponent, TextbookListComponent])
  ],
  exports: [
    ProgramComponent,
    OnboardPopupComponent,
    DummyComponent
  ]

})
export class ContributeModule { }
