import React, { useState } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import Navbar from "./components/Navebar";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import Login from "./components/Login"
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Dropdown from "./components/Dropdowns"
import styles from "./Styles";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(false)

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required to use this feature.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image URI:", result.assets[0].uri); // Access the captured image URI
    }
  };

  const openDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    console.log(result)
    if (result.canceled === false) {
      console.log("Picked document URI:");
      setFile(result.assets[0])
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: `📄${result.assets[0].name}`, isUser: true },
      ]);
      console.log(result.assets[0])
    }
  };

  const handleOutsidePress = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const clearMessages = () => {
    setMessages([]); 
  };

  return (
    // <Login/>
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <Navbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNewChat={clearMessages}
        />
        <Sidebar isVisible={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ChatArea
          openCamera={openCamera}
          openDocumentPicker={openDocumentPicker}
          messages={messages}
          setMessages={setMessages}
          file= {file}
          setFile = {setFile}
        />
        {/* <Dropdown/> */}
      </View>
    </TouchableWithoutFeedback>
   
  );
}
