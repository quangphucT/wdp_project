import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import blogApi from '../../services/blogs/getAllBlogsApi';


const BlogScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const { width } = useWindowDimensions();

  // Function để strip HTML tags cho preview
  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const fetchingDataBlog = async () => {
    try {
      const response = await blogApi.getAll();
      setBlogs(response.data.data.data);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
  };

  useEffect(() => {
    fetchingDataBlog();
  }, []);

  const renderBlogItem = ({ item }) => (
  <View style={styles.card}>
    <Link href={`/blogs/${item.id}`} asChild>
      <TouchableOpacity>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </TouchableOpacity>
    </Link>

    <View style={styles.cardContent}>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      
      {/* Sử dụng stripHtml để hiển thị preview text không có HTML tags */}
      <Text style={styles.content} numberOfLines={3}>
        {stripHtml(item.content)}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.author}>👤 {item.author?.name || 'Unknown'}</Text>
        <Text style={styles.category}>📚 {item.category?.title || 'Chưa phân loại'}</Text>
      </View>
    </View>
  </View>
);
  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBlogItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#f2f4f6',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e88e5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  content: {
    fontSize: 14,
    color: '#444',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
  category: {
    fontSize: 12,
    color: '#1e88e5',
    fontWeight: '500',
  },
});
