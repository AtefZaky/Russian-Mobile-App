import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../Styles";

const Navbar = ({ onOpenSidebar, onNewChat }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onOpenSidebar}>
        <Ionicons name="menu-outline" size={28} color="#2579A7" />
      </TouchableOpacity>
      <Text style={styles.title}>ChatApp</Text>
      <TouchableOpacity onPress={onNewChat}>
        <Ionicons name="chatbox-ellipses-outline" size={28} color="#2579A7" />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
