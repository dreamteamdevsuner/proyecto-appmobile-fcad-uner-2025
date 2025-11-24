import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

export interface SearchableDropdownItem {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string | null;
  items: SearchableDropdownItem[];
  onChange: (value: string) => void;
}

const SearchableModalDropdown: React.FC<Props> = ({
  label,
  value,
  items,
  onChange,
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return items;
    return items.filter((i) =>
      i.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, items]);

  const handleSelect = (item: SearchableDropdownItem) => {
    onChange(item.value);
    setVisible(false);
  };

  const handleKeepText = () => {
    onChange(search);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setSearch(value ?? '');
          setVisible(true);
        }}
      >
        <TextInput
          mode="outlined"
          value={value ?? ''}
          placeholder={`Selecciona ${label.toLowerCase()}`}
          style={styles.input}
          editable={false} // necesario
          pointerEvents="none" // evita conflictos de toque
          right={
            value ? (
              <TextInput.Icon icon="close" onPress={() => onChange('')} />
            ) : undefined
          }
        />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              mode="outlined"
              placeholder={`Buscar ${label.toLowerCase()}`}
              value={search}
              onChangeText={setSearch}
              style={styles.input}
              autoFocus
            />

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            {search !== '' && (
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleKeepText}
              >
                Usar "{search}"
              </Button>
            )}

            <Button
              mode="text"
              onPress={() => setVisible(false)}
              style={{ marginTop: 10 }}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    backgroundColor: 'rgb(0,0,0)',
    padding: 20,
    maxHeight: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#BEB52C',
  },
});

export default SearchableModalDropdown;
