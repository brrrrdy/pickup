import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";

export default function FindGame() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // TODO: implement game search
  };

  return (
    <PageContent className="items-start justify-start gap-8">
      <PageHeader>find a game</PageHeader>

      {/* Search box */}
      <View className="w-full gap-3">
        <Text className="text-sm font-semibold text-defaulttext">
          Search for a game near you
        </Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 border border-defaulttext/20 rounded-lg px-4 py-3 text-base text-defaulttext"
            placeholder="Location, sport, or game name..."
            placeholderTextColor="#3d3c3c70"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <Pressable
            onPress={handleSearch}
            className="bg-primary rounded-lg px-5 py-3"
          >
            <Text className="text-base font-semibold text-white">Search</Text>
          </Pressable>
        </View>
      </View>
    </PageContent>
  );
}
