import { ReportModule } from './report/report.module';
import { HeaderComponent } from './header/header.component';
import { ScheduleModule } from './schedule/schedule.module';
import { ApplicationModule } from './application/application.module';
import { ResumeModule } from './resume/resume.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './user/components/profile/user-view.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { OnlyNumber } from './_shared/directive/onlynumber.directive';
import { ResendComponent } from './auth/resend/resend.component';
import { OverviewModule } from './overview/overview.module';
import { FooterComponent } from './footer/footer.component';
import { TagModule } from './tag/tag.module';

@NgModule({
  declarations: [
    AppComponent,

    ResendComponent,
    LoginComponent,
    RegisterComponent,

    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    OnlyNumber,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    UserModule,
    VacancyModule,
    ResumeModule,
    OrganizationModule,
    TagModule,
    ApplicationModule,
    ScheduleModule,
    OverviewModule,
    ReportModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
