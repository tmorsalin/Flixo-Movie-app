import { View, TextInput, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
  // If onPress is provided (home page), make it a touchable component
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center bg-dark-200 rounded-full px-5 py-4"
      >
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
          tintColor="#AB8BFF"
        />
        <TextInput
          placeholder={placeholder}
          className="flex-1 ml-2 text-white"
          placeholderTextColor="#A8B5DB"
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
    );
  }

  // If no onPress (search page), make it a regular text input
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#A8B5DB"
      />
    </View>
  );
};

export default SearchBar;