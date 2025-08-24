import React from 'react';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Appbar, Card, Text, ActivityIndicator, FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/lib/http';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { data, isLoading } = useQuery({ queryKey: ['feed'], queryFn: async () => (await api.get('/tweets/feed/home')).data });

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header><Appbar.Content title="Home" /></Appbar.Header>
      {isLoading ? <ActivityIndicator style={{ marginTop: 40 }} /> : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/tweet/${item.id}`)}>
              <Card style={{ margin: 12 }}>
                <Card.Title title={item.author.displayName} subtitle={`@${item.author.handle}`} />
                <Card.Content>
                  <Text>{item.content}</Text>
                </Card.Content>
                {item.media?.length ? (
                  <Card.Content>
                    {item.media.map((m: any) => (
                      <Image key={m.id} source={{ uri: m.url }} style={{ height: 200, borderRadius: 8, marginTop: 8 }} />
                    ))}
                  </Card.Content>
                ) : null}
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
      <FAB icon="plus" style={{ position: 'absolute', bottom: 24, right: 24 }} onPress={() => router.push('/compose')} />
    </View>
  );
}