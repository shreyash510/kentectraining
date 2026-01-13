import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import type {
  HomePageResponse,
  HomepageMasthead,
  CourseCard,
  CoursesSlider,
  OfferBlock,
  WhyChooseKentec,
  AccreditationSlider,
  LatestNews,
  Logos,
  PrimaryBlock,
} from '../types';
import homePageData from '../docs/document.json';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const BASE_URL = 'https://www.kentectraining.com';

const HomeScreen: React.FC = () => {
  const data = homePageData as HomePageResponse;
  const masthead = data.properties.banner.items[0]?.content as HomepageMasthead;
  const primaryBlocks = data.properties.primaryBlocks.items;

  return (
    <ScrollView style={styles.container}>
      {/* Masthead Section */}
      {masthead && <MastheadSection masthead={masthead} />}

      {/* Course Categories */}
      {masthead?.properties.sliderCourseCards && (
        <CourseCategoriesSection
          title={masthead.properties.sliderTitle}
          courses={masthead.properties.sliderCourseCards.items.map(
            item => item.content,
          )}
        />
      )}

      {/* Primary Blocks */}
      {primaryBlocks.map((block, index) => (
        <PrimaryBlockRenderer key={block.content.id} block={block.content} />
      ))}
    </ScrollView>
  );
};

// Masthead Component
interface MastheadSectionProps {
  masthead: HomepageMasthead;
}

const MastheadSection: React.FC<MastheadSectionProps> = ({masthead}) => {
  const imageUrl = masthead.properties.image[0]?.url;

  return (
    <View style={styles.mastheadContainer}>
      {imageUrl && (
        <Image
          source={{uri: `${BASE_URL}${imageUrl}`}}
          style={styles.mastheadImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.mastheadOverlay}>
        <Text style={styles.mastheadTitle}>{masthead.properties.title}</Text>
        <Text style={styles.mastheadDescription}>
          {masthead.properties.description}
        </Text>
      </View>
    </View>
  );
};

// Course Categories Component
interface CourseCategoriesSectionProps {
  title: string;
  courses: CourseCard[];
}

const CourseCategoriesSection: React.FC<CourseCategoriesSectionProps> = ({
  title,
  courses,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {courses.map(course => (
          <CourseCardItem key={course.id} course={course} />
        ))}
      </ScrollView>
    </View>
  );
};

// Course Card Item
interface CourseCardItemProps {
  course: CourseCard;
}

const CourseCardItem: React.FC<CourseCardItemProps> = ({course}) => {
  const imageUrl = course.properties.courseTypeImage[0]?.url;

  return (
    <View style={styles.courseCard}>
      {imageUrl && (
        <Image
          source={{uri: `${BASE_URL}${imageUrl}`}}
          style={styles.courseCardImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.courseCardTitle}>
        {course.properties.courseTypeName}
      </Text>
    </View>
  );
};

// Primary Block Renderer
interface PrimaryBlockRendererProps {
  block: PrimaryBlock;
}

const PrimaryBlockRenderer: React.FC<PrimaryBlockRendererProps> = ({block}) => {
  switch (block.contentType) {
    case 'coursesSlider':
      return <CoursesSliderBlock block={block as CoursesSlider} />;
    case 'offerBlock':
      return <OfferBlockSection block={block as OfferBlock} />;
    case 'whyChooseKentec':
      return <WhyChooseSection block={block as WhyChooseKentec} />;
    case 'accreditationSlider':
      return <AccreditationSection block={block as AccreditationSlider} />;
    case 'latestNews':
      return <LatestNewsSection block={block as LatestNews} />;
    case 'logos':
      return <LogosSection block={block as Logos} />;
    default:
      return null;
  }
};

// Courses Slider Block
const CoursesSliderBlock: React.FC<{block: CoursesSlider}> = ({block}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{block.properties.title}</Text>
    <Text style={styles.placeholder}>Popular courses will be displayed here</Text>
  </View>
);

// Offer Block Section
const OfferBlockSection: React.FC<{block: OfferBlock}> = ({block}) => (
  <View style={[styles.section, styles.offerSection]}>
    <Text style={styles.sectionTitle}>{block.properties.title}</Text>
    <Text style={styles.offerText}>{block.properties.text}</Text>
    <Text style={styles.offerTextBold}>{block.properties.textBold}</Text>
  </View>
);

// Why Choose Section
const WhyChooseSection: React.FC<{block: WhyChooseKentec}> = ({block}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      {block.properties.headingOne} {block.properties.headingTwo}
    </Text>
    {block.properties.iconText.items.map(item => (
      <View key={item.content.id} style={styles.iconTextItem}>
        <Text style={styles.iconTextTitle}>{item.content.properties.title}</Text>
        <Text style={styles.iconTextDescription}>
          {item.content.properties.description}
        </Text>
      </View>
    ))}
  </View>
);

// Accreditation Section
const AccreditationSection: React.FC<{block: AccreditationSlider}> = ({
  block,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{block.properties.title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {block.properties.logos.map(logo => (
        <Image
          key={logo.id}
          source={{uri: `${BASE_URL}${logo.url}`}}
          style={styles.logoImage}
          resizeMode="contain"
        />
      ))}
    </ScrollView>
  </View>
);

// Latest News Section
const LatestNewsSection: React.FC<{block: LatestNews}> = ({block}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{block.properties.title}</Text>
    <Text style={styles.placeholder}>News articles will be displayed here</Text>
  </View>
);

// Logos Section
const LogosSection: React.FC<{block: Logos}> = ({block}) => (
  <View style={styles.section}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {block.properties.sliderLogos.map(logo => (
        <Image
          key={logo.id}
          source={{uri: `${BASE_URL}${logo.url}`}}
          style={styles.certLogoImage}
          resizeMode="contain"
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Masthead Styles
  mastheadContainer: {
    height: 250,
    position: 'relative',
  },
  mastheadImage: {
    width: '100%',
    height: '100%',
  },
  mastheadOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mastheadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  mastheadDescription: {
    fontSize: 16,
    color: '#fff',
  },
  // Section Styles
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  placeholder: {
    color: '#999',
    fontStyle: 'italic',
  },
  // Course Card Styles
  courseCard: {
    width: 150,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  courseCardImage: {
    width: '100%',
    height: 100,
  },
  courseCardTitle: {
    padding: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  // Offer Section
  offerSection: {
    backgroundColor: '#f0f7ff',
  },
  offerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  offerTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  // Icon Text Item
  iconTextItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconTextTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  iconTextDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Logo Styles
  logoImage: {
    width: 100,
    height: 60,
    marginRight: 16,
  },
  certLogoImage: {
    width: 80,
    height: 40,
    marginRight: 16,
  },
});

export default HomeScreen;
