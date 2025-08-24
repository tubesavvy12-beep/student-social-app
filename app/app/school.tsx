import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import { api } from '@/src/lib/http';

export default function SchoolScreen() {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [address, setAddress] = useState('');

  async function submit() {
    await api.post('/premium/schools', { name, domain, address });
    setName(''); setDomain(''); setAddress('');
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header><Appbar.Content title="Register School" /></Appbar.Header>
      <View style={{ padding: 16 }}>
        <TextInput label="School name" value={name} onChangeText={setName} />
        <TextInput label="Domain (optional)" value={domain} onChangeText={setDomain} style={{ marginTop: 8 }} />
        <TextInput label="Address (optional)" value={address} onChangeText={setAddress} style={{ marginTop: 8 }} />
        <Button mode="contained" onPress={submit} style={{ marginTop: 16 }}>Register</Button>
      </View>
    </View>
  );
}