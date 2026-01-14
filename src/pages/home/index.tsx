import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, ScrollView} from 'react-native';
import {useAppSelector} from '../../redux/store';
import {
  selectContent,
  selectContentLoading,
} from '../../redux/slices/contentSlice';
import {
  getDBConnection,
  createTable,
  insertItem,
  getAllItems,
  clearAllItems,
} from '../../services/database';

const Home = () => {
  const [savedData, setSavedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get content data from Redux store
  const contentData = useAppSelector(selectContent);
  const contentLoading = useAppSelector(selectContentLoading);

  // Load data from SQLite on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const items = await getAllItems(db);
      setSavedData(items);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSaveToDb = async () => {
    setLoading(true);
    try {
      const db = await getDBConnection();
      await createTable(db);
      await insertItem(db, contentData);
      await loadData();
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDb = async () => {
    try {
      const db = await getDBConnection();
      await clearAllItems(db);
      setSavedData([]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Saving...' : 'Save to SQLite'}
          onPress={handleSaveToDb}
          disabled={loading}
        />
        <View style={styles.spacer} />
        <Button
          title="Clear Database"
          onPress={handleClearDb}
          color="red"
        />
      </View>

      <Text style={styles.sectionTitle}>
        Data from SQLite ({savedData.length} items):
      </Text>

      {savedData.map((item, index) => (
        <View key={item.id || index} style={styles.itemCard}>
          <Text style={styles.itemId}>ID: {item.id}</Text>
          <Text style={styles.itemText}>{JSON.stringify(item, null, 2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  spacer: {
    width: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemId: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 10,
  },
});

export default Home;
