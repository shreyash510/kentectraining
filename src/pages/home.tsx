import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import content_doc from '../docs/document';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${JSON.stringify(content_doc)}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize:5,
    // fontWeight: 'bold',
  },
});

export default Home;
