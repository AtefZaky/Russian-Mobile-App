import React, { useState, useRef } from "react";
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  Pressable, 
  Animated 
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Markdown from 'react-native-markdown-display';
import EventSource from 'react-native-event-source';
import styles from "../Styles";

const ChatArea = ({ openCamera, openDocumentPicker, messages, setMessages, file, setFile }) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef();
  const scaleAnim = useRef(new Animated.Value(1)).current; // For scaling animation

  const closeConnection = (eventSource) => {
    eventSource.close();
    console.log('Connection closed.');
    setLoading(false);
  };

  const sendMessage = async () => {
    let fullResponse = ""
    if (input == ""){
      return
    }
    setInput(""); // Clear previous responses
    const botMessageId = Date.now().toString() +2
    setLoading(true); // Show loading state
    try {
      context = ""
      if (file){
        const formData = new FormData();
        setLoading(true)
        formData.append('file', {
          uri: file.uri, // File URI
          type: file.mimeType, // File MIME type
          name: file.name, // File name
        });
        console.log(formData)
        const response = await fetch("http://192.168.1.242:8000/docs", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            // No need for 'Content-Type'; `fetch` sets it automatically for FormData
          },
        });
        console.log(response)
        const result = await response.json();
        console.log(result);
        context = result.english_translation
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now().toString()+4, text: `Extracted Text:\n\n ${result.context}`, isUser: false },
          { id: Date.now().toString()+5, text: `Translated Text:\n\n ${context}`, isUser: false },
        ]);
        setFile(false)
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: input, isUser: true },
        { id: botMessageId, text: "", isUser: false }, // Add placeholder for bot response
      ]);

      const url = `http://192.168.1.242:8000/stream`;  // Adjust the URL if necessary

      const eventSource = new EventSource(url, {
        method: 'POST',  // Ensure you use POST if required
        body: JSON.stringify({
          question: input,
          context: context
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      eventSource.addEventListener("message", ({ data }) => {
        const msgObj = JSON.parse(data);
        console.log(msgObj);
        fullResponse += msgObj;
  
        // Check if the bot message already exists
        setMessages((prevMessages) => {
          const existingBotMessage = prevMessages.find(
            (message) => message.id === botMessageId
          );
  
          if (existingBotMessage) {
            // Update the existing bot message
            return prevMessages.map((message) =>
              message.id === botMessageId
                ? { ...message, text: (message.text || "") + msgObj }
                : message
            );
          } else {
            // Add a new bot message if it doesn't exist
            return [
              ...prevMessages,
              { id: botMessageId, text: msgObj, isUser: false },
            ];
          }
        });
        flatListRef.current?.scrollToEnd()
    })
      // Return cleanup function
      eventSource.addEventListener('end', () => {
        console.log('Stream ended.');
        // setResponse("")
        // flatListRef.current?.scrollToEnd({ animated: true });
        closeConnection(eventSource); // Close the connection when the stream ends
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => {
        const existingBotMessage = prevMessages.find(
          (message) => message.id === botMessageId
        );

        if (existingBotMessage) {
          // Update the existing bot message
          return prevMessages.map((message) =>
            message.id === botMessageId
              ? { ...message, text: (message.text || "") + "An Error Occurred Try again" }
              : message
          );
        } else {
          // Add a new bot message if it doesn't exist
          return [
            ...prevMessages,
            { id: botMessageId, text: "An Error Occurred Try again", isUser: false },
          ];
        }
      })
      // setResponse("");
      setLoading(false); // Hide loading state
    };  
  }

  const startRecording = async () => {
    if (!input == ""){
      return
    }
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access microphone denied");
        return;
      }

      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording saved at:", uri);

        // You can process the recorded audio file (e.g., send it to a server or save it locally)
      }
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const handleMicPressIn = () => {
    if (!input == ""){
      return
    }
    Animated.spring(scaleAnim, {
      toValue: 1.2, // Scale up the button
      useNativeDriver: true,
    }).start();
  };

  const handleMicPressOut = async () => {
    if (!input == ""){
      return
    }

    Animated.spring(scaleAnim, {
      toValue: 1, // Scale back to original size
      useNativeDriver: true,
    }).start();

    if (isRecording) {
      await stopRecording();
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser
          ? { alignSelf: "flex-end", flexDirection: "row-reverse" }
          : { alignSelf: "flex-start", flexDirection: "row" },
      ]}
    >
      <View style={styles.iconContainer}>
        {item.isUser ? (
          <Ionicons name="person-circle-outline" size={24} color="#2579A7" />
        ) : (
          <MaterialIcons name="smart-toy" size={24} color="#2579A7" />
        )}
      </View>
      <Text
        style={[
          styles.messageText,
          item.isUser && styles.userMessageText,
          !item.isUser && { color: "black" },
        ]}
      >
        <Markdown style={markdownStyles}>{item.text}</Markdown>
      </Text>
    </View>
  );

  return (
    <View style={styles.chatArea}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        ref={flatListRef}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />
      <View style={styles.inputContainer}>
        <View style={styles.inputWithMic}>
          <TouchableOpacity onPress={openCamera} style={styles.iconContainer}>
            <MaterialIcons name="photo-camera" size={24} color="#2579A7" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openDocumentPicker}
            style={styles.iconContainer}
          >
            <MaterialIcons name="attach-file" size={24} color="#2579A7" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Pressable
          onPressIn={() => {
            if(loading){
              return
            }else{
              handleMicPressIn();
              startRecording();
            }
          }}
          
          onPressOut={handleMicPressOut}
          onPress={sendMessage}
          disabled={loading}
          style={({ pressed }) => [
            styles.sendButton,
            pressed && { opacity: 0.8 },
            isRecording && {
              shadowColor: "#ffffff",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 6,
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={input.trim() ? "send" : isRecording ? "mic" : "mic-outline"}
              size={20}
              color={input.trim() ? "#fff" : isRecording ? "#C6E7FF" : "#fff"}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

export default ChatArea;

const markdownStyles = {
  body: {
    fontSize: 16,
    color: '#333',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  link: {
    color: '#1e90ff',
  },
};
