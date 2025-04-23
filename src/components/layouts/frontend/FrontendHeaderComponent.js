import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { changeLanguage as setLanguage } from '../../../store/actions/globalStateActions';
import { fetchLanguage, fetchLanguages } from '../../../store/actions/frontend/frontendLanguageActions';

const Navbar = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const searchInputRef = useRef(null);
  const debounceTimeout = useRef(null);

  // State
  const [isSticky, setIsSticky] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Redux selectors
  const setting = useSelector(state => state.frontendSetting.lists);
  const language = useSelector(state => state.frontendLanguage.show);
  const languages = useSelector(state => state.frontendLanguage.lists);

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Fetch available languages
        await dispatch(fetchLanguages());
        
        // If no language is selected, find and set English as default
        if (!language && languages && languages.length > 0) {
          const englishLanguage = languages.find(lang => lang.name === 'English');
          if (englishLanguage) {
            await dispatch(setLanguage({
              language_id: englishLanguage.id,
              language_code: englishLanguage.code,
              display_mode: englishLanguage.display_mode
            }));
            await dispatch(fetchLanguage(englishLanguage.id));
          }
        }
      } catch (error) {
        console.error('Language initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeLanguage();
    
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearch]);

  const changeLanguage = (id, code, mode) => {
    dispatch(setLanguage({ language_id: id, language_code: code, display_mode: mode }));
    dispatch(fetchLanguage(id));
    setShowLanguageDropdown(false);
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length > 2) {
      navigation.navigate('ProductList', { search: trimmedQuery });
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const searchProducts = async (query) => {
    if (query.length > 2) {
      setIsSearching(true);
      setSearchError(null);
      
      try {
        const res = await axios.get(`/frontend/product`, {
          params: { name: query }
        });
        console.log("search products",res.data.data)
        setSearchResults(res.data.data || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Failed to fetch search results');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    if (text.length > 2) {
      debounceTimeout.current = setTimeout(() => {
        searchProducts(text);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => {
        navigation.navigate('ProductDetails', { id: item.id });
      }}
    >
      <Image 
        source={{ uri: item.cover }} 
        style={styles.searchResultImage}
      />
      <View style={styles.searchResultText}>
        <Text style={styles.searchResultTitle}>{item.name}</Text>
        <Text style={styles.searchResultPrice}>${item.currency_price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Animated.View style={[styles.header, isSticky && styles.stickyHeader]}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Image 
                source={{ uri: setting?.theme_logo }} 
                style={styles.logo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerRight}>
            {/* {setting?.site_language_switch === 5 && (
              <View style={styles.languageContainer}>
                {isInitializing ? (
                  <ActivityIndicator size="small" color="#4B6FED" />
                ) : (
                  <>
                    <TouchableOpacity 
                      onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      style={styles.languageButton}
                    >
                      <View style={styles.languageButtonContent}>
                        {language?.image && (
                          <Image 
                            source={{ uri: language.image }} 
                            style={styles.languageFlag}
                          />
                        )}
                        <Text style={styles.languageName} numberOfLines={1}>
                          {language?.name || 'English'}
                        </Text>
                        <MaterialIcons 
                          name={showLanguageDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                          size={20} 
                          color="#333"
                        />
                      </View>
                    </TouchableOpacity>
                    
                    {showLanguageDropdown && (
                      <View style={styles.languageDropdown}>
                        <ScrollView>
                          {languages.map((lang) => (
                            <TouchableOpacity
                              key={lang.id}
                              onPress={() => changeLanguage(lang.id, lang.code, lang.display_mode)}
                              style={[
                                styles.languageItem,
                                lang.name === 'English' && { backgroundColor: '#f8f8f8' }
                              ]}
                            >
                              {lang.image && (
                                <Image 
                                  source={{ uri: lang.image }} 
                                  style={styles.languageFlag}
                                />
                              )}
                              <Text style={styles.languageText} numberOfLines={1}>
                                {lang.name}
                              </Text>
                              {lang.name === 'English' && (
                                <Text style={styles.defaultBadge}>Default</Text>
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </>
                )}
              </View>
            )} */}
            
            <TouchableOpacity 
              onPress={() => {
                setShowSearch(true);
                setSearchQuery('');
                setSearchResults([]);
                setSearchError(null);
              }}
              style={styles.searchButton}
            >
              <MaterialIcons name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      

<Modal
  visible={showSearch}
  animationType="slide"
  transparent={false}
  onRequestClose={() => setShowSearch(false)}
>
  <KeyboardAvoidingView 
    style={styles.searchModalContainer}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View style={styles.searchModalHeader}>
      <TouchableOpacity 
        onPress={() => setShowSearch(false)}
        style={styles.searchModalCloseButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
      <View style={styles.searchInputContainer}>
        <TextInput
          ref={searchInputRef}
          style={styles.searchModalInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          onSubmitEditing={handleSearch}
          autoFocus={true}
          returnKeyType="search"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          editable={true}  // Explicitly make it editable
          selectTextOnFocus={true}  // Select text when focused
        />
        
        {isSearching ? (
          <ActivityIndicator 
            style={styles.searchLoadingIndicator} 
            size="small" 
            color="#4B6FED" 
                />    
        ) : searchQuery.length > 0 ? (
          <TouchableOpacity 
            onPress={clearSearch}
            style={styles.searchModalClearButton}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>

    <ScrollView 
      style={styles.searchResultsContainer}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
       {searchError ? (
              <Text style={styles.errorText}>{searchError}</Text>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={item => item.id.toString()}
                keyboardShouldPersistTaps="handled"
              />
            ) : searchQuery.length > 2 && !isSearching ? (
              <Text style={styles.noResultsText}>No results found</Text>
            ) : null}
    </ScrollView>
  </KeyboardAvoidingView>
</Modal>

    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    marginRight: 16,
  },
  logo: {
    width: 112,
    height: 40,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  searchButton: {
    marginLeft: 16,
  },
  languageContainer: {
    position: 'relative',
    minWidth: 120,
    zIndex: 1000,
  },
  languageButton: {
    paddingVertical: 8,
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  languageName: {
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    maxWidth: 80,
  },
  languageDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 200,
    maxHeight: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flexShrink: 1,
  },
  defaultBadge: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchModalCloseButton: {
    marginRight: 10,
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchModalInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    paddingRight: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    color: '#333',
    fontSize: 16,
  },
  searchLoadingIndicator: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  searchModalClearButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  searchResultsContainer: {
    flex: 1,
    padding: 15,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#f5f5f5',
  },
  searchResultText: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  searchResultPrice: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default Navbar;