/**
 * Caution: Consider this file when using react-scripts
 *
 * You may delete this file and its occurrences from the project filesystem if you are using GatsbyJS or NextJS version
 */
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import WithLayout from "WithLayout";
import { Main as MainLayout, Minimal as MinimalLayout } from "./layouts";

import {
  IndexView,
  NotFound as NotFoundView,
  NotFoundCover as NotFoundCoverView,
  AboutPlatelet as AboutPlateletView,
  AboutBloodBikes as AboutBloodBikesView,
  Testimonials as TestimonialsView,
} from "./views";

const Routes = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(matchProps) => (
          <WithLayout
            {...matchProps}
            component={IndexView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/about-platelet"
        render={(matchProps) => (
          <WithLayout
            {...matchProps}
            component={AboutPlateletView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/about-blood-bikes"
        render={(matchProps) => (
          <WithLayout
            {...matchProps}
            component={AboutBloodBikesView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/testimonials"
        render={(matchProps) => (
          <WithLayout
            {...matchProps}
            component={TestimonialsView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/not-found"
        render={(matchProps) => (
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
        render={(matchProps) => (
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
