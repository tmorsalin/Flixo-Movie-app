import { View, Text, Image } from "react-native";

interface CastCardProps {
  cast: Cast;
}

const CastCard = ({ cast }: CastCardProps) => {
  return (
    <View className="mr-4 w-24">
      <Image
        source={{
          uri: cast.profile_path
            ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
            : "https://via.placeholder.com/200x300.png?text=No+Image",
        }}
        className="w-24 h-32 rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-white text-xs font-semibold mt-2" numberOfLines={1}>
        {cast.name}
      </Text>
      <Text className="text-light-200 text-xs" numberOfLines={1}>
        {cast.character}
      </Text>
    </View>
  );
};

export default CastCard;