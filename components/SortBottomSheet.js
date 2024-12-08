import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SortBottomSheet = ({ visible, onClose, onSort }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [selectedOption, setSelectedOption] = useState(null);

  const options = ['Level', 'Capacity', 'Availability'];

  const openSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT * 0.2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Animate the bottom sheet out
  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start(() => onClose());
  };

  if (visible) {
    openSheet();
  }

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} onPress={closeSheet} />

        <Animated.View style={[styles.sheet, { top: slideAnim }]}>
          <View style={styles.handleBar} />
          <Text style={styles.title}>Sort</Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => setSelectedOption(option)}>
              <Text style={styles.optionText}>{option}</Text>
              <View
                style={[
                  styles.radio,
                  selectedOption === option && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => setSelectedOption(null)}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onSort(selectedOption);
                closeSheet();
              }}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  background: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    width: '100%',
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handleBar: {
    width: 50,
    height: 4,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#aab2bd',
  },
  radioSelected: {
    backgroundColor: '#507add',
    borderColor: '#507add',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButton: {
    flexGrow: 0.3,
    backgroundColor: '#444',
    marginRight: 8,
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 500,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#507add',
    marginLeft: 8,
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 500,
  },
});

export default SortBottomSheet;
