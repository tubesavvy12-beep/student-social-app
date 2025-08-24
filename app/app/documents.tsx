import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { api } from '@/src/lib/http';

export default function DocumentsScreen() {
  const [type, setType] = useState<'STUDENT_ID' | 'TRANSCRIPT' | 'OTHER'>('STUDENT_ID');
  const [url, setUrl] = useState('');

  async function submit() {
    await api.post('/premium/documents', { type, url });
    setUrl('');
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header><Appbar.Content title="Documents" /></Appbar.Header>
      <View style={{ padding: 16 }}>
        <SegmentedButtons
          value={type}
          onValueChange={v => setType(v as any)}
          buttons={[
            { value: 'STUDENT_ID', label: 'Student ID' },
            { value: 'TRANSCRIPT', label: 'Transcript' },
            { value: 'OTHER', label: 'Other' }
          ]}
        />
        <TextInput label="Document URL" value={url} onChangeText={setUrl} style={{ marginTop: 12 }} />
        <Button mode="contained" onPress={submit} style={{ marginTop: 12 }}>Attach</Button>
      </View>
    </View>
  );
}