// Base types
export interface MediaItem {
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width: number | null;
  height: number | null;
  bytes: number;
  focalPoint: unknown;
  crops: Crop[];
  properties: Record<string, unknown>;
}

export interface Crop {
  alias: string;
  width: number;
  height: number;
  coordinates: unknown;
}

export interface Route {
  path: string;
  startItem: {
    id: string;
    path: string;
  };
}

export interface CTALink {
  url: string | null;
  queryString: string | null;
  title: string;
  target: string | null;
  destinationId: string;
  destinationType: string;
  route: Route;
  linkType: string;
}

// Content block wrapper
export interface ContentBlock<T> {
  content: T;
  settings: unknown;
}

// Course Card
export interface CourseCard {
  contentType: 'ourCourseCard';
  id: string;
  properties: {
    courseTypeImage: MediaItem[];
    courseTypeName: string;
    cTALink: CTALink[];
  };
}

// Homepage Masthead
export interface HomepageMasthead {
  contentType: 'homepageMasthead';
  id: string;
  properties: {
    title: string;
    description: string;
    image: MediaItem[];
    sliderTitle: string;
    sliderCourseCards: {
      items: ContentBlock<CourseCard>[];
    };
  };
}

// Courses Slider
export interface CoursesSlider {
  contentType: 'coursesSlider';
  id: string;
  properties: {
    title: string;
    cTAText: string | null;
    cTALink: CTALink[] | null;
  };
}

// Offer Block
export interface OfferBlock {
  contentType: 'offerBlock';
  id: string;
  properties: {
    icon: MediaItem[];
    title: string;
    text: string;
    textBold: string;
    cTATitle: string;
    cTALink: CTALink[];
  };
}

// Icon with Description
export interface IconWithDescription {
  contentType: 'iconWithDescription';
  id: string;
  properties: {
    icon: MediaItem[];
    title: string;
    description: string;
  };
}

// Why Choose Kentec
export interface WhyChooseKentec {
  contentType: 'whyChooseKentec';
  id: string;
  properties: {
    headingOne: string;
    headingTwo: string;
    youtubeUrl: string | null;
    iconText: {
      items: ContentBlock<IconWithDescription>[];
    };
    imageOrVideo: MediaItem[];
  };
}

// Accreditation Slider
export interface AccreditationSlider {
  contentType: 'accreditationSlider';
  id: string;
  properties: {
    logos: MediaItem[];
    title: string;
    text: string | null;
    textCenter: boolean;
  };
}

// Latest News
export interface LatestNews {
  contentType: 'latestNews';
  id: string;
  properties: {
    title: string;
    cTAText: string;
    cTAUrl: CTALink[];
  };
}

// Logos
export interface Logos {
  contentType: 'logos';
  id: string;
  properties: {
    sliderLogos: MediaItem[];
  };
}

// Image with Alt
export interface ImageWithAlt {
  contentType: 'imageWithAlt';
  id: string;
  properties: {
    image: MediaItem[];
    altTag: string;
  };
}

// Union type for all primary block types
export type PrimaryBlock =
  | CoursesSlider
  | OfferBlock
  | WhyChooseKentec
  | AccreditationSlider
  | LatestNews
  | Logos;

// Home Page Response
export interface HomePageResponse {
  contentType: 'homePage';
  name: string;
  createDate: string;
  updateDate: string;
  route: Route;
  id: string;
  properties: {
    listingTitle: string;
    listingExcerpt: string | null;
    listingImage: {
      items: ContentBlock<ImageWithAlt>[];
    };
    simpleHeader: boolean;
    metaTitle: string;
    metaDescription: string;
    searchEngineRelativePriority: unknown;
    searchEngineChangeFrequency: unknown;
    hideFromSiteMap: boolean;
    oGMetaTitle: string | null;
    oGMetaDescription: string | null;
    oGMetaImage: unknown;
    banner: {
      items: ContentBlock<HomepageMasthead>[];
    };
    primaryBlocks: {
      items: ContentBlock<PrimaryBlock>[];
    };
  };
  cultures: Record<string, unknown>;
}
