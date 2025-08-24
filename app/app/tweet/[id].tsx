import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Appbar, Card, Text, TextInput, Button } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/lib/http';

export default function TweetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: tweet } = useQuery({ queryKey: ['tweet', id], queryFn: async () => (await api.get(`/tweets/${id}`)).data, enabled: !!id });
  const { data: comments } = useQuery({ queryKey: ['tweet', id, 'comments'], queryFn: async () => (await api.get(`/tweets/${id}/comments`)).data, enabled: !!id });
  const [content, setContent] = useState('');

  async function like() {
    await api.post(`/tweets/${id}/like`);
    qc.invalidateQueries({ queryKey: ['tweet', id] });
  }

  async function comment() {
    await api.post(`/tweets/${id}/comment`, { content });
    setContent('');
    qc.invalidateQueries({ queryKey: ['tweet', id, 'comments'] });
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Tweet" />
      </Appbar.Header>
      {tweet ? (
        <Card style={{ margin: 12 }}>
          <Card.Title title={tweet.author.displayName} subtitle={`@${tweet.author.handle}`} />
          <Card.Content>
            <Text>{tweet.content}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={like}>Like ({tweet.likeCount})</Button>
          </Card.Actions>
        </Card>
      ) : null}
      <FlatList data={comments || []} keyExtractor={(item) => item.id} renderItem={({ item }) => (
        <Card style={{ marginHorizontal: 12, marginVertical: 6 }}>
          <Card.Title title={item.author.displayName} subtitle={`@${item.author.handle}`} />
          <Card.Content><Text>{item.content}</Text></Card.Content>
        </Card>
      )} />
      <View style={{ padding: 12, flexDirection: 'row', gap: 8 }}>
        <TextInput style={{ flex: 1 }} value={content} onChangeText={setContent} placeholder="Write a comment" />
        <Button onPress={comment} disabled={!content.trim()}>Send</Button>
      </View>
    </View>
  );
}