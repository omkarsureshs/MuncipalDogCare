// src/screens/WelcomeScreen.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const features = [
    { icon: 'alert-triangle', title: 'Report Issues', description: 'Quickly report dog nuisance or garbage problems' },
    { icon: 'users', title: 'Smart Assignment', description: 'Automatic assignment to nearest available workers' },
    { icon: 'trending-up', title: 'Track Progress', description: 'Real-time updates and resolution tracking' },
    { icon: 'map-pin', title: 'Location Based', description: 'Issues mapped to specific locations' },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();

  useEffect(() => {
    const totalWidth = features.length * (screenWidth * 0.7 + 16);
    let offset = 0;

    const animateScroll = () => {
      offset += 1; // smooth small increment
      if (offset > totalWidth) offset = 0;
      scrollRef.current?.scrollTo({ x: offset, animated: false });
      requestAnimationFrame(animateScroll);
    };

    animateScroll();
  }, [features.length]);

  const FeatureCard = ({ icon, title, description }) => (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon}>
        <Feather name={icon} size={16} color="#fff" />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#1A1F2B', '#2C3036', '#3A3F46']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1F2B" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Feather name="shield" size={28} color="#E1994D" />
          </View>
          <Text style={styles.appName}>CivicCare</Text>
          <Text style={styles.tagline}>Community Issue Management</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Welcome to CivicCare</Text>
          <Text style={styles.heroSubtitle}>Your neighborhood's solution for faster issue resolution</Text>
        </View>

        {/* Features Horizontal Scroll */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
            scrollEnabled={false} // disable manual scrolling
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {features.map((feature) => (
              <FeatureCard key={feature.icon} {...feature} />
            ))}
          </ScrollView>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.nextButtonText}>Get Started</Text>
          <Feather name="arrow-right" size={18} color="#1A1F2B" />
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Trusted by communities nationwide</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 70, paddingBottom: 30 },
  logoCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(225,153,77,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'rgba(225,153,77,0.3)' },
  appName: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  tagline: { fontSize: 15, color: '#CBD5E0', marginTop: 6 },

  heroSection: { alignItems: 'center', marginBottom: 36 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#A0AEC0', textAlign: 'center' },

  featuresSection: { marginBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  featureCard: { width: screenWidth * 0.7, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginRight: 16, borderWidth: 1, borderColor: 'rgba(225,153,77,0.25)' },
  featureIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#E1994D', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  featureDescription: { fontSize: 13, color: '#CBD5E0' },

  nextButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#E1994D', borderRadius: 14, paddingVertical: 14, marginBottom: 28, shadowColor: '#E1994D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  nextButtonText: { fontSize: 16, fontWeight: '700', color: '#1A1F2B', marginRight: 6 },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 13, color: '#264653', fontStyle: 'italic' },
});

export default WelcomeScreen;
