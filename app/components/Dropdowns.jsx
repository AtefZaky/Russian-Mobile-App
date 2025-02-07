import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = () => {
  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState(null);
  const [items1, setItems1] = useState([
    { label: "القطاع التجاري", value: "القطاع التجاري" },
    { label: "القطاع الصناعي", value: "القطاع الصناعي" },
    { label: "القطاع الزراعي", value: "القطاع الزراعي" },
  ]);

  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState(null);
  const [items2, setItems2] = useState([
    { label: "الكل", value: "all" },
    { label: "إدارة التسويق", value: "marketing" },
    { label: "إدارة المبيعات", value: "sales" },
  ]);

  const [open3, setOpen3] = useState(false);
  const [value3, setValue3] = useState(null);
  const [items3, setItems3] = useState([
    { label: "التحدث مع قواعد البيانات", value: "database" },
    { label: "التحدث مع الشبكات", value: "networking" },
    { label: "التحدث مع التطبيقات", value: "applications" },
  ]);

  const [open4, setOpen4] = useState(false);
  const [value4, setValue4] = useState(null);
  const [items4, setItems4] = useState([
    { label: "جدول الفواتير", value: "invoices" },
    { label: "جدول العملاء", value: "customers" },
    { label: "جدول المنتجات", value: "products" },
  ]);

  // const handleSubmit = () => {
  //   alert(
  //     `تم تقديم النموذج:\nالقطاع: ${value1 || "غير محدد"}\nالإدارة: ${value2 || "غير محدد"}\nالموضوع: ${value3 || "غير محدد"}\nالبيان: ${value4 || "غير محدد"}`
  //   );
  // };

  return (
    <View style={styles.container}>
      <View style={[styles.dropdownContainer, { zIndex: open1 ? 4 : 0 }]}>
        <Text style={styles.label}>القطاع</Text>
        <DropDownPicker
          open={open1}
          value={value1}
          items={items1}
          setOpen={setOpen1}
          setValue={setValue1}
          setItems={setItems1}
          placeholder="اختر القطاع"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        
        />
      </View>

      <View style={[styles.dropdownContainer, { zIndex: open2 ? 3 : 0 }]}>
        <Text style={styles.label}>الإدارة</Text>
        <DropDownPicker
          open={open2}
          value={value2}
          items={items2}
          setOpen={setOpen2}
          setValue={setValue2}
          setItems={setItems2}
          placeholder="اختر الإدارة"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
      </View>

      <View style={[styles.dropdownContainer, { zIndex: open3 ? 2 : 0 }]}>
        <Text style={styles.label}>الموضوع</Text>
        <DropDownPicker
          open={open3}
          value={value3}
          items={items3}
          setOpen={setOpen3}
          setValue={setValue3}
          setItems={setItems3}
          placeholder="اختر الموضوع"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
      </View>

      <View style={[styles.dropdownContainer, { zIndex: open4 ? 1 : 0 }]}>
        <Text style={styles.label}>البيان</Text>
        <DropDownPicker
          open={open4}
          value={value4}
          items={items4}
          setOpen={setOpen4}
          setValue={setValue4}
          setItems={setItems4}
          placeholder="اختر البيان"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>دخول</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    direction: "rtl",
  },
  dropdownContainer: {
    marginBottom: 20,
    position: "relative", 
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#777777",
  },
  dropdown: {
    borderColor: "#2579A7",
  },
  dropdownBox: {
    borderWidth: 0,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#2579A7",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Dropdown;
