// src/screens/ListBooking.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SortBottomSheet from './SortBottomSheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, setSortOption, setDate, setTime } from '../Actions/Action';
import Room from '../Models/Room';
import { connect } from 'react-redux';

const ListBooking = ({
  navigation,
  rooms,
  loading,
  error,
  sortOption,
  date,
  time,
}) => {
  const dispatch = useDispatch();
  const [isSheetVisible, setSheetVisible] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const formatWithOrdinal = (date) => {
    console.log(date);
    const day = date.getDate();
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    const formattedDay = `${day}${getOrdinalSuffix(day)}`;
    const formattedDate = format(date, 'MMM yyyy'); // e.g., "Dec 2019"
    return `${formattedDay} ${formattedDate}`;
  };
  const handleSort = (option) => {
    dispatch(setSortOption(option));
    setSheetVisible(false);
  };

  const onDateChange = (selectedDate) => {
    setDatePickerOpen(false);
    dispatch(setDate(selectedDate || date));
  };

  const onTimeChange = (selectedTime) => {
    setTimePickerOpen(false);
    dispatch(setTime(selectedTime || time));
    dispatch(setSortOption(sortOption));
  };

  const renderRoom = ({ item }) => (
    <View style={styles.roomCard}>
      <View>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomLevel}>Level: {item.level}</Text>
      </View>
      <View style={styles.roomStatus}>
        <Text
          style={[
            styles.statusText,
            isRoomAvailable(item) && styles.availableStatus,
          ]}>
          {isRoomAvailable(item) ? 'Available' : 'Not Available'}
        </Text>
        <Text style={styles.roomCapacity}>Capacity: {item.capacity}</Text>
      </View>
    </View>
  );

  const isRoomAvailable = (room: Room): boolean => {
    const now = new Date();
    const compareTime = time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    });
    // Check availability
    return room.availability[compareTime] === '1';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book a Room</Text>
        <Ionicons
          name="camera-outline"
          size={28}
          color="black"
          onPress={() => navigation.navigate('ScanBooking')}
        />
      </View>

      <View style={styles.dateTimeContainer}>
        <Text style={styles.sectionLabel}>Date</Text>
        <Text
          style={styles.dateTimeValue}
          onPress={() => setDatePickerOpen(true)}>
          {formatWithOrdinal(date)}
        </Text>
        <View style={styles.line}></View>

        <DateTimePickerModal
          isVisible={datePickerOpen}
          mode="date"
          onConfirm={onDateChange}
          onCancel={() => setDatePickerOpen(false)}
          date={date}
        />
      </View>

      <View style={styles.dateTimeContainer}>
        <Text style={styles.sectionLabel}>Timeslot</Text>
        <Text
          style={styles.dateTimeValue}
          onPress={() => setTimePickerOpen(true)}>
          {formatTime(time)}
        </Text>
        <View style={styles.line}></View>

        <DateTimePickerModal
          isVisible={timePickerOpen}
          mode="time"
          onConfirm={onTimeChange}
          onCancel={() => setTimePickerOpen(false)}
          date={time}
        />
      </View>

      {/* Rooms */}
      <View style={styles.roomsHeader}>
        <Text style={styles.sectionLabel}>Rooms</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSheetVisible(true)}>
          <Text style={styles.sortText}>Sort</Text>
          <Ionicons name="funnel-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.name}
        renderItem={renderRoom}
        contentContainerStyle={styles.roomsList}
      />

      {/* Sort Bottom Sheet */}
      <SortBottomSheet
        visible={isSheetVisible}
        onClose={() => setSheetVisible(false)}
        onSort={handleSort}
      />
    </SafeAreaView>
  );
};
function _mapStateToProps(state) {
  const { rooms, loading, error, date, time, sortOption } = state['rooms'];
  return {
    rooms: rooms || [],
    loading: loading || false,
    error: error || null,
    date: date || new Date(),
    time: time || new Date(),
    sortOption: sortOption || 'Level',
  };
}

export default connect(_mapStateToProps)(ListBooking);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 0 : 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flexGrow: 1,
    textAlign: 'center',
    paddingLeft: 24,
  },
  dateTimeContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
  },
  roomsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
    paddingRight: 8,
  },
  roomsList: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  roomCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '500',
  },
  roomLevel: {
    color: '#888',
    fontSize: 14,
  },
  roomStatus: {
    flexDirection: 'column',
  },
  statusText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  availableStatus: {
    color: '#00c853',
  },
  roomCapacity: {
    fontSize: 14,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  line: {
    backgroundColor: 'lightgray',
    height: 1,
  },
});
