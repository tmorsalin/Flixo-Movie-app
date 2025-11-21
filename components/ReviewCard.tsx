import { View, Text, Image } from "react-native";
import { icons } from "@/constants/icons";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <View className="bg-dark-100 rounded-lg p-4 mb-3">
      <View className="flex-row items-center mb-3">
        <Image
          source={{
            uri: review.author_details.avatar_path
              ? `https://image.tmdb.org/t/p/w100${review.author_details.avatar_path}`
              : "https://via.placeholder.com/100x100.png?text=User",
          }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="text-white font-semibold">{review.author}</Text>
          <View className="flex-row items-center">
            <Text className="text-light-200 text-xs">
              {formatDate(review.created_at)}
            </Text>
            {review.author_details.rating && (
              <View className="flex-row items-center ml-3">
                <Image source={icons.star} className="w-3 h-3 mr-1" />
                <Text className="text-white text-xs font-semibold">
                  {review.author_details.rating}/10
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <Text className="text-light-100 text-sm leading-5">
        {truncateContent(review.content)}
      </Text>
    </View>
  );
};

export default ReviewCard;