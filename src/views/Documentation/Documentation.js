import React, { lazy, Suspense } from 'react';
import { parse } from 'query-string';
import { makeStyles } from '@material-ui/core/styles';
import { Section } from 'components/organisms';
import { Loading } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    height: '100%',
    width: '100%',
  },
  section: {
    paddingTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(4),
    }
  },
}));

const getComponentId = () => parse(window.location.search).component || 'introduction';

const renderComponent = () => {
  let Component = null;
  const componentId = getComponentId();

  switch (componentId) {
    case 'introduction':
      const Introduction = lazy(() => import('./parts/Introduction'));
      Component = <Introduction />;
      break;
    case 'quick-start':
      const QuickStart = lazy(() => import('./parts/QuickStart'));
      Component = <QuickStart />;
      break;
    case 'changelog':
      const Changelog = lazy(() => import('./parts/Changelog'));
      Component = <Changelog />;
      break;
    case 'dark-mode-toggler':
      const DarkModeTogglerExample = lazy(() => import('./examples/DarkModeTogglerExample'));
      Component = <DarkModeTogglerExample />;
      break;
    case 'icon':
      const IconExample = lazy(() => import('./examples/IconExample'));
      Component = <IconExample />;
      break;
    case 'icon-text':
      const IconTextExample = lazy(() => import('./examples/IconTextExample'));
      Component = <IconTextExample />;
      break;
    case 'image':
      const ImageExample = lazy(() => import('./examples/ImageExample'));
      Component = <ImageExample />;
      break;
    case 'learn-more-link':
      const LearnMoreLinkExample = lazy(() => import('./examples/LearnMoreLinkExample'));
      Component = <LearnMoreLinkExample />;
      break;
    case 'count-up-number':
      const CountUpNumberExample = lazy(() => import('./examples/CountUpNumberExample'));
      Component = <CountUpNumberExample />;
      break;
    case 'description-with-cta':
      const DescriptionCtaExample = lazy(() => import('./examples/DescriptionCtaExample'));
      Component = <DescriptionCtaExample />;
      break;
    case 'icon-alternate':
      const IconAlternateExample = lazy(() => import('./examples/IconAlternateExample'));
      Component = <IconAlternateExample />;
      break;
    case 'overlapped-images':
      const OverlapedImagesExample = lazy(() => import('./examples/OverlapedImagesExample'));
      Component = <OverlapedImagesExample />;
      break;
    case 'section-header':
      const SectionHeaderExample = lazy(() => import('./examples/SectionHeaderExample'));
      Component = <SectionHeaderExample />;
      break;
    case 'image-swiper':
      const SwiperImageExample = lazy(() => import('./examples/SwiperImageExample'));
      Component = <SwiperImageExample />;
      break;
    case 'numbers-swiper':
      const SwiperNumberExample = lazy(() => import('./examples/SwiperNumberExample'));
      Component = <SwiperNumberExample />;
      break;
    case 'typed-text':
      const TypedTextExample = lazy(() => import('./examples/TypedTextExample'));
      Component = <TypedTextExample />;
      break;
    case 'accordion':
      const AccordionExample = lazy(() => import('./examples/AccordionExample'));
      Component = <AccordionExample />;
      break;
    case 'card-base':
      const CardBaseExample = lazy(() => import('./examples/CardBaseExample'));
      Component = <CardBaseExample />;
      break;
    case 'card-category':
      const CardCategoryExample = lazy(() => import('./examples/CardCategoryExample'));
      Component = <CardCategoryExample />;
      break;
    case 'card-category-link':
      const CardCategoryLinkExample = lazy(() => import('./examples/CardCategoryLinkExample'));
      Component = <CardCategoryLinkExample />;
      break;
    case 'card-job':
      const CardJobExample = lazy(() => import('./examples/CardJobExample'));
      Component = <CardJobExample />;
      break;
    case 'card-job-company':
      const CardJobCompanyExample = lazy(() => import('./examples/CardJobCompanyExample'));
      Component = <CardJobCompanyExample />;
      break;
    case 'card-job-minimal':
      const CardJobMinimalExample = lazy(() => import('./examples/CardJobMinimalExample'));
      Component = <CardJobMinimalExample />;
      break;
    case 'card-job-tag':
      const CardJobTagExample = lazy(() => import('./examples/CardJobTagExample'));
      Component = <CardJobTagExample />;
      break;
    case 'card-pricing-standard':
      const CardPricingStandardExample = lazy(() => import('./examples/CardPricingStandardExample'));
      Component = <CardPricingStandardExample />;
      break;
    case 'card-product':
      const CardProductExample = lazy(() => import('./examples/CardProductExample'));
      Component = <CardProductExample />;
      break;
    case 'card-promo':
      const CardPromoExample = lazy(() => import('./examples/CardPromoExample'));
      Component = <CardPromoExample />;
      break;
    case 'card-review':
      const CardReviewExample = lazy(() => import('./examples/CardReviewExample'));
      Component = <CardReviewExample />;
      break;
    case 'description-list-icon':
      const DescriptionListIconExample = lazy(() => import('./examples/DescriptionListIconExample'));
      Component = <DescriptionListIconExample />;
      break;
    case 'hero-background':
      const HeroBackgroundExample = lazy(() => import('./examples/HeroBackgroundExample'));
      Component = <HeroBackgroundExample />;
      break;
    case 'hero-shaped':
      const HeroShapedExample = lazy(() => import('./examples/HeroShapedExample'));
      Component = <HeroShapedExample />;
      break;
    case 'hero-side-image':
      const HeroSideImageExample = lazy(() => import('./examples/HeroSideImageExample'));
      Component = <HeroSideImageExample />;
      break;
    case 'hero-simple-background':
      const HeroSimpleBackgroundExample = lazy(() => import('./examples/HeroSimpleBackgroundExample'));
      Component = <HeroSimpleBackgroundExample />;
      break;
    case 'map':
      const MapExample = lazy(() => import('./examples/MapExample'));
      Component = <MapExample />;
      break;
    case 'parallax':
      const ParallaxExample = lazy(() => import('./examples/ParallaxExample'));
      Component = <ParallaxExample />;
      break;
    case 'section':
      const SectionExample = lazy(() => import('./examples/SectionExample'));
      Component = <SectionExample />;
      break;
    case 'section-alternate':
      const SectionAlternateExample = lazy(() => import('./examples/SectionAlternateExample'));
      Component = <SectionAlternateExample />;
      break;
    default:
      Component = null;
      break;
  }

  return Component;
};

const Documentation = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Section className={classes.section}>
        <Suspense fallback={<Loading />}>
          {renderComponent()}
        </Suspense>
      </Section>
    </div>
  );
};

export default Documentation;
