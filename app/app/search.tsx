import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, TextInput, List } from 'react-native-paper';
import { api } from '@/src/lib/http';

export default function SearchScreen() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);

  async function search() {
    const res = await api.get('/users', { params: { q } });
    setResults(res.data);
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header><Appbar.Content title="Search" /></Appbar.Header>
      <View style={{ padding: 16 }}>
        <TextInput placeholder="Search users by handle, name, email" value={q} onChangeText={setQ} onSubmitEditing={search} />
      </View>
      <FlatList data={results} keyExtractor={(item) => item.id} renderItem={({ item }) => (
        <List.Item title={item.displayName} description={`@${item.handle}`} left={props => <List.Icon {...props} icon="account" />} />
      )} />
    </View>
  );
}