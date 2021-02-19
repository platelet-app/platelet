/**
 * Caution: Consider this file when using react-scripts
 * 
 * You may delete this file and its occurrences from the project filesystem if you are using GatsbyJS or NextJS version
 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import WithLayout from 'WithLayout';
import { Main as MainLayout, Minimal as MinimalLayout, DocsLayout } from './layouts';

import {
  Home as HomeView,
  IndexView,
  Agency as AgencyView,
  CareerListing as CareerListingView,
  CareerListingMinimal as CareerListingMinimalView,
  CareerOpening as CareerOpeningView,
  ContactPage as ContactPageView,
  Coworking as CoworkingView,
  Elearning as ElearningView,
  Enterprise as EnterpriseView,
  Service as ServiceView,
  WebBasic as WebBasicView,
  DesktopApp as DesktopAppView,
  Expo as ExpoView,
  Startup as StartupView,
  DesignCompany as DesignCompanyView,
  MobileApp as MobileAppView,
  JobListing as JobListingView,
  Rental as RentalView,
  CloudHosting as CloudHostingView,
  Logistics as LogisticsView,
  Ecommerce as EcommerceView,
  Pricing as PricingView,
  About as AboutView,
  HelpCenter as HelpCenterView,
  HelpCenterArticle as HelpCenterArticleView,
  PortfolioPage as PortfolioPageView,
  PortfolioMasonry as PortfolioMasonryView,
  PortfolioGrid as PortfolioGridView,
  CompanyTerms as CompanyTermsView,
  ContactPageSidebarMap as ContactPageSidebarMapView,
  ContactPageCover as ContactPageCoverView,
  AboutSideCover as AboutSideCoverView,
  BlogSearch as BlogSearchView,
  BlogNewsroom as BlogNewsroomView,
  BlogArticle as BlogArticleView,
  BlogReachView as BlogReachViewView,
  PasswordResetCover as PasswordResetCoverView,
  PasswordResetSimple as PasswordResetSimpleView,
  SigninSimple as SigninSimpleView,
  SigninCover as SigninCoverView,
  SignupSimple as SignupSimpleView,
  SignupCover as SignupCoverView,
  Account as AccountView,
  Documentation as DocumentationView,
  NotFound as NotFoundView,
  NotFoundCover as NotFoundCoverView,
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={IndexView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/home"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={HomeView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/career-listing"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={CareerListingView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/career-listing-minimal"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={CareerListingMinimalView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/career-opening"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={CareerOpeningView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/contact-page"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={ContactPageView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/coworking"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={CoworkingView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/e-learning"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={ElearningView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/enterprise"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={EnterpriseView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/service"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={ServiceView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/web-basic"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={WebBasicView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/desktop-app"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={DesktopAppView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/expo"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={ExpoView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/agency"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={AgencyView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/startup"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={StartupView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/design-company"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={DesignCompanyView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/mobile-app"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={MobileAppView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/job-listing"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={JobListingView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/rental"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={RentalView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/cloud-hosting"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={CloudHostingView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/logistics"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={LogisticsView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/e-commerce"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={EcommerceView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/pricing"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={PricingView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/about"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={AboutView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/help-center"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={HelpCenterView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/help-center-article"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={HelpCenterArticleView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/portfolio-page"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={PortfolioPageView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/portfolio-masonry"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={PortfolioMasonryView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/portfolio-grid"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={PortfolioGridView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/company-terms"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={CompanyTermsView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/contact-sidebar-map"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={ContactPageSidebarMapView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/contact-page-cover"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={ContactPageCoverView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/about-side-cover"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={AboutSideCoverView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/blog-search"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={BlogSearchView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/blog-newsroom"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={BlogNewsroomView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/blog-article"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={BlogArticleView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/blog-reach-view"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={BlogReachViewView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/password-reset-cover"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={PasswordResetCoverView}
            layout={MinimalLayout}
          />
        )}
      />
      <Route
        exact
        path="/password-reset-simple"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={PasswordResetSimpleView}
            layout={MinimalLayout}
          />
        )}
      />
      <Route
        exact
        path="/signin-simple"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={SigninSimpleView}
            layout={MinimalLayout}
          />
        )}
      />
      <Route
        exact
        path="/signin-cover"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={SigninCoverView}
            layout={MinimalLayout}
          />
        )}
      />
      <Route
        exact
        path="/signup-simple"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={SignupSimpleView}
            layout={MinimalLayout}
          />
        )}
      />
      <Route
        exact
        path="/signup-cover"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={SignupCoverView}
            layout={MinimalLayout}
          />
        )}
      />
      <Route
        exact
        path="/account"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={AccountView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/documentation"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={DocumentationView}
            layout={DocsLayout}
          />
        )}
      />
      <Route
        exact
        path="/not-found"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={NotFoundView}
            layout={MinimalLayout}
          />
        )}
      />
      <Route
        exact
        path="/not-found-cover"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={NotFoundCoverView}
            layout={MinimalLayout}
          />
        )}
      />
      <Redirect to="/not-found-cover" />
    </Switch>
  );
};

export default Routes;
