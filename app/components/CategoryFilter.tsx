// app/components/CategoryFilter.tsx
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../src/constants";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.button,
            selectedCategory === cat && styles.selectedButton,
          ]}
          onPress={() => onSelectCategory(cat)}
        >
          <Text
            style={[
              styles.text,
              selectedCategory === cat && styles.selectedText,
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginVertical: 10 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  selectedButton: { backgroundColor: COLORS.primary },
  text: { color: "#333", fontWeight: "bold" },
  selectedText: { color: COLORS.secondary },
});
