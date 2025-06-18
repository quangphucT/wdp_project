import { Stack } from 'expo-router';

export default function BlogLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="blog"
        options={{
          title: "Tin tức",
        }}
      />
    </Stack>
  );
}
