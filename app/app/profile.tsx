import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button, Text, TextInput } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/lib/http';

export default function ProfileScreen() {
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: async () => (await api.get('/users/me')).data });
  const [handle, setHandle] = useState('');

  async function follow() {
    await api.post(`/users/follow/${handle}`);
  }
  async function unfollow() {
    await api.post(`/users/unfollow/${handle}`);
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header><Appbar.Content title="Profile" /></Appbar.Header>
      <View style={{ padding: 16 }}>
        {me ? (
          <>
            <Text variant="titleLarge">{me.displayName}</Text>
            <Text>@{me.handle}</Text>
            {me.school ? <Text>School: {me.school.name}</Text> : null}
          </>
        ) : null}
        <View style={{ height: 24 }} />
        <TextInput label="Handle" value={handle} onChangeText={setHandle} />
        <View style={{ height: 12 }} />
        <Button mode="contained" onPress={follow} style={{ marginBottom: 8 }}>Follow</Button>
        <Button mode="outlined" onPress={unfollow}>Unfollow</Button>
      </View>
    </View>
  );
}