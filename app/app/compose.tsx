import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button, TextInput } from 'react-native-paper';
import { api } from '@/src/lib/http';
import { useRouter } from 'expo-router';

export default function ComposeScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  async function submit() {
    await api.post('/tweets', { content, media: imageUrl ? [{ url: imageUrl, type: 'IMAGE' }] : [] });
    router.back();
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Compose" />
        <Button onPress={submit} disabled={!content.trim()}>Post</Button>
      </Appbar.Header>
      <View style={{ padding: 16 }}>
        <TextInput label="What's happening?" multiline value={content} onChangeText={setContent} style={{ marginBottom: 16 }} />
        <TextInput label="Image URL (optional)" value={imageUrl} onChangeText={setImageUrl} />
      </View>
    </View>
  );
}