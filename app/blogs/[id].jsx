import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import getDetailBlogApi from '../../services/blogs/getDetailsBlogApi';

const BlogDetails = () => {
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <Text className="text-base text-gray-700 leading-7">
        {blog.content}
      </Text>
    </ScrollView>
  );
};

export default BlogDetails;
