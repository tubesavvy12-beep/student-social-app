import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Appbar, TextInput, Button, List } from 'react-native-paper';
import { api } from '@/src/lib/http';

export default function GroupsScreen() {
  const [name, setName] = useState('');
  const [invites, setInvites] = useState<any[]>([]);

  async function create() {
    await api.post('/premium/groups', { name, isPrivate: true });
    setName('');
  }

  async function refreshInvites() {
    // backend doesn't yet expose a list endpoint; placeholder for future
    setInvites([]);
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header><Appbar.Content title="Groups" /></Appbar.Header>
      <View style={{ padding: 16 }}>
        <TextInput label="Group name" value={name} onChangeText={setName} />
        <Button mode="contained" onPress={create} style={{ marginTop: 8 }}>Create</Button>
      </View>
      <FlatList data={invites} keyExtractor={(item) => item.id} renderItem={({ item }) => (
        <List.Item title={item.group?.name} description={item.status} />
      )} />
    </View>
  );
}