const Dropdown = ({ options, selectedValue, onValueChange, placeholder }) => {
  const [showPicker, setShowPicker] = useState(false);
  const selectedOption = options.find(opt => opt.id === selectedValue);

  return (
    <View>
      <TouchableOpacity 
        className="border border-gray-300 rounded p-2 flex-row justify-between items-center"
        onPress={() => setShowPicker(true)}
      >
        <Text>{selectedOption?.name || placeholder}</Text>
        <Feather name="chevron-down" size={16} color="gray" />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable 
          className="flex-1 bg-black bg-opacity-50 justify-end"
          onPress={() => setShowPicker(false)}
        >
          <View className="bg-white p-4 rounded-t-lg">
            <ScrollView>
              {options.map(option => (
                <Pressable
                  key={option.id}
                  className="py-3 border-b border-gray-100"
                  onPress={() => {
                    onValueChange(option.id);
                    setShowPicker(false);
                  }}
                >
                  <Text className="text-center">{option.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};