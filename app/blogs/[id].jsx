import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import getDetailBlogApi from '../../services/blogs/getDetailsBlogApi';

const BlogDetails = () => {
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (id) {
      getDetailBlogApi.getDetailsBlog(id)
        .then((res) => {
          setBlog(res.data.data); // lấy đúng blog từ res.data.data
          setLoading(false);
        })
        .catch((err) => {
          console.error('Lỗi khi lấy blog:', err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-500">Đang tải...</Text>
      </View>
    );
  }

  if (!blog) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Không tìm thấy blog</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* Tiêu đề */}
      <Text className="text-2xl font-bold text-black mb-4">{blog.title}</Text>

      {/* Ảnh đại diện */}
      {blog.imageUrl && (
        <Image
          source={{ uri: blog.imageUrl }}
          className="w-full h-64 rounded-2xl mb-6"
          resizeMode="cover"
        />
      )}

      {/* Thông tin phụ */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600">👤 Tác giả: {blog.author?.name || 'Unknown'}</Text>
        <Text className="text-sm text-gray-600">📚 Chuyên mục: {blog.category?.title || 'Chưa phân loại'}</Text>
        <Text className="text-sm text-gray-500 italic">
          🕒 Ngày đăng: {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
        </Text>
      </View>

      {/* Nội dung blog */}
      <View className="mb-4">
        <RenderHtml
          contentWidth={width}
          source={{ html: blog.content }}
          tagsStyles={{
            h1: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: '#1F2937' },
            h2: { fontSize: 20, fontWeight: 'bold', marginVertical: 8, color: '#1F2937' },
            h3: { fontSize: 18, fontWeight: 'bold', marginVertical: 6, color: '#1F2937' },
            p: { fontSize: 16, lineHeight: 24, marginVertical: 4, color: '#374151' },
            strong: { fontWeight: 'bold', color: '#1F2937' },
            a: { color: '#3B82F6', textDecorationLine: 'underline' },
            li: { fontSize: 16, lineHeight: 24, marginVertical: 2, color: '#374151' },
            ul: { marginVertical: 8 },
            ol: { marginVertical: 8 }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default BlogDetails;
